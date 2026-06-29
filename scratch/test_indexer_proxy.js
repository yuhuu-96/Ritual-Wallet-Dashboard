async function main() {
  const address = '0x010dd13b588a806c1f0289317e18368516c8df35';
  const url = `https://explorer.ritualfoundation.org/api/indexer-proxy/api/v1/addresses/${address}/transactions?limit=1&offset=0`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    console.log('Status:', res.status);
    const json = await res.json();
    console.log('Keys:', Object.keys(json));
    console.log('Total count or paging fields:', json.total, json.total_count, json.count, json.paging);
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
