const hre = require('hardhat');
require('dotenv').config({ path: '.env' });
require('@nomiclabs/hardhat-etherscan');

async function main() {
  // Verify the contract after deploying
  await hre.run('verify:verify', {
    address: '0x01cE64703C0E8dF4dE5717f6fBAD71713AC575fB',
    constructorArguments: [],
  });
}
// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
