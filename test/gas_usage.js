const OneInch = artifacts.require('OneInch');

contract('OneInch gas usage', function ([_, owner, recipient, spender]) {
    beforeEach(async function () {
        this.token = await OneInch.new(owner);
    });

    it('transfer gas usage', async function () {
        const receipt = await this.token.transfer(recipient, 100, { from: owner });
        console.log('Transfer gas usage:', receipt.receipt.gasUsed);
    });

    it('approve gas usage', async function () {
        const receipt = await this.token.approve(spender, 100, { from: owner });
        console.log('Approve gas usage:', receipt.receipt.gasUsed);
    });

    it('transferFrom gas usage', async function () {
        await this.token.approve(spender, 100, { from: owner });
        const receipt = await this.token.transferFrom(owner, recipient, 100, { from: spender });
        console.log('TransferFrom gas usage:', receipt.receipt.gasUsed);
    });

    it('burn gas usage', async function () {
        const receipt = await this.token.burn(100, { from: owner });
        console.log('Burn gas usage:', receipt.receipt.gasUsed);
    });

    it('burnFrom gas usage', async function () {
        await this.token.approve(spender, 100, { from: owner });
        const receipt = await this.token.burnFrom(owner, 100, { from: spender });
        console.log('BurnFrom gas usage:', receipt.receipt.gasUsed);
    });

    it('infinite allowance transferFrom gas usage', async function () {
        await this.token.approve(spender, web3.utils.toBN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), { from: owner });
        const receipt = await this.token.transferFrom(owner, recipient, 100, { from: spender });
        console.log('Infinite allowance transferFrom gas usage:', receipt.receipt.gasUsed);
    });

    it('infinite allowance burnFrom gas usage', async function () {
        await this.token.approve(spender, web3.utils.toBN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), { from: owner });
        const receipt = await this.token.burnFrom(owner, 100, { from: spender });
        console.log('Infinite allowance burnFrom gas usage:', receipt.receipt.gasUsed);
    });
});
