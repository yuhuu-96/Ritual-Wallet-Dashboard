const fs = require('fs');

function main() {
  const content = fs.readFileSync('scratch/next_data_dump.txt', 'utf8');
  const lines = content.split('\n');
  console.log(`Loaded ${lines.length} lines`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Look for JSON-like content
    const jsonStart = line.indexOf('{');
    if (jsonStart !== -1) {
      const jsonStr = line.slice(jsonStart);
      try {
        const obj = JSON.parse(jsonStr);
        // Let's print keys and some values
        console.log(`Line ${i + 1} JSON keys:`, Object.keys(obj));
        // Search for transaction count or list
        const str = JSON.stringify(obj).toLowerCase();
        if (str.includes('count') || str.includes('transaction') || str.includes('tx')) {
          console.log(`Line ${i + 1} has transaction/count keywords!`);
          findKeywordValues(obj, '');
        }
      } catch (e) {
        // Try parsing as array if it starts with [
      }
    }
    
    const arrayStart = line.indexOf('[');
    if (arrayStart !== -1 && (jsonStart === -1 || arrayStart < jsonStart)) {
      const arrayStr = line.slice(arrayStart);
      try {
        const arr = JSON.parse(arrayStr);
        console.log(`Line ${i + 1} Array length:`, arr.length);
        const str = JSON.stringify(arr).toLowerCase();
        if (str.includes('count') || str.includes('transaction') || str.includes('tx')) {
          console.log(`Line ${i + 1} Array has transaction/count keywords!`);
          findKeywordValues(arr, '');
        }
      } catch (e) {
        // Not valid array
      }
    }
  }
}

function findKeywordValues(obj, path) {
  if (obj === null || obj === undefined) return;
  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const newPath = path ? `${path}.${key}` : key;
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        const strVal = String(val).toLowerCase();
        const strKey = String(key).toLowerCase();
        if (strKey.includes('count') || strKey.includes('tx') || strKey.includes('transaction') || strVal.includes('transaction') || strVal.includes('count')) {
          console.log(`  Found field: ${newPath} = ${val}`);
        }
      } else {
        findKeywordValues(val, newPath);
      }
    }
  }
}

main();
