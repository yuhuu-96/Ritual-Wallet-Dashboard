// Vercel Serverless Function — Ritual NFT Scanner
// Route: /api/nfts?address=0x...
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { address } = req.query;
  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  const RPC_URLS = [
    'https://rpc.ritualfoundation.org',
    'https://ritual-testnet-rpc.allthatnode.com',
    'https://rpc.ritual.network'
  ];

  const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  const addrPadded = '0x' + address.slice(2).toLowerCase().padStart(64, '0');
  const CHUNK = 100000;
  const DEPTH = 500000;

  // ── JSON-RPC helper ──
  async function rpc(url, method, params) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      signal: AbortSignal.timeout(12000)
    });
    const j = await r.json();
    if (j.error) throw new Error(j.error.message);
    return j.result;
  }

  // ── eth_call helper ──
  async function ethCall(rpcUrl, to, data) {
    return rpc(rpcUrl, 'eth_call', [{ to, data }, 'latest']);
  }

  // ── ABI encoders ──
  function encodeCall(sig, ...args) {
    // Simple 4-byte selector + 32-byte padded args
    const sel = keccak4(sig);
    const encoded = args.map(a => {
      if (typeof a === 'bigint' || typeof a === 'number') {
        return a.toString(16).padStart(64, '0');
      }
      return String(a).replace('0x', '').padStart(64, '0');
    }).join('');
    return sel + encoded;
  }

  function keccak4(sig) {
    // We compute the 4-byte selector by doing a sha3 in pure JS via a lookup table
    // Instead, we hardcode the common NFT selectors
    const sigs = {
      'ownerOf(uint256)': '6352211e',
      'tokenURI(uint256)': 'c87b56dd',
      'name()': '06fdde03'
    };
    return sigs[sig] ? '0x' + sigs[sig] : null;
  }

  function decodeString(hex) {
    if (!hex || hex === '0x') return '';
    try {
      // ABI-encoded string: offset (32) + length (32) + data
      const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
      const offset = parseInt(clean.slice(0, 64), 16) * 2;
      const length = parseInt(clean.slice(offset, offset + 64), 16) * 2;
      const strHex = clean.slice(offset + 64, offset + 64 + length);
      return Buffer.from(strHex, 'hex').toString('utf8');
    } catch { return ''; }
  }

  function decodeAddress(hex) {
    if (!hex || hex === '0x') return '';
    return '0x' + hex.slice(-40);
  }

  // ── Find working RPC and latest block ──
  let workingRpc = null;
  let latestBlock = 0;
  for (const url of RPC_URLS) {
    try {
      const hex = await rpc(url, 'eth_blockNumber', []);
      latestBlock = parseInt(hex, 16);
      workingRpc = url;
      break;
    } catch { /* try next */ }
  }

  if (!workingRpc) {
    return res.status(503).json({ error: 'All RPC endpoints unreachable', nfts: [] });
  }

  // ── Scan for ERC-721 Transfer events ──
  const discovered = new Map();
  const startBlock = Math.max(0, latestBlock - DEPTH);

  for (let from = startBlock; from < latestBlock; from += CHUNK) {
    const to = Math.min(from + CHUNK - 1, latestBlock);
    try {
      // Received
      const logsTo = await rpc(workingRpc, 'eth_getLogs', [{
        fromBlock: '0x' + from.toString(16),
        toBlock: '0x' + to.toString(16),
        topics: [TRANSFER_TOPIC, null, addrPadded]
      }]);
      (logsTo || []).forEach(log => {
        if ((log.topics || []).length === 4) {
          const tokenId = BigInt(log.topics[3]).toString();
          const key = `${log.address.toLowerCase()}_${tokenId}`;
          discovered.set(key, { contract: log.address, tokenId });
        }
      });
      // Sent (to detect and verify ownership later)
      const logsFrom = await rpc(workingRpc, 'eth_getLogs', [{
        fromBlock: '0x' + from.toString(16),
        toBlock: '0x' + to.toString(16),
        topics: [TRANSFER_TOPIC, addrPadded, null]
      }]);
      (logsFrom || []).forEach(log => {
        if ((log.topics || []).length === 4) {
          const tokenId = BigInt(log.topics[3]).toString();
          const key = `${log.address.toLowerCase()}_${tokenId}`;
          if (!discovered.has(key)) {
            discovered.set(key, { contract: log.address, tokenId });
          }
        }
      });
    } catch (e) {
      console.warn(`getLogs chunk ${from}-${to} failed:`, e.message);
    }
  }

  const tokens = Array.from(discovered.values());

  if (tokens.length === 0) {
    return res.status(200).json({ nfts: [], message: 'No NFT transfer events found in last 500k blocks' });
  }

  // ── Verify ownership and resolve metadata ──
  const nfts = [];
  const addrLower = address.toLowerCase();

  for (const t of tokens) {
    try {
      // ownerOf(tokenId)
      const ownerHex = await ethCall(workingRpc, t.contract, '0x6352211e' + BigInt(t.tokenId).toString(16).padStart(64, '0'));
      const owner = decodeAddress(ownerHex);
      if (owner.toLowerCase() !== addrLower) continue; // not owned anymore

      // name()
      let collectionName = 'NFT';
      try {
        const nameHex = await ethCall(workingRpc, t.contract, '0x06fdde03');
        collectionName = decodeString(nameHex) || 'NFT';
      } catch {}

      // tokenURI(tokenId)
      let tokenUri = '';
      try {
        const uriHex = await ethCall(workingRpc, t.contract, '0xc87b56dd' + BigInt(t.tokenId).toString(16).padStart(64, '0'));
        tokenUri = decodeString(uriHex);
      } catch {}

      let name = `${collectionName} #${t.tokenId}`;
      let imageUrl = '';
      let description = '';

      // Fetch metadata
      if (tokenUri) {
        try {
          let fetchUrl = tokenUri;
          if (tokenUri.startsWith('data:application/json;base64,')) {
            const meta = JSON.parse(Buffer.from(tokenUri.split(',')[1], 'base64').toString('utf8'));
            name = meta.name || name;
            imageUrl = meta.image || meta.image_url || '';
            description = meta.description || '';
          } else {
            if (tokenUri.startsWith('ipfs://')) {
              fetchUrl = 'https://ipfs.io/ipfs/' + tokenUri.slice(7);
            }
            const metaRes = await fetch(fetchUrl, { signal: AbortSignal.timeout(8000) });
            const meta = await metaRes.json();
            name = meta.name || name;
            imageUrl = meta.image || meta.image_url || '';
            description = meta.description || '';
          }
          if (imageUrl.startsWith('ipfs://')) {
            imageUrl = 'https://ipfs.io/ipfs/' + imageUrl.slice(7);
          }
        } catch {}
      }

      nfts.push({
        contract: t.contract,
        tokenId: t.tokenId,
        collectionName,
        name,
        imageUrl,
        description,
        tokenUri,
        explorerUrl: `https://explorer.ritualfoundation.org/token/${t.contract}?a=${t.tokenId}`
      });
    } catch { /* skip faulty contracts */ }
  }

  return res.status(200).json({ nfts, total: nfts.length });
}
