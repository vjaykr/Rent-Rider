const fetch = require('node-fetch');

const testAdminLogin = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@rentrider.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
};

testAdminLogin();
