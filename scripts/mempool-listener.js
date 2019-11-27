const ethers = require('ethers');
const env = require('../env');

const nodeDetails = env[process.argv[2]];
const provider = new ethers.providers.JsonRpcProvider(nodeDetails.rpcUrl);

const MemPoolEnum = {
  PENDING: 0,
  CONFIRMED: 1
};

let mempool = {};

provider.on('pending', async tx => {
  // adding tx to mempool list
  mempool[tx.hash] = MemPoolEnum.PENDING;
  updateScreen();

  // marking tx as confirmed
  await tx.wait();
  mempool[tx.hash] = MemPoolEnum.CONFIRMED;

  updateScreen();
});

function updateScreen() {
  const mempoolArray = Object.entries(mempool).filter(entry => entry[1] === MemPoolEnum.PENDING).map(entry => entry[0]);
  console.log('\n'.repeat(process.stdout.columns));
  console.log(mempoolArray);
  // process.stdout.clearLine();
  // process.stdout.cursorTo(0);
  // process.stdout.write(mempoolArray.join(' '.repeat(process.stdout.columns > 66 ? process.stdout.columns - 66 : process.stdout.columns - 66%process.stdout.columns)));
}
