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

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        address spender = _msgSender();
        uint256 currentAllowance = allowance(sender, spender);
        if (currentAllowance != uint256(-1)) {
            require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
            _approve(sender, spender, currentAllowance - amount);
        }
        _transfer(sender, recipient, amount);
        return true;
    }

    function burnFrom(address account, uint256 amount) public override {
        address spender = _msgSender();
        uint256 currentAllowance = allowance(account, spender);
        if (currentAllowance != uint256(-1)) {
            require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
            _approve(account, spender, currentAllowance - amount);
        }
        _burn(account, amount);
    }
}
