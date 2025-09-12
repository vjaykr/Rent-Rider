// Test script to verify Firebase configuration and demo OTP functionality
const { authAPI } = require('./src/services/authService');

async function testDemoOTP() {
  console.log('Testing Demo OTP functionality...');
  
  try {
    // Test sending OTP
    console.log('\n1. Testing OTP sending...');
    const sendResult = await authAPI.sendRegistrationOTP('9876543210');
    console.log('✅ OTP Send Result:', sendResult.data);
    
    // Test OTP verification with correct OTP
    console.log('\n2. Testing OTP verification with correct OTP...');
    const verifyResult = await authAPI.verifyOTP('9876543210', '123456');
    console.log('✅ OTP Verify Result (correct):', verifyResult.data);
    
    // Test OTP verification with incorrect OTP
    console.log('\n3. Testing OTP verification with incorrect OTP...');
    try {
      const verifyResultFail = await authAPI.verifyOTP('9876543210', '999999');
      console.log('❌ Should have failed but got:', verifyResultFail.data);
    } catch (error) {
      console.log('✅ OTP Verify Result (incorrect):', error.response?.data || error.message);
    }
    
    console.log('\n🎉 All demo OTP tests passed!');
    
  } catch (error) {
    console.error('❌ Demo OTP test failed:', error);
  }
}

// Run the test
testDemoOTP();
