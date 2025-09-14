const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { asyncHandler, sendSuccessResponse, sendErrorResponse } = require('../middleware/errorHandler');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return sendErrorResponse(res, 400, 'All fields are required');
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendErrorResponse(res, 400, 'User already exists');
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'customer',
    phone: '1234567890', // Default phone
    dateOfBirth: new Date('1990-01-01'), // Default DOB
    profileCompleted: false,
    isEmailVerified: true,
    isPhoneVerified: true
  });

  const token = generateToken(user._id);

  sendSuccessResponse(res, 201, 'User registered successfully', {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted
    },
    token,
    needsProfileCompletion: !user.profileCompleted
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendErrorResponse(res, 400, 'Email and password are required');
  }

  // Find user with password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
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
      role: user.role,
      profileCompleted: user.profileCompleted
    },
    token,
    needsProfileCompletion: !user.profileCompleted
  });
});

// @desc    Complete profile
// @route   PUT /api/auth/complete-profile
// @access  Private
const completeProfile = asyncHandler(async (req, res) => {
  const { phone, dateOfBirth, address, drivingLicense } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      phone,
      dateOfBirth,
      address,
      drivingLicense,
      profileCompleted: true
    },
    { new: true, runValidators: true }
  );

  sendSuccessResponse(res, 200, 'Profile completed successfully', {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted
    }
  });
});

// @desc    Get profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  sendSuccessResponse(res, 200, 'Profile retrieved', { user });
});

module.exports = {
  register,
  login,
  completeProfile,
  getProfile
};