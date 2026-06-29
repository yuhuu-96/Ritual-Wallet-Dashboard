const { ethers } = require('ethers');

const words = [
  'InvalidStatus',
  'NotConfigured',
  'AlreadyConfigured',
  'WakeModeNone'
];

for (const w of words) {
  const err = `${w}()`;
  if (ethers.id(err).startsWith('0x740d9e57')) {
    console.log("MATCH:", err);
  }
}
