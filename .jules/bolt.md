## 2025-01-24 - [Infinite Allowance Optimization Results]
**Learning:** Initial gas measurements for standard ERC20 `transferFrom` and `burnFrom` with infinite allowance were higher than necessary due to redundant storage updates.
**Action:** Implemented infinite allowance optimization in `OneInch.sol` by overriding `transferFrom` and `burnFrom` to skip allowance updates when set to `uint256(-1)`.

### Gas Savings Results:
- `transferFrom` (infinite): 54,736 -> 49,616 (**5,120 gas saved**)
- `burnFrom` (infinite): 36,993 -> 31,845 (**5,148 gas saved**)

**Key Insight:** In Solidity 0.6.x, even if inheriting from contracts that use `SafeMath`, you must explicitly import and declare `using SafeMath for uint256;` in each child contract that uses its methods.
