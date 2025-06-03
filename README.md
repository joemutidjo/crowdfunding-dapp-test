
# Crowdfund DApp

A decentralized crowdfunding application built with Solidity, Hardhat, and React (Vite), deployed on the Ethereum Sepolia testnet.

## 🚀 Project Overview

This DApp allows users to contribute ETH to a crowdfunding campaign. If the campaign reaches its goal by the deadline, the contract owner can withdraw the funds. Otherwise, contributors can request refunds.

### 🔧 Tech Stack

- **Smart Contract:** Solidity
- **Testing & Deployment:** Hardhat, Mocha/Chai
- **Frontend:** React + Vite
- **Wallet Integration:** MetaMask
- **Network:** Ethereum Sepolia Testnet

## 🧠 Smart Contract Details

- `contribute()`: Accepts ETH contributions
- `withdraw()`: Allows owner to withdraw funds if goal is met and deadline passed
- `getRefund()`: Allows contributors to reclaim their ETH if the goal is not met
- `goal`: Public getter for goal in wei
- `totalRaised`: Public getter for total amount raised
- `deadline`: Public getter for campaign end time (UNIX timestamp)

### Campaign Configuration

- **Goal:** 5 ETH
- **Deadline:** November 30, 2025 at 6:39 PM EST

## 🧪 Running Tests

Test suite validates:

- Accepting and rejecting contributions
- Enforcing the deadline
- Withdrawal logic
- Refund logic

```bash
npx hardhat test
```

All tests are written in `Crowdfund.test.js` using Mocha + Chai.

## 🌐 Frontend

The React frontend includes:

- Wallet connection via MetaMask
- Display of funding stats and deadline countdown
- Contribution button (0.01 ETH per click)
- UI feedback on transaction completion

### Run Locally

```bash
cd frontend/crowd-ui
npm install
npm run dev
```

Make sure you're connected to the Sepolia network in MetaMask.

## 📋 QA Checklist

- [x] Wallet connects on supported browser (MetaMask on desktop)
- [x] Prevents contributions after deadline
- [x] Allows refund if goal is not met
- [x] Allows owner withdrawal if goal is met
- [x] UI shows accurate goal, raised amount, and countdown
- [x] Buttons respond to user interaction and trigger transactions

## 📖 Technical Overview (also in-app)

- Smart contract built in Solidity and tested with Hardhat
- Interacts with Sepolia via Alchemy RPC
- React UI with dynamic stats and MetaMask integration
- All key functions are manually testable in Remix or Postman
- Verified via unit tests using Hardhat's local EVM

---

For demo access or technical questions, contact Joseph Mutidjo.
