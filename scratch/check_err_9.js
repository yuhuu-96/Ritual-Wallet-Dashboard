const { ethers } = require('ethers');

const words = [
  'InvalidScheduleState',
  'NotConfigured',
  'AlreadyScheduled'
];

for (const w of words) {
  const err = `${w}()`;
  if (ethers.id(err).startsWith('0x740d9e57')) {
    console.log("MATCH:", err);
  }
}
