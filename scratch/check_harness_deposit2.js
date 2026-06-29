const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const RITUAL_WALLET = '0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948';
// Predicted harness address
const HARNESS = '0x7FE95a3a0AbD043Dc3793447199903d8ad367553';

const ABI = [
  'function depositFor(address user, uint256 lockDuration) external payable',
  'function balanceOf(address user) external view returns (uint256)',
  'function lockUntil(address user) external view returns (uint256)',
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Contract(RITUAL_WALLET, ABI, provider);
  
  console.log('Testing depositFor to HARNESS with lockDuration=100000000...');
  try {
    await wallet.depositFor.staticCall(HARNESS, 100000000n, {
      from: '0xe1e8BD93279529831b789133BD76e7c30D54d200',
      value: ethers.parseEther('0.1')
    });
    console.log('depositFor to HARNESS succeeded!');
  } catch (e) {
    console.log('depositFor to HARNESS REVERTED:', e.message);
    if (e.data) console.log('Error data:', e.data);
  }

  // Also check current harness balance
  const bal = await wallet.balanceOf(HARNESS);
  const lock = await wallet.lockUntil(HARNESS);
  const block = await provider.getBlockNumber();
  console.log('\nHarness RitualWallet balance:', ethers.formatEther(bal), 'RITUAL');
  console.log('Harness lockUntil:', lock.toString(), '(current block:', block, ')');
}

main().catch(console.error);
