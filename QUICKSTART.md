# 🚀 SatyaLedger Quick Start Guide

**Get up and running in 5 minutes!**

---

## 📋 Prerequisites

- ✅ Node.js v22.14.0+ installed
- ✅ MetaMask browser extension
- ✅ Ganache Desktop or CLI

---

## 🏁 5-Minute Setup

### 1️⃣ Install Dependencies
```powershell
cd SatyaLedger
npm install
```

### 2️⃣ Start Ganache Blockchain
- **Launch Ganache Desktop**
- **Create New Workspace**: Name it "SatyaLedger"
- **Verify Settings**:
  - Port: `7545`
  - Network ID: `5777`
  - Accounts: 10 (default)

### 3️⃣ Configure MetaMask Network
**Add Custom Network:**
```
Network Name: SatyaLedger Local
RPC URL: http://127.0.0.1:7545
Chain ID: 5777
Currency Symbol: ETH
```

### 4️⃣ Import Ministry Accounts
**Copy private keys from Ganache (first 4 accounts) and import to MetaMask:**

| Ministry | Ganache Account | Role |
|----------|---------|------|
| **Finance** | Account 0 | Voter 1/3 ✅ |
| **Welfare** | Account 1 | Creator (No voting) 🚫 |
| **Education** | Account 2 | Voter 2/3 ✅ |
| **Auditor** | Account 3 | Voter 3/3 ✅ |

**Note**: Import the private keys from these accounts into MetaMask and label them appropriately.

### 5️⃣ Deploy Smart Contract
```powershell
truffle compile
truffle migrate --reset
```

⚠️ **Important**: Copy the contract address from deployment output - you'll need it for the web interface.

🔒 **Security Note**: Never commit private keys to version control. This project uses Ganache test accounts only.

### 6️⃣ Launch Web Interface
```powershell
# Quick server start
npx http-server web -p 8000

# OR Node.js server
node -e "require('http').createServer((req,res)=>{require('fs').createReadStream(require('path').join(__dirname,'web',req.url==='/'?'index.html':req.url.slice(1))).pipe(res)}).listen(8000)"
```

**Access URLs:**
- 📝 **Create**: http://localhost:8000/index.html
- ✅ **Approve**: http://localhost:8000/approve.html
- 🔍 **Verify**: http://localhost:8000/verify.html

---

## 🎯 Demo Transaction (2 Minutes)

### Step 1: Create Transaction
1. **Open**: http://localhost:8000/index.html
2. **Enter**: Contract address from deployment step
3. **Connect**: MetaMask with **Welfare Ministry** account
4. **Fill Form**:
   ```
   Beneficiary ID: BEN001
   Scheme: PM-KISAN
   Amount: 6000
   Ministry: Agriculture
   ```
5. **Submit** and **copy Transaction ID**

### Step 2: Approve as Finance Ministry
1. **Switch**: MetaMask to **Finance Ministry** account
2. **Open**: http://localhost:8000/approve.html
3. **Paste**: Transaction ID
4. **Click**: "Load Transaction Details"
5. **Click**: "Approve Transaction" → **Confirm in MetaMask**
6. **Status**: 1/3 approvals ✅

### Step 3: Approve as Education Ministry
1. **Switch**: MetaMask to **Education Ministry** account
2. **Refresh**: approve.html page
3. **Click**: "Approve Transaction" → **Confirm**
4. **Status**: 2/3 approvals ✅

### Step 4: Final Approval (Auditor General)
1. **Switch**: MetaMask to **Auditor General** account
2. **Refresh**: approve.html page
3. **Click**: "Approve Transaction" → **Confirm**
4. **Result**: 🎉 **UNANIMOUS CONSENSUS ACHIEVED!**
5. **Status**: Transaction **FINALIZED** ✅

