// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

// https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27756678#overview
contract Tether {
    string public name = "Gibson Tether Token";
    string public symbol = "USDT";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
    uint8 public decimals = 18;

    event Tranfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);
        // balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        // balanceOf[_to] = balanceOf[_to] + _value;
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Tranfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]); // not undersatand
        balanceOf[_to] += _value; // Add the balance
        balanceOf[_from] -= _value; // subtract the balance for transfarfrom
        allowance[_from][msg.sender] -= _value; // not understand
        emit Tranfer(_from, _to, _value);
        return true;
    }
}
