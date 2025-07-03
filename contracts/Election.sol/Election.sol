// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    address public admin;
    string[] public candidates;
    mapping(address => bool) public hasVoted;
    mapping(string => uint) public votes;

    constructor(string[] memory _candidates) {
        admin = msg.sender;
        candidates = _candidates;
    }

    function vote(string memory _candidate) public {
        require(!hasVoted[msg.sender], "Already voted");
        bool valid = false;
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(abi.encodePacked(candidates[i])) == keccak256(abi.encodePacked(_candidate))) {
                valid = true;
                break;
            }
        }
        require(valid, "Invalid candidate");
        hasVoted[msg.sender] = true;
        votes[_candidate]++;
    }

    function getVotes(string memory _candidate) public view returns (uint) {
        return votes[_candidate];
    }

    function getCandidates() public view returns (string[] memory) {
        return candidates;
    }
}
