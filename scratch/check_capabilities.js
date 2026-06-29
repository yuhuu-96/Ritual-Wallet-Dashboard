const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const TEE_REGISTRY = '0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F';

const REG_ABI = [
  'function getServicesByCapability(uint8 capability, bool checkValidity) view returns (tuple(tuple(address paymentAddress, address teeAddress, uint8 teeType, bytes publicKey, string endpoint, bytes32 certPubKeyHash, uint8 capability) node, bool isValid, bytes32 workloadId)[])'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const reg = new ethers.Contract(TEE_REGISTRY, REG_ABI, provider);

  for (let cap = 0; cap <= 10; cap++) {
    try {
      const services = await reg.getServicesByCapability(cap, true);
      console.log(`Capability ${cap}: ${services.length} valid services found`);
      if (services.length > 0) {
        console.log(`  Example service: ${services[0].node.teeAddress} (${services[0].node.endpoint})`);
      }
    } catch (e) {
      console.log(`Capability ${cap} check failed:`, e.message);
    }
  }
}

main().catch(console.error);
