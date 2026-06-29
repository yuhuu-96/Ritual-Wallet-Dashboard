const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const ADDR = '0x17F53f75f97FbcDA74e78f02F66eEB9CFa37b6a9';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const abi = [
    'function hasStartConfig() view returns (bool)'
  ];
  const harness = new ethers.Contract(ADDR, abi, provider);
  
  try {
    const hasStartConfig = await harness.hasStartConfig();
    console.log('hasStartConfig:', hasStartConfig);
  } catch (err) {
    console.log('Error reading contract state', err);
  }
}

main().catch(console.error);
