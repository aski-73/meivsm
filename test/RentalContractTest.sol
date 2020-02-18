// pragma solidity >=0.4.25 <0.6.0;

// import "truffle/Assert.sol";
// import "truffle/DeployedAddresses.sol";
// import "../contracts/RentalContract.sol";

// contract RentalContractTest {

//   function before() public {
//   }

//   function testCompareDateDeployedContract() public {
//     RentalContract rentalContract = RentalContract(DeployedAddresses.RentalContract());
//     bool expected = false;

//     Assert.equal(rentalContract.compareDate(), expected, "Should be Equal");
//   }

//   function testCompareDate2DeployedContract() public {
//     RentalContract rentalContract = RentalContract(DeployedAddresses.RentalContract());

//     bool expected = true;

//     Assert.equal(rentalContract.compareDate2(), expected, "Should be Equal");
//   }

//   function testHandleWithNoParamSetStateCreated() public {
//     // GIVEN
//     RentalContract rentalContract = RentalContract(DeployedAddresses.RentalContract());

//     // WHEN
//     rentalContract.handle("");

//     // THEN
//     Assert.equal(rentalContract.state(), "CREATED", "should have state CREATED");
//   }
// }