/**
 * createTx.js - Create a new transaction
 * 
 * Usage: node scripts/createTx.js <contract_address> <beneficiary_id> <scheme_name> <amount> <receipt_hash>
 * Example: node scripts/createTx.js 0x... BEN001 "PM-KISAN" 5000 abc123hash
 */

const Web3 = require('web3');
const contract = require('@truffle/contract');
const SatyaLedgerArtifact = require('../build/contracts/SatyaLedger.json');
const crypto = require('crypto');

// Connect to Ganache
const web3 = new Web3('http://127.0.0.1:7545');

// Welfare Ministry address (transaction creator)
const WELFARE_MINISTRY = "0xb2eA23Ad706B701a359aDc5DAC5A7E7a8FEe96b0";

async function createTransaction(contractAddress, beneficiaryId, schemeName, amount, receiptHash) {
  try {
    console.log("\n📝 Creating Transaction on SatyaLedger...\n");
    
    // Setup contract
    const SatyaLedger = contract(SatyaLedgerArtifact);
    SatyaLedger.setProvider(web3.currentProvider);
    const instance = await SatyaLedger.at(contractAddress);
    
    console.log("📍 Contract Address:", contractAddress);
    console.log("🏛️  Creating as: Welfare Ministry");
    console.log("   Address:", WELFARE_MINISTRY);
    
    console.log("\n📄 Transaction Details:");
    console.log("   Beneficiary ID:", beneficiaryId);
    console.log("   Scheme:", schemeName);
    console.log("   Amount:", amount, "INR");
    console.log("   Receipt Hash:", receiptHash);
    
    // Create transaction
    console.log("\n⏳ Submitting to blockchain...");
    const result = await instance.createTransaction(
      beneficiaryId,
      schemeName,
      amount,
      receiptHash,
      { from: WELFARE_MINISTRY, gas: 500000 }
    );
    
    // Get transaction ID from event
    const txId = result.logs[0].args.txId;
    console.log("\n✅ Transaction created successfully!");
    console.log("🆔 Transaction ID:", txId);
    console.log("⛓️  Block Number:", result.receipt.blockNumber);
    console.log("⛽ Gas Used:", result.receipt.gasUsed);
    
    // Get transaction details
    console.log("\n🔍 Transaction Status:");
    const txDetails = await instance.getTransaction(txId);
    console.log("   Status:", txDetails.status);
    console.log("   Approvals:", txDetails.approvals.toString(), "/ 3");
    console.log("   Finalized:", txDetails.finalized);
    
    console.log("\n💡 Next Steps:");
    console.log("   Run approveTx.js to approve this transaction");
    console.log("   Transaction ID:", txId);
    
    return txId;
    
  } catch (error) {
    console.error("\n❌ Transaction creation failed:", error.message);
    process.exit(1);
  }
}

// Parse command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 5) {
    console.log("\n❌ Usage: node createTx.js <contract_address> <beneficiary_id> <scheme_name> <amount> <receipt_hash>");
    console.log("\nExample:");
    console.log("node scripts/createTx.js 0x1234... BEN001 PM-KISAN 5000 abc123hash\n");
    process.exit(1);
  }
  
  const [contractAddress, beneficiaryId, schemeName, amount, receiptHash] = args;
  
  createTransaction(contractAddress, beneficiaryId, schemeName, parseInt(amount), receiptHash)
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = createTransaction;
