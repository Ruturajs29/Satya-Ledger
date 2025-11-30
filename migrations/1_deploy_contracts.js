const SatyaLedger = artifacts.require("SatyaLedger");

module.exports = function (deployer, network, accounts) {
  console.log("\n=== Debugging Deployment ===");
  console.log("Network:", network);
  console.log("Total accounts available:", accounts.length);
  
  // Ensure we have enough accounts
  if (accounts.length < 4) {
    throw new Error("Need at least 4 accounts. Please check your Ganache configuration.");
  }

  const financeMinistry = accounts[0];
  const welfareMinistry = accounts[1];
  const educationMinistry = accounts[2];
  const auditorGeneral = accounts[3];

  console.log("\n🔍 Account Details:");
  console.log("Finance Ministry:    ", financeMinistry);
  console.log("Welfare Ministry:    ", welfareMinistry);
  console.log("Education Ministry:  ", educationMinistry);
  console.log("Auditor General:     ", auditorGeneral);
  
  // Check for zero addresses
  console.log("\n🔍 Zero Address Checks:");
  console.log("Finance is zero?    ", financeMinistry === "0x0000000000000000000000000000000000000000");
  console.log("Welfare is zero?    ", welfareMinistry === "0x0000000000000000000000000000000000000000");
  console.log("Education is zero?  ", educationMinistry === "0x0000000000000000000000000000000000000000");
  console.log("Auditor is zero?    ", auditorGeneral === "0x0000000000000000000000000000000000000000");
  
  // Check for duplicates
  console.log("\n🔍 Uniqueness Checks:");
  console.log("Finance == Welfare?   ", financeMinistry === welfareMinistry);
  console.log("Finance == Education? ", financeMinistry === educationMinistry);
  console.log("Finance == Auditor?   ", financeMinistry === auditorGeneral);
  console.log("Welfare == Education? ", welfareMinistry === educationMinistry);
  console.log("Welfare == Auditor?   ", welfareMinistry === auditorGeneral);
  console.log("Education == Auditor? ", educationMinistry === auditorGeneral);
  
  const uniqueAddresses = new Set([financeMinistry, welfareMinistry, educationMinistry, auditorGeneral]);
  console.log("Unique count:", uniqueAddresses.size, "(should be 4)");

  if (uniqueAddresses.size !== 4) {
    throw new Error("Ministry addresses must be unique!");
  }

  console.log("\n🚀 Attempting deployment...\n");

  return deployer.deploy(
    SatyaLedger,
    financeMinistry,
    welfareMinistry,
    educationMinistry,
    auditorGeneral
  ).then(() => {
    console.log("\n✅ SatyaLedger deployed successfully!");
    console.log("📍 Contract Address:", SatyaLedger.address);
  }).catch(error => {
    console.error("\n❌ Deployment failed with error:");
    console.error(error);
    throw error;
  });
};