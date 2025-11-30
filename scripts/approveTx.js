/**
 * approveTx.js - Approve a transaction (ministry voting)
 * 
 * Usage: node scripts/approveTx.js <contract_address> <transaction_id> <ministry>
 * Ministry options: finance, welfare, education, auditor
 * Example: node scripts/approveTx.js 0x... 0x123abc... finance
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

async function approveTransaction(contractAddress, txId, ministryKey) {
  try {
    console.log("\n✅ Approving Transaction on SatyaLedger...\n");
    
    // Get ministry address
    const ministryAddress = MINISTRIES[ministryKey.toLowerCase()];
    if (!ministryAddress) {
      throw new Error("Invalid ministry. Use: finance, welfare, education, or auditor");
    }
    
    // Setup contract
    const SatyaLedger = contract(SatyaLedgerArtifact);
    SatyaLedger.setProvider(web3.currentProvider);
    const instance = await SatyaLedger.at(contractAddress);
    
    console.log("📍 Contract Address:", contractAddress);
    console.log("🆔 Transaction ID:", txId);
    console.log("🏛️  Approving as:", MINISTRY_NAMES[ministryAddress]);
    console.log("   Address:", ministryAddress);
    
    // Check if already voted
    const hasVoted = await instance.hasVoted(txId, ministryAddress);
    if (hasVoted) {
      console.log("\n⚠️  This ministry has already voted for this transaction!");
      process.exit(0);
    }
    
    // Get current transaction status
    console.log("\n📄 Current Status:");
    const txBefore = await instance.getTransaction(txId);
    console.log("   Status:", txBefore.status);
    console.log("   Approvals:", txBefore.approvals.toString(), "/ 3");
    console.log("   Finalized:", txBefore.finalized);
    
    // Approve transaction
    console.log("\n⏳ Submitting approval...");
    const result = await instance.approveTransaction(
      txId,
      { from: ministryAddress, gas: 300000 }
    );
    
    console.log("\n✅ Approval submitted successfully!");
    console.log("⛓️  Block Number:", result.receipt.blockNumber);
    console.log("⛽ Gas Used:", result.receipt.gasUsed);
    
    // Get updated status
    console.log("\n📊 Updated Status:");
    const txAfter = await instance.getTransaction(txId);
    console.log("   Status:", txAfter.status);
    console.log("   Approvals:", txAfter.approvals.toString(), "/ 3");
    console.log("   Finalized:", txAfter.finalized);
    
    // Check voting status
    console.log("\n🗳️  Voting Status:");
    for (const [key, addr] of Object.entries(MINISTRIES)) {
      const voted = await instance.hasVoted(txId, addr);
      const status = voted ? "✅ Approved" : "⏳ Pending";
      console.log(`   ${MINISTRY_NAMES[addr]}: ${status}`);
    }
    
    if (txAfter.finalized) {
      console.log("\n🎉 Transaction is now FINALIZED!");
      console.log("   Quorum of 3 approvals reached!");
    } else {
      const remaining = 3 - parseInt(txAfter.approvals);
      console.log("\n💡 Status: Waiting for", remaining, "more approval(s)");
    }
    
  } catch (error) {
    console.error("\n❌ Approval failed:", error.message);
    process.exit(1);
  }
}

// Parse command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log("\n❌ Usage: node approveTx.js <contract_address> <transaction_id> <ministry>");
    console.log("\nMinistry options: finance, welfare, education, auditor");
    console.log("\nExample:");
    console.log("node scripts/approveTx.js 0x1234... 0xabc123... finance\n");
    process.exit(1);
  }
  
  const [contractAddress, txId, ministry] = args;
  
  approveTransaction(contractAddress, txId, ministry)
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = approveTransaction;
