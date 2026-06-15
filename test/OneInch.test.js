const OneInch = artifacts.require('OneInch');

contract('OneInch gas benchmark', function ([owner, spender, recipient]) {
    const amount = '100';
    const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

    beforeEach(async function () {
        this.token = await OneInch.new(owner);
    });

    describe('transferFrom', function () {
        it('gas usage with infinite allowance', async function () {
            await this.token.approve(spender, MAX_UINT256, { from: owner });
            const receipt = await this.token.transferFrom(owner, recipient, amount, { from: spender });
            console.log('transferFrom (infinite allowance) gas used:', receipt.receipt.gasUsed);
        });

        it('gas usage with finite allowance', async function () {
            await this.token.approve(spender, amount, { from: owner });
            const receipt = await this.token.transferFrom(owner, recipient, amount, { from: spender });
            console.log('transferFrom (finite allowance) gas used:', receipt.receipt.gasUsed);
        });
    });

    describe('burnFrom', function () {
        it('gas usage with infinite allowance', async function () {
            await this.token.approve(spender, MAX_UINT256, { from: owner });
            const receipt = await this.token.burnFrom(owner, amount, { from: spender });
            console.log('burnFrom (infinite allowance) gas used:', receipt.receipt.gasUsed);
        });

        it('gas usage with finite allowance', async function () {
            await this.token.approve(spender, amount, { from: owner });
            const receipt = await this.token.burnFrom(owner, amount, { from: spender });
            console.log('burnFrom (finite allowance) gas used:', receipt.receipt.gasUsed);
        });
    });
});
