const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const FACTORY = '0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';
const USER_SALT = '0x2ceb27b50b8eb17cf2bfec8b0cd1149a62140c21017c5163b05f23c733d39ab7';

const FACTORY_ABI = [
  'function predictCompressedHarness(address owner, bytes32 userSalt) view returns (address harness, bytes32 compressedSalt, bytes32 childSalt)'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const factory = new ethers.Contract(FACTORY, FACTORY_ABI, provider);

  console.log('Predicting compressed harness address for SENDER:', SENDER);
  console.log('userSalt:', USER_SALT);
  
  const [harness, compressedSalt, childSalt] = await factory.predictCompressedHarness(SENDER, USER_SALT);
  console.log('Predicted Harness:', harness);
  console.log('Compressed Salt:', compressedSalt);
  console.log('Child Salt:', childSalt);
}

main().catch(console.error);
