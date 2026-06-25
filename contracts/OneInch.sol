// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./ERC20Permit.sol";


contract OneInch is ERC20Permit, ERC20Burnable, Ownable {
    using SafeMath for uint256;

    constructor(address _owner) public ERC20("1INCH Token", "1INCH") EIP712("1INCH Token", "1") {
        _mint(_owner, 1.5e9 ether);
        transferOwnership(_owner);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Overrides {ERC20-transferFrom} to skip allowance update if the current allowance is set to infinite (uint256(-1)).
     * This saves gas by avoiding a storage write (SSTORE) and an Approval event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        uint256 currentAllowance = allowance(sender, _msgSender());
        if (currentAllowance != uint256(-1)) {
            _approve(sender, _msgSender(), currentAllowance.sub(amount, "ERC20: transfer amount exceeds allowance"));
        }
        return true;
    }

    /**
     * @dev Overrides {ERC20Burnable-burnFrom} to skip allowance update if the current allowance is set to infinite (uint256(-1)).
     * This saves gas by avoiding a storage write (SSTORE) and an Approval event.
     */
    function burnFrom(address account, uint256 amount) public override {
        uint256 currentAllowance = allowance(account, _msgSender());
        if (currentAllowance != uint256(-1)) {
            _approve(account, _msgSender(), currentAllowance.sub(amount, "ERC20: burn amount exceeds allowance"));
        }
        _burn(account, amount);
    }
}
