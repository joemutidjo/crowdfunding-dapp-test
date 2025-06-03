import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getCrowdfundContract } from "./CrowdfundInterface";

function App() {
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [goal, setGoal] = useState("...");
  const [raised, setRaised] = useState("...");
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    if (wallet) {
      async function setup() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const c = getCrowdfundContract(signer);
        setContract(c);
      }
      setup();
    }
  }, [wallet]);

  async function connectWallet() {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setWallet(signer);
      const c = getCrowdfundContract(signer);
      setContract(c);
      refreshStats(c);
    } else {
      alert("Please install MetaMask to use this app.");
    }
  }

  async function contribute() {
    try {
      const tx = await contract.contribute({ value: ethers.parseEther("0.01") });
      await tx.wait();
      alert("Contribution sent!");
      refreshStats();
    } catch (err) {
      alert("Contribution failed: " + err.message);
    }
  }

  async function withdraw() {
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      alert("Funds withdrawn!");
      refreshStats();
    } catch (err) {
      alert("Withdraw failed: " + err.message);
    }
  }

  async function claimRefund() {
    try {
      const tx = await contract.getRefund();
      await tx.wait();
      alert("Refund claimed!");
      refreshStats();
    } catch (err) {
      alert("Refund failed: " + err.message);
    }
  }

  async function refreshStats(c = contract) {
    try {
      const goal = await c.goal();
      const raised = await c.totalRaised();
      const dl = await c.deadline();
      setGoal(ethers.formatEther(goal));
      setRaised(ethers.formatEther(raised));
      setDeadline(Number(dl));
    } catch (err) {
      alert("Failed to fetch stats: " + err.message);
    }
  }

  function formatCountdown(secondsLeft) {
    const d = Math.floor(secondsLeft / (60 * 60 * 24));
    const h = Math.floor((secondsLeft % (60 * 60 * 24)) / 3600);
    const m = Math.floor((secondsLeft % 3600) / 60);
    const s = secondsLeft % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  }

  const secondsRemaining = deadline ? Math.max(0, deadline - Math.floor(Date.now() / 1000)) : null;
  const estDeadline = deadline
    ? new Date(deadline * 1000).toLocaleString("en-US", { timeZone: "America/Jamaica" })
    : null;

  const buttonStyle = {
    padding: "10px 20px",
    margin: "8px 0",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 5 }}>Crowdfund DApp</h1>
      <h3 style={{ marginTop: 0, marginBottom: 20, color: "#555" }}>
        Raising 5 ETH for Kingston's homeless!
      </h3>

      <div style={{ marginBottom: 20, backgroundColor: "#fff3cd", padding: 10, borderRadius: 6 }}>
        <strong>Note:</strong> Please use a desktop browser with the MetaMask extension installed,<br />
        and make sure your wallet is connected to the <strong>Sepolia test network</strong>.
      </div>

      <button onClick={connectWallet} style={buttonStyle}>Connect Wallet</button>
      <br /><br />

      {wallet && (
        <>
          <button onClick={contribute} style={buttonStyle}>Contribute 0.01 ETH</button>
          <br />
          <button onClick={() => refreshStats()} style={buttonStyle}>Refresh Stats</button>

          <p><strong>Goal:</strong> {goal} ETH</p>
          <p><strong>Raised:</strong> {raised} ETH</p>

          {deadline && (
            <>
              <p><strong>Deadline (EST):</strong> {estDeadline}</p>
              <p><strong>⏳ Ends in:</strong> {formatCountdown(secondsRemaining)}</p>
            </>
          )}

          <br />
          <button onClick={withdraw} style={buttonStyle}>Withdraw (owner only)</button>
          <br />
          <button onClick={claimRefund} style={buttonStyle}>Claim Refund</button>
        </>
      )}
    </div>
  );
}

export default App;
