const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const ADDR = '0x17F53f75f97FbcDA74e78f02F66eEB9CFa37b6a9';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const abi = [
    'function configureAndStartSovereignSchedule(tuple(bytes32 modelId, bytes dkmsKey, bytes32[] keys) dkmsReq, tuple(bytes model, uint256 windowNumCalls, bytes provider) schedConfig, uint256 allocation)'
  ];
  const harness = new ethers.Contract(ADDR, abi, provider);
  
  const modelBytes = ethers.toUtf8Bytes("gemini-2.5-flash");
  const dkmsKeyHex = ethers.hexlify(ethers.toUtf8Bytes("dummy_api_key"));
  const dkmsTokenHex = ethers.hexlify(ethers.toUtf8Bytes("dummy_hf_token"));
  
  const dkmsReq = {
    modelId: ethers.keccak256(modelBytes),
    dkmsKey: dkmsKeyHex,
    keys: [ethers.keccak256(dkmsTokenHex)]
  };
  
  const schedConfig = {
    model: ethers.hexlify(modelBytes),
    windowNumCalls: 5n,
    provider: '0x02'
  };
  
  console.log('Simulating...');
  try {
    const tx = await harness.configureAndStartSovereignSchedule.staticCall(
      dkmsReq,
      schedConfig,
      100000000n,
      {
        from: SENDER,
        value: 100000000n
      }
    );
    console.log('Simulation succeeded!', tx);
  } catch (error) {
    console.log('Simulation reverted. Error message:', error.message);
    if (error.data) {
      console.log('Raw revert data:', error.data);
    }
  }
}

main().catch(console.error);
