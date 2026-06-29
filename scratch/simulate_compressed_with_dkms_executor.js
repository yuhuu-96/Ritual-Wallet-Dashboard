const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const FACTORY = '0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

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

// Decoded values with new salt and DKMS executor
const userSalt = ethers.keccak256(ethers.toUtf8Bytes('ritual-dapp-agent-final-v2'));
const dkmsExecutor = '0x612870C7894b9F0Ea010F4D2452Af1b5dcd367Dd'; // Capability 6
const agentExecutor = '0x9dc11412391Dc3EDF59811FC9Ee7bEbFD41c8b4C'; // Capability 0

const dkmsFunding = 0n;
const schedulerFunding = ethers.parseEther('5.0');

// Calculate predicted harness address for the new salt
async function getPredictedHarness(provider) {
  const factAbi = ['function predictCompressedHarness(address,bytes32) view returns(address,bytes32,bytes32)'];
  const factory = new ethers.Contract(FACTORY, factAbi, provider);
  const [harness] = await factory.predictCompressedHarness(SENDER, userSalt);
  return harness;
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const factory = new ethers.Contract(FACTORY, FACTORY_ABI, provider);
  
  const predictedHarness = await getPredictedHarness(provider);
  console.log('Predicted Harness for new salt:', predictedHarness);

  const params = {
    executor: agentExecutor, // Executor that runs the task
    ttl: 500n,
    userPublicKey: '0x',
    pollIntervalBlocks: 5n,
    maxPollBlock: 6000n,
    taskIdMarker: 'SOVEREIGN_AGENT_TASK',
    deliveryTarget: predictedHarness, // Must match predicted
    deliverySelector: '0x8ca12055',
    deliveryGasLimit: 3000000n,
    deliveryMaxFeePerGas: 1000000000n,
    deliveryMaxPriorityFeePerGas: 100000000n,
    cliType: 5,
    prompt: 'An AI agent that monitors Ritual testnet transactions and provides real-time insights',
    encryptedSecrets: '0x', // Empty for testing
    convoHistory: { platform: 'hf', path: 'yuhuu-96/ritual/sessions/session-001.jsonl', keyRef: 'HF_TOKEN' },
    output: { platform: 'hf', path: 'yuhuu-96/ritual/artifacts/', keyRef: 'HF_TOKEN' },
    skills: [],
    systemPrompt: { platform: 'hf', path: 'yuhuu-96/ritual/prompts/default-system.md', keyRef: '' },
    model: 'gemini-2.5-flash',
    tools: [],
    maxTurns: 50n,
    maxTokens: 8192n,
    rpcUrls: ''
  };

  const schedule = {
    schedulerGas: 3000000,
    frequency: 2000,
    schedulerTtl: 500,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 100000000n,
    value: 0n
  };

  const schedulerLockDuration = 100000000n;
  const windowNumCalls = 5;

  console.log('\nSimulating launchSovereignCompressed with DKMS Executor (0x6128...)...');
  try {
    const tx = await factory.launchSovereignCompressed.staticCall(
      userSalt,
      dkmsExecutor, // Passing DKMS executor
      500n, // dkmsTtl
      dkmsFunding,
      params,
      schedule,
      schedulerLockDuration,
      schedulerFunding,
      windowNumCalls,
      {
        from: SENDER,
        value: dkmsFunding + schedulerFunding,
        gasLimit: 5000000n
      }
    );
    console.log('Simulation succeeded! Output:', tx);
  } catch (error) {
    console.log('Simulation failed with error:', error.message);
    if (error.data) {
      console.log('Raw revert data:', error.data);
    }
  }
}

main().catch(console.error);
