async function main() {
  const address = '0x010dd13b588a806c1f0289317e18368516c8df35';
  const url = `https://explorer.ritualfoundation.org/address/${address}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    console.log('HTML Length:', html.length);
    // Find all occurrences of the word "transaction" or related metrics in the HTML
    const regex = /[^<>\n]*transaction[^<>\n]*/gi;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null && count < 20) {
      console.log(`Match ${++count}:`, match[0].trim());
    }
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
