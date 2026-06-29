const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const HARNESS_ADDR = '0x17F53f75f97FbcDA74e78f02F66eEB9CFa37b6a9';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  // Get scheduler address from harness
  const harnessAbi = ['function scheduler() view returns (address)'];
  const harness = new ethers.Contract(HARNESS_ADDR, harnessAbi, provider);
  
  try {
    const schedulerAddr = await harness.scheduler();
    console.log('Scheduler address:', schedulerAddr);
    
    // Check if 740d9e57 is in scheduler bytecode
    const code = await provider.getCode(schedulerAddr);
    if (code.includes('740d9e57')) {
      console.log('Scheduler bytecode CONTAINS 740d9e57 !');
    } else {
      console.log('Scheduler bytecode DOES NOT contain 740d9e57.');
    }
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);
