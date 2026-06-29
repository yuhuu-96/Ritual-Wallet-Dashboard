const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const RITUAL_WALLET = '0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  const wallet = new ethers.Contract(RITUAL_WALLET, [
    'function depositFor(address user, uint256 lockDuration) external payable',
    'function deposit(uint256 lockDuration) external payable'
  ], provider);
  
  console.log('Testing depositFor staticCall with lockDuration = 100,000,000...');
  try {
    await wallet.depositFor.staticCall('0xe1e8BD93279529831b789133BD76e7c30D54d200', 100000000n, {
      from: '0xe1e8BD93279529831b789133BD76e7c30D54d200',
      value: ethers.parseEther('1.0')
    });
    console.log('depositFor call succeeded with 100M lock!');
  } catch (error) {
    console.log('depositFor call reverted. Error msg:', error.message);
  }
}

main().catch(console.error);
