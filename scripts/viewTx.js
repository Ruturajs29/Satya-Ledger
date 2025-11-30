/**
 * viewTx.js - View transaction details
 * 
 * Usage: node scripts/viewTx.js <contract_address> <transaction_id>
 * Example: node scripts/viewTx.js 0x... 0x123abc...
 */

const Web3 = require('web3');
const contract = require('@truffle/contract');
const SatyaLedgerArtifact = require('../build/contracts/SatyaLedger.json');

// Connect to Ganache
const web3 = new Web3('http://127.0.0.1:7545');

// Ministry addresses
const MINISTRIES = {
  finance: "0xdeF7c520781D097D23f20563111C266630e8Fe7f",
  welfare: "0xb2eA23Ad706B701a359aDc5DAC5A7E7a8FEe96b0",
  education: "0x76F52BE2B49cc3466897865fa488dCa8B5cBa33b",
  auditor: "0xE7C431244397bc4DB389806d4931e16B978fC23F"
};

const MINISTRY_NAMES = {
  [MINISTRIES.finance]: "Finance Ministry",
  [MINISTRIES.welfare]: "Welfare Ministry",
  [MINISTRIES.education]: "Education Ministry",
  [MINISTRIES.auditor]: "Auditor General"
};

async function viewTransaction(contractAddress, txId) {
  try {
    console.log("\n🔍 Viewing Transaction Details...\n");
    
    // Setup contract
    const SatyaLedger = contract(SatyaLedgerArtifact);
    SatyaLedger.setProvider(web3.currentProvider);
    const instance = await SatyaLedger.at(contractAddress);
    
    console.log("📍 Contract Address:", contractAddress);
    console.log("🆔 Transaction ID:", txId);
    
    // Get transaction details
    const tx = await instance.getTransaction(txId);
    
    console.log("\n" + "=".repeat(60));
    console.log("📄 TRANSACTION DETAILS");
    console.log("=".repeat(60));
    
    console.log("\n📋 Basic Information:");
    console.log("   Beneficiary ID:", tx.beneficiaryId);
    console.log("   Scheme Name:", tx.schemeName);
    console.log("   Amount:", web3.utils.fromWei(tx.amount.toString(), 'wei'), "INR");
    console.log("   Receipt Hash:", tx.receiptHash);
    
    console.log("\n👤 Creator:");
    console.log("   Address:", tx.createdBy);
    console.log("   Ministry:", MINISTRY_NAMES[tx.createdBy] || "Unknown");
    
    console.log("\n📅 Timestamp:");
    const date = new Date(tx.timestamp.toNumber() * 1000);
    console.log("   Created:", date.toLocaleString());
    
    console.log("\n📊 Status:");
    console.log("   Current Status:", tx.status);
    console.log("   Approvals:", tx.approvals.toString(), "/ 3");
    console.log("   Finalized:", tx.finalized ? "Yes ✅" : "No ⏳");
    
    console.log("\n🗳️  Voting Details:");
    for (const [key, addr] of Object.entries(MINISTRIES)) {
      const voted = await instance.hasVoted(txId, addr);
      const status = voted ? "✅ Approved" : "⏳ Pending";
      console.log(`   ${MINISTRY_NAMES[addr].padEnd(25)} ${status}`);
    }
    
    // Progress bar
    const approvals = parseInt(tx.approvals);
    const progress = "█".repeat(approvals) + "░".repeat(3 - approvals);
    console.log("\n📈 Progress:");
    console.log(`   ${progress} ${approvals}/3 approvals`);
    
    if (tx.finalized) {
      console.log("\n🎉 Status: TRANSACTION FINALIZED");
      console.log("   ✅ Quorum reached - Transaction approved by consensus");
    } else {
      const remaining = 3 - approvals;
      console.log("\n⏳ Status: WAITING FOR APPROVALS");
      console.log(`   Need ${remaining} more approval(s) to finalize`);
    }
    
    console.log("\n" + "=".repeat(60));
    
  } catch (error) {
    console.error("\n❌ Failed to retrieve transaction:", error.message);
    process.exit(1);
  }
}

async function viewAllTransactions(contractAddress) {
  try {
    console.log("\n📚 Viewing All Transactions...\n");
    
    // Setup contract
    const SatyaLedger = contract(SatyaLedgerArtifact);
    SatyaLedger.setProvider(web3.currentProvider);
    const instance = await SatyaLedger.at(contractAddress);
    
    console.log("📍 Contract Address:", contractAddress);
    
    const count = await instance.getTransactionCount();
    console.log("📊 Total Transactions:", count.toString());
    
    if (count.toNumber() === 0) {
      console.log("\n⚠️  No transactions found");
      return;
    }
    
    console.log("\n" + "=".repeat(80));
    
    for (let i = 0; i < count; i++) {
      const txId = await instance.getTransactionIdByIndex(i);
      const tx = await instance.getTransaction(txId);
      
      console.log(`\n#${i + 1} Transaction ID: ${txId}`);
      console.log("─".repeat(80));
      console.log(`   Scheme: ${tx.schemeName}`);
      console.log(`   Beneficiary: ${tx.beneficiaryId}`);
      console.log(`   Amount: ${web3.utils.fromWei(tx.amount.toString(), 'wei')} INR`);
      console.log(`   Status: ${tx.status} | Approvals: ${tx.approvals}/3 | Finalized: ${tx.finalized ? "✅" : "⏳"}`);
    }
    
    console.log("\n" + "=".repeat(80));
    
  } catch (error) {
    console.error("\n❌ Failed to retrieve transactions:", error.message);
    process.exit(1);
  }
}

// Parse command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log("\n❌ Usage: node viewTx.js <contract_address> [transaction_id]");
    console.log("\nExamples:");
    console.log("View specific transaction: node scripts/viewTx.js 0x1234... 0xabc123...");
    console.log("View all transactions:     node scripts/viewTx.js 0x1234...\n");
    process.exit(1);
  }
  
  const [contractAddress, txId] = args;
  
  if (txId) {
    viewTransaction(contractAddress, txId)
      .then(() => process.exit(0))
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
  } else {
    viewAllTransactions(contractAddress)
      .then(() => process.exit(0))
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
  }
}

module.exports = { viewTransaction, viewAllTransactions };
