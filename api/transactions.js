// Vercel Serverless Function — Ritual TX Proxy (v5 – REST Only, No Timeout)
// Route: /api/transactions?address=0x...&limit=3
//
// Uses ONLY fast REST API calls (no slow RPC block scanning).
// If no transactions found via API → returns [] → frontend shows explorer link.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { address, limit = '3' } = req.query;
  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  const limitNum = Math.min(parseInt(limit) || 3, 10);
  const addr     = address.toLowerCase();

  // ── Helpers ──
  async function fetchJSON(url, ms = 8000) {
    const r = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'RitualDashboard/5.0' },
      signal: AbortSignal.timeout(ms),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }

  // ── Normalize: unify field names across all REST response shapes ──
  function normalize(tx) {
    const rawVal = tx.value || tx.amount || '0x0';
    const valueHex = rawVal.startsWith('0x')
      ? rawVal
      : '0x' + (rawVal === '0' ? '0' : BigInt(rawVal).toString(16));
    const tsRaw = tx.block_timestamp ?? tx.timeStamp ?? tx.timestamp ?? 0;
    return {
      tx_hash:         tx.tx_hash       || tx.hash             || '',
      from_address:    tx.from_address  || tx.from             || '',
      to_address:      tx.to_address    || tx.to               || null,
      value:           valueHex,
      block_number:    String(tx.block_number || tx.blockNumber || '0'),
      // Ensure milliseconds: Blockscout gives ms already; Etherscan gives seconds
      block_timestamp: tsRaw > 1e12 ? tsRaw : tsRaw * 1000,
      method_selector: tx.method_selector || tx.input?.slice(0, 10) || '0x',
    };
  }

  // ─────────────────────────────────────────────────────────
  //  REST ENDPOINTS — tried in order, first success wins
  // ─────────────────────────────────────────────────────────
  const EXPLORER = 'https://explorer.ritualfoundation.org';

  // Helper: Chunked query strategy to safely scan a wider range of blocks without 422
  async function fetchChunkedTransactions(address, limitNum) {
    const chunkDays = 15;
    const maxChunks = 4; // up to 60 days ago
    const now = Date.now();
    const urls = [];

    for (let i = 0; i < maxChunks; i++) {
      const startMs = now - (i + 1) * chunkDays * 24 * 60 * 60 * 1000;
      const endMs   = now - i * chunkDays * 24 * 60 * 60 * 1000;
      
      const fromDate = new Date(startMs).toISOString().slice(0, 10);
      const toDate   = new Date(endMs).toISOString().slice(0, 10);

      urls.push(
        `${EXPLORER}/api/indexer-proxy/api/v1/addresses/${address}/transactions?limit=${limitNum}&offset=0&from_date=${fromDate}&to_date=${toDate}`,
        `${EXPLORER}/api/indexer-proxy/api/v1/addresses/${address}/transactions?limit=${limitNum}&offset=0&from_date=${fromDate}&to_date=${toDate}&type=from`,
        `${EXPLORER}/api/indexer-proxy/api/v1/addresses/${address}/transactions?limit=${limitNum}&offset=0&from_date=${fromDate}&to_date=${toDate}&type=to`
      );
    }

    // Run all fetches in parallel with a 9-second timeout
    const results = await Promise.allSettled(
      urls.map(url => fetchJSON(url, 9000))
    );

    const allTxs = [];
    for (const res of results) {
      if (res.status === 'fulfilled' && res.value) {
        const txs = res.value.transactions || res.value.items || [];
        if (Array.isArray(txs)) {
          for (const tx of txs) {
            const hash = tx.tx_hash || tx.hash;
            if (hash && !allTxs.some(t => (t.tx_hash || t.hash) === hash)) {
              allTxs.push(tx);
            }
          }
        }
      }
    }

    if (allTxs.length > 0) {
      allTxs.sort((a, b) => {
        const blockA = Number(a.block_number || a.blockNumber || 0);
        const blockB = Number(b.block_number || b.blockNumber || 0);
        return blockB - blockA;
      });
      return allTxs.slice(0, limitNum);
    }
    return null;
  }

  // Endpoint set B: Blockscout v2 standard REST
  const blockscoutCandidates = [
    `${EXPLORER}/api/v2/addresses/${address}/transactions?limit=${limitNum}`,
    `${EXPLORER}/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from&limit=${limitNum}`,
  ];

  // Endpoint set C: Etherscan-compatible
  const etherscanCandidates = [
    `${EXPLORER}/api?module=account&action=txlist&address=${address}&page=1&offset=${limitNum}&sort=desc`,
    `${EXPLORER}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&limit=${limitNum}`,
  ];

  // Helper: try an array of endpoints, return normalized txs on first success
  async function tryEndpoints(urls, extractor) {
    for (const url of urls) {
      try {
        const data = await fetchJSON(url, 7000);
        const txs  = extractor(data);
        if (Array.isArray(txs) && txs.length > 0) {
          return txs.slice(0, limitNum).map(normalize);
        }
      } catch { /* try next */ }
    }
    return null;
  }

  // Strategy A — Chunked Indexer-Proxy (safely goes back 60 days)
  const chunkedTxs = await fetchChunkedTransactions(address, limitNum);
  if (chunkedTxs && Array.isArray(chunkedTxs)) {
    return res.status(200).json({
      transactions: chunkedTxs.map(normalize),
      source: 'indexer-proxy-chunked'
    });
  }

  // Strategy B — Blockscout v2
  let result = await tryEndpoints(blockscoutCandidates, d => d.items || d.transactions || []);
  if (result) return res.status(200).json({ transactions: result, source: 'blockscout-v2' });

  // Strategy C — Etherscan-compatible
  result = await tryEndpoints(etherscanCandidates, d => {
    const r = d.result;
    return Array.isArray(r) ? r : [];
  });
  if (result) return res.status(200).json({ transactions: result, source: 'etherscan-api' });

  // ── Nothing found — return empty so frontend shows explorer link ──
  return res.status(200).json({
    transactions: [],
    source:       'none',
    hint:         `View at ${EXPLORER}/address/${address}`,
  });
}
