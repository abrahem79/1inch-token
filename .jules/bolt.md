## 2026-06-26 - [Infinite Allowance Optimization]
**Learning:** Implementing an infinite allowance check (skipping storage updates for uint256(-1)) reduces gas costs for transferFrom and burnFrom by over 5,000 gas. In Solidity 0.6.x, explicit import of SafeMath in the child contract is necessary when overriding functions that use it.
**Action:** Always check for infinite allowance in ERC20 tokens to save gas for high-volume integrators.
