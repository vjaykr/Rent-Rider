import React, { useState } from 'react';
import { useSecureAuth } from '../context/SecureAuthContext';
import firebaseAuthService from '../services/firebaseAuthService';

const GoogleAuthDebug = () => {
  const { signInWithGoogle } = useSecureAuth();
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const testFirebaseDirectly = async () => {
    addLog('Testing Firebase Google auth directly...', 'info');
    try {
      const result = await firebaseAuthService.signInWithGoogle();
      addLog(`Firebase result: ${JSON.stringify(result)}`, result.success ? 'success' : 'error');
    } catch (error) {
      addLog(`Firebase error: ${error.message}`, 'error');
    }
  };

  const testGoogleLogin = async () => {
    addLog('Testing Google login through AuthContext...', 'info');
    try {
      const result = await googleLogin();
      addLog(`Login result: ${JSON.stringify(result)}`, result.success ? 'success' : 'error');
    } catch (error) {
      addLog(`Login error: ${error.message}`, 'error');
    }
  };

  const testGoogleSignup = async () => {
    addLog('Testing Google signup through AuthContext...', 'info');
    try {
      const result = await googleSignup();
      addLog(`Signup result: ${JSON.stringify(result)}`, result.success ? 'success' : 'error');
    } catch (error) {
      addLog(`Signup error: ${error.message}`, 'error');
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Google Auth Debug</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testFirebaseDirectly}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Firebase Direct
        </button>
        <button
          onClick={testGoogleLogin}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Google Login
        </button>
        <button
          onClick={testGoogleSignup}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Google Signup
        </button>
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div>No logs yet. Click a test button to start debugging.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`mb-1 ${
              log.type === 'error' ? 'text-red-400' : 
              log.type === 'success' ? 'text-green-400' : 
              'text-blue-400'
            }`}>
              [{log.timestamp}] {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GoogleAuthDebug;