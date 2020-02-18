// const GeneratedContract = artifacts.require("GeneratedContract");

// contract("GeneratedContract", accounts => {

//     let testSubject;

//     beforeEach(async () => {
//         // Für jeden Test ein neuen Smart Contract deployen
//         testSubject = await GeneratedContract.new(); // START State
//     });

//     it("should be in state START at first", async () => {
//         // GIVEN 

//         // WHEN
//         let contract = await GeneratedContract.deployed();

//         // THEN
//         assert.equal("START", await contract.state())
//     });

//     it("should receive 5 ether in order to set State to ONGOING", async () => {
//         // GIVEN
//         await testSubject.handle("something"); // CREATED STATE

//         let tenant = accounts[1];

//         let ownerBalance = await web3.eth.getBalance(await testSubject.owner());
//         let tenantBalance = await web3.eth.getBalance(tenant);
//         tenantBalance = web3.utils.fromWei(tenantBalance, 'ether');
//         console.log("Mieter Balance: ", tenantBalance, "ether");

//         let contractBalance = await web3.eth.getBalance(testSubject.address);
//         contractBalance = web3.utils.fromWei(contractBalance);
//         console.log("Smart Contract Balance: ", contractBalance, "ether");

//         // WHEN
//         let msg = {
//             from: tenant,
//             value: web3.utils.toWei("5", "ether")
//         };
//         await testSubject.handle("pay", msg);

//         // THEN
//         let newTenantBalance = await web3.eth.getBalance(tenant);
//         newTenantBalance = web3.utils.fromWei(newTenantBalance, 'ether');
//         console.log("Mieter Balance: ", newTenantBalance, "ether");
//         assert.equal("ONGOING", (await testSubject.state()));
//         // Mieter hat Betrag gezahlt, folglich muss er weniger Geld haben
//         // Der neue Betrag ist nicht genau der alte Betrag subtrahiert mit der Miete,
//         // denn es kommen noch die GAS-Kosten hinzu
//         assert.isTrue(parseInt(tenantBalance, 10) > parseInt(newTenantBalance));
//         let newContractBalance = await web3.eth.getBalance(testSubject.address);
//         newContractBalance = web3.utils.fromWei(newContractBalance);
//         console.log("Smart Contract Balance", newContractBalance, "ether");
//         assert.isTrue(parseInt(newContractBalance, 10) == parseInt(contractBalance + 5));
//     });

//     it("should set time of expire correctly when state is set to ongoing", async () => {
//         // GIVEN

//         // WHEN
//         let result = await testSubject.handle("pay", {from: accounts[1], value: web3.utils.toWei("5", "ether")});
//         console.log("ASDFASFSADF", result);
//         // THEN
//         // Block in dem die Transaktion gemined wurde
//         let block = await web3.eth.getBlock(result.blockNumber);
//         console.log(block.timestamp);
//         // Ablaufdatum des Mietvertrags
//         let expireAt = await testSubject.expireAt(); // BigNumber (BN)

//         console.log(expireAt.toNumber());

//         assert.equal(block.timestamp, expireAt.toNumber());
//     });


//     it("should send 5 ether to owner when exiting state ONGOING", async () => {
//         // GIVEN (Zustand simulieren)
//         await testSubject.handle("something"); // CREATED STATE

//         let ownerBalance = web3.utils.fromWei(await web3.eth.getBalance(await testSubject.owner()));
//         console.log("Vermieter Balance am Anfang: ", ownerBalance);

//         // Mieter sendet Geld an Contract
//         let msg = {
//             from: accounts[1],
//             value: web3.utils.toWei("5", "ether")
//         };
//         await testSubject.handle("pay", msg); // ONGOING STATE

//         let contractBalance = web3.utils.fromWei(await web3.eth.getBalance(testSubject.address));
//         console.log("Smart Contract Balance Nach Bezahlung: ", contractBalance, "ether");

//         // WHEN
//         // Da der Smart Contract so generiert wurde, dass er direkt nach Zahlung abläuft, sollte
//         // der Aufruf von mit Input "check" den Smart Contract auf CREATED wieder setzen
//         await testSubject.handle("check");

//         // THEN
//         let newContractBalance = web3.utils.fromWei(await web3.eth.getBalance(testSubject.address));
//         console.log("Smart Contract Balance Nach Exit Activity: ", newContractBalance, "ether");
//         let newOwnerBalance = web3.utils.fromWei(await web3.eth.getBalance(await testSubject.owner()));
//         console.log("Vermieter Balance am Nach Exit Activity: ", newOwnerBalance);

//         assert.equal("CREATED", await testSubject.state())
//         // Smart Contract hat das zwischen gelagerte Geld an den Vermieter ausgezahlt
//         assert.equal(0, parseInt(newContractBalance, 10));
//         // Vermieter hat jetzt 5 Ether mehr
//         assert.equal(parseInt(ownerBalance, 10) + 5, parseInt(newOwnerBalance, 10));
//     });
// });