const { ethers } = require('ethers');

const errors = [
  'MissingStartConfig()',
  'NotOwner()',
  'CallerNotOwner()',
  'Unauthorized()',
  'SovereignNotConfigured()',
  'NotActive()',
  'WindowNotStarted()',
  'NoStartConfig()',
];

for (const err of errors) {
  if (ethers.id(err).startsWith('0x740d9e57')) {
    console.log("MATCH", err);
  }
}
