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

    it('measure permit gas and verify signature correctness', async function () {
        // EIP-712 Permit parameters
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        // Domain separator can be fetched from the contract
        const domainSeparator = await this.token.DOMAIN_SEPARATOR();

        // Standard permit typehash
        const permitTypehash = web3.utils.soliditySha3(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );

        const privateKey = '0x0000000000000000000000000000000000000000000000000000000000000001';
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);

        // Mint tokens to the dummy private key account so we can permit
        await this.token.mint(account.address, amount, { from: owner });

        const accountNonce = await this.token.nonces(account.address);

        // ABI encode the parameters for structHash (using standard abi.encode, not packed)
        const encodedData = web3.eth.abi.encodeParameters(
            ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
            [permitTypehash, account.address, spender, amount, accountNonce.toString(), deadline]
        );
        const structHashAccount = web3.utils.keccak256(encodedData);

        // Compute EIP-712 digest: keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHashAccount))
        const digestAccount = web3.utils.soliditySha3(
            { t: 'bytes2', v: '0x1901' },
            { t: 'bytes32', v: domainSeparator },
            { t: 'bytes32', v: structHashAccount }
        );

        const signingKey = new ethers.utils.SigningKey(privateKey);
        const signature = signingKey.signDigest(digestAccount);
        const v = signature.v;
        const r = signature.r;
        const s = signature.s;

        const receipt = await this.token.permit(account.address, spender, amount, deadline, v, r, s, { from: spender });
        console.log('permit gas used:', receipt.receipt.gasUsed);

        // Verify allowance was set correctly
        const allowanceAmount = await this.token.allowance(account.address, spender);
        assert.equal(allowanceAmount.toString(), amount.toString(), "Permit allowance was not set correctly");
    });
});
