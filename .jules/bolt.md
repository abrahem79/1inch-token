## 2026-06-26 - [Infinite Allowance Optimization]
**Learning:** Implementing an infinite allowance check (skipping storage updates for uint256(-1)) reduces gas costs for transferFrom and burnFrom by over 5,000 gas. In Solidity 0.6.x, explicit import of SafeMath in the child contract is necessary when overriding functions that use it.
**Action:** Always check for infinite allowance in ERC20 tokens to save gas for high-volume integrators.

## 2026-06-28 - [TEE Wallet Service Implementation]
**Learning:** Implementing envelope encryption (KEK -> DEK -> Private Key) with AAD (Wallet Address) provides strong security for TEE-based wallet services. JWT (ES256) with request body hashing (`reqHash`) ensures request integrity and non-repudiation in gRPC services.
**Action:** Use `crypto.createHash('sha256').update(JSON.stringify(sortObjectKeys(body))).digest('hex')` for consistent request hashing across services.

## 2026-07-01 - [Ethers v6 Wallet Initialization]
**Learning:** In ethers v6, `new ethers.Wallet()` strictly requires the `0x` prefix when passing a private key as a hex string. Omitting it results in an `INVALID_ARGUMENT` error. Direct instantiation from random bytes (with `0x` prefix) is ~93% faster than `ethers.Wallet.createRandom()` because it avoids expensive mnemonic generation.
**Action:** Always use `0x` prefix for hex strings in ethers v6 and prefer direct byte-based instantiation when mnemonics aren't needed.
