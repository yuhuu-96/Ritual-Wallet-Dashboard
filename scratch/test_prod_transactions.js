async function main() {
  const url = 'https://ritual-wallet-dashboard.vercel.app/api/transactions?address=0x010dd13b588a806c1f0289317e18368516c8df35&limit=10';
  console.log(`Fetching from: ${url}`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Transactions count:', data.transactions ? data.transactions.length : 0);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

main();
