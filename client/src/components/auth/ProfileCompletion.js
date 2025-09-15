import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureAuth } from '../../context/SecureAuthContext';
import { FaEye, FaEyeSlash, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { showToast } from '../CustomToast';

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const { user, completeProfile, loading } = useSecureAuth();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    phone: '',
    bio: '',
    role: 'customer',
    // Customer fields
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    drivingLicense: {
      number: '',
      expiryDate: ''
    },
    // Owner fields
    ownerDetails: {
      aadharNumber: '',
      panNumber: '',
      businessName: '',
      businessLicense: '',
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
      }
    }
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
    
    // Role-specific validations
    if (formData.role === 'owner') {
      if (!formData.ownerDetails.aadharNumber) {
        errors.aadharNumber = 'Aadhar number is required for owners';
      } else if (!/^\d{12}$/.test(formData.ownerDetails.aadharNumber)) {
        errors.aadharNumber = 'Please enter a valid 12-digit Aadhar number';
      }
      
      if (!formData.ownerDetails.panNumber) {
        errors.panNumber = 'PAN number is required for owners';
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.ownerDetails.panNumber)) {
        errors.panNumber = 'Please enter a valid PAN number';
      }
      
      if (!formData.ownerDetails.businessName) {
        errors.businessName = 'Business name is required for owners';
      }
      
      if (!formData.ownerDetails.bankDetails.accountNumber) {
        errors.accountNumber = 'Account number is required for owners';
      }
      
      if (!formData.ownerDetails.bankDetails.ifscCode) {
        errors.ifscCode = 'IFSC code is required for owners';
      }
      
      if (!formData.ownerDetails.bankDetails.accountHolderName) {
        errors.accountHolderName = 'Account holder name is required for owners';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: value
          } : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
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
        role: formData.role,
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.bio && { bio: formData.bio }),
        ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
        address: formData.address,
        drivingLicense: formData.drivingLicense,
        ...(formData.role === 'owner' && { ownerDetails: formData.ownerDetails })
      };

      const response = await completeProfile(profileData);
      
      if (response.success) {
        showToast.success('Profile completed successfully!');
        navigate('/');
      } else {
        showToast.error(response.message || 'Failed to complete profile');
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      if (error.code === 'auth/weak-password') {
        showToast.error('Password is too weak. Please choose a stronger password.');
      } else {
        showToast.error('Failed to complete profile. Please try again.');
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
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I want to use RentRider as: *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.role === 'customer' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={formData.role === 'customer'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">Customer</span>
                      <span className="block text-sm text-gray-500">Rent bikes from owners</span>
                    </div>
                  </label>
                  
                  <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.role === 'owner' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="owner"
                      checked={formData.role === 'owner'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">Owner</span>
                      <span className="block text-sm text-gray-500">List bikes for rent</span>
                    </div>
                  </label>
                </div>
              </div>

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

              {/* Common Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="drivingLicense.number" className="block text-sm font-medium text-gray-700">
                    Driving License
                  </label>
                  <input
                    id="drivingLicense.number"
                    name="drivingLicense.number"
                    type="text"
                    value={formData.drivingLicense.number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="License number"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="address.street"
                    type="text"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Street Address"
                  />
                  <input
                    name="address.city"
                    type="text"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="City"
                  />
                  <input
                    name="address.state"
                    type="text"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="State"
                  />
                  <input
                    name="address.zipCode"
                    type="text"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              {/* Owner-specific fields */}
              {formData.role === 'owner' && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900">Owner Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700">
                        Aadhar Number *
                      </label>
                      <input
                        id="aadharNumber"
                        name="ownerDetails.aadharNumber"
                        type="text"
                        value={formData.ownerDetails.aadharNumber}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          formErrors.aadharNumber ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="12-digit Aadhar number"
                      />
                      {formErrors.aadharNumber && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.aadharNumber}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">
                        PAN Number *
                      </label>
                      <input
                        id="panNumber"
                        name="ownerDetails.panNumber"
                        type="text"
                        value={formData.ownerDetails.panNumber}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          formErrors.panNumber ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="ABCDE1234F"
                      />
                      {formErrors.panNumber && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.panNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                      Business Name *
                    </label>
                    <input
                      id="businessName"
                      name="ownerDetails.businessName"
                      type="text"
                      value={formData.ownerDetails.businessName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.businessName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Your business name"
                    />
                    {formErrors.businessName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.businessName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Details</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="ownerDetails.bankDetails.accountNumber"
                        type="text"
                        value={formData.ownerDetails.bankDetails.accountNumber}
                        onChange={handleInputChange}
                        className={`block w-full px-3 py-2 border ${
                          formErrors.accountNumber ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Account Number *"
                      />
                      <input
                        name="ownerDetails.bankDetails.ifscCode"
                        type="text"
                        value={formData.ownerDetails.bankDetails.ifscCode}
                        onChange={handleInputChange}
                        className={`block w-full px-3 py-2 border ${
                          formErrors.ifscCode ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="IFSC Code *"
                      />
                    </div>
                    <input
                      name="ownerDetails.bankDetails.accountHolderName"
                      type="text"
                      value={formData.ownerDetails.bankDetails.accountHolderName}
                      onChange={handleInputChange}
                      className={`mt-2 block w-full px-3 py-2 border ${
                        formErrors.accountHolderName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Account Holder Name *"
                    />
                  </div>
                </div>
              )}

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