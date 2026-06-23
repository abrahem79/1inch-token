## 2025-05-14 - [Infinite Allowance Gas Optimization]
**Learning:** Implementing the "infinite allowance" pattern by overriding `transferFrom` and `burnFrom` to skip storage updates and event emissions when the allowance is `type(uint256).max` saves approximately 5,000 gas per transaction. This is a common and safe optimization for ERC20 tokens used in DeFi protocols.
**Action:** Always consider overriding standard ERC20 functions in derived contracts to implement gas-saving short-circuits for common use cases like infinite allowances.
