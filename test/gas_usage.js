const OneInch = artifacts.require('OneInch');
const ethers = require('ethers');

contract('OneInch Gas Usage', function (accounts) {
    const [owner, spender, recipient] = accounts;
    const amount = web3.utils.toWei('10');
    const infiniteAllowance = web3.utils.toBN('2').pow(web3.utils.toBN('256')).sub(web3.utils.toBN('1'));

    // A private key for the permit test
    const permitPrivKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const permitWallet = new ethers.Wallet(permitPrivKey);
    const permitOwner = permitWallet.address;

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
        const nonce = (await this.token.nonces(permitOwner)).toNumber();
        const deadline = 9999999999;
        const value = amount;

        const domainSeparator = await this.token.DOMAIN_SEPARATOR();
        const PERMIT_TYPEHASH = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")
        );

        const structHash = ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(
                ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
                [PERMIT_TYPEHASH, permitOwner, spender, value.toString(), nonce, deadline]
            )
        );

        const digest = ethers.utils.keccak256(
            ethers.utils.solidityPack(
                ['string', 'bytes32', 'bytes32'],
                ['\x19\x01', domainSeparator, structHash]
            )
        );

        const sig = permitWallet._signingKey().signDigest(digest);
        const { v, r, s } = ethers.utils.splitSignature(sig);

        const receipt = await this.token.permit(permitOwner, spender, value, deadline, v, r, s, { from: spender });
        console.log('permit:', receipt.receipt.gasUsed);

        // Verify that allowance is set correctly
        const allowance = await this.token.allowance(permitOwner, spender);
        assert.equal(allowance.toString(), value.toString(), "allowance was not correctly set by permit");
    });
});
