async function main() {
  const contract = '0x126ce9f1599f2667a4ff3e0eaaccc4c363343fd1';
  const url = `https://explorer.ritualfoundation.org/api?module=contract&action=getabi&address=${contract}`;
  console.log(`Fetching ABI: ${url}`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('ABI Result status:', data.status);
    console.log('ABI Result message:', data.message);
    if (data.result) {
      console.log('ABI:', data.result.slice(0, 500));
    }
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

main();
