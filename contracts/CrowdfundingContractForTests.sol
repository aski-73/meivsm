pragma solidity >=0.5.0 <0.7.0;

contract CrowdfundingContractForTests {
    string public state = "START";
    struct Sender {
        address payable addr;
        uint256 date;
        uint256 val;
    }
    event Message(string msg);
    Sender[] public senders;
    mapping(address => Sender) public senderMap;
    address payable public company;
    uint256 public endDate;
    string public title;
    uint256 public goal;
    uint256 public sum;
    function handle(string memory input) public payable {
        if (isEqual(state, "START") && isEqual(input, "init")) {
            state = "CREATED";
            //Entry Activity of new State
            company = 0xD52910c88309A7014078E3795c15753A858aee2A;
            endDate = 1610406000;
            title = "IrgendeinProjekt";
            goal = 10 ether;
            sum = 0;
        } else if (
            isEqual(state, "CREATED") &&
            isEqual(input, "pay*") &&
            now <= endDate &&
            msg.value < goal
        ) {
            Sender memory s = Sender(msg.sender, now, msg.value);
            addSender(s);
            state = "FUNDING";
            //Entry Activity of new State
            sum = sum + msg.value;
        } else if (
            isEqual(state, "FUNDING") &&
            isEqual(input, "pay*") &&
            now <= endDate &&
            sum + msg.value < goal
        ) {
            Sender memory s = Sender(msg.sender, now, msg.value);
            addSender(s);
            state = "FUNDING";
            //Entry Activity of new State
            sum = sum + msg.value;
        } else if (
            isEqual(state, "CREATED") &&
            isEqual(input, "pay*") &&
            now <= endDate &&
            msg.value >= goal
        ) {
            Sender memory s = Sender(msg.sender, now, msg.value);
            addSender(s);
            state = "SUCCESSFUL";
            //Entry Activity of new State
            transfer(sum + msg.value, company);
            sum = sum + msg.value;
        } else if (
            isEqual(state, "CREATED") && isEqual(input, "pay*") && now > endDate
        ) {
            Sender memory s = Sender(msg.sender, now, msg.value);
            addSender(s);
            state = "FAILED";
            //Entry Activity of new State
            returnPayments();
        } else if (
            isEqual(state, "FUNDING") &&
            isEqual(input, "pay*") &&
            sum + msg.value >= goal &&
            now <= endDate
        ) {
            Sender memory s = Sender(msg.sender, now, msg.value);
            addSender(s);
            state = "SUCCESSFUL";
            //Entry Activity of new State
            transfer(sum + msg.value, company);
            sum = sum + msg.value;
        } else if (
            isEqual(state, "FUNDING") && isEqual(input, "pay*") && now > endDate
        ) {
            Sender memory s = Sender(msg.sender, now, msg.value);
            addSender(s);
            state = "FAILED";
            //Entry Activity of new State
            returnPayments();
        } else if (isEqual(state, "FAILED") && isEqual(input, "exit")) {
            state = "END";
        } else if (isEqual(state, "SUCCESSFUL") && isEqual(input, "exit")) {
            state = "END";
        }
    }

    function isEqual(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function transfer(uint256 amount, address payable receiver) private {
        // workaround with local var because of invalid opcode by using address(this).balance
        address self = address(this);
        uint256 balance = self.balance;
        if (balance >= amount) receiver.transfer(amount);
    }
    function returnPayments() private {
        for (uint256 i = 0; i < senders.length; i++)
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
    function setEndDate(uint256 _endDate) public {
        endDate = _endDate;
    }

    function getSendersLength() public view returns (uint256) {
        return senders.length;
    }
}