### Step 5: Verify Final Result
1. **Open**: http://localhost:8000/verify.html
2. **Enter**: Transaction ID
3. **View**: Complete transaction details and voting history
4. **Confirm**: Status shows "✅ APPROVED (Unanimous - All 3 Eligible)"

---

## 🔧 Key System Features

### Unanimous Consensus System
```
Total Ministries: 4
├── Welfare Ministry: Creator (CANNOT VOTE) 🚫
├── Finance Ministry: Required Voter ✅
├── Education Ministry: Required Voter ✅
└── Auditor General: Required Voter ✅

Consensus: ALL 3 eligible voters must approve (100%)
```

### Smart Contract Features
- ✅ **Creator Exclusion**: Welfare Ministry cannot vote on own transactions
- ✅ **Double Vote Prevention**: Each ministry votes only once
- ✅ **Automatic Finalization**: Consensus triggers immediate completion
- ✅ **Immutable Records**: All actions permanently stored on blockchain

---

## 📱 Interface Guide

### Create Transaction (index.html)
**Purpose**: Welfare Ministry creates subsidy transactions
**Features**:
- Pre-configured contract address (hidden)
- Government scheme dropdown
- Automatic transaction ID generation
- MetaMask integration for secure signing

### Approve Transaction (approve.html)
**Purpose**: Ministry voting dashboard
**Features**:
- Real-time voting status for all ministries
- Progress bar (X/3 approvals)
- Ministry role identification
- Automatic button state management
- Creator exclusion enforcement

### Verify Transaction (verify.html)
**Purpose**: Public audit trail viewing
**Features**:
- Complete transaction details
- Voting history for all ministries
- Status verification (Pending/Approved)
- Transparent audit information

---

## ⚡ Quick Commands

| Action | Command |
|--------|----------|
| **Compile** | `truffle compile` |
| **Deploy** | `truffle migrate --reset` |
| **Start Web** | `npx http-server web -p 8000` |
| **Check Status** | Open http://localhost:8000/verify.html |
| **Reset Demo** | Delete transaction ID and create new |

---

## 🆘 Quick Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| **Web3 Error** | Ensure Ganache is running on port 7545 |
| **Wrong Network** | Switch MetaMask to "SatyaLedger Local" |
| **Cannot Vote** | Check if you're using creator account (Welfare) |
| **Already Voted** | Each ministry can vote only once |
| **No Balance** | Ganache accounts have 100 ETH by default |
| **Page Won't Load** | Start server: `npx http-server web -p 8000` |

---

## ✅ Success Checklist

**Setup Complete:**
- [ ] Ganache running on port 7545 ✅
- [ ] MetaMask configured with custom network ✅
- [ ] 4 ministry accounts imported ✅
- [ ] Smart contract deployed successfully ✅
- [ ] Web server running on port 8000 ✅

**Demo Successful:**
- [ ] Transaction created by Welfare Ministry ✅
- [ ] Finance Ministry approved (1/3) ✅
- [ ] Education Ministry approved (2/3) ✅
- [ ] Auditor General approved (3/3) ✅
- [ ] Transaction shows "UNANIMOUS CONSENSUS" ✅
- [ ] Final status: "APPROVED" ✅

---

## 📖 Next Steps

1. **Read Full Documentation**: See [README.md](README.md)
2. **Explore Research**: Check [RESEARCH_PAPER.md](RESEARCH_PAPER.md)
3. **Experiment**: Create multiple transactions
4. **Customize**: Modify schemes and amounts
5. **Deploy**: Consider testnet deployment for production

---

## 🎉 Congratulations!

You've successfully set up **SatyaLedger** - a blockchain-based transparent government subsidy system with unanimous multi-ministry consensus! 

**What you've achieved:**
- ✅ Deployed a secure smart contract system
- ✅ Configured multi-ministry blockchain governance
- ✅ Implemented conflict-free approval mechanism
- ✅ Created transparent audit trails
- ✅ Demonstrated real-world e-governance application

**Happy Blockchain Governance! 🏛️⛓️**
