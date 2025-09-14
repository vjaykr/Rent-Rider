const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { verifyIdToken, createFirebaseUser, updateFirebaseUser } = require('../config/firebase');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Unified user response
const createUserResponse = (user, token) => ({
  success: true,
  token,
  user: {
    id: user._id,
    firebaseUid: user.firebaseUid,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    profileCompleted: user.profileCompleted,
    authProvider: user.authProvider,
    preferences: user.preferences,
    lastLogin: user.lastLogin
  }
});

// Firebase Authentication Login/Register
const firebaseAuth = async (req, res) => {
  try {
    const { idToken, userData } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required'
      });
    }

    // Verify Firebase token
    const verificationResult = await verifyIdToken(idToken);
    if (!verificationResult.success) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Firebase token'
      });
    }

    const { uid, email, phoneNumber } = verificationResult;

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      // Existing user - update last login
      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id);
      return res.json(createUserResponse(user, token));
    }

    // New user - create in MongoDB
    if (!userData || !userData.firstName || !userData.lastName) {
      return res.status(400).json({
        success: false,
        message: 'User data (firstName, lastName) is required for new users'
      });
    }

    // Determine auth provider
    let authProvider = 'email';
    if (verificationResult.decodedToken.firebase?.sign_in_provider === 'google.com') {
      authProvider = 'google';
    } else if (phoneNumber) {
      authProvider = 'phone';
    }

    user = new User({
      firebaseUid: uid,
      email: email || userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || phoneNumber,
      dateOfBirth: userData.dateOfBirth,
      role: userData.role || 'customer',
      authProvider,
      isEmailVerified: verificationResult.decodedToken.email_verified || false,
      isPhoneVerified: !!phoneNumber,
      avatar: verificationResult.decodedToken.picture || null,
      lastLogin: new Date()
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json(createUserResponse(user, token));

  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Email/Password Registration (with Firebase sync)
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user in MongoDB
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      role: role || 'customer',
      authProvider: 'email',
      lastLogin: new Date()
    });

    await user.save();

    // Optionally create Firebase user for unified management
    try {
      const firebaseResult = await createFirebaseUser({
        email,
        displayName: `${firstName} ${lastName}`,
        phoneNumber: phone
      });

      if (firebaseResult.success) {
        user.firebaseUid = firebaseResult.user.uid;
        await user.save();
      }
    } catch (firebaseError) {
      console.log('Firebase user creation failed, continuing with MongoDB only');
    }

    const token = generateToken(user._id);
    res.status(201).json(createUserResponse(user, token));

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Email/Password Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json(createUserResponse(user, token));

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        drivingLicense: user.drivingLicense,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        profileCompleted: user.profileCompleted,
        authProvider: user.authProvider,
        preferences: user.preferences,
        ownerDetails: user.ownerDetails,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user.userId;

    // Remove sensitive fields that shouldn't be updated directly
    delete updates.password;
    delete updates.firebaseUid;
    delete updates.email;
    delete updates.role;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updates, profileCompleted: true },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Sync with Firebase if needed
    if (user.firebaseUid && (updates.firstName || updates.lastName || updates.phone)) {
      try {
        await updateFirebaseUser(user.firebaseUid, {
          displayName: `${user.firstName} ${user.lastName}`,
          phoneNumber: user.phone
        });
      } catch (firebaseError) {
        console.log('Firebase sync failed:', firebaseError.message);
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        drivingLicense: user.drivingLicense,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        profileCompleted: user.profileCompleted,
        authProvider: user.authProvider,
        preferences: user.preferences,
        ownerDetails: user.ownerDetails
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Logout (mainly for token invalidation on client side)
const logout = async (req, res) => {
  try {
    // In a more sophisticated setup, you might maintain a token blacklist
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

module.exports = {
  firebaseAuth,
  register,
  login,
  getProfile,
  updateProfile,
  logout
};