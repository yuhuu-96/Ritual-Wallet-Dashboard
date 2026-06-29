const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const ADDR = '0x17F53f75f97FbcDA74e78f02F66eEB9CFa37b6a9';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const abi = [
    'function restart() external',
    'function stop() external'
  ];
  const harness = new ethers.Contract(ADDR, abi, provider);
  
  console.log('Simulating restart...');
  try {
    const tx = await harness.stop.staticCall({ from: SENDER });
    console.log('Simulation of stop succeeded!', tx);
  } catch (error) {
    console.log('Simulation of stop reverted. Error message:', error.message);
    if (error.data) {
      console.log('Raw revert data:', error.data);
    }
  }
}

main().catch(console.error);
