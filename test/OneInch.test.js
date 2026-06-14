const OneInch = artifacts.require('OneInch');

contract('OneInch', function ([_, owner, recipient, anotherAccount]) {
    const uint256Max = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

    beforeEach(async function () {
        this.token = await OneInch.new(owner);
    });

    it('has 18 decimals', async function () {
        assert.equal(await this.token.decimals(), '18');
    });

    it('has name', async function () {
        assert.equal(await this.token.name(), '1INCH Token');
    });

    it('has symbol', async function () {
        assert.equal(await this.token.symbol(), '1INCH');
    });

    it('should have 1.5B tokens after construction', async function () {
        assert.equal(await this.token.totalSupply(), web3.utils.toWei('1500000000'));
        assert.equal(await this.token.balanceOf(owner), web3.utils.toWei('1500000000'));
    });

    describe('infinite allowance', function () {
        const amount = web3.utils.toWei('100');

        beforeEach(async function () {
            await this.token.approve(anotherAccount, uint256Max, { from: owner });
        });

        it('should NOT decrease allowance on transferFrom if it is set to uint256 max', async function () {
            await this.token.transferFrom(owner, recipient, amount, { from: anotherAccount });
            const allowance = await this.token.allowance(owner, anotherAccount);
            assert.equal(allowance.toString(), uint256Max);
        });

        it('should NOT decrease allowance on burnFrom if it is set to uint256 max', async function () {
            await this.token.burnFrom(owner, amount, { from: anotherAccount });
            const allowance = await this.token.allowance(owner, anotherAccount);
            assert.equal(allowance.toString(), uint256Max);
        });

        it('should decrease allowance on transferFrom if it is not set to uint256 max', async function () {
            const initialAllowance = web3.utils.toBN(amount).add(web3.utils.toBN(1));
            await this.token.approve(anotherAccount, initialAllowance, { from: owner });
            await this.token.transferFrom(owner, recipient, amount, { from: anotherAccount });
            assert.equal(await this.token.allowance(owner, anotherAccount), '1');
        });

        it('should decrease allowance on burnFrom if it is not set to uint256 max', async function () {
            await this.token.approve(anotherAccount, amount, { from: owner });
            await this.token.burnFrom(owner, amount, { from: anotherAccount });
            assert.equal(await this.token.allowance(owner, anotherAccount), '0');
        });
    });
});
