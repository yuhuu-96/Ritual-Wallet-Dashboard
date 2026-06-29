const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const TEE_REGISTRY = '0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F';
const TARGET_EXECUTOR = '0x9dc11412391Dc3EDF59811FC9Ee7bEbFD41c8b4C';

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
  
  const list = await registry.getServicesByCapability(0, true);
  const found = list.find(item => item.node.teeAddress.toLowerCase() === TARGET_EXECUTOR.toLowerCase());
  if (found) {
    console.log(`Executor ${TARGET_EXECUTOR} found!`);
    console.log(`  isValid:`, found.isValid);
    console.log(`  endpoint:`, found.node.endpoint);
    console.log(`  publicKey (len):`, found.node.publicKey.length);
  } else {
    console.log(`Executor ${TARGET_EXECUTOR} NOT found in registry!`);
  }
}

main().catch(console.error);
