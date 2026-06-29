const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const DKMS_PRECOMPILE = '0x000000000000000000000000000000000000081B';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';

const EXECUTOR = '0x612870C7894b9F0Ea010F4D2452Af1b5dcd367Dd'; // DKMS TEE node
const HARNESS = '0x7FE95a3a0AbD043Dc3793447199903d8ad367553';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  // ABI encode the 8 parameters for DKMS precompile
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
    console.log('DKMS Precompile Succeeded! Output:', result);
    
    // Decode output if it is not empty
    if (result !== '0x') {
      // Decode: (address dkmsPaymentAddress, bytes dkmsPublicKey)
      const decoded = ethers.AbiCoder.defaultAbiCoder().decode(['address', 'bytes'], result);
      console.log('Decoded DKMS Output:', decoded);
    }
  } catch (error) {
    console.error('DKMS Precompile Failed:');
    if (error.data) {
      console.error('Raw error data:', error.data);
    } else {
      console.error(error);
    }
  }
}

main().catch(console.error);
