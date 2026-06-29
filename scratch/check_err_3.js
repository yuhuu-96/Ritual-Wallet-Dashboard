const { ethers } = require('ethers');

const words = [
  'NotConfigured',
  'AgentNotConfigured',
  'HarnessNotConfigured',
  'InvalidState',
  'AlreadyRunning',
  'MissingConfig',
  'NoConfig',
  'MissingStartConfig',
  'NoStartConfig',
  'NotActive',
  'AlreadyActive',
  'NotOwner',
  'SovereignNotConfigured',
  'WindowNotStarted',
  'SovereignCallFailed',
  'NoValidExecutor',
  'InvalidWindow',
  'NoActiveWindow'
];

for (const w of words) {
  const err = `${w}()`;
  if (ethers.id(err).startsWith('0x740d9e57')) {
    console.log("MATCH:", err);
  }
}
