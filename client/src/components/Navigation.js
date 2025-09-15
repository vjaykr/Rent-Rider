import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '../context/SecureAuthContext';
import { useDebounce } from '../hooks/useDebounce';

import '../styles/animations.css';

// Icon Component
const Icon = memo(({ d, className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
));

const icons = {
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  vehicle: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  about: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
  contact: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  booking: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  wallet: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  support: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z",
  add: "M12 6v6m0 0v6m0-6h6m-6 0H6",
  earnings: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 18L18 6M6 6l12 12",
  chevronDown: "M19 9l-7 7-7-7",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
};

// Mobile Navigation Item
const MobileNavItem = memo(({ item, isActive, onClick }) => (
  <Link
    to={item.path}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <Icon d={icons[item.icon]} className="h-5 w-5" />
    <span className="font-medium">{item.name}</span>
  </Link>
));

// Desktop Navigation Item
const DesktopNavItem = memo(({ item, isActive, onClick }) => (
  <Link
    to={item.path}
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'text-white bg-blue-600 shadow-lg'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`}
  >
    <Icon d={icons[item.icon]} className="h-4 w-4" />
    <span>{item.name}</span>
  </Link>
));

// User Avatar Component
const UserAvatar = memo(({ user, onClick, showDropdown, onLogout, setShowDropdown, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {(user.firstName || user.fullName)?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user.role || user.userType || 'Member'}</p>
          </div>
        </div>
        <Link
          to="/profile"
          onClick={onClick}
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-2"
        >
          <Icon d={icons.about} className="h-5 w-5" />
          <span className="font-medium">Profile Settings</span>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {(user.firstName || user.fullName)?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="text-left hidden lg:block">
          <p className="text-sm font-semibold text-gray-900 truncate max-w-24">
            {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
          </p>
        </div>
        <Icon d={icons.chevronDown} className={`h-4 w-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
          <div className="p-2">
            <Link
              to="/profile"
              onClick={() => setShowDropdown(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Icon d={icons.about} className="h-4 w-4" />
              <span className="text-sm">Profile Settings</span>
            </Link>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
            >
              <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Main Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const { user, logout, refreshUser } = useSecureAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Track user changes and force updates
  useEffect(() => {
    if (user !== currentUser) {
      setCurrentUser(user);
      setForceUpdate(prev => prev + 1);
    }
  }, [user, currentUser]);

  // Navigation Items Configuration
  const navConfig = useMemo(() => ({
    universal: [
      { name: 'Home', path: '/', icon: 'home' },
      { name: 'How it Works', path: '/how-it-works', icon: 'info' },
      { name: 'Browse Vehicles', path: '/vehicles', icon: 'vehicle' },
      { name: 'About Us', path: '/about', icon: 'about' },
      { name: 'Contact', path: '/contact', icon: 'contact' }
    ],
    renter: [
      { name: 'Search', path: '/search', icon: 'search' },
      { name: 'My Bookings', path: '/bookings', icon: 'booking' },
      { name: 'Wallet', path: '/wallet', icon: 'wallet' },
      { name: 'Support', path: '/support', icon: 'support' }
    ],
    owner: [
      { name: 'Dashboard', path: '/owner', icon: 'home' },
      { name: 'My Vehicles', path: '/owner/vehicles', icon: 'vehicle' },
      { name: 'Add Vehicle', path: '/owner/add-vehicle', icon: 'add' },
      { name: 'Bookings', path: '/owner/bookings', icon: 'booking' },
      { name: 'Earnings', path: '/owner/earnings', icon: 'earnings' }
    ]
  }), []);

  const navigationItems = useMemo(() => {
    const activeUser = currentUser || user;
    if (!activeUser) return navConfig.universal;
    return activeUser.role === 'owner' ? navConfig.owner : navConfig.renter;
  }, [currentUser?.role, currentUser?.userType, user?.role, user?.userType, navConfig, forceUpdate]);

  // Event Handlers
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (debouncedSearch.trim()) {
      navigate(`/vehicles?search=${encodeURIComponent(debouncedSearch.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  }, [debouncedSearch, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setShowDropdown(false);
    setIsOpen(false);
  }, [logout, navigate]);

  const isActivePath = useCallback((path) => location.pathname === path, [location.pathname]);

  // Listen for profile updates and force re-renders
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      // Force immediate refresh if user data is provided
      if (event.detail) {
        // Trigger a state update to force re-render
        setForceUpdate(prev => prev + 1);
        setShowDropdown(false);
      }
      refreshUser();
    };

    const handleAuthUpdate = (event) => {
      if (event.detail) {
        // Force component re-render by updating local state
        setForceUpdate(prev => prev + 1);
        setShowDropdown(false);
      }
    };

    const handleUserRefresh = () => {
      // Force re-render by toggling a state
      setForceUpdate(prev => prev + 1);
      setShowDropdown(false);
    };

    window.addEventListener('profile:updated', handleProfileUpdate);
    window.addEventListener('auth:update', handleAuthUpdate);
    window.addEventListener('user:refreshed', handleUserRefresh);
    
    return () => {
      window.removeEventListener('profile:updated', handleProfileUpdate);
      window.removeEventListener('auth:update', handleAuthUpdate);
      window.removeEventListener('user:refreshed', handleUserRefresh);
    };
  }, [refreshUser]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setShowDropdown(false);
    if (showDropdown) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showDropdown]);

  return (
    <nav 
      key={`nav-${forceUpdate}-${(currentUser || user)?.id}-${(currentUser || user)?.role}`}
      className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-blue-600 hidden sm:block">RentRider</span>
            <span className="text-lg font-bold text-blue-600 sm:hidden">RR</span>
          </Link>

          {/* Desktop Search - Hidden on mobile */}
          {(currentUser || user) && (
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vehicles..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Icon d={icons.search} className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </form>
            </div>
          )}

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.slice(0, 4).map((item) => (
              <DesktopNavItem
                key={item.name}
                item={item}
                isActive={isActivePath(item.path)}
              />
            ))}

            {/* Auth Section */}
            {!(currentUser || user) ? (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <div className="ml-4" onClick={(e) => e.stopPropagation()}>
                <UserAvatar
                  key={`desktop-${forceUpdate}-${(currentUser || user)?.role}-${(currentUser || user)?.userType}`}
                  user={currentUser || user}
                  onClick={() => setShowDropdown(!showDropdown)}
                  showDropdown={showDropdown}
                  onLogout={handleLogout}
                  setShowDropdown={setShowDropdown}
                />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Icon d={isOpen ? icons.close : icons.menu} className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            
            {/* Mobile Search */}
            {(currentUser || user) && (
              <div className="mb-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search vehicles..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Icon d={icons.search} className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </form>
              </div>
            )}

            {/* Mobile Navigation Items */}
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <MobileNavItem
                  key={item.name}
                  item={item}
                  isActive={isActivePath(item.path)}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
            
            {/* Mobile Auth Section */}
            {!(currentUser || user) ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <UserAvatar
                key={`mobile-${forceUpdate}-${(currentUser || user)?.role}-${(currentUser || user)?.userType}`}
                user={currentUser || user}
                onClick={() => setIsOpen(false)}
                onLogout={handleLogout}
                isMobile={true}
              />
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navigation);