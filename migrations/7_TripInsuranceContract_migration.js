var TripInsuranceContract = artifacts.require("./TripInsuranceContract.sol");

module.exports = function(deployer) {
    deployer.deploy(TripInsuranceContract);   
}