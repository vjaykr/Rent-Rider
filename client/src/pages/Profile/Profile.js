import React, { useState, useEffect } from 'react';
import { useSecureAuth } from '../../context/SecureAuthContext';
import { secureAuthService } from '../../services/secureAuthService';
import { showToast } from '../../components/CustomToast';

const Profile = () => {
  const { user } = useSecureAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    role: 'customer',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    drivingLicense: {
      number: '',
      expiryDate: ''
    },
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
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [errors, setErrors] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [roleChangeWarning, setRoleChangeWarning] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [completionStats, setCompletionStats] = useState({ completed: 0, total: 0, percentage: 0 });


  // Fetch complete profile data from database
  const fetchProfile = async () => {
    try {
      const response = await secureAuthService.getCurrentUser();
      if (response.success) {
        const userData = response.user;
        setProfileData(userData);
        
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
          role: userData.role || 'customer',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            zipCode: userData.address?.zipCode || '',
            country: userData.address?.country || 'India'
          },
          drivingLicense: {
            number: userData.drivingLicense?.number || '',
            expiryDate: userData.drivingLicense?.expiryDate ? new Date(userData.drivingLicense.expiryDate).toISOString().split('T')[0] : ''
          },
          ownerDetails: {
            aadharNumber: userData.ownerDetails?.aadharNumber || '',
            panNumber: userData.ownerDetails?.panNumber || '',
            vehicleRegistration: userData.ownerDetails?.vehicleRegistration || '',
            insuranceNumber: userData.ownerDetails?.insuranceNumber || '',
            insuranceExpiry: userData.ownerDetails?.insuranceExpiry ? new Date(userData.ownerDetails.insuranceExpiry).toISOString().split('T')[0] : '',
            bankDetails: {
              accountNumber: userData.ownerDetails?.bankDetails?.accountNumber || '',
              ifscCode: userData.ownerDetails?.bankDetails?.ifscCode || '',
              accountHolderName: userData.ownerDetails?.bankDetails?.accountHolderName || ''
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast.error('Failed to load profile data');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    updateCompletionStats();
  }, [formData, formData.role]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    
    // Input validations
    if (name === 'ownerDetails.aadharNumber') {
      value = value.replace(/\D/g, '').slice(0, 12);
    } else if (name === 'ownerDetails.panNumber') {
      const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (cleaned.length <= 5) {
        value = cleaned.replace(/[^A-Z]/g, '');
      } else if (cleaned.length <= 9) {
        value = cleaned.slice(0, 5).replace(/[^A-Z]/g, '') + cleaned.slice(5).replace(/[^0-9]/g, '');
      } else {
        value = cleaned.slice(0, 5).replace(/[^A-Z]/g, '') + cleaned.slice(5, 9).replace(/[^0-9]/g, '') + cleaned.slice(9, 10).replace(/[^A-Z]/g, '');
      }
      value = value.slice(0, 10);
    } else if (name === 'ownerDetails.bankDetails.accountNumber') {
      value = value.replace(/\D/g, '');
    } else if (name === 'ownerDetails.bankDetails.ifscCode') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    } else if (name === 'drivingLicense.number') {
      value = value.toUpperCase();
    }
    
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
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Real-time validation
    validateField(name, value);
    
    // Handle role change
    if (name === 'role' && value !== profileData?.role) {
      setRoleChangeWarning(true);
      checkMissingFields(value);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    // Clear existing error for this field
    const fieldKey = name.split('.').pop();
    delete newErrors[fieldKey];
    
    // Validate based on field
    if (name === 'firstName' && !value.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (name === 'phone') {
      if (!value.trim()) {
        newErrors.phone = 'Mobile number is required';
      } else if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ''))) {
        newErrors.phone = 'Must be 10 digits';
      }

    } else if (name === 'ownerDetails.aadharNumber') {
      if (!value.trim()) newErrors.aadharNumber = 'Required';
      else if (!/^\d{12}$/.test(value)) newErrors.aadharNumber = 'Must be 12 digits';
    } else if (name === 'ownerDetails.panNumber') {
      if (!value.trim()) newErrors.panNumber = 'Required';
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) newErrors.panNumber = 'Format: ABCDE1234F';
    } else if (formData.role === 'owner') {
      if (name === 'ownerDetails.vehicleRegistration' && !value.trim()) {
        newErrors.vehicleRegistration = 'Required';
      } else if (name === 'ownerDetails.insuranceNumber' && !value.trim()) {
        newErrors.insuranceNumber = 'Required';
      } else if (name === 'ownerDetails.bankDetails.accountNumber' && !value.trim()) {
        newErrors.accountNumber = 'Required';
      } else if (name === 'ownerDetails.bankDetails.ifscCode') {
        if (!value.trim()) newErrors.ifscCode = 'Required';
        else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) newErrors.ifscCode = 'Invalid IFSC format';
      } else if (name === 'ownerDetails.bankDetails.accountHolderName' && !value.trim()) {
        newErrors.accountHolderName = 'Required';
      }
    }
    
    setErrors(newErrors);
  };

  const updateCompletionStats = () => {
    const allFields = [
      'firstName', 'lastName', 'phone', 'dateOfBirth',
      'address.street', 'address.city', 'address.state', 'address.zipCode',
      'drivingLicense.number', 'drivingLicense.expiryDate',
      'ownerDetails.aadharNumber', 'ownerDetails.panNumber'
    ];
    
    if (formData.role === 'owner') {
      allFields.push(
        'ownerDetails.vehicleRegistration',
        'ownerDetails.insuranceNumber',
        'ownerDetails.insuranceExpiry',
        'ownerDetails.bankDetails.accountNumber',
        'ownerDetails.bankDetails.ifscCode',
        'ownerDetails.bankDetails.accountHolderName'
      );
    }
    
    const completed = allFields.filter(field => {
      const value = field.includes('.') ? 
        field.split('.').reduce((obj, key) => obj?.[key], formData) : 
        formData[field];
      return value && value.toString().trim();
    }).length;
    
    const total = allFields.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setCompletionStats({ completed, total, percentage });
    
    const missing = allFields.filter(field => {
      const value = field.includes('.') ? 
        field.split('.').reduce((obj, key) => obj?.[key], formData) : 
        formData[field];
      return !value || !value.toString().trim();
    }).map(field => {
      const fieldNames = {
        'firstName': 'First Name', 'lastName': 'Last Name', 'phone': 'Mobile Number',
        'dateOfBirth': 'Date of Birth', 'address.street': 'Street Address',
        'address.city': 'City', 'address.state': 'State', 'address.zipCode': 'ZIP Code',
        'drivingLicense.number': 'License Number', 'drivingLicense.expiryDate': 'License Expiry',
        'ownerDetails.aadharNumber': 'Aadhar Number', 'ownerDetails.panNumber': 'PAN Number',
        'ownerDetails.vehicleRegistration': 'Vehicle Registration',
        'ownerDetails.insuranceNumber': 'Insurance Number', 'ownerDetails.insuranceExpiry': 'Insurance Expiry',
        'ownerDetails.bankDetails.accountNumber': 'Bank Account',
        'ownerDetails.bankDetails.ifscCode': 'IFSC Code',
        'ownerDetails.bankDetails.accountHolderName': 'Account Holder Name'
      };
      return fieldNames[field] || field;
    });
    
    setMissingFields(missing);
  };

  const checkMissingFields = (role) => {
    updateCompletionStats();
    return missingFields;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Mobile number must be 10 digits';
    }
    
    // Driving license validation for all users
    if (!formData.drivingLicense.number.trim()) {
      newErrors.drivingLicense = 'Driving license number is required';
    }
    
    // Role-specific validation
    if (formData.role === 'owner') {
      if (!formData.ownerDetails.aadharNumber.trim()) {
        newErrors.aadharNumber = 'Aadhar number is required';
      } else if (!/^\d{12}$/.test(formData.ownerDetails.aadharNumber)) {
        newErrors.aadharNumber = 'Must be exactly 12 digits';
      }
      
      if (!formData.ownerDetails.panNumber.trim()) {
        newErrors.panNumber = 'PAN number is required';
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.ownerDetails.panNumber)) {
        newErrors.panNumber = 'Format: ABCDE1234F';
      }
      
      if (!formData.ownerDetails.vehicleRegistration.trim()) {
        newErrors.vehicleRegistration = 'Vehicle registration is required';
      }
      
      if (!formData.ownerDetails.insuranceNumber.trim()) {
        newErrors.insuranceNumber = 'Insurance number is required';
      }
      
      if (!formData.ownerDetails.bankDetails.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      }
      
      if (!formData.ownerDetails.bankDetails.ifscCode.trim()) {
        newErrors.ifscCode = 'IFSC code is required';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ownerDetails.bankDetails.ifscCode)) {
        newErrors.ifscCode = 'Invalid IFSC format';
      }
      
      if (!formData.ownerDetails.bankDetails.accountHolderName.trim()) {
        newErrors.accountHolderName = 'Account holder name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast.error('Please fix the errors before submitting');
      return;
    }
    
    setLoading(true);
    
    try {
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        dateOfBirth: formData.dateOfBirth || null,
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          zipCode: formData.address.zipCode.trim(),
          country: formData.address.country.trim()
        },
        drivingLicense: {
          number: formData.drivingLicense.number.trim(),
          expiryDate: formData.drivingLicense.expiryDate || null
        }
      };
      
      // Include owner details if role is owner
      if (formData.role === 'owner') {
        updateData.ownerDetails = {
          aadharNumber: formData.ownerDetails.aadharNumber.trim(),
          panNumber: formData.ownerDetails.panNumber.trim(),
          vehicleRegistration: formData.ownerDetails.vehicleRegistration.trim(),
          insuranceNumber: formData.ownerDetails.insuranceNumber.trim(),
          insuranceExpiry: formData.ownerDetails.insuranceExpiry || null,
          bankDetails: {
            accountNumber: formData.ownerDetails.bankDetails.accountNumber.trim(),
            ifscCode: formData.ownerDetails.bankDetails.ifscCode.trim(),
            accountHolderName: formData.ownerDetails.bankDetails.accountHolderName.trim()
          }
        };
      }
      
      const response = await secureAuthService.updateProfile(updateData);
      
      if (response.success) {
        setIsEditing(false);
        setErrors({});
        setRoleChangeWarning(false);
        setMissingFields([]);
        await fetchProfile();
        
        if (formData.role !== profileData?.role) {
          showToast.success(`Role changed to ${formData.role === 'owner' ? 'Owner' : 'Customer'}!`);
        } else {
          showToast.success('Profile updated successfully!');
        }
      } else {
        showToast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showToast.error(error.message || 'Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordChange = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, number, and special character';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordChange()) {
      showToast.error('Please fix the errors before submitting');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await secureAuthService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (response.success) {
        showToast.success('Password changed successfully!');
        setShowChangePassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
      } else {
        showToast.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      showToast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '',
        role: profileData.role || 'customer',
        address: {
          street: profileData.address?.street || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          zipCode: profileData.address?.zipCode || '',
          country: profileData.address?.country || 'India'
        },
        drivingLicense: {
          number: profileData.drivingLicense?.number || '',
          expiryDate: profileData.drivingLicense?.expiryDate ? new Date(profileData.drivingLicense.expiryDate).toISOString().split('T')[0] : ''
        },
        ownerDetails: {
          aadharNumber: profileData.ownerDetails?.aadharNumber || '',
          panNumber: profileData.ownerDetails?.panNumber || '',
          vehicleRegistration: profileData.ownerDetails?.vehicleRegistration || '',
          insuranceNumber: profileData.ownerDetails?.insuranceNumber || '',
          insuranceExpiry: profileData.ownerDetails?.insuranceExpiry ? new Date(profileData.ownerDetails.insuranceExpiry).toISOString().split('T')[0] : '',
          bankDetails: {
            accountNumber: profileData.ownerDetails?.bankDetails?.accountNumber || '',
            ifscCode: profileData.ownerDetails?.bankDetails?.ifscCode || '',
            accountHolderName: profileData.ownerDetails?.bankDetails?.accountHolderName || ''
          }
        }
      });
    }
    setErrors({});
    setIsEditing(false);
  };



  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            {profileData && (
              <p className="text-sm text-gray-600 mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Member since {new Date(profileData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
          {!isEditing && (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowChangePassword(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Change Password
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Header with Avatar */}
          <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden shadow-lg">
                {profileData?.photoURL ? (
                  <img 
                    src={profileData.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {formData.firstName?.charAt(0) || 'U'}{formData.lastName?.charAt(0) || ''}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-6 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {formData.firstName || 'User'} {formData.lastName}
              </h2>
              <p className="text-gray-600 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {formData.email}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${
                  formData.role === 'owner' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {formData.role === 'owner' ? 'Bike Owner' : 'Customer'}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Email Verified
                </span>
                {formData.phone && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Phone Added
                  </span>
                )}
                {formData.drivingLicense.number && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    License Added
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => isEditing && handleInputChange({ target: { name: 'role', value: 'customer' } })}
                  disabled={!isEditing}
                  className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.role === 'customer'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => isEditing && handleInputChange({ target: { name: 'role', value: 'owner' } })}
                  disabled={!isEditing}
                  className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.role === 'owner'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  Vehicle Owner
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driving License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="drivingLicense.number"
                value={formData.drivingLicense.number}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 ${
                  errors.drivingLicense ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MH1420110012345"
              />
              {errors.drivingLicense && <p className="text-red-500 text-sm mt-1">{errors.drivingLicense}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Expiry Date
              </label>
              <input
                type="date"
                name="drivingLicense.expiryDate"
                value={formData.drivingLicense.expiryDate}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ownerDetails.aadharNumber"
                value={formData.ownerDetails.aadharNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                inputMode="numeric"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 ${
                  errors.aadharNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123456789012"
              />
              {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ownerDetails.panNumber"
                value={formData.ownerDetails.panNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{ textTransform: 'uppercase' }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 ${
                  errors.panNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ABCDE1234F"
              />
              {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Address Information</h3>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <textarea
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 resize-none"
                placeholder="Enter your complete address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50"
                placeholder="City"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50"
                placeholder="State"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50"
                placeholder="ZIP Code"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50"
                placeholder="Country"
              />
            </div>
            
            {/* Owner-specific fields */}
            {formData.role === 'owner' && (
              <>
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Vehicle Owner Information</h3>
                </div>
                

                

                
                {/* Vehicle Information */}
                <div className="md:col-span-2">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v8a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H21a1 1 0 001-1V8a1 1 0 00-1-1h-7z" />
                    </svg>
                    Vehicle Information
                  </h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerDetails.vehicleRegistration"
                    value={formData.ownerDetails.vehicleRegistration}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 ${
                      errors.vehicleRegistration ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="MH12AB1234"
                  />
                  {errors.vehicleRegistration && <p className="text-red-500 text-xs mt-1">{errors.vehicleRegistration}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Policy Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerDetails.insuranceNumber"
                    value={formData.ownerDetails.insuranceNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 ${
                      errors.insuranceNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Insurance policy number"
                  />
                  {errors.insuranceNumber && <p className="text-red-500 text-xs mt-1">{errors.insuranceNumber}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Expiry Date
                  </label>
                  <input
                    type="date"
                    name="ownerDetails.insuranceExpiry"
                    value={formData.ownerDetails.insuranceExpiry}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50"
                  />
                </div>
                

                
                {/* Banking Information */}
                <div className="md:col-span-2">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    Banking Information
                  </h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerDetails.bankDetails.accountNumber"
                    value={formData.ownerDetails.bankDetails.accountNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    inputMode="numeric"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 ${
                      errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1234567890123456"
                  />
                  {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerDetails.bankDetails.ifscCode"
                    value={formData.ownerDetails.bankDetails.ifscCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{ textTransform: 'uppercase' }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 ${
                      errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="SBIN0001234"
                  />
                  {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerDetails.bankDetails.accountHolderName"
                    value={formData.ownerDetails.bankDetails.accountHolderName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 ${
                      errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Account holder name"
                  />
                  {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>}
                </div>
              </>
            )}
          </div>
          
          {isEditing && (
            <div className="mt-8 pt-6 border-t">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
                      <p className="text-sm text-gray-600">Complete your profile information</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        {completionStats.completed}/{completionStats.total} completed
                      </span>
                      <span className={`text-xs font-bold ${
                        completionStats.percentage === 100 ? 'text-green-600' : 
                        completionStats.percentage >= 50 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {completionStats.percentage}%
                      </span>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          completionStats.percentage === 100 ? 'bg-green-500' :
                          completionStats.percentage >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${completionStats.percentage}%` }}
                      ></div>
                    </div>
                    {missingFields.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{missingFields.length} remaining</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-8 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 flex items-center font-medium shadow-lg"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
          
          {!isEditing && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-sm">
                  <span className="text-red-500">*</span> Required fields for profile completion
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">
                    {completionStats.completed}/{completionStats.total}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        completionStats.percentage === 100 ? 'bg-green-500' :
                        completionStats.percentage >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${completionStats.percentage}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-bold ${
                    completionStats.percentage === 100 ? 'text-green-600' : 
                    completionStats.percentage >= 50 ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {completionStats.percentage}%
                  </span>
                </div>
              </div>
              {missingFields.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-800 font-medium mb-1">Missing Required Fields:</p>
                  <p className="text-xs text-orange-700">{missingFields.join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </form>
        </div>
        
        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                      setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }));
                      if (passwordErrors.currentPassword) {
                        setPasswordErrors(prev => ({ ...prev, currentPassword: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
                      if (passwordErrors.newPassword) {
                        setPasswordErrors(prev => ({ ...prev, newPassword: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Must contain uppercase, lowercase, number, and special character
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }));
                      if (passwordErrors.confirmPassword) {
                        setPasswordErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        )}
        

      </div>
    </div>
  );
};

export default Profile;
