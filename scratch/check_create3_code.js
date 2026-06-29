const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const CREATE3_FACTORY = '0x8d11001e2eC8707687a3D99c645a1728b2dc3fDe';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const code = await provider.getCode(CREATE3_FACTORY);
  console.log(`CREATE3 Factory code size at ${CREATE3_FACTORY}:`, code === '0x' ? 'Empty' : `${code.length} characters`);
}

main().catch(console.error);
