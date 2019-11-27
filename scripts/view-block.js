const ethers = require('ethers');
const { node0, node1 } = require('../env');

const provider0 = new ethers.providers.JsonRpcProvider(node0.rpcUrl);
const provider1 = new ethers.providers.JsonRpcProvider(node1.rpcUrl);

let provider;
switch(process.argv[2]) {
  case 'node0':
    provider = provider0;
    break;
  case 'node1':
    provider = provider1;
    break;
  default:
    throw new Error("please pass node0 or node1 in arguments");
}

if(!process.argv[3]) {
  throw new Error("please pass blocknumber in second argv");
}

(async() => {
  // for(let i = 0; i <= await provider.getBlockNumber(); i++) {
    const block = await provider.send('eth_getBlockByNumber', [
      ethers.utils.bigNumberify(process.argv[3])._hex,
      !!process.argv[4]
    ]);
    console.log('block', block);
  // }
})();
