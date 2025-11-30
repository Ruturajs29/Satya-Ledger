# 🏛️ SatyaLedger: Blockchain-Based Multi-Ministry Consensus System

**Decentralized Transparency for Government Subsidy Management with Unanimous Consensus**

## 📋 Overview

SatyaLedger is a decentralized blockchain-based system designed to revolutionize government subsidy disbursement through transparent, tamper-proof transaction management. The system implements a **unanimous multi-ministry consensus mechanism** where subsidy transactions require approval from **ALL 3 eligible government ministries** (excluding the transaction creator) before finalization.

### Key Features

- ✅ **Unanimous Consensus**: All 3 eligible ministries must approve (creator excluded)
- ✅ **Conflict-free Approval**: Transaction creators cannot vote on their own proposals
- ✅ **Real-time Transparency**: Live voting status and blockchain tracking
- ✅ **Immutable Audit Trail**: Permanent record of all transactions and approvals
- ✅ **Web3 Integration**: Browser-based interface with MetaMask wallet support
- ✅ **Government-grade Security**: Multi-layer cryptographic protection
- ⚙️ **Unanimous Consensus**: All 3 eligible voters must approve (creator excluded)
- 🔒 **Data Privacy**: Only cryptographic hashes stored on-chain, actual data stored off-chain  
- 🧾 **Transparent Verification**: Web portal for receipt verification and status checking
- ⛓️ **Immutable Ledger**: All approvals and transactions permanently recorded on blockchain

## 🏗️ Architecture

### Ministry Roles & Addresses

| Ministry | Role | Voting Rights |
|----------|------|---------------|
| **Welfare Ministry** | Transaction Creator | ❌ Cannot vote on own transactions |
| **Finance Ministry** | Eligible Voter | ✅ Required for unanimous approval |
| **Education Ministry** | Eligible Voter | ✅ Required for unanimous approval |
| **Auditor General** | Eligible Voter | ✅ Required for unanimous approval |

**Note**: Ministry addresses are automatically assigned from your Ganache accounts during deployment.

**Consensus Rule**: ALL 3 eligible voters must approve for transaction approval (3/3 = 100%)

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Blockchain** | Ganache | Latest | Local Ethereum simulation (Port 7545) |
| **Smart Contract** | Solidity | 0.8.19 | Unanimous consensus logic |
| **Network** | Local | Ganache (localhost:7545) | Development blockchain |
| **Framework** | Truffle | v5.11.5 | Compilation, deployment & testing |
| **Web Interface** | HTML5/CSS3/JS + Web3.js | v1.8.0 | Ministry interaction portal |
| **Wallet** | MetaMask | Latest | Ministry account management |
| **Runtime** | Node.js | v22.14.0 | Development environment |

## 📂 Project Structure

```
SatyaLedger/
├── contracts/
│   └── SatyaLedger.sol          # Smart contract (unanimous consensus logic)
├── migrations/
│   └── 1_deploy_contracts.js    # Deployment script with ministry addresses
├── web/
│   ├── index.html               # Create transaction interface
│   ├── approve.html             # Ministry approval dashboard
│   └── verify.html              # Transaction verification portal
├── build/
│   └── contracts/               # Compiled contract artifacts
├── truffle-config.js            # Blockchain configuration
├── package.json                 # Node.js dependencies
├── README.md                    # Complete documentation
├── QUICKSTART.md                # Quick setup guide
└── .gitignore                   # Git ignore patterns
```

## 🚀 Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
   ```bash
   node --version
   ```

2. **Truffle Suite**
   ```bash
   npm install -g truffle
   ```

3. **Ganache** (Desktop or CLI)
   - Download from: https://trufflesuite.com/ganache/
   - Or install CLI: `npm install -g ganache`

4. **MetaMask Browser Extension**
   - Install from: https://metamask.io/

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SatyaLedger
   ```

2. **Install dependencies**
   ```bash
   npm install web3 @truffle/contract @truffle/hdwallet-provider
   ```

3. **Start Ganache**
   - Open Ganache Desktop application
   - Create a new workspace named "SatyaLedger"
   - Ensure it's running on `http://127.0.0.1:7545`
   - Note down the first 4 account addresses

4. **Import Ministry Accounts to MetaMask**
   - Copy private keys from Ganache for the first 4 accounts
   - Import each account into MetaMask
   - Label them: Finance, Welfare, Education, Auditor

5. **Configure MetaMask Network**
   - Network Name: Ganache Local
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

## 🔧 Deployment

### Deploy Smart Contract

Using Truffle:
```bash
truffle compile
truffle migrate --reset
```

**Note**: The contract will deploy to a new address each time you run migration.
All 4 ministry addresses are pre-configured in the deployment script.

## 💻 Usage - Web Interface (Recommended)

### 📋 Quick Start URLs
- **Create Transaction**: http://localhost:8000/index.html
- **Approve Transactions**: http://localhost:8000/approve.html  
- **Verify Status**: http://localhost:8000/verify.html

### 🎯 Complete Workflow

#### Step 1: Start Local Server
```bash
# Using Node.js http-server (recommended)
npx http-server web -p 8000

# Or using Python
python -m http.server 8000
```

