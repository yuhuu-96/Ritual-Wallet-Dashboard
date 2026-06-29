const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const RITUAL_WALLET = '0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

const ABI = [
  'function balanceOf(address user) external view returns (uint256)',
  'function lockUntil(address user) external view returns (uint256)'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Contract(RITUAL_WALLET, ABI, provider);
  const currentBlock = await provider.getBlockNumber();
  
  console.log('Current block:', currentBlock);
  const balance = await wallet.balanceOf(SENDER);
  console.log('SENDER Balance:', ethers.formatEther(balance), 'RITUAL');
  const lock = await wallet.lockUntil(SENDER);
  console.log('SENDER LockUntil block:', lock.toString());
  console.log('Is locked:', currentBlock < lock);
}

main().catch(console.error);
