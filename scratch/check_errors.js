const { ethers } = require('ethers');

const errors = [
  'HarnessAddressMismatch()',
  'InvalidValue()',
  'InvalidDeliveryTarget()',
  'InvalidDkmsOutput()',
  'DkmsFundingTransferFailed()',
  'InvalidSovereignMode()',
  'InvalidCreate3Factory()',
  'InvalidScheduler()',
  'InvalidRitualWallet()',
  'InvalidTeeRegistry()',
  'InvalidAsyncDelivery()',
  'ReentrantCall()',
  'SovereignCallFailed()',
  'NoValidExecutor()',
  'OwnableUnauthorizedAccount(address)'
];

for (const err of errors) {
  console.log(err, ethers.id(err).substring(0, 10));
}
