import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '../context/SecureAuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { showToast } from '../components/CustomToast';
import '../styles/animations.css';

// Memoized Icon Components for Performance
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
  chevronDown: "M19 9l-7 7-7-7"
};

// Memoized Navigation Item Component
const NavItem = memo(({ item, isActive, onClick }) => (
  <Link
    to={item.path}
    onClick={onClick}
    className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 transform scale-105'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 hover:shadow-md hover:transform hover:scale-105'
    }`}
  >
    <Icon d={icons[item.icon]} className="h-4 w-4 transition-transform group-hover:scale-110" />
    <span className="font-semibold">{item.name}</span>
  </Link>
));

// Memoized User Avatar Component
const UserAvatar = memo(({ user, onClick, showDropdown, onLogout, setShowDropdown }) => (
  <div className="relative">
    <button
      onClick={onClick}
      className="group flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105"
    >
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-bold">
            {(user.firstName || user.fullName)?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </div>
      <div className="text-left">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
          {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
        </p>
        <p className="text-xs text-gray-500 capitalize">{user.role || 'Member'}</p>
      </div>
      <Icon 
        d={icons.chevronDown} 
        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
      />
    </button>
    
    {showDropdown && (
      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-fade-in overflow-hidden">
        <div className="p-2">
          <Link
            to="/profile"
            onClick={() => setShowDropdown(false)}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
          >
            <Icon d={icons.about} className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Profile Settings</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    )}
  </div>
));

// Main Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout, refreshUser } = useSecureAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const debouncedSearch = useDebounce(searchQuery, 300);

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
      { name: 'My Vehicles', path: '/owner/vehicles', icon: 'vehicle' },
      { name: 'Add Vehicle', path: '/owner/add-vehicle', icon: 'add' },
      { name: 'Bookings', path: '/owner/bookings', icon: 'booking' },
      { name: 'Earnings', path: '/owner/earnings', icon: 'earnings' },
      { name: 'Support', path: '/support', icon: 'support' }
    ]
  }), []);

  const navigationItems = useMemo(() => {
    if (!user) return navConfig.universal;
    return user.role === 'owner' ? navConfig.owner : navConfig.renter;
  }, [user?.role, navConfig]);

  // Event Handlers
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (debouncedSearch.trim()) {
      navigate(`/vehicles?search=${encodeURIComponent(debouncedSearch.trim())}`);
      setSearchQuery('');
    }
  }, [debouncedSearch, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setShowDropdown(false);
  }, [logout, navigate]);

  const isActivePath = useCallback((path) => location.pathname === path, [location.pathname]);

  // Removed auto-refresh on route change

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      refreshUser();
    };

    window.addEventListener('profile:updated', handleProfileUpdate);
    return () => window.removeEventListener('profile:updated', handleProfileUpdate);
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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 overflow-hidden">
              <img 
                src="/images/logo.png" 
                alt="RentRider Logo" 
                className="w-8 h-8 object-contain bg-transparent"
                style={{ backgroundColor: 'transparent', mixBlendMode: 'multiply' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-white font-bold text-lg hidden">R</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              RentRider
            </span>
          </Link>

          {/* Desktop Search */}
          {user && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vehicles, locations..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
                  />
                  <Icon d={icons.search} className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </form>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                isActive={isActivePath(item.path)}
              />
            ))}

            {/* Auth Section */}
            {!user ? (
              <Link
                to="/login"
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </Link>
            ) : (
              <div className="ml-4" onClick={(e) => e.stopPropagation()}>
                <UserAvatar
                  key={`${user?.firstName}-${user?.lastName}-${user?.fullName}`}
                  user={user}
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
            className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Icon d={isOpen ? icons.close : icons.menu} className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-slide-in">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  isActive={isActivePath(item.path)}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
            
            {!user && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navigation);