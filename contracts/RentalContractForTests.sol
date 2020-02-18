pragma solidity >=0.5.0 <0.7.0;

contract RentalContractForTests {
	string public state = "START";
	address payable public owner;
	string public ownerName;
	uint public objectId;
	address payable public tenant;
	string public tenantName;
	uint public endDate;
	function() external {}

	function handle(string memory input) public payable {
		if (isEqual(state, "START") && isEqual(input, "init")) {
			state = "CREATED";
			//Entry Activity of new State
			owner = 0x7F181DeF2E46196a239aC423a2b77e2E6A4d54a6;
			ownerName = "andi";
			objectId = 1234;
		}
		else if (isEqual(state, "CREATED") && isEqual(input, "pay") && msg.value == 5 ether) {
			state = "ONGOING";
			//Entry Activity of new State
			tenant = 0x1023aE3D76272dA1916E680f55Bc53D56340B86c;
			tenantName = "andi2";
			endDate = now + 30 days;
		}
		else if (isEqual(state, "ONGOING") && isEqual(input, "check") && now >= endDate) {
			state = "CREATED";
			//Exit Activity of old State
			transfer(5 ether, owner);
			//Entry Activity of new State
			owner = 0x7F181DeF2E46196a239aC423a2b77e2E6A4d54a6;
			ownerName = "andi";
			objectId = 1234;
		}
		else if (isEqual(state, "CREATED") && isEqual(input, "exit") && msg.sender == owner) {
			state = "END";
		}
	}

	function isEqual(string memory a, string memory b) public pure returns (bool) {
		return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
	}

	function transfer(uint amount, address payable receiver) private {
		if (address(this).balance >= amount)
			receiver.transfer(amount);
	}

	// FOR TESTS ONLY
	function setEndDate(uint _endDate) public {
		endDate = _endDate;
	}
}
