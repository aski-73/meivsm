let TripInsuranceContract = artifacts.require("TripInsuranceContract");

contract("TripInsuranceContract", async (accounts) => {
    // Testfall 1
    it("should be in State Exit (Damage), when input is: init, pay, pay, report, exit", async () => {
        // GIVEN
        let contract = await TripInsuranceContract.deployed();

        // WHEN
        let msg1 = {
            from: accounts[0],
            value: web3.utils.toWei("5", "ether")
        }

        let msg2 = {
            from: accounts[1],
            value: web3.utils.toWei("1", "ether")
        }

        let msg3 = {
            from: accounts[2]
        }

        await contract.handle("init");
        await contract.handle("pay", msg1);
        await contract.handle("pay", msg2);
        await contract.handle("report", msg3);

        assert.equal(await contract.state(), "DAMAGE");

        await contract.handle("exit");

        // THEN
        assert.equal(await contract.state(), "END");
    });
});

contract("TripInsuranceContract", async (accounts) => {
    // Testfall 2
    it("should be in State Exit (NOPROBLEMS), when input is: int, pay, pay, check, exit", async () => {
        // GIVEN
        let contract = await TripInsuranceContract.deployed();

        // WHEN
        let msg1 = {
            from: accounts[0],
            value: web3.utils.toWei("5", "ether")
        }

        let msg2 = {
            from: accounts[1],
            value: web3.utils.toWei("1", "ether")
        }

        let msg3 = {
            from: accounts[2]
        }

        await contract.handle("init");
        await contract.handle("pay", msg1);
        await contract.handle("pay", msg2);

        // Enddatum auf vergangene Zeit setzen. Durch 1000 teilen, da
        // Solidity Timestamp in sec. JS Timestamp aber in msec
        await contract.setEndDate(new Date(2019, 1, 1).getTime() / 1000);

        await contract.handle("check", msg3);

        assert.equal(await contract.state(), "NOPROBLEMS");

        await contract.handle("exit");

        // THEN
        assert.equal(await contract.state(), "END");
    });
});

let contract = artifacts.require("Contract");

contract("SomeContract", async () => {
    // Testfall X
    it("should do xyz", async () => {
        // GIVEN
        // WHEN
        // THEN
    });
});

contract("SomeContract", async () => {
    // Testfall X + 1
    it("should do xyz", async () => {
        // GIVEN
        // WHEN
        // THEN
    });
});