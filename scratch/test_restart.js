const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const HARNESS_ADDR = '0x17F53f75f97FbcDA74e78f02F66eEB9CFa37b6a9';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  const harnessAbi = [
    'function restart() external returns (uint256)',
    'function scheduler() view returns (address)',
    'function ritualWallet() view returns (address)'
  ];
  const harness = new ethers.Contract(HARNESS_ADDR, harnessAbi, provider);
  
  try {
    // Try to static call restart
    // Since we are not signing, we can impersonate a call from a random address. 
    // Wait, let's just do staticCall without signer, it will default to 0x0
    console.log('Simulating restart()...');
    const res = await harness.restart.staticCall();
    console.log('Restart returned:', res);
  } catch (err) {
    console.error('Restart failed:', err.data || err.message);
  }
}

main().catch(console.error);
