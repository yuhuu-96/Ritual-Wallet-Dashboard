async function main() {
  const url = 'https://ritual-wallet-dashboard.vercel.app/api/nfts?address=0x010dd13b588a806c1f0289317e18368516c8df35';
  console.log(`Fetching from production URL: ${url}`);
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log('Result length:', data.nfts ? data.nfts.length : 0);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

main();
