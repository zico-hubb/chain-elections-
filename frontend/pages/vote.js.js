import { useEffect, useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address if it changes

const abi = [
  "function vote(uint256 _candidateIndex) public",
  "function candidates(uint256) view returns (string memory, uint256)",
  "function getNumCandidates() view returns (uint256)"
];

const VOTE_DEADLINE = new Date("2025-07-05T18:00:00Z");

export default function VotePage() {
  const [candidates, setCandidates] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("🦊 Please install MetaMask.");
      return;
    }
    try {
      const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(address);
      setStatus("");
    } catch (err) {
      setStatus("⚠️ Wallet connection failed.");
    }
  };

  // Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = VOTE_DEADLINE - now;
      if (diff <= 0) {
        setTimeLeft("Voting has ended.");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch candidates from the smart contract
  useEffect(() => {
    const loadCandidates = async () => {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const count = await contract.getNumCandidates();
        const fetched = [];
        for (let i = 0; i < count; i++) {
          const [name, votes] = await contract.candidates(i);
          fetched.push(name);
        }
        setCandidates(fetched);
      } catch (err) {
        console.error("Error loading candidates:", err);
      }
    };
    loadCandidates();
  }, []);

  const vote = async (index) => {
    if (!window.ethereum) return;
    setStatus("Submitting vote...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.vote(index);
      await tx.wait();

      setStatus("✅ Vote submitted!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Error submitting vote.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🗳️ Vote for Student Leader</h1>
        <button onClick={connectWallet} className="bg-blue-600 px-4 py-2 rounded">
          {wallet ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>

      <p className="text-yellow-400 mb-4">⏳ Voting ends in: {timeLeft}</p>

      <ul className="space-y-4">
        {candidates.map((name, index) => (
          <li key={index} className="bg-gray-800 p-4 rounded shadow flex justify-between items-center">
            <span>{name}</span>
            <button
              onClick={() => vote(index)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Vote
            </button>
          </li>
        ))}
      </ul>

      status && <div className="mt-6 text-lg">{status}</div>}
    </div>
  );
}


      