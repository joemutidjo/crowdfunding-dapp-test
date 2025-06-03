// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Crowdfund {
    address public owner;
    uint public deadline;     // UNIX timestamp
    uint public goal;         // goal in wei
    uint public totalRaised;

    mapping(address => uint) public contributions;

    constructor(uint _deadline, uint _goal) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        owner = msg.sender;
        deadline = _deadline;
        goal = _goal;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "Campaign has ended");
        require(msg.value > 0, "Must send ETH");
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(block.timestamp >= deadline, "Campaign not ended");
        require(totalRaised >= goal, "Funding goal not met");
        payable(owner).transfer(address(this).balance);
    }

    function getRefund() external {
        require(block.timestamp >= deadline, "Campaign not ended");
        require(totalRaised < goal, "Goal was met, no refunds");
        uint amount = contributions[msg.sender];
        require(amount > 0, "No contributions found");
        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
