const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const FACTORY = '0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304';
const TX_HASH = '0xc17f20005a05fd7d8dc8e6bc78c77f79dd4570d8471e20306b01650c267e279b';

const FACTORY_ABI = [
  {
    "name": "launchSovereignCompressed",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "userSalt", "type": "bytes32" },
      { "name": "executor", "type": "address" },
      { "name": "dkmsTtl", "type": "uint64" },
      { "name": "dkmsFunding", "type": "uint256" },
      {
        "name": "params",
        "type": "tuple",
        "components": [
          { "name": "executor", "type": "address" },
          { "name": "ttl", "type": "uint256" },
          { "name": "userPublicKey", "type": "bytes" },
          { "name": "pollIntervalBlocks", "type": "uint64" },
          { "name": "maxPollBlock", "type": "uint64" },
          { "name": "taskIdMarker", "type": "string" },
          { "name": "deliveryTarget", "type": "address" },
          { "name": "deliverySelector", "type": "bytes4" },
          { "name": "deliveryGasLimit", "type": "uint256" },
          { "name": "deliveryMaxFeePerGas", "type": "uint256" },
          { "name": "deliveryMaxPriorityFeePerGas", "type": "uint256" },
          { "name": "cliType", "type": "uint16" },
          { "name": "prompt", "type": "string" },
          { "name": "encryptedSecrets", "type": "bytes" },
          {
            "name": "convoHistory",
            "type": "tuple",
            "components": [
              { "name": "platform", "type": "string" },
              { "name": "path", "type": "string" },
              { "name": "keyRef", "type": "string" }
            ]
          },
          {
            "name": "output",
            "type": "tuple",
            "components": [
              { "name": "platform", "type": "string" },
              { "name": "path", "type": "string" },
              { "name": "keyRef", "type": "string" }
            ]
          },
          {
            "name": "skills",
            "type": "tuple[]",
            "components": [
              { "name": "platform", "type": "string" },
              { "name": "path", "type": "string" },
              { "name": "keyRef", "type": "string" }
            ]
          },
          {
            "name": "systemPrompt",
            "type": "tuple",
            "components": [
              { "name": "platform", "type": "string" },
              { "name": "path", "type": "string" },
              { "name": "keyRef", "type": "string" }
            ]
          },
          { "name": "model", "type": "string" },
          { "name": "tools", "type": "string[]" },
          { "name": "maxTurns", "type": "uint16" },
          { "name": "maxTokens", "type": "uint32" },
          { "name": "rpcUrls", "type": "string" }
        ]
      },
      {
        "name": "schedule",
        "type": "tuple",
        "components": [
          { "name": "schedulerGas", "type": "uint32" },
          { "name": "frequency", "type": "uint32" },
          { "name": "schedulerTtl", "type": "uint32" },
          { "name": "maxFeePerGas", "type": "uint256" },
          { "name": "maxPriorityFeePerGas", "type": "uint256" },
          { "name": "value", "type": "uint256" }
        ]
      },
      { "name": "schedulerLockDuration", "type": "uint256" },
      { "name": "schedulerFunding", "type": "uint256" },
      { "name": "windowNumCalls", "type": "uint32" }
    ],
    "outputs": [
      { "name": "harness", "type": "address" },
      { "name": "dkmsPaymentAddress", "type": "address" },
      { "name": "schedulerCallId", "type": "uint256" }
    ]
  }
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  console.log('Fetching transaction details for', TX_HASH);
  const tx = await provider.getTransaction(TX_HASH);
  if (!tx) {
    console.error('Transaction not found!');
    return;
  }
  
  console.log('Tx Sender:', tx.from);
  console.log('Tx To:', tx.to);
  console.log('Tx Value:', ethers.formatEther(tx.value), 'RITUAL');
  console.log('Tx Input Length:', tx.data.length);
  
  const iface = new ethers.Interface(FACTORY_ABI);
  
  try {
    const decoded = iface.parseTransaction({ data: tx.data, value: tx.value });
    console.log('\nDecoded function name:', decoded.name);
    console.log('Arguments:');
    console.log('  userSalt:', decoded.args[0]);
    console.log('  executor:', decoded.args[1]);
    console.log('  dkmsTtl:', decoded.args[2].toString());
    console.log('  dkmsFunding:', ethers.formatEther(decoded.args[3]));
    console.log('  schedulerLockDuration:', decoded.args[6].toString());
    console.log('  schedulerFunding:', ethers.formatEther(decoded.args[7]));
    console.log('  windowNumCalls:', decoded.args[8].toString());
    const params = decoded.args[4];
    console.log('  params.encryptedSecrets length:', params.encryptedSecrets.length);
    console.log('  params.encryptedSecrets:', params.encryptedSecrets.slice(0, 50) + '...');
    
    console.log('\n--- Simulating transaction call static ---');
    await provider.call({
      from: tx.from,
      to: tx.to,
      data: tx.data,
      value: tx.value,
      gasLimit: 5000000n
    });
    console.log('Simulation succeeded (unexpected!)');
  } catch (error) {
    console.log('Simulation failed with error:', error.message);
    if (error.data) {
      console.log('Raw revert data:', error.data);
      // Try to decode custom errors
      const customErrors = [
        'error HarnessAddressMismatch()',
        'error InvalidValue()',
        'error InvalidDeliveryTarget()',
        'error InvalidDkmsOutput()',
        'error DkmsFundingTransferFailed()',
        'error InvalidSovereignMode()',
        'error InvalidCreate3Factory()',
        'error InvalidScheduler()',
        'error InvalidRitualWallet()',
        'error InvalidTeeRegistry()',
        'error InvalidAsyncDelivery()',
        'error ReentrantCall()',
        'error CallerNotContract()',
        'error ScheduleLifespanExceeded()',
        'error InvalidScheduleParameters()',
        'error InvalidTtl()'
      ];
      const errIface = new ethers.Interface(customErrors);
      try {
        const decodedError = errIface.parseError(error.data);
        console.log('Decoded custom error:', decodedError.name, decodedError.args);
      } catch (errDec) {
        console.log('Could not decode error with standard custom errors list.');
      }
    }
  }
}

main().catch(console.error);
