import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '../../context/SecureAuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { FaGoogle, FaEye, FaEyeSlash, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SecureLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, signInWithEmail, loading, error, clearError } = useSecureAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (error) {
      clearError();
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true);
      clearError();

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await signInWithGoogle(idToken);
      
      if (response.success) {
        if (response.requiresProfileCompletion) {
          toast.success('Welcome! Please complete your profile.');
          navigate('/profile-completion');
        } else {
          toast.success('Successfully signed in!');
          navigate(from, { replace: true });
        }
      } else {
        toast.error(response.message || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup was blocked. Please allow popups and try again.');
      } else {
        toast.error('Google authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      clearError();

      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const firebaseResult = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      const response = await signInWithEmail(formData.email, formData.password);
      
      if (response.success) {
        toast.success('Successfully signed in!');
        navigate(from, { replace: true });
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Email login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Please try again later.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <span className="text-2xl font-bold text-blue-600">🔐</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            New user?{' '}
            <span className="font-medium text-blue-600">
              Sign up with Google below
            </span>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleAuth}
            disabled={isSubmitting || loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              {isSubmitting ? (
                <FaSpinner className="h-5 w-5 text-white animate-spin" />
              ) : (
                <FaGoogle className="h-5 w-5 text-white" />
              )}
            </span>
            {isSubmitting ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  New to our platform?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    First-time users must sign up with Google. After signup, you can set up email/password login.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Already have an account? Use email
              </span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter your email"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                      formErrors.password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <FaSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  'Sign in with Email'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Don't have email login set up?{' '}
                <span className="text-blue-600 font-medium">
                  Sign up with Google first
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecureLoginForm;