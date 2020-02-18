pragma solidity >=0.5.0 <0.7.0;

contract PurchaseContract {
	string public state = "START";
	address payable public owner;
	uint public productId;
	address payable public buyer;
	function() external {}

	function handle(string memory input) public payable {
		if (isEqual(state, "START") && isEqual(input, "init")) {
			state = "OFFERING";
			//Entry Activity of new State
			owner = 0x7F181DeF2E46196a239aC423a2b77e2E6A4d54a6;
			productId = 1234;
		}
		else if (isEqual(state, "OFFERING") && isEqual(input, "pay") && msg.value == 1 ether) {
			state = "CHECKING";
			//Entry Activity of new State
			buyer = msg.sender;
		}
		else if (isEqual(state, "CHECKING") && isEqual(input, "decline") && msg.sender == owner) {
			state = "DECLINED";
			//Entry Activity of new State
			transfer(1 ether, buyer);
		}
		else if (isEqual(state, "DECLINED") && isEqual(input, "reinsert") && msg.sender == owner) {
			state = "OFFERING";
			//Entry Activity of new State
			owner = 0x7F181DeF2E46196a239aC423a2b77e2E6A4d54a6;
			productId = 1234;
		}
		else if (isEqual(state, "CHECKING") && isEqual(input, "accept") && msg.sender == owner) {
			state = "SOLD";
			//Entry Activity of new State
			owner = buyer;
		}
		else if (isEqual(state, "SOLD") && isEqual(input, "exit")) {
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
