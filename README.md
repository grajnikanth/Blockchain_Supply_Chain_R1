# Supply chain & data auditing

This repository containts an Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer. The user story is similar to any commonly used supply chain process. A Seller can add items to the inventory system stored in the blockchain. A Buyer can purchase such items from the inventory system. Additionally a Seller can mark an item as Shipped, and similarly a Buyer can mark an item as Received.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Please make sure you've already installed ganache-cli, Truffle and enabled MetaMask extension in your browser.

```
Give examples (to be clarified)
```

### Installing

A step by step series of examples that tell you have to get a development env running

Clone this repository:



Change directory to ```project-files``` folder and install all requisite npm packages (as listed in ```package.json```):

```
cd project-files
npm install
```

Launch Ganache:



In a separate terminal window, Compile smart contracts:

```
truffle compile
```


This will create the smart contract artifacts in folder ```build\contracts```.

Migrate smart contracts to the locally running blockchain, ganache-cli:

```
truffle migrate
```

Test smart contracts:

```
truffle test
```

All 10 tests should pass.


In a separate terminal window, launch the DApp:

```
npm run dev
```

## Rinkeby Testnet Contract Deployment
SupplyChain.sol

Transaction Hash: 0xa8071e596deb7146cc4658bff055c1a62d1838a78ff3c1202cdc85165efb65d3                                           
contract address: 0x287a46D0d8772E66DB56794b20EeAaF59793574a

## Libraries 
No libraries used

## IPFS 
Not Used

## Software used and Version Numbers
Truffle v5.0.18 (core: 5.0.18)
Solidity v0.5.0 (solc-js)
Node v10.6.0
Web3.js v1.0.0-beta.37

## Built With

* [Ethereum](https://www.ethereum.org/) - Ethereum is a decentralized platform that runs smart contracts
* [IPFS](https://ipfs.io/) - IPFS is the Distributed Web | A peer-to-peer hypermedia protocol
to make the web faster, safer, and more open.
* [Truffle Framework](http://truffleframework.com/) - Truffle is the most popular development framework for Ethereum with a mission to make your life a whole lot easier.

## Acknowledgments

* Solidity
* Ganache-cli
* Truffle
* IPFS
