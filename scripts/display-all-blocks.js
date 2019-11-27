const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('http://13.127.185.136:80');

(async() => {
  // for(let i = 0; i <= await provider.getBlockNumber(); i++) {
    const block = await provider.send('eth_getBlockByNumber', [
      // ethers.utils.bigNumberify(i)._hex
      '0x8'
      , false]);
    console.log('block', block);
  // }
})();
