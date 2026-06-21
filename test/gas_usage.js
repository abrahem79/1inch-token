const OneInch = artifacts.require('OneInch');
const { BN } = web3.utils;

contract('OneInch Gas Usage', function ([_, owner, recipient, spender]) {
    const amount = new BN('100');
    const infiniteAllowance = new BN('2').pow(new BN('256')).sub(new BN('1'));

    beforeEach(async function () {
        this.token = await OneInch.new(owner);
    });

    describe('transferFrom', function () {
        it('measure gas for finite allowance', async function () {
            await this.token.approve(spender, amount, { from: owner });
            const receipt = await this.token.transferFrom(owner, recipient, amount, { from: spender });
            console.log('transferFrom (finite):', receipt.receipt.gasUsed);
        });

        it('measure gas for infinite allowance', async function () {
            await this.token.approve(spender, infiniteAllowance, { from: owner });
            const receipt = await this.token.transferFrom(owner, recipient, amount, { from: spender });
            console.log('transferFrom (infinite):', receipt.receipt.gasUsed);
        });
    });

    describe('burnFrom', function () {
        it('measure gas for finite allowance', async function () {
            await this.token.approve(spender, amount, { from: owner });
            const receipt = await this.token.burnFrom(owner, amount, { from: spender });
            console.log('burnFrom (finite):', receipt.receipt.gasUsed);
        });

        it('measure gas for infinite allowance', async function () {
            await this.token.approve(spender, infiniteAllowance, { from: owner });
            const receipt = await this.token.burnFrom(owner, amount, { from: spender });
            console.log('burnFrom (infinite):', receipt.receipt.gasUsed);
        });
    });
});
