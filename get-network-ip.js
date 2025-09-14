const os = require('os');

function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        console.log(`\n🌐 Network IP Address: ${interface.address}`);
        console.log(`\n📱 Access your applications from other devices:`);
        console.log(`   Client App:    http://${interface.address}:3000`);
        console.log(`   Admin Panel:   http://${interface.address}:3001`);
        console.log(`   API Server:    http://${interface.address}:5001`);
        console.log(`\n💡 Make sure your firewall allows connections on these ports.`);
        return interface.address;
      }
    }
  }
  
  console.log('❌ No network interface found');
  return null;
}

getNetworkIP();