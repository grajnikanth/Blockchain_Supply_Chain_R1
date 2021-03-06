// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.utils.toWei('1', "ether")

    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // 0th Test
    it("Testing all add role functions that allow owner to add addresses of all the Participants of the network", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Contract deployer(owner) add the Accesscontrol addresses. Add Farmer, Distributor, Retailer and Consumer addresses to the SupplyChain contract
        // save transaction object in variable "result.." to check for event emitted once addresses are added successful
        // Added addresses will be persisted on the Blockchain for rest of the tests to use these added addresses
        let result1 = await supplyChain.addFarmer(originFarmerID, {from: ownerID})
        let result2 = await supplyChain.addDistributor(distributorID, {from: ownerID})
        let result3 = await supplyChain.addRetailer(retailerID, {from: ownerID})
        let result4 = await supplyChain.addConsumer(consumerID, {from: ownerID})

        //Verify the result 
        assert.equal(result1.logs[0].event, "FarmerAdded")
        assert.equal(result2.logs[0].event, "DistributorAdded")
        assert.equal(result3.logs[0].event, "RetailerAdded")
        assert.equal(result4.logs[0].event, "ConsumerAdded")

    })

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
       
      // console.log("SupplyChain Object: " +supplyChain)
      // console.log("supplyChain.address: " +supplyChain.address)
        
        // Mark an item as Harvested by calling function harvestItem()
        // Store the transaction object in variable "result1"
        // Use result1 to check the event was emitted
        let result2 = await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, 
            originFarmLongitude, productNotes, {from:originFarmerID})
        // Display the transaction object "result2" to see contents and event information
        //    console.log(result2) 

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(result2.logs[0].event, "Harvested")
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
    })    

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
       // console.log("supplyChain.address: " +supplyChain.address)
        
        // Have Farmer mark an item as Processed by calling function processtItem()
        // Get the transaction object to check events emitted
        let result1 = await supplyChain.processItem(upc, {from: originFarmerID})
        // console.log(result1)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        
        /*
        console.log("Item SKU " +resultBufferOne[0]);
        console.log("Item UPC " +resultBufferOne[1]);
        console.log("OwnerID " + resultBufferOne[2]);
        console.log("OriginFarmerID " +resultBufferOne[3]);
        console.log("OriginFarmName " +resultBufferOne[4]);
        console.log("originFarmInformation " +resultBufferOne[5]);
        console.log("originFarmLatitude " +resultBufferOne[6]);
        console.log("originFarmLongitude " +resultBufferOne[7]);
        */

        // Verify the result set
        assert.equal(result1.logs[0].event, "Processed")
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')   
    })    

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Mark an item as Packed by calling function packItem()
        let result1 = await supplyChain.packItem(upc, {from: originFarmerID})

        // Retrieve the new state of data stored in variable "items" from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(result1.logs[0].event, "Packed") //Verify that the event Packed was emitted
        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State') //verify that the enum State = 2 == to state Packed 
       
    })    

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        let coffeePrice = web3.utils.toWei("1", "ether"); 
        


        // Mark an item as ForSale by calling function sellItem()
        let result1 = await supplyChain.sellItem(upc, coffeePrice, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(result1.logs[0].event, "ForSale") //Verify that the event ForSale was emitted
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State')
        assert.equal(Number(resultBufferTwo[4]), coffeePrice, 'Error: Invalid Coffee Price')   
    })    

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        let buyPriceOffered = web3.utils.toWei("1.5", "ether"); 
        let distributorBalanceBefore = await web3.eth.getBalance(distributorID)
        let farmerBalanceBefore = await web3.eth.getBalance(originFarmerID)
       
        
        // Mark an item as Sold by calling function buyItem()
        let result1 = await supplyChain.buyItem(upc, {from: distributorID, value: buyPriceOffered})
        let distributorBalanceAfter = await web3.eth.getBalance(distributorID)


        let distributorPricePaid = Number(distributorBalanceBefore) - Number(distributorBalanceAfter)

        let farmerBalanceAfter = await web3.eth.getBalance(originFarmerID)
        let farmerPriceReceived = Number(farmerBalanceAfter) - Number(farmerBalanceBefore)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(result1.logs[0].event, "Sold") //Verify that the event Sold was emitted
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(Math.trunc(distributorPricePaid/1e18), Math.trunc(productPrice/1e18), 'Error: Distributor payment failed')
        assert.equal(farmerPriceReceived, productPrice, 'Error: Farmer failed to receive payment')
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid productNotes')
    

    })    

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        

        // Mark an item as Shipped by calling function shipItem()
        let result1 = await supplyChain.shipItem(upc, {from: distributorID}) 

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(result1.logs[0].event, "Shipped") //Verify that the event Sold was emitted
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State')     
    })    

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()
        

        // Mark an item as Received by calling function receiveItem()
        let result1 = await supplyChain.receiveItem(upc, {from: retailerID}) 

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State')
        assert.equal(result1.logs[0].event, "Received") //Verify that the event Received was emitted
    })    

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        let buyPriceOffered = web3.utils.toWei("1.5", "ether");
        
        // Mark an item as purchased by calling function purchaseItem()
        let result1 = await supplyChain.purchaseItem(upc, {from: consumerID, value: buyPriceOffered})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State')
        assert.equal(result1.logs[0].event, "Purchased") //Verify that the event Purchased was emitted 
    })    

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 7, 'Error: Missing or Invalid itemState')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consurmerID')
    })

});
