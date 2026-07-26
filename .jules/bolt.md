## 2026-06-26 - [Infinite Allowance Optimization]
**Learning:** Implementing an infinite allowance check (skipping storage updates for uint256(-1)) reduces gas costs for transferFrom and burnFrom by over 5,000 gas. In Solidity 0.6.x, explicit import of SafeMath in the child contract is necessary when overriding functions that use it.
**Action:** Always check for infinite allowance in ERC20 tokens to save gas for high-volume integrators.

## 2026-06-28 - [TEE Wallet Service Implementation]
**Learning:** Implementing envelope encryption (KEK -> DEK -> Private Key) with AAD (Wallet Address) provides strong security for TEE-based wallet services. JWT (ES256) with request body hashing (`reqHash`) ensures request integrity and non-repudiation in gRPC services.
**Action:** Use `crypto.createHash('sha256').update(JSON.stringify(sortObjectKeys(body))).digest('hex')` for consistent request hashing across services.

## 2026-06-30 - [Efficient SECP256K1 Wallet Generation]
**Learning:** `ethers.Wallet.createRandom()` is slow (~10ms) because it generates a mnemonic phrase. Direct instantiation from 32 random bytes via `crypto.randomBytes(32)` is ~15x faster (~0.7ms) and equally secure if the mnemonic is not needed.
**Action:** Prefer `new ethers.Wallet('0x' + crypto.randomBytes(32).toString('hex'))` over `createRandom()` for high-performance wallet generation.

## 2026-07-02 - [EIP-712 Constant Typehash and Inline Chain ID Optimization]
**Learning:** In Solidity 0.6.x, EIP-712 Typehashes and Permit Typehashes declared as `immutable` incur storage-reading/deployment gas overhead. Changing them to `constant` allows the compiler to pre-compute the `keccak256` hash at compile time. In addition, inlining the `chainid()` assembly block and passing it into private domain separator builders avoids redundant internal function calls, saving both execution and deployment gas.
**Action:** Use `constant` for hashes of compile-time string literals, and inline assembly opcodes like `chainid()` to avoid internal call overhead.
