const OneInch = artifacts.require('OneInch');

contract('OneInch Functional', function (accounts) {
    const [owner, spender, recipient] = accounts;
    const amount = web3.utils.toWei('10');
    const overAmount = web3.utils.toWei('11');

    beforeEach(async function () {
        this.token = await OneInch.new(owner);
    });

    it('should revert transferFrom if allowance is insufficient', async function () {
        await this.token.approve(spender, amount, { from: owner });
        try {
            await this.token.transferFrom(owner, recipient, overAmount, { from: spender });
            assert.fail('The transaction should have reverted');
        } catch (error) {
            assert.include(error.message, 'ERC20: transfer amount exceeds allowance', 'Expected revert reason not found');
        }
    });

    it('should revert burnFrom if allowance is insufficient', async function () {
        await this.token.approve(spender, amount, { from: owner });
        try {
            await this.token.burnFrom(owner, overAmount, { from: spender });
            assert.fail('The transaction should have reverted');
        } catch (error) {
            assert.include(error.message, 'ERC20: burn amount exceeds allowance', 'Expected revert reason not found');
        }
    });

    it('should allow transferFrom with infinite allowance', async function () {
        const infinite = web3.utils.toBN('2').pow(web3.utils.toBN('256')).sub(web3.utils.toBN('1'));
        await this.token.approve(spender, infinite, { from: owner });
        await this.token.transferFrom(owner, recipient, amount, { from: spender });
        const allowance = await this.token.allowance(owner, spender);
        assert.equal(allowance.toString(), infinite.toString(), 'Allowance should remain infinite');
    });
});
