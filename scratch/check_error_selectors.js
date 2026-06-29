const { ethers } = require('ethers');

// Potential error names from the Scheduler contract
const errors = [
  'ScheduleLifespanExceeded',
  'Unauthorized',
  'InvalidPayer',
  'InvalidPayerApproval',
  'InvalidGasLimit',
  'InvalidFrequency',
  'InvalidNumCalls',
  'InvalidStartBlock',
  'InvalidTtl',
  'InvalidMaxFeePerGas',
  'InvalidMaxPriorityFeePerGas',
  'InvalidValue',
  'PayerNotApproved',
  'PayerMismatch'
];

async function main() {
  const target = '0xbe541de4';
  console.log(`Searching for signature matching ${target}...`);
  for (const name of errors) {
    const signature = `${name}()`;
    const hash = ethers.keccak256(ethers.toUtf8Bytes(signature));
    const selector = hash.slice(0, 10);
    console.log(`  ${signature} -> ${selector}`);
    if (selector === target) {
      console.log(`\nFOUND MATCH: ${signature}`);
    }
  }
}

main().catch(console.error);
