const fs = require('fs');

function main() {
  const content = fs.readFileSync('scratch/next_data_dump.txt', 'utf8');
  const urls = content.match(/https?:\/\/[^\s"']+/g) || [];
  const paths = content.match(/\/api\/[^\s"']+/g) || [];
  
  console.log(`Found ${urls.length} URLs:`);
  const uniqueUrls = [...new Set(urls)];
  for (const url of uniqueUrls) {
    console.log('  URL:', url);
  }
  
  console.log(`\nFound ${paths.length} API paths:`);
  const uniquePaths = [...new Set(paths)];
  for (const path of uniquePaths) {
    console.log('  Path:', path);
  }
}

main();
