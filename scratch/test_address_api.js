async function main() {
  const address = '0x010dd13b588a806c1f0289317e18368516c8df35';
  const endpoints = [
    `https://explorer.ritualfoundation.org/api/v2/addresses/${address}`,
    `https://explorer.ritualfoundation.org/api?module=account&action=txlist&address=${address}&page=1&offset=1`
  ];
  for (const url of endpoints) {
    try {
      console.log('Fetching:', url);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });
      console.log('Status:', res.status);
      const contentType = res.headers.get('content-type');
      console.log('Content-Type:', contentType);
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        console.log('JSON Keys:', Object.keys(json));
        console.log('JSON preview:', JSON.stringify(json).slice(0, 500));
      } else {
        const text = await res.text();
        console.log('Text prefix:', text.slice(0, 200));
      }
    } catch (e) {
      console.error('Error fetching address:', e);
    }
  }
}
main();
