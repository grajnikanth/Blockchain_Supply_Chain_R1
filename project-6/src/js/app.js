App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
       // App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access 
                // RG: This sends a request to the metamask account to accept the incoming request from DAPP
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }

        // RG: Get the addresses/accounts of Metamask available for the user of the DAPP.
        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            // RG: The addresses/accounts exposed by metamask are returned as an array and we store that array in variable "res" 
            console.log('getMetaskID:',res);
            // RG: Store the first address in the App.metamaskAccountID variable
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        // RG: Get the location(url) path of the JSON file
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        // RG: Load the file located at "jsonSupplyChain" path and if successful run the function
        //RG: variable "data" will contain the JSON contents of the SupplyChain.json
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            // RG: Create a Truffle contract object - https://www.npmjs.com/package/truffle-contract
            // RG: This returns a function TruffleContract()
            // RG: Store the following in the App.contracts object as shown below
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            console.log("Truffle Contract Object: " +App.contracts.SupplyChain);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();
            // RG: Added below function to update Input boxes on the webpage based on current contract state
            App.initInputBoxes();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },

    harvestItem: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        // RG: Added the readForm() function here so that the data from website is read and stored 
        // into the App database before the harvestitem() function of the smart contract is called
        // so the farmer can edit the data on the webpage prior to cliking.
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.harvestItem(
                App.upc, 
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    packItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.buyItem(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.purchaseItem(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);
        // RG: Clear out previously displayed Data on the website
        $("#data-item1").empty();

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          //$("#data-item").text(result);
          // RG: Display the Array returned by the Contract on the webpage
          $("#data-item1").append('<li>' + "SKU = " +result[0] + '</li>');
          $("#data-item1").append('<li>' + "UPC = " +result[1] + '</li>');
          $("#data-item1").append('<li>' + "Current Owner Address = " +result[2] + '</li>');
          $("#data-item1").append('<li>' + "Original Farmer Address = " +result[3] + '</li>');
          $("#data-item1").append('<li>' + "Farm Name = " +result[4] + '</li>');
          $("#data-item1").append('<li>' + "Farm Information = " +result[5] + '</li>');
          $("#data-item1").append('<li>' + "Farm Latitude = " +result[6] + '</li>');
          $("#data-item1").append('<li>' + "Farm Longitude = " +result[7] + '</li>');
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
    // RG: Clear out previously displayed Data on the website
        $("#data-item2").empty();     

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
            // RG: Display the Array returned by the Contract on the webpage
            $("#data-item2").append('<li>' + "SKU = " +result[0] + '</li>');
            $("#data-item2").append('<li>' + "UPC = " +result[1] + '</li>');
            $("#data-item2").append('<li>' + "Product ID = " +result[2] + '</li>');
            $("#data-item2").append('<li>' + "Product Notes = " +result[3] + '</li>');
            $("#data-item2").append('<li>' + "Product Price = " +result[4] + '</li>');
            $("#data-item2").append('<li>' + "Item State = " +result[5] + '</li>');
            $("#data-item2").append('<li>' + "Distributor ID = " +result[6] + '</li>');
            $("#data-item2").append('<li>' + "Retailer ID = " +result[7] + '</li>');
            $("#data-item2").append('<li>' + "Consumer ID = " +result[8] + '</li>');
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    },

    //RG: Added this function to display the initial values of the State of the contract stored on blockchain on the Webpage
    initInputBoxes: function () {

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fetchItemBufferOne(App.upc);
          }).then(function(result) {
              $("#sku").val(result[0]);
              $("#upc").val(result[1]);
              $("#originFarmerID").val(result[3]);
            console.log('fetchItemBufferOne', result);
          }).catch(function(err) {
            console.log(err.message);
          });

          App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.ownerLookUp();
          }).then(function(result) {
              $("#ownerID").val(result);
            console.log('Current Owner', result);
          }).catch(function(err) {
            console.log(err.message);
          });

          App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fetchItemBufferTwo.call(App.upc);
          }).then(function(result) {
              $("#distributorID").val(result[6]);
              $("#retailerID").val(result[7]);
              $("#consumerID").val(result[8]);
            console.log('fetchItemBufferTwo', result);
          }).catch(function(err) {
            console.log(err.message);
          });

    }    
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
