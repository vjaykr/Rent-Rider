/**
 * Utility functions for syncing Google user data with MongoDB
 */

/**
 * Sync Google user data with existing MongoDB user
 * @param {Object} googleData - Data from Google token
 * @param {Object} existingUser - Existing user from MongoDB
 * @returns {Object} - Updated user data
 */
const syncGoogleData = (googleData, existingUser = {}) => {
  const { uid, email, name, picture, phone_number } = googleData;
  
  // Parse name from Google
  const nameParts = name ? name.split(' ') : [];
  const firstName = nameParts[0] || existingUser.firstName || 'User';
  const lastName = nameParts.slice(1).join(' ') || existingUser.lastName || '';
  
  return {
    firebaseUid: uid,
    firstName,
    lastName,
    email,
    avatar: picture || existingUser.avatar || null,
    phone: phone_number || existingUser.phone || '',
    isEmailVerified: true,
    isPhoneVerified: !!phone_number || existingUser.isPhoneVerified || false,
    lastLogin: new Date()
  };
};

/**
 * Create new user data from Google profile
 * @param {Object} googleData - Data from Google token
 * @param {Object} additionalData - Additional user data
 * @returns {Object} - New user data
 */
const createUserFromGoogle = (googleData, additionalData = {}) => {
  const { uid, email, name, picture, phone_number } = googleData;
  
  const nameParts = name ? name.split(' ') : [];
  const firstName = nameParts[0] || additionalData.firstName || 'User';
  const lastName = nameParts.slice(1).join(' ') || additionalData.lastName || '';
  
  return {
    firebaseUid: uid,
    firstName,
    lastName,
    email,
    phone: phone_number || additionalData.phone || '',
    avatar: picture || null,
    role: additionalData.role || 'customer',
    dateOfBirth: additionalData.dateOfBirth || new Date('1990-01-01'),
    isEmailVerified: true,
    isPhoneVerified: !!phone_number,
    profileCompleted: false,
    password: process.env.GOOGLE_AUTH_DEFAULT_PASSWORD || 'google_auth_secure'
  };
};

module.exports = {
  syncGoogleData,
  createUserFromGoogle
};