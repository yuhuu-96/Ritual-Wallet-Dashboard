const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const HARNESS_ADDR = '0x17F53f75f97FbcDA74e78f02F66eEB9CFa37b6a9';
const RITUAL_WALLET_ADDR = '0x19a0A6e9A34bcf1A51373A85eB5Ff23dF4619C45'; // usually wallet

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  // Need the actual RitualWallet address. We can read it from harness!
  const harnessAbi = ['function ritualWallet() view returns (address)'];
  const harness = new ethers.Contract(HARNESS_ADDR, harnessAbi, provider);
  const walletAddr = await harness.ritualWallet();
  console.log('RitualWallet:', walletAddr);
  
  const walletAbi = ['function balanceOf(address) view returns (uint256)'];
  const wallet = new ethers.Contract(walletAddr, walletAbi, provider);
  const balance = await wallet.balanceOf(HARNESS_ADDR);
  console.log('Harness Wallet Balance:', ethers.formatEther(balance), 'RITUAL');
}

main().catch(console.error);
