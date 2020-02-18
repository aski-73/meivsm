var ContractRegistryContract = artifacts.require("./ContractRegistryContract");

module.exports = function(deployer) {
    deployer.deploy(ContractRegistryContract)
}