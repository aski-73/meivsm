pragma solidity >=0.5.0 <0.7.0;
contract CrowdFundingContract {
        struct Sender {
                address payable addr;
                uint date;
                uint val;
        }

        string public state = "START";
        address payable public company;
        uint public endDate;
        string title;
        // in Ether
        uint public goal = 10 ether;
        // in Wei. 1 wei == 1e-18 Ether <=> 10 Ether = 10e18 wei
        uint public sum;

        /**Folgendes Attribut für normale pay Transaktion */
        Sender public sender;


        /**
         * Folgende Attribute für Transaktionen bei
         * der alle Sender gespeichert werden solen (pay*)
        */

        // Automatisch initialisiert
        Sender[] public senders;

        // Extra Map mit allen Sendern, um O(1) Zugriff bei bekannter Adresse zu ermöglichen
        mapping(address => Sender) public senderMap;

        function() external {}

        function handle(string memory input) public payable {
		if (isEqual(state, "START") && isEqual(input, "init")) {
			state = "CREATED";
			//Entry Activity of new State
			company = 0x7F181DeF2E46196a239aC423a2b77e2E6A4d54a6;
			endDate = now + 10 days;
			title = "IrgendeinProjekt";
		}
		else if (isEqual(state, "CREATED") && isEqual(input, "pay*") && now <= endDate) {
			Sender memory s = Sender(msg.sender, now, msg.value);
			addSender(s);
			state = "FUNDING";
			//Entry Activity of new State
			sum = sum + msg.value;
		}
		else if (isEqual(state, "FUNDING") && isEqual(input, "pay*") && now <= endDate && sum < 10 ether) {
			Sender memory s = Sender(msg.sender, now, msg.value);
			addSender(s);
			state = "FUNDING";
			//Entry Activity of new State
			sum = sum + msg.value;
		}
		else if (isEqual(state, "FUNDING") && isEqual(input, "check") && sum < 10 ether && now >= endDate) {
			state = "FAILED";
			//Entry Activity of new State
			returnPayments();
		}
		else if (isEqual(state, "FAILED") && isEqual(input, "exit")) {
			state = "END";
		}
		else if (isEqual(state, "FUNDING") && isEqual(input, "pay*") && sum >= 10 ether && now <= endDate) {
			Sender memory s = Sender(msg.sender, now, msg.value);
			senderMap[msg.sender] = s;
			addSender(s);
			state = "SUCCESSFUL";
			//Entry Activity of new State
			transfer(sum, company);
		}
		else if (isEqual(state, "SUCCESSFUL") && isEqual(input, "exit")) {
			state = "END";
		}
        }

        function isEqual(string memory a, string memory b) public pure returns (bool) {
                return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
        }

        function transfer(uint amount, address payable receiver) public {
                if (address(this).balance >= amount)
                        receiver.transfer(amount);
        }

	function returnPayments() private {
		// Bei Mehrfach Zahlungen eines EOA, wird der aktuellste Betrag nur in der Map
		// vermerkt
		for (uint i = 0; i < senders.length; i++)
			transfer(senderMap[senders[i].addr].val, senders[i].addr);
	}
	function addSender(Sender memory s) private {
		if (senderMap[s.addr].addr == address(0)) {
			senderMap[msg.sender] = s;
			senders.push(s);
		} else { // Mehrfachzahlung eines EOAs in der Map aktualisieren
			senderMap[msg.sender].val += msg.value;
		}
	}
}

