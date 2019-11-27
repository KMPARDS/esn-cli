const ethers = require('ethers');
const env = require('../env');

const nodeDetails = env[process.argv[2]];

const provider = new ethers.providers.JsonRpcProvider(nodeDetails.rpcUrl);

provider.on('block', async blockNumber => {
    console.log(`\nNew Block on ${process.argv[2]}: ${blockNumber}`);
    const block = await provider.send('eth_getBlockByNumber', [
      ethers.utils.bigNumberify(blockNumber)._hex,
      false
    ]);
    console.log('Number of transactions:', block.transactions.length);
    if(!!process.argv[3]) console.log(block.transactions);
    console.log('waiting for next block on '+process.argv[2]);
});
