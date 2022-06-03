# Smart contract in solidity for utopia project

This project is a smart contract set for utopia

## Install

The first things you need to do are cloning this repository and installing its dependencies:

```sh
git clone https://github.com/keen0004/utopia-contracts.git
cd utopia-contracts
npm install
```

## Compile & Test

Once Installed, you can compile all contracts and test

```sh
npx hardhat compile
npx hardhat test
```

## Deploy 

After compile and test, you need to run ganache network which can download from [ganache](https://trufflesuite.com/ganache/)

Then, go to the repository's root folder and run this to deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network ganache
```


