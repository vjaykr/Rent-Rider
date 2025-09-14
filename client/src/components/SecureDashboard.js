import React, { useEffect, useState } from 'react';
import { useSecureAuth } from '../context/SecureAuthContext';
import { FaUser, FaExclamationTriangle, FaCheckCircle, FaPhone, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SecureDashboard = () => {
  const { user, logout, updateProfile } = useSecureAuth();
  const [issues, setIssues] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      const detectedIssues = [];
      
      if (!user.phone) {
        detectedIssues.push({
          type: 'warning',
          message: 'Add your phone number for better security',
          action: 'Add Phone'
        });
      }
      
      if (!user.bio) {
        detectedIssues.push({
          type: 'info',
          message: 'Complete your bio to personalize your profile',
          action: 'Add Bio'
        });
      }
      
      if (!user.hasPassword) {
        detectedIssues.push({
          type: 'error',
          message: 'Set up email/password login for account security',
          action: 'Complete Profile'
        });
      }
      
      setIssues(detectedIssues);
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await updateProfile(editData);
      if (response.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(response.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const getIssueIcon = (type) => {
    switch (type) {
      case 'error':
        return <FaExclamationTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <FaExclamationTriangle className="h-5 w-5 text-blue-500" />;
      default:
        return <FaExclamationTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getIssueStyle = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.fullName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="h-8 w-8 text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <FaCheckCircle className="h-3 w-3 mr-1" />
                    Authenticated
                  </span>
                  {user.hasPassword && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Email Login Enabled
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaSignOutAlt className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {issues.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Profile Issues ({issues.length})
            </h2>
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className={`border rounded-md p-4 ${getIssueStyle(issue.type)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getIssueIcon(issue.type)}
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {issue.message}
                      </span>
                    </div>
                    <button
                      onClick={handleEditToggle}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      {issue.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            <button
              onClick={handleEditToggle}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaEdit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={editData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.fullName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.phone ? (
                      <span className="flex items-center">
                        <FaPhone className="h-4 w-4 mr-2 text-green-500" />
                        {user.phone}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </div>
              {user.bio && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.bio}</dd>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecureDashboard;