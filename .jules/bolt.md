## 2024-05-24 - [Infinite Allowance Gas Optimization]
**Learning:** In Solidity 0.6.x (OpenZeppelin 3.x), implementing the infinite allowance pattern (skipping allowance updates when set to uint256(-1)) significantly reduces gas costs for 'transferFrom' and 'burnFrom' by avoiding unnecessary 'SSTORE' operations. This saves about 5,000 gas per transaction.
**Action:** Always check for opportunities to skip storage updates in high-frequency operations, especially when using standard patterns like EIP-2612 and ERC20.

**Learning:** 'using SafeMath for uint256;' is NOT inherited from base contracts in Solidity 0.6.x. It must be explicitly declared in the derived contract to use SafeMath methods.
**Action:** Ensure 'using SafeMath' is present when calling '.sub()' or other SafeMath functions in derived contracts.
