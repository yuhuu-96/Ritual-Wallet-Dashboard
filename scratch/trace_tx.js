

const RPC_URL = 'https://rpc.ritualfoundation.org';
const TX_HASH = '0xc17f20005a05fd7d8dc8e6bc78c77f79dd4570d8471e20306b01650c267e279b';

async function rpc(method, params) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 })
  });
  return res.json();
}

async function main() {
  console.log(`Requesting trace for tx ${TX_HASH}...`);
  const response = await rpc('debug_traceTransaction', [TX_HASH, { tracer: 'callTracer' }]);
  if (response.error) {
    console.error('RPC Error:', response.error);
  } else {
    console.log('Trace Result:', JSON.stringify(response.result, null, 2));
  }
}

main().catch(console.error);
