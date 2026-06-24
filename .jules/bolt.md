# BOLT'S JOURNAL - PERFORMANCE OPTIMIZATIONS ⚡

## 2025-05-14 - [Infinite Allowance Optimization]
**Learning:** In Solidity 0.6.x, the 'using SafeMath for uint256;' directive requires an explicit import of the SafeMath library in the child contract to be used for local arithmetic, even if the base contract also uses it. Overriding `transferFrom` and `burnFrom` to skip allowance updates when set to `type(uint256).max` significantly reduces gas costs (~5k gas per call).
**Action:** Always implement infinite allowance check for high-throughput ERC20 tokens to improve user experience and reduce gas costs.
