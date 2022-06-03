require("@nomiclabs/hardhat-waffle");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: [`a2739fbf35e0dcc5df878bcc02bc4ead29627d8598bce345a22646f0989dcf34`],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`${ACCOUNT_PRIVATE_KEY}`],
    }
  }
};
