const fs = require('fs');

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
    
    // Find all self.__next_f.push(...)
    const matches = html.match(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/g);
    if (!matches) {
      console.log('No next_f matches found');
      return;
    }
    
    console.log(`Found ${matches.length} chunks`);
    let fullText = '';
    for (const match of matches) {
      const contentMatch = match.match(/self\.__next_f\.push\(\[1,"(.*)"\]\)/);
      if (contentMatch) {
        // Decode js string escape sequence
        let escapedStr = contentMatch[1];
        // simple unescape
        let unescaped = escapedStr
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\');
        fullText += unescaped;
      }
    }
    
    // Write full text to a file for analysis
    fs.writeFileSync('scratch/next_data_dump.txt', fullText, 'utf8');
    console.log('Dumped full next_f data to scratch/next_data_dump.txt');
    
    // Search for keywords in the dumped text
    const lines = fullText.split('\n');
    console.log('Searching for interesting keywords...');
    for (const line of lines) {
      if (line.toLowerCase().includes('count') || line.toLowerCase().includes('transaction') || line.toLowerCase().includes('tx')) {
        if (line.length < 500) {
          console.log('Line match:', line.trim());
        } else {
          console.log('Line match (truncated):', line.trim().slice(0, 500) + '...');
        }
      }
    }
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
