pragma solidity >=0.5.0 <0.7.0;

contract ContractRegistryContract {
    struct Registration {
        address contractAddress;
        uint256 registrationDate;
        string category;
    }

    struct Index {
        uint256 i;
        bool occupied;
    }

    Registration[] public registry;
    mapping(address => Index) public registryCheck;

    function register(address contractAddress, uint256 timestamp, string memory category)
        public
        payable
    {
        // to avoid trash being registrated ..
        if (msg.value < 1 ether) revert("fee not enough");

        // stop if element already in array
        if (registryCheck[contractAddress].occupied)
            revert("contract already registrated");

        registry.push(Registration(contractAddress, timestamp, category));
        registryCheck[contractAddress].occupied = true;
        registryCheck[contractAddress].i = registry.length - 1;
    }

    function remove(address contractAddress) public payable {
        // to avoid trash being registrated ..
        if (msg.value < 5 ether) revert("fee not enough");

        // Nothing to remove
        if (registry.length == 0) return;

        // element to remove not in array
        if (!registryCheck[contractAddress].occupied) return;

        // mark element as not in array anymore
        registryCheck[contractAddress].occupied = false;

        // avoiding gaps in array by moving last element of array to index
		// (array is deleted by overriding it)
        if (registry.length > 1) {
            // Index of element to remove
            uint256 index = registryCheck[contractAddress].i;
            // Move last element in array to index
            registry[index] = registry[registry.length - 1];
            // Set new index of moved element
            registryCheck[registry[index].contractAddress].i = index;
        }
        // deleting last element (not needed anymore)
        registry.pop();
    }

    function collectFees() public {
        address payable receiver = 0xE98A2cA17F4A56b07e458Ed85e00eBbFdE6f415C;
        receiver.transfer(address(this).balance);
    }

    function getAllContracts() public view returns (address[] memory) {
        address[] memory addresses = new address[](registry.length);
        for (uint256 i = 0; i < registry.length; i++)
            addresses[i] = registry[i].contractAddress;

        return addresses;
    }
}

