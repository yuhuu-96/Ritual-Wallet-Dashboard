const fs = require('fs');

function main() {
  const content = fs.readFileSync('scratch/next_data_dump.txt', 'utf8');
  console.log(`Content length: ${content.length}`);
  
  const keywords = ['transaction', 'count', 'nonce', 'tx', 'total'];
  for (const kw of keywords) {
    console.log(`\n--- Searching for: "${kw}" ---`);
    const regex = new RegExp(kw, 'gi');
    let match;
    let count = 0;
    while ((match = regex.exec(content)) !== null && count < 15) {
      const idx = match.index;
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + 150);
      console.log(`Match ${++count} at index ${idx}:`);
      console.log(`  ...${content.slice(start, end).replace(/\n/g, ' ')}...`);
    }
  }
}

main();
