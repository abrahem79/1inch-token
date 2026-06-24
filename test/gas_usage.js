const OneInch = artifacts.require('OneInch');

contract('OneInch gas usage', function ([owner, alice, bob]) {
    const INF = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

    beforeEach(async function () {
        this.token = await OneInch.new(owner);
    });

    it('transfer gas usage', async function () {
        const receipt = await this.token.transfer(alice, 100, { from: owner });
        console.log('transfer gasUsed:', receipt.receipt.gasUsed);
    });

    it('transferFrom gas usage (normal allowance)', async function () {
        await this.token.approve(alice, 100, { from: owner });
        const receipt = await this.token.transferFrom(owner, bob, 100, { from: alice });
        console.log('transferFrom (normal) gasUsed:', receipt.receipt.gasUsed);
    });

    it('transferFrom gas usage (infinite allowance)', async function () {
        await this.token.approve(alice, INF, { from: owner });
        const receipt = await this.token.transferFrom(owner, bob, 100, { from: alice });
        console.log('transferFrom (infinite) gasUsed:', receipt.receipt.gasUsed);
    });

    it('burnFrom gas usage (normal allowance)', async function () {
        await this.token.approve(alice, 100, { from: owner });
        const receipt = await this.token.burnFrom(owner, 100, { from: alice });
        console.log('burnFrom (normal) gasUsed:', receipt.receipt.gasUsed);
    });

    it('burnFrom gas usage (infinite allowance)', async function () {
        await this.token.approve(alice, INF, { from: owner });
        const receipt = await this.token.burnFrom(owner, 100, { from: alice });
        console.log('burnFrom (infinite) gasUsed:', receipt.receipt.gasUsed);
    });
});
