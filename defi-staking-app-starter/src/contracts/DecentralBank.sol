// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStake;
    mapping(address => bool) public isStaking;

    // https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27756750#overview

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    //staking function
    function depositTokens(uint256 _amount) public {
        // require the amount grater than zero
        require(_amount > 0, "amount cannot be 0");

        // Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount); // could not understand this

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStake[msg.sender]) {
            stakers.push(msg.sender);
        }
        // update the staking balance
        isStaking[msg.sender] = true;
        hasStake[msg.sender] = true;
    }

    // Unstake Tokens
    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        // require ammount > 0
        require(balance > 0, "Staking balance can't be less than zero");

        // transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);

        // reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update Staking Status
        isStaking[msg.sender] = false;
    }

    // Issue rewards
    function issueTokens() public {
        // require the owner to issue token only
        require(msg.sender == owner, "caller must be the owner");

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient] / 9;
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }
}
