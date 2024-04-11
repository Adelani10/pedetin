// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./pedetin.sol";


error Trade_InsufficientAmount();

contract Trade {

    Pedetin pedetin;

    constructor(address _pedetin) {
        pedetin = Pedetin(_pedetin);
    }

    mapping (address owner => uint256 amountOwned) public ownerToAmountOwned;

    function deposit(uint256 amount) public payable {
        if(amount <= 0){
            revert Trade_InsufficientAmount();
        }
        ownerToAmountOwned[msg.sender] += msg.value;
        pedetin.mint(msg.sender, amount);
        
    }

    function swap() public {

    }
}
