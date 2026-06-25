## 2024-06-25 - [Infinite Allowance Gas Optimization]
**Learning:** Overriding `transferFrom` and `burnFrom` to skip allowance updates when the allowance is set to `uint256(-1)` saves approximately 5,000 gas per call in Solidity 0.6.x. This is because it avoids an `SSTORE` operation and an `Approval` event emission.
**Action:** Always consider implementing this optimization for ERC20 tokens that are expected to be used with infinite allowances in DeFi protocols.
