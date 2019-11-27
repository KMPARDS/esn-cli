const ethers = require('ethers');
const { node0, node1 } = require('../env');

const NUMBER_OF_TX_SEND = 100;

const provider0 = new ethers.providers.JsonRpcProvider(node0.rpcUrl);
const provider1 = new ethers.providers.JsonRpcProvider(node1.rpcUrl);

const wallet = new ethers.Wallet('24C4FE6063E62710EAD956611B71825B778B041B18ED53118CE5DA5F02E494BA')
                // .connect(provider);

(async() => {
  const currentBalance = await provider0.getBalance(wallet.address);
  console.log(`Current Balance of ${wallet.address}: ${ethers.utils.formatEther(currentBalance)}`);

  let tx;
  let walletNonce = await provider1.getTransactionCount(wallet.address);
  console.log(`${wallet.address} nonce is ${walletNonce}\n`);
  for(let i = 0; i < NUMBER_OF_TX_SEND; i++) {
    const signedTransaction = await wallet.sign({
      nonce: walletNonce,
      gasLimit: 30000,
      gasPrice: ethers.utils.bigNumberify('20000000000').add(walletNonce),
      to: wallet === wallet1 ? wallet2.address : wallet1.address,
      value: ethers.utils.parseEther('0.001')
    });

    tx = await (walletNonce%2?provider0:provider1).sendTransaction(signedTransaction);
    console.log(walletNonce, tx.hash, walletNonce%2?'node0':'node1');

    await new Promise(function(resolve, reject) {
      setTimeout(resolve, 10);
    });

    walletNonce++;
  }

  // try {
  //   const receipt = await (await tx).wait();
  //   console.log('tx is confirmed in block', receipt.blockNumber);
  // } catch(e) {}
  //
  // const newBalance = await provider0.getBalance(wallet.address);
  // console.log(`New Balance of ${wallet.address}: ${ethers.utils.formatEther(newBalance)}`);

  console.log();
})();
