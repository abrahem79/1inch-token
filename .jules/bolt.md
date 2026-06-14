## 2025-05-15 - [SafeMath Inheritance and Gas Reporter dependency]
**Learning:** In Solidity 0.6.x, `using SafeMath for uint256;` is not automatically inherited by child contracts even if the parent uses it. It must be explicitly declared in each contract that needs it. Additionally, `eth-gas-reporter` can cause Mocha to fail if it's referenced in `truffle-config.js` but missing from `package.json`.
**Action:** Always check for explicit `SafeMath` imports and usage in child contracts for Solidity 0.6.x. If tests fail due to a missing reporter, use `--reporter spec` as a workaround instead of modifying the config file.

## 2025-05-15 - [Infinite Allowance Optimization]
**Learning:** The "infinite allowance" optimization (skipping storage updates in `transferFrom` and `burnFrom` when the allowance is `uint256(-1)`) saves ~5,000 gas per transaction (one `SSTORE` operation).
**Action:** Implement this pattern in ERC20 tokens where gas efficiency for high-frequency spenders (like DEXs or aggregators) is critical.
