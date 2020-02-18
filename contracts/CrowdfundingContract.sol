pragma solidity >=0.5.0 <0.7.0;

contract CrowdfundingContract {
	string public state = "START";
	struct Sender {
		address payable addr;
		uint date;
		uint val;
	}
	event Message(string msg);
	event Message2(uint msg);
	Sender[] public senders;
	mapping(address => Sender) public senderMap;
	address payable public company;
	uint public endDate;
	string public title;
	uint public goal;
	uint public sum;
	function handle(string memory input) public payable {
		if (isEqual(state, "START") && isEqual(input, "init")) {
			state = "CREATED";
			//Entry Activity of new State
			company = 0x0ad875cadf6CD921c5DB2cDD3dddC24A8b61B2d3;
			endDate = 1610406000000;
			title = "IrgendeinProjekt";
			goal = 10 ether;
		}
		else if (isEqual(state, "CREATED") && isEqual(input, "pay*") && now <= endDate && msg.value < goal) {
			Sender memory s = Sender(msg.sender, now, msg.value);
			addSender(s);
			state = "FUNDING";
			//Entry Activity of new State
			sum = sum + msg.value;
		}
		else if (isEqual(state, "FUNDING") && isEqual(input, "pay*") && now <= endDate && sum + msg.value < goal) {
			Sender memory s = Sender(msg.sender, now, msg.value);
			addSender(s);
			state = "FUNDING";
			//Entry Activity of new State
			sum = sum + msg.value;
		}
		else if (isEqual(state, "CREATED") && isEqual(input, "pay*") && now <= endDate && msg.value >= goal) {
			Sender memory s = Sender(msg.sender, now, msg.value);
			addSender(s);
			state = "SUCCESSFUL";
			//Entry Activity of new State
			transfer(sum + msg.value, company);
			sum = sum + msg.value;
		}
		else if (isEqual(state, "CREATED") && isEqual(input, "pay*") && now > endDate) {
			Sender memory s = Sender(msg.sender, now, msg.value);
			addSender(s);
			state = "FAILED";
			//Entry Activity of new State
			returnPayments();
		}
		else if (isEqual(state, "FUNDING") && isEqual(input, "pay*") && sum + msg.value >= goal && now <= endDate) {
			Sender memory s = Sender(msg.sender, now, msg.value);
			addSender(s);
			state = "SUCCESSFUL";
			//Entry Activity of new State
			transfer(sum + msg.value, company);
			sum = sum + msg.value;
		}
		else if (isEqual(state, "FUNDING") && isEqual(input, "pay*") && now > endDate) {
			Sender memory s = Sender(msg.sender, now, msg.value);
			addSender(s);
			state = "FAILED";
			//Entry Activity of new State
			returnPayments();
		}
		else if (isEqual(state, "FAILED") && isEqual(input, "exit")) {
			state = "END";
		}
		else if (isEqual(state, "SUCCESSFUL") && isEqual(input, "exit")) {
			state = "END";
		}
	}

	function isEqual(string memory a, string memory b) public pure returns (bool) {
		return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
	}

	function transfer(uint amount, address payable receiver) private {
		if (address(this).balance >= amount)
			receiver.transfer(amount);
		else
			emit Message("balance of contract no enough");
	}
	function returnPayments() private {
		for (uint i = 0; i < senders.length; i++)
			transfer(senderMap[senders[i].addr].val, senders[i].addr);
	}
	function addSender(Sender memory s) private {
		if (senderMap[s.addr].addr == address(0)) {
			senders.push(s);
			senderMap[s.addr] = s;
		} else {
			senderMap[s.addr].val += s.val;
		}
	}
}
