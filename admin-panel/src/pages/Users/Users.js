import React, { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../../services/adminAPI';
import LoadingSpinner from '../../components/LoadingSpinner';

// User Details Modal Component
const UserDetailsModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Safe render function to handle objects
  const safeRender = (value, fallback = 'Not provided') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') {
      if (value.number) return value.number;
      if (value.street || value.city) {
        return `${value.street || ''} ${value.city || ''} ${value.state || ''} ${value.postalCode || ''}`.trim() || fallback;
      }
      return JSON.stringify(value);
    }
    return value.toString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">{safeRender(user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim())}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Firebase UID</label>
                  <p className="text-gray-900 font-mono text-xs">{safeRender(user.firebaseUid)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{safeRender(user.email)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{safeRender(user.phone)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">{user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Bio</label>
                  <p className="text-gray-900">{safeRender(user.bio)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Auth Provider</label>
                  <p className="text-gray-900 capitalize">{safeRender(user.authProvider)}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-gray-900 font-mono text-sm">{user._id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'owner' ? 'Vehicle Owner' : user.role}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Type</label>
                  <p className="text-gray-900">{user.accountType || user.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Verified</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Profile Complete</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isProfileComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isProfileComplete ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Verified</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isPhoneVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isPhoneVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Street Address</label>
                  <p className="text-gray-900">{safeRender(user.address?.street)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">City</label>
                  <p className="text-gray-900">{safeRender(user.address?.city)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">State</label>
                  <p className="text-gray-900">{safeRender(user.address?.state)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ZIP/Postal Code</label>
                  <p className="text-gray-900">{safeRender(user.address?.zipCode)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Country</label>
                  <p className="text-gray-900">{safeRender(user.address?.country)}</p>
                </div>
              </div>
            </div>

            {/* Documents & Verification */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents & Verification</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Aadhaar Number</label>
                  <p className="text-gray-900">{safeRender(user.personalDetails?.aadharNumber || user.ownerDetails?.aadharNumber)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">PAN Number</label>
                  <p className="text-gray-900">{safeRender(user.personalDetails?.panNumber || user.ownerDetails?.panNumber)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Driving License Number</label>
                  <p className="text-gray-900">{safeRender(user.drivingLicense?.number)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">License Expiry Date</label>
                  <p className="text-gray-900">{user.drivingLicense?.expiryDate ? formatDate(user.drivingLicense.expiryDate) : 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">License Verified</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.drivingLicense?.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.drivingLicense?.verified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Owner Verification Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.ownerDetails?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.ownerDetails?.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Information (for owners) */}
            {user.role === 'owner' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vehicle Registration Number</label>
                    <p className="text-gray-900">{safeRender(user.ownerDetails?.vehicleRegistration)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Insurance Policy Number</label>
                    <p className="text-gray-900">{safeRender(user.ownerDetails?.insuranceNumber)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Insurance Expiry Date</label>
                    <p className="text-gray-900">{user.ownerDetails?.insuranceExpiry ? formatDate(user.ownerDetails.insuranceExpiry) : 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Owner Rating</label>
                    <p className="text-gray-900">{user.ownerDetails?.rating || 0}/5 ⭐</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Earnings</label>
                    <p className="text-gray-900">₹{user.ownerDetails?.totalEarnings || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Banking Information (for owners) */}
            {user.role === 'owner' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Number</label>
                    <p className="text-gray-900">{safeRender(user.ownerDetails?.bankDetails?.accountNumber)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                    <p className="text-gray-900">{safeRender(user.ownerDetails?.bankDetails?.ifscCode)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Holder Name</label>
                    <p className="text-gray-900">{safeRender(user.ownerDetails?.bankDetails?.accountHolderName)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Timestamps */}
            <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Created</label>
                  <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Login</label>
                  <p className="text-gray-900">{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</p>
                </div>
              </div>
            </div>

            {/* Documents Uploaded (if owner) */}
            {user.role === 'owner' && user.ownerDetails?.documents && user.ownerDetails.documents.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                  {user.ownerDetails.documents.map((doc, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{doc.type.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-500">Uploaded: {formatDate(doc.uploadedAt)}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        doc.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Notifications</label>
                  <p className="text-gray-900">{user.preferences?.notifications?.email ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">SMS Notifications</label>
                  <p className="text-gray-900">{user.preferences?.notifications?.sms ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Push Notifications</label>
                  <p className="text-gray-900">{user.preferences?.notifications?.push ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Currency</label>
                  <p className="text-gray-900">{user.preferences?.currency || 'INR'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Language</label>
                  <p className="text-gray-900">{user.preferences?.language || 'en'}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{user.role === 'owner' ? 'Owner' : 'Customer'} Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{user.stats?.totalVehicles || user.vehicles?.length || 0}</p>
                  <p className="text-sm text-gray-500">{user.role === 'owner' ? 'Total Vehicles' : 'Vehicles Used'}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{user.stats?.totalBookings || user.bookings?.length || 0}</p>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">₹{user.stats?.totalEarnings || user.ownerDetails?.totalEarnings || user.stats?.totalSpent || 0}</p>
                  <p className="text-sm text-gray-500">{user.role === 'owner' ? 'Total Earnings' : 'Total Spent'}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{user.ownerDetails?.rating || user.stats?.averageRating || 0}/5</p>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Send Message
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Edit User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...filters,
      };

      const response = await usersAPI.getUsers(params);
      setUsers(response.data);
      setTotalPages(response.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await usersAPI.updateUserStatus(userId, !currentStatus);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDetails = async (user) => {
    try {
      setLoading(true);
      // Fetch detailed user information
      const response = await usersAPI.getUserDetails(user._id);
      const detailedUser = response.data?.user || response.data || user;
      setSelectedUser(detailedUser);
      setShowUserDetails(true);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      // Fallback to basic user info if detailed fetch fails
      setSelectedUser(user);
      setShowUserDetails(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'owner': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
          <p className="text-gray-600">Manage all registered users in the system</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                <option value="customer">Customer</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleStatusToggle(user._id, user.isActive)}
                        className={`mr-2 px-3 py-1 rounded-md text-sm font-medium ${
                          user.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md hover:bg-blue-50"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex justify-between flex-1 sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={showUserDetails}
        onClose={() => {
          setShowUserDetails(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default Users;