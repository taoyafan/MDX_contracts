'use strict'

const mdxInit = require("../scripts/mdx_init.js");
const BigNumber = require("bignumber.js");

contract("Test Mdx", (accounts) => {
    // Each contract instance
    let factory;
    let wbnb;
    let busd;
    let router;
    let wbnb_busd_lp;

    let addr0 = "0x0000000000000000000000000000000000000000";


    before(async () => {
        [factory, wbnb, busd, router, wbnb_busd_lp] = await mdxInit();
    });

    describe("Check get pair", async () => {

        it("Pair length is 1", async () => {
            let len = await factory.allPairsLength();
            assert.equal(len, 1);
        });

        it("wbnb and busd pair are not 0", async () => {
            let pair_address = wbnb_busd_lp.address;
            console.log(`wbnb-busd-lp address is ${pair_address}`);
            assert.notEqual(pair_address, addr0);
        });

    });

    describe("Check router", async () => {
        
        let testAmount = BigNumber(1e21);   // 1000 WBNB
        let beforeWbnbAmout;
        let beforeBusdAmout;

        before("Add liquidate", async () => {

            // Token approve
            await wbnb.deposit({value: testAmount});       // Get wbnb
            await wbnb.approve(router.address, testAmount);
            await busd.approve(router.address, testAmount);

            // Save before amount
            beforeWbnbAmout = BigNumber(await wbnb.balanceOf(accounts[0]));
            console.log(`Before Wbnb Amout: ${beforeWbnbAmout}`);
            beforeBusdAmout = BigNumber(await busd.balanceOf(accounts[0]));
            console.log(`Before Busd Amout: ${beforeBusdAmout}`);

            // Get current time
            let blockNum = await web3.eth.getBlockNumber();
            console.log(`Current block: ${blockNum}`);
            let time = (await web3.eth.getBlock(blockNum)).timestamp;
            console.log(`Current time: ${time}`);

            await router.addLiquidity(wbnb.address, busd.address,
                 testAmount, testAmount, 0, 0, accounts[0], time);
        })

        it("Token amount decrease sended amount", async () => {
            let afterWbnbAmout = BigNumber(await wbnb.balanceOf(accounts[0]));
            console.log(`After Wbnb Amout: ${afterWbnbAmout}`);
            let afterBusdAmout = BigNumber(await busd.balanceOf(accounts[0]));
            console.log(`After Busd Amout: ${afterBusdAmout}`);

            assert.equal(beforeWbnbAmout.minus(afterWbnbAmout).toString(), testAmount.toString());
            assert.equal(beforeBusdAmout.minus(afterBusdAmout).toString(), testAmount.toString());
        });

        it("Check received lp amount", async () => {
            let lpAmount = await wbnb_busd_lp.balanceOf(accounts[0]);
            console.log(`lpAmount: ${lpAmount}`);

            // Lp amount not equal to 0
            assert.notEqual(lpAmount.toString(), '0');
        })

    });
});
