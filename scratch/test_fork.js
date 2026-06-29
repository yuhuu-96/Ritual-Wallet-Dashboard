const hre = require("hardhat");

const FACTORY = '0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

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

const userSalt = '0xfe1abb3488b49c6e9faa39f925a65e55e8973d1b0a4cd712c76079d38c5d2f05';
const executor = '0x612870C7894b9F0Ea010F4D2452Af1b5dcd367Dd'; // DKMS executor
const dkmsTtl = 500n;
const dkmsFunding = 0n;

const params = {
  executor: '0x9dc11412391Dc3EDF59811FC9Ee7bEbFD41c8b4C', // HTTP_CALL executor
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
  cliType: 5,
  prompt: 'An AI agent that monitors Ritual testnet transactions and provides real-time insights',
  encryptedSecrets: '0x0492a73dafed9023d74e1c5ae0ac3321b0a01fe8c868d2e356685b1cd09d9b2b3f46df93235a5eb7dc922ec44eb6101f5332a550fce661bf57e956d5102e2851d8420ae4c045d1d13a8bd4da3b6ff8c179e5fc995e19eb60c9138f156a512d26d9ff58dac46cf623c6568da0c95bbf99a2ccac67ec47aedb05ffa3d08198356b06fccd937067a71d2ed83f12c72627ff605c67ad195012688fdf407723e62e4d63703e87bba5cbdbb7837b36ddc5278562e51c4c9c6b7cba8737e5a27c1b28235fb98beee6354cc4ae0cccc05a7e2a352415d173b224a1ca5436b9c9184fd3e4374b01a73fb607367d8dc7fcab34eb57ee2a',
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
  maxTurns: 50,
  maxTokens: 8192,
  rpcUrls: ''
};

const schedule = {
  schedulerGas: 3000000,
  frequency: 100,
  schedulerTtl: 100,
  maxFeePerGas: 1000000000n,
  maxPriorityFeePerGas: 100000000n,
  value: 0n
};

const schedulerLockDuration = 100000000n;
const schedulerFunding = 1000000000000000000n; // 1 RITUAL
const windowNumCalls = 5;

async function main() {
  // Impersonate SENDER to send a real transaction on our local fork!
  console.log('Impersonating sender:', SENDER);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [SENDER],
  });
  
  // Set sender balance to make sure they have plenty of funds
  await hre.network.provider.send("hardhat_setBalance", [
    SENDER,
    "0x56BC75E2D63100000" // 100 RITUAL
  ]);
  
  const signer = await hre.ethers.getSigner(SENDER);
  const factory = new hre.ethers.Contract(FACTORY, ABI, signer);
  
  console.log('Simulating on local Hardhat fork...');
  try {
    const tx = await factory.launchSovereignCompressed(
      userSalt,
      executor,
      dkmsTtl,
      dkmsFunding,
      params,
      schedule,
      schedulerLockDuration,
      schedulerFunding,
      windowNumCalls,
      {
        value: dkmsFunding + schedulerFunding,
        gasLimit: 15000000
      }
    );
    console.log('Tx sent! Hash:', tx.hash);
    const receipt = await tx.wait();
    console.log('Tx Succeeded! Block:', receipt.blockNumber);
  } catch (error) {
    console.error('Execution Failed:');
    console.error(error);
  }
}

main().catch(console.error);
