const OneInch = artifacts.require('OneInch');

contract('OneInch gas measurement and correctness', ([owner, alice, bob]) => {
    let token;
    const infiniteAllowance = web3.utils.toBN('2').pow(web3.utils.toBN('256')).sub(web3.utils.toBN('1'));

    beforeEach(async () => {
        token = await OneInch.new(owner);
    });

    it('measure gas and verify correctness for transferFrom with infinite allowance', async () => {
        await token.approve(alice, infiniteAllowance, { from: owner });
        const tx = await token.transferFrom(owner, bob, 100, { from: alice });
        console.log('Gas used for transferFrom (infinite):', tx.receipt.gasUsed);

        const remainingAllowance = await token.allowance(owner, alice);
        assert.equal(remainingAllowance.toString(), infiniteAllowance.toString(), "Allowance should remain infinite");
        assert.equal((await token.balanceOf(bob)).toString(), "100");
    });

    it('measure gas and verify correctness for transferFrom with finite allowance', async () => {
        await token.approve(alice, 1000, { from: owner });
        const tx = await token.transferFrom(owner, bob, 100, { from: alice });
        console.log('Gas used for transferFrom (finite):', tx.receipt.gasUsed);

        const remainingAllowance = await token.allowance(owner, alice);
        assert.equal(remainingAllowance.toString(), "900", "Allowance should decrease");
        assert.equal((await token.balanceOf(bob)).toString(), "100");
    });

    it('measure gas and verify correctness for burnFrom with infinite allowance', async () => {
        await token.approve(alice, infiniteAllowance, { from: owner });
        const tx = await token.burnFrom(owner, 100, { from: alice });
        console.log('Gas used for burnFrom (infinite):', tx.receipt.gasUsed);

        const remainingAllowance = await token.allowance(owner, alice);
        assert.equal(remainingAllowance.toString(), infiniteAllowance.toString(), "Allowance should remain infinite");
    });

    it('measure gas and verify correctness for burnFrom with finite allowance', async () => {
        await token.approve(alice, 1000, { from: owner });
        const tx = await token.burnFrom(owner, 100, { from: alice });
        console.log('Gas used for burnFrom (finite):', tx.receipt.gasUsed);

        const remainingAllowance = await token.allowance(owner, alice);
        assert.equal(remainingAllowance.toString(), "900", "Allowance should decrease");
    });

    it('should revert transferFrom if allowance is insufficient', async () => {
        await token.approve(alice, 50, { from: owner });
        try {
            await token.transferFrom(owner, bob, 100, { from: alice });
            assert.fail("Should have reverted");
        } catch (error) {
            assert.include(error.message, "transfer amount exceeds allowance");
        }
    });

    it('should revert burnFrom if allowance is insufficient', async () => {
        await token.approve(alice, 50, { from: owner });
        try {
            await token.burnFrom(owner, 100, { from: alice });
            assert.fail("Should have reverted");
        } catch (error) {
            assert.include(error.message, "burn amount exceeds allowance");
        }
    });
});
