const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const block = await provider.getBlock('latest');
  console.log('Current block number:', block.number);
  console.log('Base Fee Per Gas (wei):', block.baseFeePerGas.toString());
  console.log('Base Fee Per Gas (gwei):', ethers.formatUnits(block.baseFeePerGas, 'gwei'));
  
  const feeData = await provider.getFeeData();
  console.log('Fee data:');
  console.log('  gasPrice:', feeData.gasPrice?.toString());
  console.log('  maxFeePerGas:', feeData.maxFeePerGas?.toString());
  console.log('  maxPriorityFeePerGas:', feeData.maxPriorityFeePerGas?.toString());
}

main().catch(console.error);