#### Step 2: Create Transaction (Welfare Ministry Only)
1. 🔗 Open: http://localhost:8000/index.html
2. 🦊 Switch MetaMask to **Welfare Ministry** account
3. 📝 Fill transaction details:
   - Beneficiary ID: `BEN001`
   - Scheme: `PM-KISAN`  
   - Amount: `5000`
   - Receipt Hash: `abc123hash`
4. 📤 Click "Create Transaction"
5. ✅ Approve MetaMask transaction

#### Step 3: Vote for Approval (3 Eligible Ministries)
1. 🔗 Open: http://localhost:8000/approve.html
2. 🦊 Switch to **Finance Ministry** → Vote "Approve"
3. 🦊 Switch to **Education Ministry** → Vote "Approve"  
4. 🦊 Switch to **Auditor General** → Vote "Approve"
5. 🎉 Transaction automatically approved after 3rd vote!

#### Step 4: Verify Results
1. 🔗 Open: http://localhost:8000/verify.html
2. 📋 Enter transaction ID from Step 2
3. 📊 View complete approval status and details

### 🚫 Important Notes
- **Welfare Ministry** (creator) cannot vote on their own transactions
- **ALL 3 eligible voters** must approve (unanimous consensus)
- Contract address is pre-filled and hidden in UI
- Each ministry can only vote once per transaction

## 🎯 Demo Workflow

### Complete Transaction Lifecycle

1. **Start Ganache**
   ```bash
   # Ensure Ganache is running on port 7545
   ```

2. **Deploy Contract**
   ```bash
   truffle migrate --reset
   # Note the contract address: 0x...
   ```

3. **Create Transaction** (Welfare Ministry)
   ```bash
   node scripts/createTx.js 0x... BEN001 PM-KISAN 5000 abc123
   # Note the transaction ID: 0x...
   ```

4. **First Approval** (Finance Ministry)
   ```bash
   node scripts/approveTx.js 0x... 0x... finance
   # Status: 1/3 approvals
   ```

5. **Second Approval** (Education Ministry)
   ```bash
   node scripts/approveTx.js 0x... 0x... education
   # Status: 2/3 approvals
   ```

6. **Third Approval** (Auditor General)
   ```bash
   node scripts/approveTx.js 0x... 0x... auditor
   # Status: 3/3 approvals - FINALIZED! 🎉
   ```

7. **Verify Transaction**
   ```bash
   node scripts/viewTx.js 0x... 0x...
   # Or use the web interface
   ```

## 📊 Smart Contract Features

### System Specifications
**Compiler Version**: Solidity 0.8.19  
**Consensus Model**: Unanimous (3/3) voting with creator exclusion  
**Deployment**: Local Ganache network (development)

### Core Functions

- **`createTransaction()`** - Create new transaction (Welfare Ministry only)
- **`approveTransaction()`** - Approve pending transaction (3 eligible voters)
- **`getTransaction()`** - Retrieve transaction details and status
- **`hasVoted()`** - Check if ministry has voted on specific transaction
- **`getTransactionCount()`** - Total number of transactions created
- **`isMinistry()`** - Verify if address is authorized ministry
- **`notCreator`** - Modifier preventing creators from voting on own transactions

### Events

- **`TransactionCreated`** - Emitted when Welfare Ministry creates transaction
- **`TransactionApproved`** - Emitted when eligible ministry votes
- **`TransactionFinalized`** - Emitted when 3/3 unanimous approval reached

### Access Control & Security

- ✅ **Creator Exclusion**: Welfare Ministry cannot vote on own transactions
- ✅ **Unanimous Requirement**: ALL 3 eligible voters must approve
- ✅ **One Vote Per Ministry**: Each ministry can only vote once per transaction
- ✅ **Role-based Access**: Only authorized addresses can interact
- ✅ **Automatic Finalization**: Transaction approved when 3/3 votes reached

## 🔒 Privacy & Security

### Data Storage Strategy

**On-Chain (Public Blockchain):**
- Transaction ID (bytes32)
- Receipt hash (SHA-256)
- Approval counts and voting status
- Transaction status (Pending/Approved)

**Off-Chain (Local Storage):**
- Beneficiary personal details
- Complete receipt information
- Bank account details
- Document scans

### Security Features

- ✅ Role-based access control
- ✅ One vote per ministry per transaction
- ✅ Immutable approval records
- ✅ Event logging for transparency
- ✅ Hash-based verification

## 📚 API Reference

### Contract ABI (Key Functions)

```javascript
// Create Transaction
createTransaction(
  beneficiaryId: string,
  schemeName: string,
  amount: uint256,
  receiptHash: string
) returns (bytes32 txId)

// Approve Transaction
approveTransaction(txId: bytes32)

// Get Transaction
getTransaction(txId: bytes32) returns (
  schemeName: string,
  beneficiaryId: string,
  receiptHash: string,
  amount: uint256,
  approvals: uint8,
  finalized: bool,
  status: string,
  createdBy: address,
  timestamp: uint256
)

// Check Vote Status
hasVoted(txId: bytes32, ministry: address) returns (bool)
``