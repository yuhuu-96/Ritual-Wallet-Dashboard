const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const balance = await provider.getBalance(SENDER);
  console.log(`Native RITUAL balance of ${SENDER}:`, ethers.formatEther(balance), 'RITUAL');
}

main().catch(console.error);
