const OneInch = artifacts.require('OneInch');

contract('OneInch gas usage', function ([owner, spender, recipient]) {
    beforeEach(async function () {
        this.token = await OneInch.new(owner);
    });

    it('measure transferFrom gas', async function () {
        const amount = web3.utils.toWei('100');
        await this.token.approve(spender, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', { from: owner });
        const receipt = await this.token.transferFrom(owner, recipient, amount, { from: spender });
        console.log('transferFrom gasUsed:', receipt.receipt.gasUsed);
    });

    it('measure burnFrom gas', async function () {
        const amount = web3.utils.toWei('100');
        await this.token.approve(spender, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', { from: owner });
        const receipt = await this.token.burnFrom(owner, amount, { from: spender });
        console.log('burnFrom gasUsed:', receipt.receipt.gasUsed);
    });
});
