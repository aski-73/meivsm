var RentalContract = artifacts.require("./RentalContract.sol");
var RentalContractForTests = artifacts.require("./RentalContractForTests.sol");

module.exports = function(deployer) {
  deployer.deploy(RentalContract);
  deployer.deploy(RentalContractForTests);
};
