import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaFacebook, FaPhone } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import toast from 'react-hot-toast';

const FirebaseAuthButtons = ({ onSuccess, onError }) => {
  const { googleLogin, facebookLogin, sendPhoneVerification, verifyPhoneCode } = useAuth();
  const [loading, setLoading] = useState({
    google: false,
    facebook: false,
    phone: false
  });
  const [phoneStep, setPhoneStep] = useState('phone'); // 'phone' or 'code'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(prev => ({ ...prev, google: true }));
    try {
      const result = await googleLogin();
      if (result.success) {
        onSuccess && onSuccess(result.user);
      } else {
        onError && onError(result.error);
      }
    } catch (error) {
      onError && onError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(prev => ({ ...prev, facebook: true }));
    try {
      const result = await facebookLogin();
      if (result.success) {
        onSuccess && onSuccess(result.user);
      } else {
        onError && onError(result.error);
      }
    } catch (error) {
      onError && onError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  const handlePhoneVerification = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(prev => ({ ...prev, phone: true }));
    try {
      const result = await sendPhoneVerification(phoneNumber);
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setPhoneStep('code');
      } else {
        onError && onError(result.error);
      }
    } catch (error) {
      onError && onError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, phone: false }));
    }
  };

  const handleCodeVerification = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setLoading(prev => ({ ...prev, phone: true }));
    try {
      const result = await verifyPhoneCode(confirmationResult, verificationCode);
      if (result.success) {
        onSuccess && onSuccess(result.user);
      } else {
        onError && onError(result.error);
      }
    } catch (error) {
      onError && onError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, phone: false }));
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading.google}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading.google ? (
          <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
        ) : (
          <FaGoogle className="h-5 w-5 mr-2 text-red-500" />
        )}
        Continue with Google
      </button>

      {/* Facebook Login */}
      <button
        onClick={handleFacebookLogin}
        disabled={loading.facebook}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading.facebook ? (
          <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
        ) : (
          <FaFacebook className="h-5 w-5 mr-2" />
        )}
        Continue with Facebook
      </button>

      {/* Phone Authentication */}
      <div className="border border-gray-300 rounded-md p-4">
        <div className="flex items-center mb-3">
          <FaPhone className="h-5 w-5 mr-2 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            Sign in with Phone
          </span>
        </div>

        {phoneStep === 'phone' ? (
          <div className="space-y-3">
            <input
              type="tel"
              placeholder="Enter phone number (e.g., +1234567890)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handlePhoneVerification}
              disabled={loading.phone}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.phone ? (
                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
              ) : null}
              Send Verification Code
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Enter the verification code sent to {phoneNumber}
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              maxLength="6"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleCodeVerification}
                disabled={loading.phone}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.phone ? (
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
                ) : null}
                Verify Code
              </button>
              <button
                onClick={() => {
                  setPhoneStep('phone');
                  setVerificationCode('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default FirebaseAuthButtons;
