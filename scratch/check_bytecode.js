const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const HARNESS_ADDR = '0x17F53f75f97FbcDA74e78f02F66eEB9CFa37b6a9';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const code = await provider.getCode(HARNESS_ADDR);
  if (code.includes('740d9e57')) {
    console.log("Error 0x740d9e57 is thrown by the harness contract itself!");
  } else {
    console.log("Error 0x740d9e57 is NOT in the harness bytecode, probably thrown by an external call.");
  }
}

main().catch(console.error);
