const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';
const WALLET_ADDR = '0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948';

const ABI = [
  'function balanceOf(address user) public view returns (uint256)'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Contract(WALLET_ADDR, ABI, provider);
  
  console.log('Querying balanceOf in RitualWallet...');
  const balance = await wallet.balanceOf(SENDER);
  console.log(`RitualWallet balance for ${SENDER}:`, ethers.formatEther(balance), 'RITUAL');
}

main().catch(console.error);
