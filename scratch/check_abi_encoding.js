const { ethers } = require('ethers');

const SovereignAgentParamsTuple = {
  name: 'params',
  type: 'tuple',
  components: [
    { name: 'executor', type: 'address' },
    { name: 'ttl', type: 'uint256' },
    { name: 'userPublicKey', type: 'bytes' },
    { name: 'pollIntervalBlocks', type: 'uint64' },
    { name: 'maxPollBlock', type: 'uint64' },
    { name: 'taskIdMarker', type: 'string' },
    { name: 'deliveryTarget', type: 'address' },
    { name: 'deliverySelector', type: 'bytes4' },
    { name: 'deliveryGasLimit', type: 'uint256' },
    { name: 'deliveryMaxFeePerGas', type: 'uint256' },
    { name: 'deliveryMaxPriorityFeePerGas', type: 'uint256' },
    { name: 'cliType', type: 'uint16' },
    { name: 'prompt', type: 'string' },
    { name: 'encryptedSecrets', type: 'bytes' },
    {
      name: 'convoHistory',
      type: 'tuple',
      components: [
        { name: 'platform', type: 'string' },
        { name: 'path', type: 'string' },
        { name: 'keyRef', type: 'string' }
      ]
    },
    {
      name: 'output',
      type: 'tuple',
      components: [
        { name: 'platform', type: 'string' },
        { name: 'path', type: 'string' },
        { name: 'keyRef', type: 'string' }
      ]
    },
    {
      name: 'skills',
      type: 'tuple[]',
      components: [
        { name: 'platform', type: 'string' },
        { name: 'path', type: 'string' },
        { name: 'keyRef', type: 'string' }
      ]
    },
    {
      name: 'systemPrompt',
      type: 'tuple',
      components: [
        { name: 'platform', type: 'string' },
        { name: 'path', type: 'string' },
        { name: 'keyRef', type: 'string' }
      ]
    },
    { name: 'model', type: 'string' },
    { name: 'tools', type: 'string[]' },
    { name: 'maxTurns', type: 'uint16' },
    { name: 'maxTokens', type: 'uint32' },
    { name: 'rpcUrls', type: 'string' }
  ]
};

const paramsObj = {
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

const paramsArr = {
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
  cliType: 5,
  prompt: 'An AI agent that monitors Ritual testnet transactions and provides real-time insights',
  encryptedSecrets: '0x0492a73dafed9023d74e1c5ae0ac3321b0a01fe8c868d2e356685b1cd09d9b2b3f46df93235a5eb7dc922ec44eb6101f5332a550fce661bf57e956d5102e2851d8420ae4c045d1d13a8bd4da3b6ff8c179e5fc995e19eb60c9138f156a512d26d9ff58dac46cf623c6568da0c95bbf99a2ccac67ec47aedb05ffa3d08198356b06fccd937067a71d2ed83f12c72627ff605c67ad195012688fdf407723e62e4d63703e87bba5cbdbb7837b36ddc5278562e51c4c9c6b7cba8737e5a27c1b28235fb98beee6354cc4ae0cccc05a7e2a352415d173b224a1ca5436b9c9184fd3e4374b01a73fb607367d8dc7fcab34eb57ee2a',
  convoHistory: ['hf', 'yuhuu-96/ritual/sessions/session-001.jsonl', 'HF_TOKEN'],
  output: ['hf', 'yuhuu-96/ritual/artifacts/', 'HF_TOKEN'],
  skills: [],
  systemPrompt: ['hf', 'yuhuu-96/ritual/prompts/default-system.md', ''],
  model: 'gemini-2.5-flash',
  tools: [],
  maxTurns: 50,
  maxTokens: 8192,
  rpcUrls: ''
};

async function main() {
  const encoder = ethers.AbiCoder.defaultAbiCoder();
  
  console.log('Encoding paramsObj...');
  const encodedObj = encoder.encode([SovereignAgentParamsTuple], [paramsObj]);
  console.log('Encoded paramsObj length:', encodedObj.length);
  
  console.log('Encoding paramsArr...');
  const encodedArr = encoder.encode([SovereignAgentParamsTuple], [paramsArr]);
  console.log('Encoded paramsArr length:', encodedArr.length);
  
  console.log('Equal?:', encodedObj === encodedArr);
}

main().catch(console.error);
