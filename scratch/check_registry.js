const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const TEE_REGISTRY = '0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F';

const ABI = [
  {
    "name": "getServicesByCapability",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{"name": "capability", "type": "uint8"}, {"name": "checkValidity", "type": "bool"}],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          {
            "name": "node",
            "type": "tuple",
            "components": [
              {"name": "paymentAddress", "type": "address"},
              {"name": "teeAddress", "type": "address"},
              {"name": "teeType", "type": "uint8"},
              {"name": "publicKey", "type": "bytes"},
              {"name": "endpoint", "type": "string"},
              {"name": "certPubKeyHash", "type": "bytes32"},
              {"name": "capability", "type": "uint8"}
            ]
          },
          {"name": "isValid", "type": "bool"},
          {"name": "workloadId", "type": "bytes32"}
        ]
      }
    ]
  }
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const registry = new ethers.Contract(TEE_REGISTRY, ABI, provider);
  
  console.log('Querying TEEServiceRegistry for capability 0...');
  try {
    const list = await registry.getServicesByCapability(0, true);
    console.log(`Found ${list.length} services:`);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      console.log(`Node ${i}:`);
      console.log(`  teeAddress:`, item.node.teeAddress);
      console.log(`  paymentAddress:`, item.node.paymentAddress);
      console.log(`  teeType:`, item.node.teeType);
      console.log(`  publicKey (len):`, item.node.publicKey.length);
      console.log(`  endpoint:`, item.node.endpoint);
      console.log(`  isValid:`, item.isValid);
    }
  } catch (error) {
    console.error('Failed to query TEE registry:', error);
  }
}

main().catch(console.error);
