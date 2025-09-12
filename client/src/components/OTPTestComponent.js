import React, { useState } from 'react';
import { authAPI } from '../services/authService';
import toast from 'react-hot-toast';

const OTPTestComponent = () => {
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOTP] = useState('123456');
  const [results, setResults] = useState({});

  const testSendOTP = async () => {
    try {
      console.log('Testing OTP send...');
      const response = await authAPI.sendRegistrationOTP(phone);
      console.log('OTP send response:', response);
      
      setResults(prev => ({
        ...prev,
        send: { success: true, data: response.data }
      }));
      
      toast.success('OTP sent successfully!');
      
      if (response.data.demoMode) {
        toast.info(`Demo OTP: ${response.data.otp}`, { duration: 10000 });
      }
    } catch (error) {
      console.error('OTP send error:', error);
      setResults(prev => ({
        ...prev,
        send: { success: false, error: error.message }
      }));
      toast.error('Failed to send OTP');
    }
  };

  const testVerifyOTP = async () => {
    try {
      console.log('Testing OTP verify...');
      const response = await authAPI.verifyOTP(phone, otp);
      console.log('OTP verify response:', response);
      
      setResults(prev => ({
        ...prev,
        verify: { success: true, data: response.data }
      }));
      
      toast.success('OTP verified successfully!');
    } catch (error) {
      console.error('OTP verify error:', error);
      setResults(prev => ({
        ...prev,
        verify: { success: false, error: error.message }
      }));
      toast.error('Failed to verify OTP');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>OTP Service Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Phone Number:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label>OTP:</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testSendOTP} style={{ marginRight: '10px' }}>
          Test Send OTP
        </button>
        <button onClick={testVerifyOTP}>
          Test Verify OTP
        </button>
      </div>
      
      <div>
        <h3>Results:</h3>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h4>Environment Variables:</h4>
        <p>REACT_APP_DEMO_MODE: {process.env.REACT_APP_DEMO_MODE}</p>
        <p>REACT_APP_DEMO_OTP: {process.env.REACT_APP_DEMO_OTP}</p>
        <p>NODE_ENV: {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
};

export default OTPTestComponent;
