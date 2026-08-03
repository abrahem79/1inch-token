const OneInch = artifacts.require('OneInch');
const { ethers } = require('ethers');

contract('OneInch Gas Usage', function (accounts) {
    const [owner, spender, recipient] = accounts;
    const amount = web3.utils.toWei('10');
    const infiniteAllowance = web3.utils.toBN('2').pow(web3.utils.toBN('256')).sub(web3.utils.toBN('1'));

    beforeEach(async function () {
        this.token = await OneInch.new(owner);
    });

    it('measure transferFrom gas (finite allowance)', async function () {
        await this.token.approve(spender, amount, { from: owner });
        const receipt = await this.token.transferFrom(owner, recipient, amount, { from: spender });
        console.log('transferFrom (finite):', receipt.receipt.gasUsed);
    });

    it('measure transferFrom gas (infinite allowance)', async function () {
        await this.token.approve(spender, infiniteAllowance, { from: owner });
        const receipt = await this.token.transferFrom(owner, recipient, amount, { from: spender });
        console.log('transferFrom (infinite):', receipt.receipt.gasUsed);
    });

    it('measure burnFrom gas (finite allowance)', async function () {
        await this.token.approve(spender, amount, { from: owner });
        const receipt = await this.token.burnFrom(owner, amount, { from: spender });
        console.log('burnFrom (finite):', receipt.receipt.gasUsed);
    });

    it('measure burnFrom gas (infinite allowance)', async function () {
        await this.token.approve(spender, infiniteAllowance, { from: owner });
        const receipt = await this.token.burnFrom(owner, amount, { from: spender });
        console.log('burnFrom (infinite):', receipt.receipt.gasUsed);
    });

    it('measure permit gas', async function () {
        const wallet = ethers.Wallet.createRandom();
        const ownerAddress = wallet.address;
        const deadline = Math.floor(Date.now() / 1000) + 3600;
        const nonce = 0;

        const domain = {
            name: '1INCH Token',
            version: '1',
            chainId: await web3.eth.getChainId(),
            verifyingContract: this.token.address,
        };

        const types = {
            Permit: [
                { name: 'owner', type: 'address' },
                { name: 'spender', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'nonce', type: 'uint256' },
                { name: 'deadline', type: 'uint256' },
            ],
        };

        const value = {
            owner: ownerAddress,
            spender: spender,
            value: amount.toString(),
            nonce: nonce,
            deadline: deadline,
        };

        const signature = await wallet._signTypedData(domain, types, value);
        const sig = ethers.utils.splitSignature(signature);

        const receipt = await this.token.permit(
            ownerAddress,
            spender,
            amount,
            deadline,
            sig.v,
            sig.r,
            sig.s,
            { from: spender }
        );
        console.log('permit:', receipt.receipt.gasUsed);
    });
});
