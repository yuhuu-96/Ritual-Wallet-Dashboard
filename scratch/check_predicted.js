const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const FACTORY = '0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';
const SALT = '0xfe1abb3488b49c6e9faa39f925a65e55e8973d1b0a4cd712c76079d38c5d2f05';

const ABI = [
  'function predictCompressedHarness(address owner, bytes32 userSalt) public view returns (address harness, bytes32 compressedSalt, bytes32 childSalt)'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const factory = new ethers.Contract(FACTORY, ABI, provider);
  
  console.log(`Querying predictCompressedHarness for SENDER=${SENDER} and SALT=${SALT}...`);
  const result = await factory.predictCompressedHarness(SENDER, SALT);
  console.log('Result:', result);
}

main().catch(console.error);
