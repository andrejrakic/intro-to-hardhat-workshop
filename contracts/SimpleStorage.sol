// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    // private means that only my contract can access this variable. It's not hidden on the blockchain!!!
    string private message;
    address public owner; // Solidity will generate "owner()" getter function for us

    event MessageChanged(string newMessage);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not an owner");
        _;
    }

    constructor() {
        message = "Chainlink Workshop";
        owner = msg.sender; // msg.sender is the EOA (externally owned account) which called this function
    }

    // Check-Effects-Interaction pattern
    function setMessage(string memory newMessage) public onlyOwner {
        require(bytes(newMessage).length > 0, "Empty strings not allowed");

        message = newMessage;

        emit MessageChanged(newMessage);
    }

    // view is free to consume, no gas required
    function getMessage() public view returns (string memory) {
        return message;
    }
}
