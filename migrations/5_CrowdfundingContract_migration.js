var CrowdfundingContract = artifacts.require("./CrowdfundingContract.sol");
var CrowdfundingContractForTests = artifacts.require("./CrowdfundingContractForTests.sol");

module.exports = function(deployer) {
  deployer.deploy(CrowdfundingContract);
  deployer.deploy(CrowdfundingContractForTests);
};
