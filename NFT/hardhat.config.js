require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

console.log(process.env.SECRET);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    mumbai: {
      url: `https://rpc.ankr.com/polygon_mumbai`,
      accounts: [process.env.SECRET],
    },
    polygon: {
      url: 'https://polygon-rpc.com	',
      accounts: [process.env.SECRET],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_KEY,
      polygon: process.env.POLYGONSCAN_KEY,
    },
  },
};
