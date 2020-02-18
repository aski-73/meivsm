const RentalContract = artifacts.require("RentalContractForTests");


contract("RentalContract", async (accounts) => {
    
    // Testfall 1
    it("should be in state CREATED, when input is: init, pay 5 ether, check 'now >= endDate'", async () => {
        // GIVEN 
        let contract = await RentalContract.deployed();

        // WHEN
        let msg = {
            from: accounts[1],
            value: web3.utils.toWei("5", "ether")
        };

        await contract.handle("init");

        await contract.handle("pay", msg);

        // Enddatum auf vergangenge Zeit setzen. Durch 1000 teilen, da
        // Solidity Timestamp in sec. JS Timestamp aber in msec
        await contract.setEndDate(new Date(2019, 1, 1).getTime() / 1000);

        await contract.handle("check");

        // THEN
        assert.equal(await contract.state(), "CREATED");
    });

    // it("should receive 5 ether in order to set State to ONGOING", async () => {
    //     // GIVEN
    //     let contract = await RentalContract.deployed(); // START State
    //     await contract.handle("something"); // CREATED STATE

    //     let tenant = accounts[2];

    //     let ownerBalance = await web3.eth.getBalance(await contract.owner());
    //     let tenantBalance = await web3.eth.getBalance(tenant);
    //     tenantBalance = web3.utils.fromWei(tenantBalance, 'ether');
    //     console.log("Mieter Balance: ", tenantBalance, "ether");

    //     let contractBalance = await web3.eth.getBalance(contract.address);
    //     contractBalance = web3.utils.fromWei(contractBalance);
    //     console.log("Smart Contract Balance: ", contractBalance, "ether");

    //     // WHEN
    //     let msg = {
    //         from: tenant,
    //         value: web3.utils.toWei("5", "ether")
    //     };
    //     await contract.handle("pay", msg);

    //     // THEN
    //     let newTenantBalance = await web3.eth.getBalance(tenant);
    //     newTenantBalance = web3.utils.fromWei(newTenantBalance, 'ether');
    //     console.log("Mieter Balance: ", newTenantBalance, "ether");
    //     assert.equal("ONGOING", (await contract.state()));
    //     assert.isTrue(parseInt(tenantBalance, 10) > parseInt(newTenantBalance));
    //     contractBalance = await web3.eth.getBalance(contract.address);
    //     contractBalance = web3.utils.fromWei(contractBalance);
    //     console.log("Smart Contract Balance", contractBalance, "ether");
    //     assert.isTrue(contractBalance == 5);
    // });


    // it("should send 5 ether on exit activity at state ONGOING", async () => {
    // GIVEN (Zustand simulieren)
    // let contract = await RentalContract.deployed(); // START State

    // let msg = {
    //     from: await contract.tenant, 
    //     to: await contract.owner(),
    //     value: web3.utils.toWei(5, 'ether')
    // };
    // contract.handle("pay", msg);
    // Anzah Sek. eines Tages
    // const dayAsSecond = 86400;
    // //SmartContract gibt Timestamp in Sekunden an, Date jedoch in Millisekunden
    // let now = new Date();
    // // Gestern
    // now.setTime(now - dayAsSecond * 1000);
    // contract.setExpireAt((now / 1000));

    // // Mieter sendet Geld an Contract

    // // WHEN
    // contract.handle("check");

    // // THEN
    // assert
    // });
});

contract("RentalContract", async (accounts) => {

    it("should be in State End, when input is: init, exit", async () => {
        // GIVEN
        let contract = await RentalContract.deployed();

        // WHEN
        await contract.handle("init");

        await contract.handle("exit");

        // THEN
        assert.equal(await contract.state(), "END");
    });
});