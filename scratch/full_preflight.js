const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const SENDER = '0xe1e8BD93279529831b789133BD76e7c30D54d200';
const FACTORY = '0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304';
const RITUAL_WALLET = '0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948';
const TEE_REGISTRY = '0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F';
const SALT = '0xfe1abb3488b49c6e9faa39f925a65e55e8973d1b0a4cd712c76079d38c5d2f05';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  console.log('======= RITUAL SOVEREIGN AGENT PREFLIGHT =======\n');
  
  // 1. Factory bytecode check
  const factoryCode = await provider.getCode(FACTORY);
  console.log('[1] Factory bytecode exists:', factoryCode !== '0x' ? '✅ YES' : '❌ NO');
  
  // 2. Check current block
  const block = await provider.getBlockNumber();
  console.log('[2] Current block:', block);
  
  // 3. SENDER native balance
  const senderBal = await provider.getBalance(SENDER);
  console.log('[3] SENDER native balance:', ethers.formatEther(senderBal), 'RITUAL',
    parseFloat(ethers.formatEther(senderBal)) >= 5.01 ? '✅' : '❌ NEED 5+ RITUAL');
  
  // 4. SENDER RitualWallet
  const rwAbi = ['function balanceOf(address) view returns(uint256)', 'function lockUntil(address) view returns(uint256)'];
  const rw = new ethers.Contract(RITUAL_WALLET, rwAbi, provider);
  const rwBal = await rw.balanceOf(SENDER);
  const rwLock = await rw.lockUntil(SENDER);
  console.log('[4] SENDER RitualWallet balance:', ethers.formatEther(rwBal), 'RITUAL');
  console.log('    LockUntil block:', rwLock.toString(), rwLock > block ? '✅ LOCKED' : '❌ NOT LOCKED');
  
  // 5. Predict harness
  const factAbi = ['function predictCompressedHarness(address,bytes32) view returns(address,bytes32,bytes32)'];
  const factory = new ethers.Contract(FACTORY, factAbi, provider);
  const [harness, , ] = await factory.predictCompressedHarness(SENDER, SALT);
  console.log('[5] Predicted harness address:', harness);
  
  // 6. Is harness already deployed?
  const harnessCode = await provider.getCode(harness);
  console.log('[6] Harness already deployed:', harnessCode !== '0x' ? '❌ YES (already exists, must use new salt)' : '✅ Clean address (not deployed yet)');
  
  // 7. TEE executor check
  const regAbi = [{
    name: 'getServicesByCapability', type: 'function', stateMutability: 'view',
    inputs: [{name: 'capability', type: 'uint8'}, {name: 'checkValidity', type: 'bool'}],
    outputs: [{name: '', type: 'tuple[]', components: [
      {name: 'node', type: 'tuple', components: [
        {name: 'paymentAddress', type: 'address'}, {name: 'teeAddress', type: 'address'},
        {name: 'teeType', type: 'uint8'}, {name: 'publicKey', type: 'bytes'},
        {name: 'endpoint', type: 'string'}, {name: 'certPubKeyHash', type: 'bytes32'},
        {name: 'capability', type: 'uint8'}
      ]},
      {name: 'isValid', type: 'bool'}, {name: 'workloadId', type: 'bytes32'}
    ]}]
  }];
  const reg = new ethers.Contract(TEE_REGISTRY, regAbi, provider);
  const executors = await reg.getServicesByCapability(0, true);
  console.log('[7] Valid TEE executors:', executors.length > 0 ? `✅ ${executors.length} available` : '❌ NONE');
  if (executors.length > 0) {
    console.log('    First executor:', executors[0].node.teeAddress);
    console.log('    Endpoint:', executors[0].node.endpoint);
    console.log('    PublicKey length:', executors[0].node.publicKey.length);
  }
  
  // 8. Gas / fee
  const feeData = await provider.getFeeData();
  console.log('[8] Gas price (gwei):', ethers.formatUnits(feeData.gasPrice || 0n, 'gwei'));
  
  // 9. msg.value check
  const schedulerFunding = ethers.parseEther('5');
  const dkmsFunding = 0n;
  const totalValue = dkmsFunding + schedulerFunding;
  console.log('[9] msg.value required:', ethers.formatEther(totalValue), 'RITUAL (dkmsFunding=0 + schedulerFunding=5)');
  console.log('    SENDER balance sufficient:', parseFloat(ethers.formatEther(senderBal)) >= parseFloat(ethers.formatEther(totalValue)) + 0.01 ? '✅' : '❌');
  
  // 10. Lifespan check
  const freq = 2000, wc = 5;
  console.log('[10] Lifespan (freq×wc):', freq * wc, freq * wc <= 10000 ? '✅ <= 10,000' : '❌ EXCEEDS MAX_LIFESPAN');
  
  // 11. schedulerTtl check
  const ttl = 500;
  console.log('[11] schedulerTtl:', ttl, ttl <= 500 ? '✅ <= MAX_TTL(500)' : '❌');
  
  console.log('\n======= PREFLIGHT COMPLETE =======');
  console.log('If all checks pass, you should be able to deploy.');
  console.log('The "Review alert" in MetaMask is EXPECTED — click it and proceed anyway.');
}

main().catch(console.error);
