// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

error Pedetin_InsufficientBalance();
error Pedetin_CannotBeZeroethAddress();
error Pedetin_CannotMintZeroTokens();

contract Pedetin is ERC20, Ownable {
    uint256 private immutable initialSupply;

    constructor (uint256 _initialSupply) ERC20("Pedetin", "PDT") {
        initialSupply = _initialSupply;
        _mint(msg.sender, initialSupply);
    }

    function burn(uint256 amountToBurn) public {
        uint256 availableBalance = balanceOf(msg.sender);
        if(availableBalance <= 0) {
            revert Pedetin_InsufficientBalance();
        }

        if(availableBalance < amountToBurn) {
            revert Pedetin_InsufficientBalance();
        }

        _burn(msg.sender, amountToBurn);
    }

    function mint(address to, uint256 amount) public {
        if(to == address(0)){
            revert Pedetin_CannotBeZeroethAddress();
        }

        if(amount <= 0) {
            revert Pedetin_CannotMintZeroTokens();
        }

        _mint(to, amount);
    }

}
