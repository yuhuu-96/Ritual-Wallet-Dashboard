const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const FACTORY = '0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

const FACTORY_ABI = [
  {
    "name": "predictCompressedHarness",
    "type": "function",
    "stateMutability": "view",
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "userSalt", "type": "bytes32" }
    ],
    "outputs": [
      { "name": "harness", "type": "address" },
      { "name": "compressedSalt", "type": "bytes32" },
      { "name": "childSalt", "type": "bytes32" }
    ]
  },
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

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const factory = new ethers.Contract(FACTORY, FACTORY_ABI, provider);
  
  const userSalt = ethers.keccak256(ethers.toUtf8Bytes('ritual-agent-derived-test-1'));
  const agentExecutor = '0x9dc11412391Dc3EDF59811FC9Ee7bEbFD41c8b4C'; 

  const predictResult = await factory.predictCompressedHarness(SENDER, userSalt);
  const predictedHarness = predictResult.harness;
  console.log('Predicted Harness:', predictedHarness);

  const params = {
    executor: agentExecutor,
    ttl: 500n,
    userPublicKey: '0x',
    pollIntervalBlocks: 5n,
    maxPollBlock: 6000n,
    taskIdMarker: 'SOVEREIGN_AGENT_TASK',
    deliveryTarget: predictedHarness,
    deliverySelector: '0x8ca12055',
    deliveryGasLimit: 3000000n,
    deliveryMaxFeePerGas: 1000000000n,
    deliveryMaxPriorityFeePerGas: 100000000n,
    cliType: 5,
    prompt: 'Hello world',
    encryptedSecrets: '0x',
    convoHistory: { platform: 'hf', path: 'user/repo/sessions/session-001.jsonl', keyRef: 'HF_TOKEN' },
    output: { platform: 'hf', path: 'user/repo/artifacts/', keyRef: 'HF_TOKEN' },
    skills: [],
    systemPrompt: { platform: 'hf', path: 'user/repo/prompts/default-system.md', keyRef: '' },
    model: 'gemini-2.5-flash',
    tools: [],
    maxTurns: 50n,
    maxTokens: 8192n,
    rpcUrls: ''
  };

  const schedule = {
    schedulerGas: 3000000n,
    frequency: 2000n,
    schedulerTtl: 500n,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 100000000n,
    value: 0n
  };

  const dkmsFunding = 0n;
  const schedulerFunding = ethers.parseEther('5.0');
  
  console.log('Simulating launchSovereignWithDerivedDkms...');
  try {
    const tx = await factory.launchSovereignWithDerivedDkms.staticCall(
      userSalt,
      predictedHarness, // Passing predicted harness as DKMS payment address
      dkmsFunding,
      params,
      schedule,
      100000000n, // schedulerLockDuration
      schedulerFunding,
      5, // windowNumCalls
      {
        from: SENDER,
        value: schedulerFunding,
        gasLimit: 5000000n
      }
    );
    console.log('Simulation succeeded!', tx);
  } catch (error) {
    console.log('Simulation failed:', error.message);
    if (error.data) {
      console.log('Revert data:', error.data);
    }
  }
}

main().catch(console.error);
