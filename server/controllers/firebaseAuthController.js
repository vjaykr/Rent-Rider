const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { verifyIdToken } = require('../config/firebase');
const { asyncHandler, sendSuccessResponse, sendErrorResponse } = require('../middleware/errorHandler');
const { syncGoogleData, createUserFromGoogle } = require('../utils/googleDataSync');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Firebase signup - create user in MongoDB after Firebase auth
// @route   POST /api/auth/firebase-signup
// @access  Public
const firebaseSignup = asyncHandler(async (req, res) => {
  const { firebaseToken, userData } = req.body;

  if (!firebaseToken) {
    return sendErrorResponse(res, 400, 'Firebase token is required');
  }

  // Verify Firebase token
  const firebaseResult = await verifyIdToken(firebaseToken);
  if (!firebaseResult.success) {
    return sendErrorResponse(res, 401, 'Invalid Firebase token');
  }

  const { uid, email, name, picture, phone_number } = firebaseResult.decodedToken;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendErrorResponse(res, 409, 'User already exists. Please login instead.');
  }

  // Create new user from Google data
  const newUserData = createUserFromGoogle({ uid, email, name, picture, phone_number }, userData);
  const newUser = await User.create(newUserData);

  const token = generateToken(newUser._id);

  sendSuccessResponse(res, 201, 'User created successfully', {
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      profileCompleted: newUser.profileCompleted,
      avatar: newUser.avatar,
      dateOfBirth: newUser.dateOfBirth,
      isEmailVerified: newUser.isEmailVerified,
      isPhoneVerified: newUser.isPhoneVerified
    },
    token
  });
});

// @desc    Firebase login - authenticate with Firebase and MongoDB
// @route   POST /api/auth/firebase-login
// @access  Public
const firebaseLogin = asyncHandler(async (req, res) => {
  const { firebaseToken } = req.body;

  if (!firebaseToken) {
    return sendErrorResponse(res, 400, 'Firebase token is required');
  }

  // Verify Firebase token
  const firebaseResult = await verifyIdToken(firebaseToken);
  if (!firebaseResult.success) {
    return sendErrorResponse(res, 401, 'Invalid Firebase token');
  }

  const { uid, email } = firebaseResult.decodedToken;

  // Find existing user by email (industry standard: email as primary identifier)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return sendErrorResponse(res, 404, 'User not found. Please sign up first.');
  }

  // Update Firebase UID and last login
  await User.findByIdAndUpdate(user._id, {
    firebaseUid: uid,
    lastLogin: new Date()
  });

  // Generate JWT token
  const token = generateToken(user._id);

  // Return user data from database
  sendSuccessResponse(res, 200, 'Login successful', {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileCompleted: user.profileCompleted,
      avatar: user.avatar,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      drivingLicense: user.drivingLicense,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified
    },
    token
  });
});

// @desc    Email/Password login (MongoDB only)
// @route   POST /api/auth/login
// @access  Public
const emailLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendErrorResponse(res, 400, 'Email and password are required');
  }

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.password) {
    return sendErrorResponse(res, 401, 'Invalid credentials');
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return sendErrorResponse(res, 401, 'Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  sendSuccessResponse(res, 200, 'Login successful', {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileCompleted: user.profileCompleted,
      avatar: user.avatar
    },
    token,
    needsProfileCompletion: !user.profileCompleted
  });
});

// @desc    Complete user profile
// @route   PUT /api/auth/complete-profile
// @access  Private
const completeProfile = asyncHandler(async (req, res) => {
  const {
    dateOfBirth,
    phone,
    address,
    drivingLicense,
    ownerDetails
  } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return sendErrorResponse(res, 404, 'User not found');
  }

  // Update profile fields
  const updates = {
    profileCompleted: true
  };

  if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
  if (phone) updates.phone = phone;
  if (address) updates.address = address;
  if (drivingLicense) updates.drivingLicense = drivingLicense;

  // Handle owner-specific details
  if (user.role === 'owner' && ownerDetails) {
    updates.ownerDetails = {
      ...user.ownerDetails,
      ...ownerDetails,
      isVerified: false // Admin needs to verify
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  );

  sendSuccessResponse(res, 200, 'Profile completed successfully', {
    user: {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profileCompleted: updatedUser.profileCompleted,
      avatar: updatedUser.avatar
    }
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return sendErrorResponse(res, 404, 'User not found');
  }

  const userProfile = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    drivingLicense: user.drivingLicense,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    profileCompleted: user.profileCompleted,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  // Include owner details if user is an owner
  if (user.role === 'owner' && user.ownerDetails) {
    userProfile.ownerDetails = user.ownerDetails;
  }

  sendSuccessResponse(res, 200, 'Profile retrieved successfully', { user: userProfile });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'firstName', 'lastName', 'phone', 'dateOfBirth', 'address', 
    'drivingLicense', 'avatar', 'ownerDetails'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Check if profile is being completed
  if (req.body.profileCompleted) {
    updates.profileCompleted = true;
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!user) {
    return sendErrorResponse(res, 404, 'User not found');
  }

  const userProfile = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    drivingLicense: user.drivingLicense,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    profileCompleted: user.profileCompleted,
    lastLogin: user.lastLogin
  };

  // Include owner details if user is an owner
  if (user.role === 'owner' && user.ownerDetails) {
    userProfile.ownerDetails = user.ownerDetails;
  }

  sendSuccessResponse(res, 200, 'Profile updated successfully', { user: userProfile });
});

module.exports = {
  firebaseSignup,
  firebaseLogin,
  emailLogin,
  completeProfile,
  getProfile,
  updateProfile
};