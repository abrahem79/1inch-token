## 2025-01-24 - [Infinite Allowance Gas Optimization]
**Learning:** Implementing an "infinite allowance" check in `transferFrom` and `burnFrom` saves approximately 5,000 gas per call by avoiding unnecessary storage writes to the allowance mapping when the allowance is set to `uint256(-1)`. This is a common and highly effective optimization for ERC20 tokens used in DeFi protocols.
**Action:** Always consider implementing infinite allowance optimizations in ERC20 tokens to improve gas efficiency for power users and protocols.
