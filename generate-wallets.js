const ethers = require('ethers');
const fs = require('fs');

for(let i = 0; i < +process.argv[2]; i++) {
  const wallet = ethers.Wallet.createRandom();
  fs.appendFileSync('wallets.txt', wallet.privateKey+'\n', function (err) {
    if (err) throw err;
  });
  updateScreen(i, +process.argv[2]);
}
console.log('\nCompleted\n');

function updateScreen(progress, total) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(Math.floor((progress+1)*100/total)+'%');
}
