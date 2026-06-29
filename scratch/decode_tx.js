const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const TX_HASH = '0x4149224791b7615d002be584968a80e75d447d3c23f68d76e5bea18b84960b4a';

const ABI = [
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
  const tx = await provider.getTransaction(TX_HASH);
  if (!tx) {
    console.error('Tx not found');
    return;
  }
  
  const iface = new ethers.Interface(ABI);
  
  const selector = iface.getFunction('launchSovereignCompressed').selector;
  console.log('Local Selector:', selector);
  console.log('Tx Selector:   ', tx.data.slice(0, 10));
  
  try {
    const decoded = iface.decodeFunctionData('launchSovereignCompressed', tx.data);
    console.log('Decoded successfully!');
    console.dir(decoded, { depth: null });
  } catch (e) {
    console.error('Decoding failed with error:');
    console.error(e);
  }
}

main().catch(console.error);
