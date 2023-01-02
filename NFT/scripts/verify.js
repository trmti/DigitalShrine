const hre = require('hardhat');
require('dotenv').config({ path: '.env' });
require('@nomiclabs/hardhat-etherscan');

async function main() {
  // Verify the contract after deploying
  await hre.run('verify:verify', {
    address: '0x0bf7eEbbE0359dbFbC9fdDB553F254A98A089d98',
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
