## 2026-06-26 - [Infinite Allowance Optimization]
**Learning:** Implementing an infinite allowance check (skipping storage updates for uint256(-1)) reduces gas costs for transferFrom and burnFrom by over 5,000 gas. In Solidity 0.6.x, explicit import of SafeMath in the child contract is necessary when overriding functions that use it.
**Action:** Always check for infinite allowance in ERC20 tokens to save gas for high-volume integrators.

## 2026-06-28 - [TEE Wallet Service Implementation]
**Learning:** Implementing envelope encryption (KEK -> DEK -> Private Key) with AAD (Wallet Address) provides strong security for TEE-based wallet services. JWT (ES256) with request body hashing (`reqHash`) ensures request integrity and non-repudiation in gRPC services.
**Action:** Use `crypto.createHash('sha256').update(JSON.stringify(sortObjectKeys(body))).digest('hex')` for consistent request hashing across services.

## 2026-06-30 - [Efficient SECP256K1 Wallet Generation]
**Learning:** `ethers.Wallet.createRandom()` is slow (~10ms) because it generates a mnemonic phrase. Direct instantiation from 32 random bytes via `crypto.randomBytes(32)` is ~15x faster (~0.7ms) and equally secure if the mnemonic is not needed.
**Action:** Prefer `new ethers.Wallet('0x' + crypto.randomBytes(32).toString('hex'))` over `createRandom()` for high-performance wallet generation.

## 2026-07-02 - [EIP-712 Permit Optimization]
**Learning:** In Solidity 0.6.x, EIP-712 type hashes should be declared as `constant` instead of `immutable` to allow the compiler to pre-compute hash values and avoid storage/deployment overhead. Inlining assembly `chainid()` lookups and passing it to internal helper functions further avoids redundant opcodes and internal call JUMP overheads, saving exactly 31-36 gas per `permit()` transaction.
**Action:** Inline `chainid` lookup and use `constant` type hashes to optimize EIP-712 message signing and verification.
