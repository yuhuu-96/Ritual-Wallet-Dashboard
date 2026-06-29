const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const FACTORY = '0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

const ABI = [
  {
    "name": "deployHarness",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "userSalt", "type": "bytes32" }],
    "outputs": [{ "name": "harness", "type": "address" }]
  },
  {
    "name": "predictHarness",
    "type": "function",
    "stateMutability": "view",
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "userSalt", "type": "bytes32" }
    ],
    "outputs": [
      { "name": "harness", "type": "address" },
      { "name": "childSalt", "type": "bytes32" }
    ]
  }
];

const userSalt = '0xfe1abb3488b49c6e9faa39f925a65e55e8973d1b0a4cd712c76079d38c5d2f05';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const factory = new ethers.Contract(FACTORY, ABI, provider);
  
  const predicted = await factory.predictHarness(SENDER, userSalt);
  console.log('Predicted Harness Address (Two-Step):', predicted.harness);
  
  console.log('Simulating deployHarness via staticCall...');
  try {
    const result = await factory.deployHarness.staticCall(
      userSalt,
      {
        from: SENDER,
        gasLimit: 5000000n
      }
    );
    console.log('deployHarness Simulation Succeeded! Result:', result);
  } catch (error) {
    console.error('deployHarness Simulation Failed:');
    if (error.data) {
      console.error('Error raw data:', error.data);
    } else {
      console.error(error);
    }
  }
}

main().catch(console.error);
