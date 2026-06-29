const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const TEE_REGISTRY = '0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F';
const EXECUTOR = '0x9dc11412391Dc3EDF59811FC9Ee7bEbFD41c8b4C';

const REG_ABI = [
  'function getService(address executor) view returns (tuple(tuple(address paymentAddress, address teeAddress, uint8 teeType, bytes publicKey, string endpoint, bytes32 certPubKeyHash, uint8 capability) node, bool isValid, bytes32 workloadId))'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const reg = new ethers.Contract(TEE_REGISTRY, REG_ABI, provider);

  console.log('Fetching details for executor:', EXECUTOR);
  try {
    const service = await reg.getService(EXECUTOR);
    console.log('IsValid:', service.isValid);
    console.log('Capability:', service.node.capability);
    console.log('Endpoint:', service.node.endpoint);
    console.log('PublicKey Length:', service.node.publicKey.length);
  } catch (error) {
    console.error('Error fetching executor details:', error.message);
  }
}

main().catch(console.error);
