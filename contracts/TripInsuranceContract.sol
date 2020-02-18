pragma solidity >=0.5.0 <0.7.0;

contract TripInsuranceContract {
	string public state = "START";
	address payable public company;
	string public companyName;
	address payable public secureSrc;
	address payable public insured;
	string public insuredName;
	uint public startDate;
	uint public endDate;
	function() external {}

	function handle(string memory input) public payable {
		if (isEqual(state, "START") && isEqual(input, "init")) {
			state = "CREATED";
			//Entry Activity of new State
			company = 0x7F181DeF2E46196a239aC423a2b77e2E6A4d54a6;
			companyName = "xyz";
			secureSrc = 0x2C0716A9D184b42353272a3AbCD7084DE2f3967B;
		}
		else if (isEqual(state, "CREATED") && isEqual(input, "pay") && msg.value == 5 ether && msg.sender == company) {
			state = "STAGEONE";
		}
		else if (isEqual(state, "STAGEONE") && isEqual(input, "pay") && msg.value == 1 ether) {
			state = "STAGETWO";
			//Entry Activity of new State
			insured = 0x1023aE3D76272dA1916E680f55Bc53D56340B86c;
			insuredName = "andi";
			startDate = now;
			endDate = now + 180 days;
		}
		else if (isEqual(state, "STAGETWO") && isEqual(input, "report") && msg.sender == secureSrc && now >= startDate && now <= endDate) {
			state = "DAMAGE";
			//Entry Activity of new State
			transfer(5 ether, insured);
			transfer(1 ether, company);
		}
		else if (isEqual(state, "STAGETWO") && isEqual(input, "check") && now >= endDate) {
			state = "NOPROBLEMS";
			//Entry Activity of new State
			transfer(6 ether, company);
		}
		else if (isEqual(state, "DAMAGE") && isEqual(input, "exit")) {
			state = "END";
		}
		else if (isEqual(state, "NOPROBLEMS") && isEqual(input, "exit")) {
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
}
