async function main() {
  const address = '0x010dd13b588a806c1f0289317e18368516c8df35';
  const url = `https://explorer.ritualfoundation.org/api/indexer-proxy/api/v1/addresses/${address}/transactions?limit=50&offset=0`;
  console.log(`Fetching transaction list: ${url}`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    const txs = data.transactions || [];
    console.log(`Total transactions found: ${txs.length}`);
    for (const tx of txs) {
      console.log(`Hash: ${tx.tx_hash}`);
      console.log(`  To: ${tx.to_address}`);
      console.log(`  Method Selector: ${tx.method_selector || tx.input?.slice(0, 10)}`);
      console.log(`  Value: ${tx.value}`);
    }
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

main();
