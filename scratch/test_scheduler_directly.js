const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const SCHEDULER = '0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

const ABI = [
  {
    "name": "schedule",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "data", "type": "bytes" },
      { "name": "gas", "type": "uint32" },
      { "name": "startBlock", "type": "uint32" },
      { "name": "numCalls", "type": "uint32" },
      { "name": "frequency", "type": "uint32" },
      { "name": "ttl", "type": "uint32" },
      { "name": "maxFeePerGas", "type": "uint256" },
      { "name": "maxPriorityFeePerGas", "type": "uint256" },
      { "name": "value", "type": "uint256" },
      { "name": "payer", "type": "address" }
    ],
    "outputs": [{ "type": "uint256" }]
  }
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const scheduler = new ethers.Contract(SCHEDULER, ABI, provider);
  
  // Dummy calldata matching the harness wakeUp callback
  const dummyCalldata = ethers.hexlify(ethers.randomBytes(32));
  
  const currentBlock = await provider.getBlockNumber();
  const startBlock = currentBlock + 2000;
  
  console.log('Testing scheduler.schedule staticCall...');
  try {
    const callId = await scheduler.schedule.staticCall(
      dummyCalldata,
      3000000,          // gas
      startBlock,       // startBlock
      5,                // numCalls
      2000,             // frequency
      500,              // ttl
      1000000000n,      // maxFeePerGas
      100000000n,       // maxPriorityFeePerGas
      0n,               // value
      SENDER,           // payer
      {
        from: SENDER
      }
    );
    console.log('scheduler.schedule succeeded! callId:', callId.toString());
  } catch (error) {
    console.log('scheduler.schedule reverted. Error:', error.message);
    if (error.data) {
      console.log('Raw revert data:', error.data);
    }
  }
}

main().catch(console.error);
