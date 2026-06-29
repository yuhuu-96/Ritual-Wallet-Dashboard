const { ethers } = require('ethers');

const words = [
  'WakeModeNotNone',
  'AlreadyRolling',
  'AlreadyRunning',
  'AgentIsRunning',
  'AlreadyConfigured'
];

for (const w of words) {
  const err = `${w}()`;
  if (ethers.id(err).startsWith('0x740d9e57')) {
    console.log("MATCH:", err);
  }
}
