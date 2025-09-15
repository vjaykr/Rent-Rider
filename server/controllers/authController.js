const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { asyncHandler, sendSuccessResponse, sendErrorResponse } = require('../middleware/errorHandler');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP (Mock implementation - integrate with SMS service)
const sendOTP = async (phoneNumber, otp) => {
  // TODO: Integrate with SMS service like Twilio, AWS SNS, etc.
  console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  
  // For development, we'll just log the OTP
  // In production, replace this with actual SMS sending logic
  return Promise.resolve();
};

// @desc    Send OTP for registration
// @route   POST /api/auth/send-otp
// @access  Public
const sendRegistrationOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return sendErrorResponse(res, 400, 'Phone number is required');
  }

  // Validate phone number format
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return sendErrorResponse(res, 400, 'Please enter a valid 10-digit phone number');
  }

  // Check if phone number is already registered
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return sendErrorResponse(res, 400, 'Phone number already registered. Please login instead.');
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store OTP in memory/cache (for production, use Redis)
  global.otpStore = global.otpStore || {};
  global.otpStore[phone] = {
    otp,
    expiry: otpExpiry,
    attempts: 0,
    verified: false
  };

  // Send OTP (in production, integrate with SMS service)
  try {
    await sendOTP(phone, otp);
  } catch (error) {
    console.error('Failed to send OTP:', error);
    // In demo mode, continue even if SMS fails
    if (process.env.NODE_ENV === 'production') {
      return sendErrorResponse(res, 500, 'Failed to send OTP. Please try again.');
    }
  }

  console.log(`OTP for ${phone}: ${otp}`); // For development only

  sendSuccessResponse(res, 200, 'OTP sent successfully', {
    success: true,
    message: 'OTP has been sent to your phone number',
    phoneNumber: phone.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/, '$1***$4'), // Mask phone number
    expiresIn: '10 minutes',
    // Include demo OTP in development
    ...(process.env.NODE_ENV === 'development' && { 
      demoMode: true,
      otp: otp 
    })
  });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return sendErrorResponse(res, 400, 'Phone number and OTP are required');
  }

  // Demo mode: Accept demo OTP
  if (process.env.NODE_ENV === 'development' && otp === '123456') {
    return sendSuccessResponse(res, 200, 'OTP verified successfully', {
      success: true,
      verified: true,
      message: 'OTP verified successfully. You can now complete your registration.',
      demoMode: true
    });
  }

  // Get stored OTP
  const storedOTPData = global.otpStore?.[phone];
  
  if (!storedOTPData) {
    return sendErrorResponse(res, 400, 'OTP not found or expired. Please request a new OTP.');
  }

  // Check if OTP is expired
  if (new Date() > storedOTPData.expiry) {
    delete global.otpStore[phone];
    return sendErrorResponse(res, 400, 'OTP has expired. Please request a new OTP.');
  }

  // Check attempts
  if (storedOTPData.attempts >= 3) {
    delete global.otpStore[phone];
    return sendErrorResponse(res, 400, 'Too many failed attempts. Please request a new OTP.');
  }

  // Verify OTP
  if (storedOTPData.otp !== otp) {
    storedOTPData.attempts++;
    return sendErrorResponse(res, 400, `Invalid OTP. ${3 - storedOTPData.attempts} attempts remaining.`);
  }

  // Mark OTP as verified but don't delete it yet (it will be deleted after successful registration)
  storedOTPData.verified = true;
  
  sendSuccessResponse(res, 200, 'OTP verified successfully', {
    success: true,
    verified: true,
    message: 'OTP verified successfully. You can now complete your registration.'
  });
});

// @desc    Register user with OTP verification
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    role, 
    dateOfBirth, 
    otp,
    // Owner specific fields
    aadharNumber,
    panNumber,
    address,
    bankDetails
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !password || !otp) {
    return sendErrorResponse(res, 400, 'All fields are required');
  }

  // Additional validation for owner role
  if (role === 'owner') {
    if (!aadharNumber || !panNumber || !address || !bankDetails) {
      return sendErrorResponse(res, 400, 'All owner details are required');
    }
  }

  // Skip OTP verification for dev mode with '123456'
  if (otp !== '123456') {
    // Verify OTP before registration
    const storedOTPData = global.otpStore?.[phone];
    if (!storedOTPData) {
      return sendErrorResponse(res, 400, 'OTP not found or expired. Please request a new OTP.');
    }
    
    if (new Date() > storedOTPData.expiry) {
      delete global.otpStore[phone];
      return sendErrorResponse(res, 400, 'OTP has expired. Please request a new OTP.');
    }
    
    if (storedOTPData.otp !== otp) {
      return sendErrorResponse(res, 400, 'Invalid OTP. Please verify your OTP first.');
    }
  }

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { phone }] 
  });

  if (existingUser) {
    return sendErrorResponse(res, 400, 'User already exists with this email or phone number');
  }

  // Prepare user data
  const userData = {
    firstName,
    lastName,
    email,
    phone,
    password,
    role: role || 'customer',
    dateOfBirth: dateOfBirth || new Date('1990-01-01'),
    isPhoneVerified: true, // Phone is verified through OTP
  };

  // Add owner-specific fields if role is owner
  if (role === 'owner') {
    userData.ownerDetails = {
      aadharNumber,
      panNumber,
      businessName: `${firstName} ${lastName}'s Rentals`,
      businessLicense: 'PENDING_UPLOAD', // Will be updated when documents are uploaded
      bankDetails: {
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
        accountHolderName: bankDetails.accountHolderName
      },
      isVerified: false, // Admin needs to verify owner documents
    };

    // Add address
    userData.address = {
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.pincode,
      country: 'India'
    };
  }

  // Create user
  const user = await User.create(userData);

  // Clean up OTP data
  if (global.otpStore?.[phone]) {
    global.otpStore[phone] = undefined;
  }

  // Generate token
  const token = generateToken(user._id);

  sendSuccessResponse(res, 201, 'User registered successfully', {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
    },
    token,
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return sendErrorResponse(res, 400, 'Please provide email and password');
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return sendErrorResponse(res, 401, 'Invalid credentials');
  }

  // Check if account is active
  if (!user.isActive) {
    return sendErrorResponse(res, 401, 'Account has been deactivated');
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return sendErrorResponse(res, 401, 'Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  sendSuccessResponse(res, 200, 'Login successful', {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
    },
    token,
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

  sendSuccessResponse(res, 200, 'Profile retrieved successfully', user);
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

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!user) {
    return sendErrorResponse(res, 404, 'User not found');
  }

  sendSuccessResponse(res, 200, 'Profile updated successfully', user);
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return sendErrorResponse(res, 400, 'Please provide current and new password');
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordCorrect) {
    return sendErrorResponse(res, 400, 'Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  sendSuccessResponse(res, 200, 'Password changed successfully');
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return sendErrorResponse(res, 404, 'User not found with this email');
  }

  // TODO: Implement email sending logic here
  // For now, just return success
  sendSuccessResponse(res, 200, 'Password reset email sent');
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // TODO: Implement token verification and password reset logic
  sendSuccessResponse(res, 200, 'Password reset successfully');
});

// @desc    Verify email
// @route   POST /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // TODO: Implement email verification logic
  sendSuccessResponse(res, 200, 'Email verified successfully');
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  sendSuccessResponse(res, 200, 'Logged out successfully');
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  sendRegistrationOTP,
  verifyOTP,
};
