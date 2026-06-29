import handler from '../api/nfts.js';

const mockReq = {
  method: 'GET',
  query: {
    address: '0x010dd13b588a806c1f0289317e18368516c8df35'
  }
};

const mockRes = {
  status(code) {
    console.log(`Status Code: ${code}`);
    return this;
  },
  json(data) {
    console.log('Response JSON:');
    console.log(JSON.stringify(data, null, 2));
    return this;
  },
  setHeader(name, value) {
    // No-op
  },
  end() {
    return this;
  }
};

async function main() {
  console.log('Running mock handler...');
  await handler(mockReq, mockRes);
}

main();
