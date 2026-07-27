const OneInch = artifacts.require('OneInch');
const { Wallet } = require('ethers');

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

    it('measure permit gas and verify it works', async function () {
        const wallet = Wallet.createRandom();

        // Mint tokens to the generated wallet address
        await this.token.mint(wallet.address, amount, { from: owner });

        const nonce = await this.token.nonces(wallet.address);
        const deadline = Math.floor(Date.now() / 1000) + 3600;
        const chainId = await web3.eth.getChainId();

        // Sign the permit EIP712 message using ethers _signTypedData
        const domain = {
            name: '1INCH Token',
            version: '1',
            chainId: chainId,
            verifyingContract: this.token.address
        };

        const types = {
            Permit: [
                { name: 'owner', type: 'address' },
                { name: 'spender', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'nonce', type: 'uint256' },
                { name: 'deadline', type: 'uint256' }
            ]
        };

        const value = {
            owner: wallet.address,
            spender: spender,
            value: amount,
            nonce: nonce.toString(),
            deadline: deadline
        };

        const signature = await wallet._signTypedData(domain, types, value);
        const sig = wallet.provider ? null : require('ethers').utils.splitSignature(signature);

        const receipt = await this.token.permit(
            wallet.address,
            spender,
            amount,
            deadline,
            sig.v,
            sig.r,
            sig.s,
            { from: spender }
        );

        console.log('permit gas:', receipt.receipt.gasUsed);

        // Verify allowance was set correctly
        const allowance = await this.token.allowance(wallet.address, spender);
        assert.equal(allowance.toString(), amount.toString(), "Allowance should match signed value");
    });
});
