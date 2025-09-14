import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureAuth } from '../../context/SecureAuthContext';
import { FaEye, FaEyeSlash, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const { user, completeProfile, loading } = useSecureAuth();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    phone: '',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number';
    }
    
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);

      const { updatePassword } = await import('firebase/auth');
      const { auth } = await import('../../config/firebase');
      
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, formData.password);
      }

      const profileData = {
        password: formData.password,
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.bio && { bio: formData.bio })
      };

      const response = await completeProfile(profileData);
      
      if (response.success) {
        toast.success('Profile completed successfully!');
        navigate('/');
      } else {
        toast.error(response.message || 'Failed to complete profile');
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please choose a stronger password.');
      } else {
        toast.error('Failed to complete profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.isProfileComplete) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <FaCheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome, {user?.firstName}! Please set up your password and complete your profile.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="h-10 w-10 rounded-full mr-3"
                />
              )}
              <div>
                <p className="text-sm font-medium text-blue-900">{user?.fullName}</p>
                <p className="text-sm text-blue-700">{user?.email}</p>
              </div>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Create Password *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                      formErrors.password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Create a strong password"
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
                <p className="mt-1 text-xs text-gray-500">
                  Must contain uppercase, lowercase, number, and special character
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                      formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formErrors.phone ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="10-digit phone number"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formErrors.bio ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Tell us about yourself..."
                />
                {formErrors.bio && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.bio}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <FaSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  'Complete Profile'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                After completing your profile, you can use email/password login
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;