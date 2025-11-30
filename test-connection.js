const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545');

async function testConnection() {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log('✅ Connected to Ganache successfully!');
    console.log('Available accounts:', accounts.length);
    console.log('\nFirst 4 accounts (for ministries):');
    accounts.slice(0, 4).forEach((acc, i) => {
      const names = ['Finance Ministry', 'Welfare Ministry', 'Education Ministry', 'Auditor General'];
      console.log(`  ${names[i].padEnd(20)}: ${acc}`);
    });
    
    const networkId = await web3.eth.net.getId();
    console.log('\nNetwork ID:', networkId);
    
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Current Block:', blockNumber);
    
  } catch (error) {
    console.error('❌ Cannot connect to Ganache on port 7545');
    console.error('Error:', error.message);
    console.error('\n⚠️  Please ensure:');
    console.error('   1. Ganache is running');
    console.error('   2. Ganache is listening on port 7545');
    console.error('   3. No firewall is blocking the connection');
    process.exit(1);
  }
}

testConnection();
