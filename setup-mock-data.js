#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Setting up mock vehicle data...\n');

// Run the mock data script
const scriptPath = path.join(__dirname, 'server', 'scripts', 'addMockVehicles.js');
const child = spawn('node', [scriptPath], {
  stdio: 'inherit',
  cwd: __dirname
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Mock data setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the server: npm run server:dev');
    console.log('   2. Start the client: npm run client:dev');
    console.log('   3. Visit http://localhost:3000 to see vehicles on home page');
    console.log('   4. Login as owner to manage vehicles');
  } else {
    console.log(`\n❌ Mock data setup failed with code ${code}`);
  }
});

child.on('error', (error) => {
  console.error('❌ Error running mock data script:', error.message);
});