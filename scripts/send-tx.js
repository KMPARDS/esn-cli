const ethers = require('ethers');
const { node0, node1 } = require('../env');

const NUMBER_OF_TX_SEND = 1;

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

const wallet1 = new ethers.Wallet('24C4FE6063E62710EAD956611B71825B778B041B18ED53118CE5DA5F02E494BA')
                .connect(provider);
const wallet2 = new ethers.Wallet('34C4FE6063E62710EAD956611B71825B778B041B18ED53118CE5DA5F02E494BA')
                .connect(provider);

const wallet = wallet1;

(async() => {
  const currentNetwork = await provider.getNetwork();
  console.log(`Current Network: ${JSON.stringify(currentNetwork)}`);

  const currentBalance = await provider.getBalance(wallet.address);
  console.log(`Current Balance of ${wallet.address}: ${ethers.utils.formatEther(currentBalance)}`);

  let tx;
  let walletNonce = await provider1.getTransactionCount(wallet.address);
  console.log(`${wallet.address} nonce is ${walletNonce}`);
  for(let i = 0; i < NUMBER_OF_TX_SEND; i++) {
    tx = wallet.sendTransaction({
      nonce: walletNonce++,
      gasLimit: 30000,
      gasPrice: ethers.utils.bigNumberify('20000000000'),
      to: wallet === wallet1 ? wallet2.address : wallet1.address,
      value: ethers.utils.parseEther('0.001')
    });
  }

  console.log('\n'+(await tx).hash+'\n');

  // try {
  //   const receipt = await (await tx).wait();
  //   console.log('tx is confirmed in block', receipt.blockNumber);
  // } catch(e) {}
  //
  // const newBalance = await provider.getBalance(wallet.address);
  // console.log(`New Balance of ${wallet.address}: ${ethers.utils.formatEther(newBalance)}`);
})();
