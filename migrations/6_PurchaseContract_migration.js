var PurchaseContract = artifacts.require("./PurchaseContract.sol");

module.exports = function(deployer) {
 deployer.deploy(PurchaseContract);   
}