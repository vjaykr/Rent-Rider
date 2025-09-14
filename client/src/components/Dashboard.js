import React from 'react';
import { useSecureAuth } from '../context/SecureAuthContext';
import { FaUser, FaBicycle, FaHistory, FaCog } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useSecureAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const customerFeatures = [
    {
      title: 'Browse Bikes',
      description: 'Find the perfect bike for your journey',
      icon: FaBicycle,
      link: '/vehicles',
      color: 'bg-blue-500'
    },
    {
      title: 'My Bookings',
      description: 'View your booking history and current rentals',
      icon: FaHistory,
      link: '/bookings',
      color: 'bg-green-500'
    },
    {
      title: 'Profile',
      description: 'Manage your account and preferences',
      icon: FaUser,
      link: '/profile',
      color: 'bg-purple-500'
    }
  ];

  const ownerFeatures = [
    {
      title: 'My Vehicles',
      description: 'Manage your bike listings',
      icon: FaBicycle,
      link: '/owner/vehicles',
      color: 'bg-blue-500'
    },
    {
      title: 'Bookings',
      description: 'View and manage customer bookings',
      icon: FaHistory,
      link: '/owner/bookings',
      color: 'bg-green-500'
    },
    {
      title: 'Dashboard',
      description: 'View earnings and analytics',
      icon: FaCog,
      link: '/owner/dashboard',
      color: 'bg-orange-500'
    }
  ];

  const features = user?.role === 'owner' ? ownerFeatures : customerFeatures;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <FaUser className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getWelcomeMessage()}, {user?.firstName}!
              </h1>
              <p className="text-gray-600">
                Welcome to your {user?.role === 'owner' ? 'owner' : 'customer'} dashboard
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  Signed in via {user?.authProvider === 'google' ? 'Google' : 'Email'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => window.location.href = feature.link}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`${feature.color} rounded-lg p-3`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Completion */}
        {!user?.profileCompleted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Complete your profile
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Complete your profile to unlock all features and improve your experience.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      onClick={() => window.location.href = '/profile'}
                      className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                    >
                      Complete Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="mt-1 text-sm text-gray-500">
              {user?.role === 'owner' 
                ? 'Start by adding your first vehicle to rent out.'
                : 'Start by browsing available bikes in your area.'
              }
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = user?.role === 'owner' ? '/owner/add-vehicle' : '/vehicles'}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {user?.role === 'owner' ? 'Add Vehicle' : 'Browse Bikes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;