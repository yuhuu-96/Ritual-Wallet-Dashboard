const { ethers } = require('ethers');
const RPC_URL = 'https://rpc.ritualfoundation.org';
const provider = new ethers.JsonRpcProvider(RPC_URL);

async function main() {
  const addr = '0x17F53f75f97FbcDA74e78f02F66eEB9CFa37b6a9';
  try {
    await provider.call({ to: addr, data: '0x8b375b43', from: '0xb234A5975A6C4d9B95116744047a064F98E1584c' }); // random address
    console.log('Success');
  } catch(e) {
    console.log('Error data:', e.data);
    console.log('Error info:', e.info);
    console.log('Full error:', JSON.stringify(e, null, 2));
  }
}
main();
