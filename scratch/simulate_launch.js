const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const FACTORY = '0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

const FACTORY_ABI = [
  {
    "name": "launchSovereignWithDerivedDkms",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "userSalt", "type": "bytes32" },
      { "name": "dkmsPaymentAddress", "type": "address" },
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
      { "name": "schedulerCallId", "type": "uint256" }
    ]
  }
];

// Parameters decoded from the failed transaction (0x4149224791b7615d002be584968a80e75d447d3c23f68d76e5bea18b84960b4a)
const userSalt = '0xfe1abb3488b49c6e9faa39f925a65e55e8973d1b0a4cd712c76079d38c5d2f05';
const dkmsPaymentAddress = '0x9dc11412391Dc3EDF59811FC9Ee7bEbFD41c8b4C';
const dkmsFunding = 0n;
const schedulerFunding = ethers.parseEther('1.0');

const params = {
  executor: '0x9dc11412391Dc3EDF59811FC9Ee7bEbFD41c8b4C',
  ttl: 500n,
  userPublicKey: '0x',
  pollIntervalBlocks: 5n,
  maxPollBlock: 6000n,
  taskIdMarker: 'SOVEREIGN_AGENT_TASK',
  deliveryTarget: '0x7FE95a3a0AbD043Dc3793447199903d8ad367553',
  deliverySelector: '0x8ca12055',
  deliveryGasLimit: 3000000n,
  deliveryMaxFeePerGas: 1000000000n,
  deliveryMaxPriorityFeePerGas: 100000000n,
  cliType: 5, // Crush
  prompt: 'An AI agent that monitors Ritual testnet transactions and provides real-time insights',
  encryptedSecrets: '0x04ec11a6fbf75278257b1033add4ebbe376aea31372397831d4fc3f554cc668d26ccbd102b2ab62ae702fef836c0cf590ccbf744b3182cbf2bc1280f4cd122031fa08f66d9e07d8bab1f69d63e1173a56677a6a1b2c2a3cc86666f4f61051af30217f3f9a2e54bcb2aebde31a872b57365a55d0123111925f175d1916d691a0286831051e40dfd91115b08485b78fa16d30704f8ad2591725030ea7779137dca8ba68b8697aaf21cd8bc4f7c377943be0923c9044dcbade6ad3d1a1b25f18c919185aa7c97cfb3b1d9dcd6d7ec80759fea8653df7466a65803a0fe5556d6fa482b0a1b930c9c8ed319809d1bcd0113e98a28',
  convoHistory: {
    platform: 'hf',
    path: 'yuhuu-96/ritual/sessions/session-001.jsonl',
    keyRef: 'HF_TOKEN'
  },
  output: {
    platform: 'hf',
    path: 'yuhuu-96/ritual/artifacts/',
    keyRef: 'HF_TOKEN'
  },
  skills: [],
  systemPrompt: {
    platform: 'hf',
    path: 'yuhuu-96/ritual/prompts/default-system.md',
    keyRef: ''
  },
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

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const factory = new ethers.Contract(FACTORY, FACTORY_ABI, provider);
  
  console.log('Simulating launchSovereignWithDerivedDkms...');
  try {
    const tx = await factory.launchSovereignWithDerivedDkms.staticCall(
      userSalt,
      dkmsPaymentAddress,
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
    console.log('Simulation reverted. Error message:', error.message);
    if (error.data) {
      console.log('Raw revert data:', error.data);
    } else {
      console.log('Full error object:', error);
    }
  }
}

main().catch(console.error);
