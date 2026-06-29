async function main() {
  const address = '0x010dd13b588a806c1f0289317e18368516c8df35';
  const url = `https://explorer.ritualfoundation.org/api/v2/addresses/${address}/transactions?limit=1`;
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
      console.log('Success, keys:', Object.keys(json));
    } else {
      const text = await res.text();
      console.log('Error text:', text.slice(0, 200));
    }
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
