## 2026-06-26 - [Infinite Allowance Optimization]
**Learning:** Implementing an infinite allowance check (skipping storage updates for uint256(-1)) reduces gas costs for transferFrom and burnFrom by over 5,000 gas. In Solidity 0.6.x, explicit import of SafeMath in the child contract is necessary when overriding functions that use it.
**Action:** Always check for infinite allowance in ERC20 tokens to save gas for high-volume integrators.

## 2026-06-28 - [TEE Wallet Service Implementation]
**Learning:** Implementing envelope encryption (KEK -> DEK -> Private Key) with AAD (Wallet Address) provides strong security for TEE-based wallet services. JWT (ES256) with request body hashing (`reqHash`) ensures request integrity and non-repudiation in gRPC services.
**Action:** Use `crypto.createHash('sha256').update(JSON.stringify(sortObjectKeys(body))).digest('hex')` for consistent request hashing across services.

## 2026-06-30 - [Optimized Wallet Generation]
**Learning:** `ethers.Wallet.createRandom()` in ethers v6 is surprisingly slow (~10ms+ per call) because it generates a BIP39 mnemonic using PBKDF2 (2048 iterations). When a mnemonic is not needed, direct instantiation from `crypto.randomBytes(32)` is ~15x faster.
**Action:** Prefer `new ethers.Wallet('0x' + crypto.randomBytes(32).toString('hex'))` for high-performance wallet generation when mnemonics are not required.
