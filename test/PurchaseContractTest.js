var PurchaseContract = artifacts.require("PurchaseContract");

contract("PurchaseContract", async (accounts) => {
    // Testfall 1
    it("should be in State END, when input is: init, pay, accept, exit", async () => {
        // GIVEN
        let contract = await PurchaseContract.deployed();

        // WHEN
        let msg1 = {
            from: accounts[1], // Der Käufer
            value: web3.utils.toWei("1", "ether")
        }

        // Der Verkäufer
        let msg2 = { from: accounts[0] }

        await contract.handle("init");

        await contract.handle("pay", msg1);

        await contract.handle("accept", msg2);

        await contract.handle("exit");

        // THEN
        assert.equal(await contract.state(), "END");

        // Neuer Besitzer ist der Käufer
        assert.equal(await contract.owner(), accounts[1]);
    });
});

contract("PurchaseContract", async (accounts) => {
    // Testfall 2
    it ("should be in State OFFERING, when input is: init, pay, decline, reinsert", async () => {
        
        // GIVEN
        let contract = await PurchaseContract.deployed();

        // WHEN
        let msg1 = {
            from: accounts[1], // Der Käufer
            value: web3.utils.toWei("1", "ether")
        }

        // Der Verkäufer
        let msg2 = { from: accounts[0] }

        await contract.handle("init");

        await contract.handle("pay", msg1);

        await contract.handle("decline", msg2);

        await contract.handle("reinsert", msg2);

        // THEN
        assert.equal(await contract.state(), "OFFERING");

        // Verkäufer ist immer noch der Besitzer
        assert.equal(await contract.owner(), accounts[0]);
    });
});