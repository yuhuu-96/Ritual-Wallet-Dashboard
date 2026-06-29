const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const ADDR = '0x17F53f75f97FbcDA74e78f02F66eEB9CFa37b6a9';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const abi = [
    'function owner() view returns (address)',
    'function configured() view returns (bool)',
    'function activeCallId() view returns (uint256)'
  ];
  const harness = new ethers.Contract(ADDR, abi, provider);
  
  try {
    const owner = await harness.owner();
    console.log('Owner:', owner);
    const configured = await harness.configured();
    console.log('Configured:', configured);
    const activeCallId = await harness.activeCallId();
    console.log('activeCallId:', activeCallId);
  } catch (err) {
    console.log('Error reading contract state', err);
  }
}

main().catch(console.error);
