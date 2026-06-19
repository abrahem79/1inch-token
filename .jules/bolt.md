## 2025-01-24 - [Infinite Allowance Gas Optimization]
**Learning:** Overriding `transferFrom` and `burnFrom` to skip allowance updates when set to `type(uint256).max` saves ~5,100 gas per call by avoiding `SSTORE` and `Approval` event emission. In Solidity 0.6.x, `using SafeMath` must be explicitly declared and imported in the contract even if it's used in the base contract.
**Action:** Always implement infinite allowance optimization in ERC20 tokens for DeFi. Cache state variables in local memory if used more than once to avoid redundant `SLOAD`s.
