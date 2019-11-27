const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

const { node0 } = require('../env');

const provider = new ethers.providers.JsonRpcProvider(node0.rpcUrl);

fs.readFile(path.join(__dirname, '/wallets.txt'), 'utf8', async(error, data) => {
  let minimumBalance = ethers.utils.parseEther('1');
  const privateKeyArray = data.split('\n');
  for(const index in privateKeyArray) {
    const privateKey = privateKeyArray[index];

    try {
      const tempWallet = new ethers.Wallet(privateKey);
      const balance = await provider.getBalance(tempWallet.address);
      if(balance.lt(minimumBalance)) minimumBalance = balance;
    } catch (error) { }

    // console.log(index+1, privateKeyArray.length);
    updateScreen(+index+1, privateKeyArray.length);
  }

  console.log(`\nMinimum Balance: ${ethers.utils.formatEther(minimumBalance)}`);
});

function updateScreen(progress, total) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(Math.floor((+progress)/total*100)+'%');
  // console.log(progress, total);
}
