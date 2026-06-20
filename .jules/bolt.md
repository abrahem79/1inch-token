## 2025-01-24 - [Infinite Allowance Gas Optimization]
**Learning:** Overriding `transferFrom` and `burnFrom` to skip storage updates and event emissions when the allowance is `uint256(-1)` saves approximately 5,100+ gas per call. This is a common and highly effective optimization for ERC20 tokens used in DeFi protocols where users often grant infinite allowance.
**Action:** Always check if the target ERC20 token implements this optimization when evaluating gas costs for integrations, and implement it in new token contracts to provide better UX for users.
