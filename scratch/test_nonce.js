async function main() {
  const address = '0x010dd13b588a806c1f0289317e18368516c8df35';
  const rpcUrl = 'https://rpc.ritualfoundation.org';
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [address, 'latest'],
        id: 1
      })
    });
    const json = await res.json();
    console.log('Result:', json);
    if (json.result) {
      console.log('Decimal Count:', parseInt(json.result, 16));
    }
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
