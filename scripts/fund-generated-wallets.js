const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

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

const wallet = new ethers.Wallet('24C4FE6063E62710EAD956611B71825B778B041B18ED53118CE5DA5F02E494BA')
                .connect(provider);

fs.readFile(path.join(__dirname, '..', '/wallets.txt'), 'utf8', async(error, data) => {
  const currentBalance = await provider.getBalance(wallet.address);
  console.log(`Current Balance of ${wallet.address}: ${ethers.utils.formatEther(currentBalance)}`);

  let walletNonce = await provider1.getTransactionCount(wallet.address);

  let count = 0;

  for(const privateKey of data.split('\n')) {
    let tempWallet;

    try {
      tempWallet = new ethers.Wallet(privateKey);
    } catch(error) { continue; }
    // console.log('sending to', tempWallet.address);

    const utx = {
      nonce: walletNonce,
      gasLimit: 30000,
      gasPrice: ethers.utils.bigNumberify('20000000000'),
      to: tempWallet.address,
      value: ethers.utils.parseEther('0.01')
    };

    console.log(utx);

    await wallet.sendTransaction(utx);
    count++;

    // await new Promise(function(resolve, reject) {
    //   setTimeout(resolve, 30);
    // });

    walletNonce++;
  }

  console.log(`Sent ${count} transactions!`);

  const newBalance = await provider.getBalance(wallet.address);
  console.log(`New Balance of ${wallet.address}: ${ethers.utils.formatEther(newBalance)}`);
});
