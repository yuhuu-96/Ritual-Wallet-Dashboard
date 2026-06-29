async function main() {
  const address = '0x010dd13b588a806c1f0289317e18368516c8df35';
  const now = Date.now();
  const startMs = now - 60 * 24 * 60 * 60 * 1000; // 60 days ago
  const fromDate = new Date(startMs).toISOString().slice(0, 10);
  const toDate = new Date(now).toISOString().slice(0, 10);
  
  const url = `https://explorer.ritualfoundation.org/api/indexer-proxy/api/v1/addresses/${address}/transactions?limit=1&offset=0&from_date=${fromDate}&to_date=${toDate}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    console.log('Status:', res.status);
    if (res.ok) {
      const json = await res.json();
      console.log('JSON Keys:', Object.keys(json));
      console.log('JSON content sample:', JSON.stringify(json).slice(0, 500));
    }
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
