// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./pedetin.sol";

error Trade_InsufficientAmount();
error Trade_InsufficientTokenBalance();
error Trade_FailedToSend();

contract Trade {
    // state variables
    Pedetin pedetin;
    uint256 private constant aToken = 0.05 ether;

    // events
    event deposited(address indexed depositor, uint256 indexed amount);
    event swapped(address indexed owner, uint256 tokenAmount, uint256 ethAmount);

    // mapping
    mapping(address owner => uint256 amountOwned) public depositorToAmountOwned;

    constructor(address _pedetin) {
        pedetin = Pedetin(_pedetin);
    }


    function deposit() public payable {
        if (msg.value <= 0) {
            revert Trade_InsufficientAmount();
        }
        depositorToAmountOwned[msg.sender] = msg.value;

        pedetin.mint(msg.sender, depositorToAmountOwned[msg.sender]/aToken);
        depositorToAmountOwned[msg.sender] = 0;
        emit deposited(msg.sender, msg.value);
    }

    function swap() public {
        uint256 avail = pedetin.balanceOf(msg.sender);
        if(avail == 0){
            revert Trade_InsufficientTokenBalance();
        }

        uint256 totalRefund = avail * aToken;

        pedetin.burn(avail);

        (bool success, ) = payable(msg.sender).call{value: totalRefund}("");

        if(!success) {
            revert Trade_FailedToSend();
        }

    }
}
