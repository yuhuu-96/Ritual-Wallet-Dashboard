const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const SCHEDULER_ADDR = '0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  // The Scheduler has a function to get schedule details.
  // Wait, I don't know the exact function name.
  // Maybe `getSchedule(uint256)` or `schedules(uint256)`?
  const abi = [
    'function schedules(uint256) view returns (uint8 status, address target, uint32 frequency, uint32 window, uint256 lastExecuted)',
    'function getSchedule(uint256) view returns (tuple(uint8 status, address target, uint32 frequency, uint256 lastExecuted))',
    'function getCall(uint256) view returns (tuple(uint8 status, address target))'
  ];
  const scheduler = new ethers.Contract(SCHEDULER_ADDR, abi, provider);
  
  try {
    const s = await scheduler.schedules(2746882n);
    console.log('schedules:', s);
  } catch (err) {
    console.log('schedules() failed');
  }
}

main().catch(console.error);
