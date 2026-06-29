const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.ritualfoundation.org';
const FACTORY = '0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304';

const ABI = [
  'function owner() external view returns (address)',
  'function create3Factory() external view returns (address)',
  'function scheduler() external view returns (address)',
  'function ritualWallet() external view returns (address)',
  'function teeRegistry() external view returns (address)',
  'function asyncDelivery() external view returns (address)'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const factory = new ethers.Contract(FACTORY, ABI, provider);
  
  console.log('Querying SovereignAgentFactory state...');
  try {
    const owner = await factory.owner();
    console.log('Owner:', owner);
    const create3Factory = await factory.create3Factory();
    console.log('CREATE3 Factory:', create3Factory);
    const scheduler = await factory.scheduler();
    console.log('Scheduler:', scheduler);
    const ritualWallet = await factory.ritualWallet();
    console.log('RitualWallet:', ritualWallet);
    const teeRegistry = await factory.teeRegistry();
    console.log('TeeRegistry:', teeRegistry);
    const asyncDelivery = await factory.asyncDelivery();
    console.log('AsyncDelivery:', asyncDelivery);
  } catch (error) {
    console.error('Failed to query factory state:', error);
  }
}

main().catch(console.error);
