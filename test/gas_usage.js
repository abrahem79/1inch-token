const OneInch = artifacts.require('OneInch');
const ethers = require('ethers');

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

    it('measure permit gas and functionality', async function () {
        const wallet = ethers.Wallet.createRandom();
        const ownerAddress = wallet.address;
        const spenderAddress = spender;
        const value = amount;
        const nonce = await this.token.nonces(ownerAddress);
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        const domainSeparator = await this.token.DOMAIN_SEPARATOR();
        const permitTypeHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")
        );

        const structHash = ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(
                ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
                [permitTypeHash, ownerAddress, spenderAddress, value.toString(), nonce.toString(), deadline]
            )
        );

        const digest = ethers.utils.keccak256(
            ethers.utils.solidityPack(
                ['string', 'bytes32', 'bytes32'],
                ['\x19\x01', domainSeparator, structHash]
            )
        );

        const signingKey = new ethers.utils.SigningKey(wallet.privateKey);
        const signature = signingKey.signDigest(digest);
        const { v, r, s } = signature;

        const receipt = await this.token.permit(ownerAddress, spenderAddress, value, deadline, v, r, s);
        console.log('permit gas:', receipt.receipt.gasUsed);

        const allowance = await this.token.allowance(ownerAddress, spenderAddress);
        assert.equal(allowance.toString(), value.toString(), 'Allowance should be set correctly');
    });
});
