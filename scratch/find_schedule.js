const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const SCHEDULER_ADDR = '0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B';
const HARNESS_ADDR = '0x17F53f75f97FbcDA74e78f02F66eEB9CFa37b6a9';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  // We can query logs for the Scheduler contract.
  // We don't know the exact event signature, maybe CallScheduled(uint256 id, address target, ...)
  // Or maybe we can just query all logs from the scheduler in the last 100000 blocks and filter by HARNESS_ADDR
  
  const currentBlock = await provider.getBlockNumber();
  const fromBlock = currentBlock - 90000;
  
  console.log(`Scanning logs from block ${fromBlock} to ${currentBlock}...`);
  
  const logs = await provider.getLogs({
    address: SCHEDULER_ADDR,
    fromBlock: fromBlock,
    toBlock: 'latest'
  });
  
  const harnessLower = HARNESS_ADDR.toLowerCase();
  // Strip 0x and pad to 64 chars
  const harnessTopic = '0x' + HARNESS_ADDR.slice(2).padStart(64, '0').toLowerCase();
  
  const relatedLogs = logs.filter(l => {
    if (l.topics.some(t => t.toLowerCase() === harnessTopic)) return true;
    if (l.data.toLowerCase().includes(HARNESS_ADDR.slice(2).toLowerCase())) return true;
    return false;
  });
  
  console.log(`Found ${relatedLogs.length} related logs.`);
  relatedLogs.forEach((l, i) => {
    console.log(`\nLog ${i}: Block ${l.blockNumber}, Tx ${l.transactionHash}`);
    console.log(`Topics:`, l.topics);
    console.log(`Data:`, l.data);
  });
}

main().catch(console.error);
