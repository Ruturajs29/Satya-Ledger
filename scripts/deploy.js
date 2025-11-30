/**
 * deploy.js - Deploy SatyaLedger contract to Ganache
 * 
 * Usage: node scripts/deploy.js
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

async function deploy() {
  try {
    console.log("\n🚀 Starting SatyaLedger Deployment...\n");
    
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    console.log("📋 Available accounts:", accounts.length);
    console.log("💼 Deploying from:", accounts[0]);
    
    // Setup contract
    const SatyaLedger = contract(SatyaLedgerArtifact);
    SatyaLedger.setProvider(web3.currentProvider);
    
    console.log("\n🏛️  Ministry Addresses:");
    console.log("   Finance Ministry:", MINISTRIES.finance);
    console.log("   Welfare Ministry:", MINISTRIES.welfare);
    console.log("   Education Ministry:", MINISTRIES.education);
    console.log("   Auditor General:", MINISTRIES.auditor);
    
    // Deploy contract
    console.log("\n📝 Deploying contract...");
    const instance = await SatyaLedger.new(
      MINISTRIES.finance,
      MINISTRIES.welfare,
      MINISTRIES.education,
      MINISTRIES.auditor,
      { from: accounts[0], gas: 6721975 }
    );
    
    console.log("\n✅ SatyaLedger deployed successfully!");
    console.log("📍 Contract Address:", instance.address);
    console.log("\n💡 Save this address for interaction scripts!");
    
    // Verify deployment
    const ministries = await instance.getMinistries();
    console.log("\n🔍 Verification:");
    console.log("   Finance:", ministries.finance);
    console.log("   Welfare:", ministries.welfare);
    console.log("   Education:", ministries.education);
    console.log("   Auditor:", ministries.auditor);
    
    return instance.address;
    
  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deploy()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = deploy;
