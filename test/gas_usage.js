const OneInch = artifacts.require('OneInch');

contract('OneInch gas usage', function ([owner, sender, recipient]) {
    let token;
    const amount = web3.utils.toWei('10');

    beforeEach(async function () {
        token = await OneInch.new(owner);
        await token.transfer(sender, amount, { from: owner });
    });

    it('measure transferFrom gas', async function () {
        await token.approve(owner, amount, { from: sender });
        const receipt = await token.transferFrom(sender, recipient, amount, { from: owner });
        console.log('transferFrom gasUsed:', receipt.receipt.gasUsed);
    });

    it('measure transferFrom gas with infinite allowance', async function () {
        await token.approve(owner, web3.utils.toBN('2').pow(web3.utils.toBN('256')).sub(web3.utils.toBN('1')), { from: sender });
        const receipt = await token.transferFrom(sender, recipient, amount, { from: owner });
        console.log('transferFrom (infinite) gasUsed:', receipt.receipt.gasUsed);
    });

    it('measure burnFrom gas', async function () {
        await token.approve(owner, amount, { from: sender });
        const receipt = await token.burnFrom(sender, amount, { from: owner });
        console.log('burnFrom gasUsed:', receipt.receipt.gasUsed);
    });

    it('measure burnFrom gas with infinite allowance', async function () {
        await token.approve(owner, web3.utils.toBN('2').pow(web3.utils.toBN('256')).sub(web3.utils.toBN('1')), { from: sender });
        const receipt = await token.burnFrom(sender, amount, { from: owner });
        console.log('burnFrom (infinite) gasUsed:', receipt.receipt.gasUsed);
    });
});
