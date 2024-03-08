// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Voting{

    struct Candidate{
        uint id;
        string name;
        uint numberOfVotes;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address=>bool) voters;//map addr of all the voters
    address[] public listOfVoters;

    uint public votingStart;
    uint public votingEnd;

    bool public electionStarted;

    modifier onlyOwner(){
        require(msg.sender==owner,"You are not authorized");
        _;
    }

    modifier electionOngoing(){
        require(electionStarted== true,"Election has not begin yet");
        _;
    }

    constructor(){
        owner=msg.sender;
    }

    function startElection(string[] memory _candidates,uint _votingDuration) public onlyOwner{
        require(electionStarted==false,"election ongoing ");
        delete candidates;
        resetAllVoterStatus();
        for (uint i=0;i<_candidates.length;i++){
            candidates.push(Candidate({id:i,name:_candidates[i],numberOfVotes:0}));
        }
        electionStarted=true;
        votingStart=block.timestamp;
        votingEnd=votingStart+(_votingDuration*1 minutes);

    }

    function checkElectionPeriod() public returns (bool){
        if(electionTimer()>0){
            return true;
        }

        electionStarted=false;
        return false;
    }
    function addCandidate(string memory _name) public onlyOwner electionOngoing{
        require(checkElectionPeriod(),"Election has Ended");
        uint n=candidates.length;
        candidates.push(Candidate({id:n,name:_name,numberOfVotes:0}));
    }

    function checkVoterStatus(address _voter) public view electionOngoing returns (bool){
        if(voters[_voter]==true){
            return true;
        }else{
            return false;
        }
    }

    function voteTo(uint _id) public electionOngoing{
        require(checkElectionPeriod(),"Election has ended");
        require(!checkVoterStatus(msg.sender),"Already Voted Can only voter once");
        candidates[_id].numberOfVotes++;
        voters[msg.sender]=true;
        listOfVoters.push(msg.sender);

    }

    function retrieveVotes() public view returns(Candidate[] memory){
        return candidates;
    }

    //to moniter the election time and return the remaining time of election
    function electionTimer() public view electionOngoing returns (uint){
        if(block.timestamp>=votingEnd){
            return 0;

        }

        return (votingEnd-block.timestamp);
    }

    function resetAllVoterStatus() public onlyOwner{
        for(uint i=0;i<listOfVoters.length;i++){
            voters[listOfVoters[i]]=false;
        }

        delete listOfVoters;
    }

    


}