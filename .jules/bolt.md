## 2026-06-26 - [Infinite Allowance Optimization]
**Learning:** Implementing an infinite allowance check (skipping storage updates for uint256(-1)) reduces gas costs for transferFrom and burnFrom by over 5,000 gas. In Solidity 0.6.x, explicit import of SafeMath in the child contract is necessary when overriding functions that use it.
**Action:** Always check for infinite allowance in ERC20 tokens to save gas for high-volume integrators.

## 2026-06-26 - [SafeMath vs Raw Arithmetic]
**Learning:** In Solidity 0.6.x, replacing `SafeMath.sub(a, b, "error")` with `require(a >= b, "error"); a - b` saves ~114 gas by avoiding the internal library function call and associated stack overhead. Caching `_msgSender()` when it's used only twice in one branch can actually increase gas for other branches due to the cost of the local variable assignment.
**Action:** Prioritize inlining SafeMath operations in hot paths like `transferFrom`. Only cache variables if the reuse is high enough to offset the assignment cost (~3 gas per read vs ~13 gas for assignment).
