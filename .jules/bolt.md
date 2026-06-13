## 2025-05-14 - Infinite Allowance Gas Optimization
**Learning:** Skipping allowance updates when the allowance is set to `uint256.max` saves approximately 5,000 gas per transaction in `transferFrom` and `burnFrom`. This is due to avoiding an `SSTORE` operation which is costly.
**Action:** Always implement this optimization in ERC20 tokens using Solidity < 0.8.0, as it is a common pattern and highly efficient for high-frequency tokens. Ensure `SafeMath` is properly linked when overriding these functions.
