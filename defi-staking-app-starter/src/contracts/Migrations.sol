// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Migrations {
    address public owner;
    uint256 public last_completed_migration;

    constructor() public{
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function setCompleted(uint256 completed) public restricted {
        last_completed_migration = completed;
    }

    //https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27756672#overview
    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address); // not understand
        upgraded.setCompleted(last_completed_migration); // not understand
    }
}
