## 2025-05-14 - [Infinite Allowance Gas Optimization]
**Learning:** Implementing an infinite allowance check (uint256(-1)) in `transferFrom` and `burnFrom` saves ~5,000 gas per transaction by avoiding an unnecessary `SSTORE` operation. This is a standard optimization for ERC20 tokens that improves efficiency for power users and integrations.
**Action:** Always consider infinite allowance optimizations in ERC20 implementations. Ensure that `SafeMath` is correctly applied in the context of the specific Solidity version.

## 2025-05-14 - [Artifact Management]
**Learning:** Running build scripts like `yarn dist` can generate multiple artifacts (`.bin`, `.abi`, flattened `.sol` files) that should not be committed to the source repository.
**Action:** Be vigilant about which files are staged for commit. Always verify `list_files` before submitting and avoid modifying `package.json` unless explicitly instructed.
