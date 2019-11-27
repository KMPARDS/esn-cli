const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

const { node0, node1 } = require('../env');

const provider0 = new ethers.providers.JsonRpcProvider(node0.rpcUrl);
const provider1 = new ethers.providers.JsonRpcProvider(node1.rpcUrl);

const wallet = new ethers.Wallet('24C4FE6063E62710EAD956611B71825B778B041B18ED53118CE5DA5F02E494BA')
                // .connect(provider);

fs.readFile(path.join(__dirname, '/wallets.txt'), 'utf8', async(error, data) => {
  const currentBalance = await provider0.getBalance(wallet.address);
  console.log(`Current Balance of ${wallet.address}: ${ethers.utils.formatEther(currentBalance)}`);


  let count = 0;
  let errorC = 0;

  const promiseArray = [];

  for(const privateKey of data.split('\n')) {
    // let walletNonce = await provider1.getTransactionCount(wallet.address);

    promiseArray.push((async() => {
      try {
        const tempWallet = new ethers.Wallet(privateKey);

        const utx = {
          nonce: await provider1.getTransactionCount(tempWallet.address),
          gasLimit: 30000,
          gasPrice: ethers.utils.bigNumberify('20000000000'),
          to: tempWallet.address,
          value: ethers.utils.parseEther('0.0001')
        };

        // promiseArray.push(
          (count%2?provider0:provider1).sendTransaction(tempWallet.sign(utx)).catch(() => {
            console.log('error for', tempWallet.address);
            errorC++;
          })
        // );
        console.log(utx, count%2?'node0':'node1');

        // await new Promise(function(resolve, reject) {
        //   setTimeout(resolve, 1);
        // });
      } catch(error) { }
      // console.log('sending to', tempWallet.address);
    })())



    count++;

  }

  console.log(`Prepared ${count} transactions!`);
  await Promise.all(promiseArray);
  console.log('All Sent!');
  console.log('Error in', errorC);

  const newBalance = await provider0.getBalance(wallet.address);
  console.log(`New Balance of ${wallet.address}: ${ethers.utils.formatEther(newBalance)}`);
});
