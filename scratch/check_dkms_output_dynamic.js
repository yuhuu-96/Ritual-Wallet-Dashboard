const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const DKMS_PRECOMPILE = '0x000000000000000000000000000000000000081B';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

const EXECUTOR = '0x612870C7894b9F0Ea010F4D2452Af1b5dcd367Dd'; // DKMS TEE node
const HARNESS = '0x7FE95a3a0AbD043Dc3793447199903d8ad367553';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  const types = [
    'address',   // executor
    'bytes[]',   // encryptedSecrets
    'uint256',   // ttl
    'bytes[]',   // secretSignatures
    'bytes',     // userPublicKey
    'address',   // owner
    'uint256',   // keyIndex
    'uint8'      // keyFormat
  ];
  
  const values = [
    EXECUTOR,
    [],
    500n,
    [],
    '0x',
    HARNESS,
    0n,
    1
  ];
  
  const encoded = ethers.AbiCoder.defaultAbiCoder().encode(types, values);
  
  console.log('Sending raw eth_call to DKMS precompile...');
  try {
    const result = await provider.call({
      to: DKMS_PRECOMPILE,
      data: encoded,
      from: SENDER
    });
    console.log('Raw output length:', result.length);
    
    // Decode as (bytes, bytes) because it is an async precompile
    const [simmedInput, actualOutput] = ethers.AbiCoder.defaultAbiCoder().decode(['bytes', 'bytes'], result);
    console.log('simmedInput length (bytes):', simmedInput.length / 2 - 1);
    console.log('actualOutput length (bytes):', actualOutput.length / 2 - 1);
    console.log('actualOutput hex:', actualOutput);
    
    if (actualOutput !== '0x') {
      const decodedActual = ethers.AbiCoder.defaultAbiCoder().decode(['address', 'bytes'], actualOutput);
      console.log('Decoded actualOutput:', decodedActual);
    } else {
      console.log('actualOutput is empty, which is expected in simulation (eth_call).');
    }
  } catch (error) {
    console.error('Failed:', error);
  }
}

main().catch(console.error);
