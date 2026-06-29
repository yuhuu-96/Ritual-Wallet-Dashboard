const { ethers } = require('ethers');

const prefixes = ['', 'Agent', 'Harness', 'Sovereign', 'Scheduler', 'Call', 'Schedule', 'Window'];
const mids = ['Not', 'Already', 'Invalid', 'Missing', 'No', 'Unauthorized'];
const suffixes = ['Configured', 'Active', 'Running', 'Started', 'Config', 'State', 'Owner', 'Schedule', 'Call'];

const all = new Set();
for (const p of prefixes) {
  for (const s of suffixes) {
    all.add(`${p}${s}`);
  }
  for (const m of mids) {
    for (const s of suffixes) {
      all.add(`${p}${m}${s}`);
    }
  }
}

for (const w of all) {
  const err = `${w}()`;
  if (ethers.id(err).startsWith('0x740d9e57')) {
    console.log("MATCH:", err);
  }
}
