const RPC_POOL = [
  'https://rpc.ritualfoundation.org',
  'https://ritual-testnet-rpc.allthatnode.com',
  'https://rpc.ritual.network',
];

const userAddress = '0x010dd13b588a806c1f0289317e18368516c8df35';

async function rpc(url, method, params = []) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j.result;
}

async function testRpc(url) {
  console.log(`\nTesting RPC: ${url}`);
  try {
    const blockNumHex = await rpc(url, 'eth_blockNumber');
    console.log(`  - eth_blockNumber: SUCCESS (${parseInt(blockNumHex, 16)})`);
  } catch (e) {
    console.log(`  - eth_blockNumber: FAILED (${e.message})`);
  }

  try {
    const gasPriceHex = await rpc(url, 'eth_gasPrice');
    console.log(`  - eth_gasPrice: SUCCESS (${parseInt(gasPriceHex, 16) / 1e9} Gwei)`);
  } catch (e) {
    console.log(`  - eth_gasPrice: FAILED (${e.message})`);
  }

  try {
    const balHex = await rpc(url, 'eth_getBalance', [userAddress, 'latest']);
    console.log(`  - eth_getBalance: SUCCESS (${parseInt(balHex, 16)})`);
  } catch (e) {
    console.log(`  - eth_getBalance: FAILED (${e.message})`);
  }

  try {
    const codeHex = await rpc(url, 'eth_getCode', [userAddress, 'latest']);
    console.log(`  - eth_getCode: SUCCESS (${codeHex})`);
  } catch (e) {
    console.log(`  - eth_getCode: FAILED (${e.message})`);
  }
}

async function main() {
  for (const url of RPC_POOL) {
    await testRpc(url);
  }
}

main();
