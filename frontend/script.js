const connectWalletMsg = document.querySelector('#connectWalletMessage');
const connectWalletBtn = document.querySelector('#connectWallet');
const votingStation = document.querySelector('#votingStation');
const timerTime = document.querySelector('#timer');
const timerMessage = document.querySelector('#timerMessage');
const mainBoard = document.querySelector('#mainBoard');
const voteForm = document.querySelector('#voteForm');
const vote = document.querySelector('#vote');
const voteBtn = document.querySelector('#sendVote');
const showResultContainer = document.querySelector('#showResultContainer');
const showResult = document.querySelector('#showResult');
const result = document.querySelector('#result');
const admin = document.querySelector('#admin');
const candidates = document.querySelector('#candidates');
const electionDuration = document.querySelector('#electionDuration');
const startAnElection = document.querySelector('#startAnElection');
const candidate = document.querySelector('#candidate');
const addTheCandidate = document.querySelector('#addTheCandidate');


const contractAddress="0x9e948Bd59224ebEb8E61D6AAC4D0b08742e05FD0";
const contractABI=  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "numberOfVotes",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "checkElectionPeriod",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_voter",
          "type": "address"
        }
      ],
      "name": "checkVoterStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "electionStarted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "electionTimer",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "listOfVoters",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetAllVoterStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "retrieveVotes",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "numberOfVotes",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidates",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_votingDuration",
          "type": "uint256"
        }
      ],
      "name": "startElection",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "voteTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  let signer, contract;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  window.ethereum.request({ method: 'eth_requestAccounts' })
    .then((accounts) => {
      signer = provider.getSigner(accounts[0]);
      contract = new ethers.Contract(contractAddress, contractABI, signer);
    })
    .catch((error) => {
      console.error('Error connecting to MetaMask:', error);
    });
  
  //functions

  const getAllCandidates = async () => {
    if (document.getElementById("candidateBoard")) {
      document.getElementById("candidateBoard").remove();
    }
  
    let board = document.createElement("table");
    board.id = "candidateBoard";
    mainBoard.appendChild(board);
  
    let tableHeader = document.createElement("tr");
    tableHeader.innerHTML = `<th>ID NO.</th>
                          <th>Candidates</th>`;
    board.appendChild(tableHeader);
  
    let candidates = await contract.retrieveVotes();
    for (let i = 0; i < candidates.length; i++) {
      let candidateRow = document.createElement("tr");
      candidateRow.innerHTML = `<td>${parseInt(candidates[i].id)}</td>
                              <td>${candidates[i].name}</td>`;
      board.appendChild(candidateRow);
    }
  };
  

  const getResult = async () => {
    result.style.display = "flex";

    if (document.getElementById("resultBoard")) {
        document.getElementById("resultBoard").remove(); 
    }
    let resultBoard = document.createElement("table");
    resultBoard.id = "resultBoard";
    result.appendChild(resultBoard);

    let tableHeader = document.createElement("tr");
    tableHeader.innerHTML = `<th>ID NO.</th>
                        <th>Candidates</th>
                        <th>Number Of Votes </th>`;
    resultBoard.appendChild(tableHeader);

    let candidates = await contract.retrieveVotes();
    for (let i = 0; i < candidates.length; i++) {
        let candidate = document.createElement("tr");
        candidate.innerHTML = `<td>${parseInt(candidates[i][0])}</td>
                            <td>${candidates[i][1]} </td>
                            <td>${parseInt(candidates[i][2])}</td> `;
        resultBoard.appendChild(candidate);
    }
}


  const refreshPage= ()=>{
    //check status of election every second
    setInterval( async ()=>{
        let time=await contract.electionTimer();

        if(time>0){
            timerMessage.innerHTML=`<span id="time">${time} </span>seconds left`;
            voteForm.style.display='flex';
            showResultContainer.style.display='none';
        }else{
            timerMessage.innerHTML="Either there is no election or the election has ended";
            voteForm.style.display='none';
            showResultContainer.style.display='block';
        }

    },1000);

    //get details of all candidates every 10 sec
    setInterval(async ()=>{
        getAllCandidates();
    },10000);
  }

  const sendVote = async ()=>{
     await contract.voteTo(vote.value);
     vote.value="";
  }

  const startElection=async ()=>{
    if(!candidates.value){
        alert("list of candidates is empty");
    }

    if(!electionDuration.value){
        alert("please set the elction duration");
    }

    const _candidates=candidates.value.split(",");
    const _votingDuration=electionDuration.value;

    await contract.startElection(_candidates,_votingDuration);
    refreshPage();

    candidates.value="";
    electionDuration.value="";

    voteForm.style.display='flex';
    showResultContainer.style.display='none';

     
  }

  const addCandidate=async ()=>{
    if(!candidate.value){
        alert("please first rpovide name of the candidate");

    }
    await contract.addCandidate(candidate.value);
    refreshPage();
    candidate.value="";

  }

  const getAccount = async () => {
    try {
        const ethAccounts = await provider.send("eth_requestAccounts", []);
        const accounts = await provider.listAccounts();
        signer = provider.getSigner(accounts[0]);
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        connectWalletBtn.textContent = signer._address.slice(0, 10) + "...";
        connectWalletMsg.textContent = "You are Connected... ";
        connectWalletBtn.disabled = true;

        let owner = await contract.owner();
        if (owner == signer._address) {
            admin.style.display = 'block';
            let time = await contract.electionTimer();
            if (time == 0) {
                await contract.checkElectionPeriod();
            }
        }

        votingStation.style.display = 'block';
        refreshPage();
        getAllCandidates();
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        connectWalletMsg.textContent = "Error connecting to MetaMask. Please try again.";
    }
};



  connectWalletBtn.addEventListener('click',getAccount);
  showResult.addEventListener('click',getResult);
  voteBtn.addEventListener('click',sendVote);
  addTheCandidate.addEventListener('click',addCandidate);
  startAnElection.addEventListener('click',startElection);


