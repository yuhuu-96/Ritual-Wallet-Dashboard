const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const TARGET = '0x7FE95a3a0AbD043Dc3793447199903d8ad367553';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const code = await provider.getCode(TARGET);
  console.log(`Bytecode at ${TARGET}:`);
  console.log(code);
  if (code !== '0x') {
    console.log('Contract IS ALREADY DEPLOYED at this address!');
  } else {
    console.log('No contract deployed (clean address).');
  }
}

main().catch(console.error);
