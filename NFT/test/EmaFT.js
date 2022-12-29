const { expect } = require('chai');

describe('ContactNFT', function () {
  it('Deployment and mints', async function () {
    const [owner] = await ethers.getSigners();

    console.log('owner:', owner.address);

    const EmaFT = await ethers.getContractFactory('EmaFT');
    const emaFT = await EmaFT.deploy();
    await emaFT.deployed();
    console.log('deployed EmaFT');

    const TestNFT = await ethers.getContractFactory('TestNFT');
    const testNFT = await TestNFT.deploy();
    await testNFT.deployed();
    console.log('deployed TestNFT');

    const testMintTx = await testNFT.safeMint(owner.address);
    await testMintTx.wait();
    console.log(
      'mint TestNFT.',
      `balance: ${await testNFT.balanceOf(owner.address)}`
    );

    const approveTx = await testNFT.approve(emaFT.address, 0);
    await approveTx.wait();
    console.log('approved transfer');

    const emaMintTx = await emaFT.mint('こんにちは\n世界', testNFT.address, 0);
    await emaMintTx.wait();
    console.log('minted EmaFT');
    console.log(await emaFT.tokenURI(0));
  }).timeout(100000);
});
