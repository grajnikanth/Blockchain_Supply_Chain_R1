# Supply Chain & Product Authenticity Tracking using Blockchain

In this project I created a Decentralized Application (DApp) for a tracking a product life cylce from Seller to Buyer (supply chain) using the Ethereum Blockchain. Tracking a product's supply chain on a Blockchain provides shared ledger that’s updated and validated instantaneously by each network participant. The results are greater collaboration, streamlined inventory management, improved asset utilization and more. 

I created smart contracts that manage specific actor's permission controls to modify data on the Blockchain. Smart contracts were implemented to track and verify a product’s authenticity. Truffle Framework was used for this project. A web based frontend was also created that allows actors in the suply chain to interact with the DApp. This frontend is used to manage product lifecycle as the product navigates down the supply chain from Seller to Buyer.

There are four actors involved in this supply chain 
* Farmer: The Farmer can harvest coffee beans, process coffee beans, pack coffee palettes, add coffee palettes, ship coffee palettes, and track authenticity.
* Distributor: The Distributor can buy coffee palettes and track authenticity.
* Retailer: The Retailer can receive coffee palettes and track authenticity.
* Consumer: The consumer can buy coffee palettes and track authenticity.

A Farmer(seller) can add items to the inventory system stored in the blockchain. A Buyer can purchase such items from the inventory system. Additionally a Seller can mark an item as Shipped, and similarly a Buyer can mark an item as Received.

## Smart Contracts 
* Base Contract - SupplyChain.sol contract holds all common structs, events and base variables.
* Core Contract - Ownable.sol is the contract that controls ownership and transfer of ownership.

## Testing and Deployment
The smart contract functions were tested using Mocha testing framework and web3. The smart contracts were then deployed on the Ethereum RINKEBY test network. The contract address and transaction hash for the deployed SupplyChain.sol contract are as follows:

Transaction Hash: 0xa8071e596deb7146cc4658bff055c1a62d1838a78ff3c1202cdc85165efb65d3                                           
contract address: 0x287a46D0d8772E66DB56794b20EeAaF59793574a

## Frontend
Front-end is configured to:

1. Submit a product for shipment (farmer to the distributor, distributor to retailer, etc).
2. Receive product from shipment.
3. Validate the authenticity of the product.

## Installing and Running the Project
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
