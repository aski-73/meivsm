const CrowdfundingContract = artifacts.require("CrowdfundingContractForTests");

/**
 * contract() Funktion: Ähnlich wie describe() von mocha. Vor jedem contract() Aufruf wird
 * der Smart Contract redeployt => Smart Contract wieder im Anfangszustand
 */
contract("Crowdfunding Testfall 1", async (accounts) => {
    // Testfall 1
    it("should be in state FUNDING, when input is: init, pay*'msg.value < goal',  pay*'msg.value < goal'",
        async () => {
            // GIVEN
            let contract = await CrowdfundingContract.deployed();
            // WHEN
            let msg1 = {
                from: accounts[1],
                value: web3.utils.toWei("4", "ether")
            };
            let msg2 = {
                from: accounts[2],
                value: web3.utils.toWei("5", "ether")
            };

            await contract.handle("init");

            await contract.handle("pay*", msg1);

            await contract.handle("pay*", msg2);

            // THEN
            assert.equal(await contract.state(), "FUNDING");
            assert.isTrue((await contract.senderMap(accounts[1])) != undefined)
            assert.isTrue((await contract.senderMap(accounts[2])) != undefined)
            assert.isTrue((await contract.getSendersLength()).toNumber() == 2)
        });
});

contract("Crowdfunding Testfall 2", async (accounts) => {
    // Testfall 2
    it("should be in state SUCCESSFUL, when input is: init, pay*'now <= endDate & msg.value >= goal', exit",
        async () => {
            // GIVEN
            let contract = await CrowdfundingContract.deployed();

            // WHEN
            let msg1 = {
                from: accounts[1],
                value: web3.utils.toWei("10", "ether")
            };

            await contract.handle("init");

            let companyBalanceThen = await web3.eth.getBalance(await contract.company())

            await contract.handle("pay*", msg1);

            // THEN
            assert.equal(await contract.state(), "SUCCESSFUL");
            assert.isTrue((await contract.senderMap(accounts[1])) != undefined)
            assert.isTrue((await contract.getSendersLength()).toNumber() == 1)
            assert.equal("10", web3.utils.fromWei(await contract.sum(), "ether"))
            // Nach erfolgreicher Campagne erhält der im Contract festgelegte Account das gesammelte
            // Geld
            let companyBalanceNow = await web3.eth.getBalance(await contract.company())
            // console.log(web3.utils.fromWei((companyBalanceNow - companyBalanceThen).toString(), "ether"))
            assert.isTrue(companyBalanceNow > companyBalanceThen)
        });
});


contract("Crowdfunding Testfall 3", async (accounts) => {
    // Testfall 3
    it("should be in state FAILED, when input is: init, pay*'now <= endDate & msg.value < goal', pay*'now > endDate', exit & end (zuvor failed')",
        async () => {
            // GIVEN
            let contract = await CrowdfundingContract.deployed();

            // WHEN
            let msg1 = {
                from: accounts[1],
                value: web3.utils.toWei("4", "ether"),
                gasPrice: 1
            };

            let balanceAccount1Then = await web3.eth.getBalance(accounts[1])

            await contract.handle("init");
            // console.log((await contract.endDate()).toString());
            // Diese Transaktion funktioniert noch
            let tx = await contract.handle("pay*", msg1);

            // Enddatum auf vergangenge Zeit setzen. Durch 1000 teilen, da
            // Solidity Timestamp in sec. JS Timestamp aber in msec
            await contract.setEndDate(new Date(2019, 1, 1).getTime() / 1000);

            let tx2 = await contract.handle("pay*", msg1);

            // THEN
            assert.equal("FAILED", await contract.state());
            // Zahler ist im Contract vermerkt, trotz FAILED Zustand
            assert.isTrue((await contract.senderMap(accounts[1])) != undefined)
            assert.isTrue((await contract.getSendersLength()).toNumber() == 1)
            let balanceAccount1Now = await web3.eth.getBalance(accounts[1])
            // Zahler erhält sein Geld zurück. Jedoch musste er durch die Transaktion Gas zahlen
            let gasCosts = tx.receipt.gasUsed * msg1.gasPrice + tx2.receipt.gasUsed * msg1.gasPrice
            assert.isTrue(balanceAccount1Now == balanceAccount1Then - gasCosts)
        });
})


contract("Crowdfunding Testfall 4", async (accounts) => {
    // Testfall 4
    it("should be in state SUCCESSFUL, when input is: init pay*'msg.value < goal' pay*'now <= endDate & sum + msg.value >= goal'",
        async () => {
            // GIVEN
            let contract = await CrowdfundingContract.deployed();

            // WHEN
            let msg1 = {
                from: accounts[1],
                value: web3.utils.toWei("4", "ether"),
                gasPrice: 1
            };

            let msg2 = {
                from: accounts[1],
                value: web3.utils.toWei("6", "ether"),
                gasPrice: 1
            };

            await contract.handle("init");

            let companyBalanceThen = await web3.eth.getBalance(await contract.company())

            await contract.handle("pay*", msg1);

            // EOA dessen Transaktion zu "SUCCESSFUL" führt muss neben den eigentlichen Kosten,
            // auch die Kosten zum Überweisen der gesammelten Betrags an die company-Adresse zahlen..
            await contract.handle("pay*", msg2);


            // THEN
            assert.equal("SUCCESSFUL", await contract.state());
            assert.isTrue((await contract.senderMap(accounts[1])) != undefined)
            assert.isTrue((await contract.getSendersLength()).toNumber() == 1)
            assert.equal("10", web3.utils.fromWei(await contract.sum(), "ether"))
            // Nach erfolgreicher Campagne erhält der im Contract festgelegte Account das gesammelte
            // Geld
            let companyBalanceNow = await web3.eth.getBalance(await contract.company())
            // console.log(web3.utils.fromWei((companyBalanceNow - companyBalanceThen).toString(), "ether"))
            assert.isTrue(companyBalanceNow > companyBalanceThen)
        });
});


contract("Crowdfunding Testfall 5", async (accounts) => {
    // Testfall 5
    it("should be in state FAILED, when input is: init,  pay*'now > endDate', exit",
        async () => {
            // GIVEN
            let contract = await CrowdfundingContract.deployed();

            // WHEN
            let msg1 = {
                from: accounts[1],
                value: web3.utils.toWei("4", "ether"),
                gasPrice: 1
            };

            await contract.handle("init");

            // Enddatum auf vergangenge Zeit setzen. Durch 1000 teilen, da
            // Solidity Timestamp in sec. JS Timestamp aber in msec
            await contract.setEndDate(new Date(2019, 1, 1).getTime() / 1000);

            let balanceAccount1Then = await web3.eth.getBalance(accounts[1])
            // Auch wenn der Contract in Zustand Failed versetzt wird, wird der Betrag auf den
            // Contract Account gebucht. Jedoch erhält der Zahler das Geld wieder (abzüglich der
            // Transaktionskosten bzw. Gas)
            let tx = await contract.handle("pay*", msg1);

            // THEN
            assert.equal("FAILED", await contract.state());
            // Zahler ist im Contract vermerkt, trotz FAILED Zustand
            assert.isTrue((await contract.senderMap(accounts[1])) != undefined)
            assert.isTrue((await contract.getSendersLength()).toNumber() == 1)
            let balanceAccount1Now = await web3.eth.getBalance(accounts[1])
            // Zahler erhält sein Geld zurück. Jedoch musste er durch die Transaktion Gas zahlen
            assert.isTrue(balanceAccount1Now == balanceAccount1Then - tx.receipt.gasUsed * msg1.gasPrice)
        });
});
