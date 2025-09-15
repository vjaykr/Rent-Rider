const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { verifyIdToken } = require('../config/firebase');
const winston = require('winston');
const bcrypt = require('bcryptjs');

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({ filename: 'logs/auth.log' })
    ] : [])
  ]
});

// Validation schemas
const googleSignupSchema = Joi.object({
  idToken: Joi.string().required()
});

const profileCompleteSchema = Joi.object({
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  bio: Joi.string().max(500).optional()
});

const emailLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Generate secure JWT with HTTP-only cookie
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  // Set HTTP-only cookie
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

// Create standardized user response
const createUserResponse = (user) => ({
  success: true,
  user: {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    firstName: user.firstName,
    lastName: user.lastName,
    photoURL: user.photoURL,
    phone: user.phone,
    bio: user.bio,
    role: user.role,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    drivingLicense: user.drivingLicense,
    personalDetails: user.personalDetails,
    ownerDetails: user.ownerDetails,
    isProfileComplete: user.isProfileComplete,
    hasPassword: user.hasPassword,
    createdAt: user.createdAt
  }
});

// Google Signup (ONLY for new users)
const googleSignup = async (req, res) => {
  try {
    // Validate input
    const { error, value } = googleSignupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { idToken } = value;

    // Verify Firebase token
    const verificationResult = await verifyIdToken(idToken);
    if (!verificationResult.success) {
      logger.error('Invalid Firebase token', { error: verificationResult.error });
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    const { uid, email, name, picture } = verificationResult.decodedToken;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { firebaseUid: uid }] 
    });

    if (existingUser) {
      // User exists - this is a login, not signup
      if (!existingUser.isProfileComplete) {
        generateTokenAndSetCookie(res, existingUser._id);
        return res.json({
          success: true,
          requiresProfileCompletion: true,
          user: createUserResponse(existingUser).user
        });
      }

      // Complete user - normal login
      existingUser.lastLogin = new Date();
      await existingUser.save();
      
      generateTokenAndSetCookie(res, existingUser._id);
      logger.info('User logged in via Google', { userId: existingUser._id, email });
      
      return res.json(createUserResponse(existingUser));
    }

    // New user - create account
    const nameParts = name ? name.split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const newUser = new User({
      email,
      fullName: name || `${firstName} ${lastName}`,
      firstName,
      lastName,
      photoURL: picture || null,
      firebaseUid: uid,
      isProfileComplete: false,
      hasPassword: false
    });

    await newUser.save();
    
    generateTokenAndSetCookie(res, newUser._id);
    logger.info('New user created via Google signup', { userId: newUser._id, email });

    res.status(201).json({
      success: true,
      requiresProfileCompletion: true,
      user: createUserResponse(newUser).user
    });

  } catch (error) {
    logger.error('Google signup error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.'
    });
  }
};

// Complete Profile (after Google signup)
const completeProfile = async (req, res) => {
  try {
    // Validate input
    const { error, value } = profileCompleteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { password, phone, bio } = value;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isProfileComplete) {
      return res.status(400).json({
        success: false,
        message: 'Profile already completed'
      });
    }

    // Update user profile with password
    user.password = password; // This will be hashed by the pre-save middleware
    user.phone = phone || user.phone;
    user.bio = bio || user.bio;
    user.hasPassword = true;
    user.isProfileComplete = true;
    // Keep authProvider as 'google' but enable email login with hasPassword flag

    await user.save();

    logger.info('User profile completed', { userId, email: user.email });

    res.json({
      success: true,
      message: 'Profile completed successfully',
      user: createUserResponse(user).user
    });

  } catch (error) {
    logger.error('Profile completion error', { 
      userId: req.user?.userId, 
      error: error.message 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to complete profile. Please try again.'
    });
  }
};

// Email/Password Login (only for users who completed Google signup)
const emailLogin = async (req, res) => {
  try {
    // Validate input
    const { error, value } = emailLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = value;

    // Get user with password for verification
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      logger.warn('Email login attempt for non-existent user', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.hasPassword || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Please complete your profile setup first'
      });
    }

    // Verify password
    logger.info('Attempting password verification', { email, hasPassword: user.hasPassword, passwordExists: !!user.password });
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn('Invalid password attempt', { email, hasPassword: user.hasPassword });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    logger.info('Password verification successful', { email });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    generateTokenAndSetCookie(res, user._id);
    logger.info('User logged in via email/password', { userId: user._id, email });

    res.json(createUserResponse(user));

  } catch (error) {
    logger.error('Email login error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json(createUserResponse(user));
  } catch (error) {
    logger.error('Get current user error', { 
      userId: req.user?.userId, 
      error: error.message 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }
    
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain uppercase, lowercase, number, and special character'
      });
    }
    
    const user = await User.findById(req.user.userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'No password set. Please complete profile setup first.'
      });
    }
    
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      logger.warn('Invalid current password during change', { userId: req.user.userId });
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    logger.info('Changing password', { userId: req.user.userId, hasPasswordBefore: user.hasPassword });
    user.password = newPassword;
    user.hasPassword = true;
    await user.save();
    logger.info('Password changed', { userId: req.user.userId, hasPasswordAfter: user.hasPassword });
    
    logger.info('Password changed successfully', { userId: req.user.userId });
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    logger.error('Change password error', { 
      userId: req.user?.userId, 
      error: error.message 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const updateSchema = Joi.object({
      firstName: Joi.string().max(50).optional(),
      lastName: Joi.string().max(50).optional(),
      phone: Joi.string().pattern(/^[6-9]\d{9}$/).allow('').optional(),
      bio: Joi.string().max(500).allow('').optional(),
      role: Joi.string().valid('customer', 'owner').optional(),
      dateOfBirth: Joi.date().optional(),
      address: Joi.object({
        street: Joi.string().allow('').optional(),
        city: Joi.string().allow('').optional(),
        state: Joi.string().allow('').optional(),
        zipCode: Joi.string().allow('').optional(),
        country: Joi.string().default('India').optional()
      }).optional(),
      drivingLicense: Joi.object({
        number: Joi.string().allow('').optional(),
        expiryDate: Joi.date().optional()
      }).optional(),
      personalDetails: Joi.object({
        aadharNumber: Joi.string().pattern(/^\d{12}$/).allow('').optional(),
        panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).allow('').optional()
      }).optional(),
      ownerDetails: Joi.object({
        aadharNumber: Joi.string().pattern(/^\d{12}$/).allow('').optional(),
        panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).allow('').optional(),
        vehicleRegistration: Joi.string().allow('').optional(),
        insuranceNumber: Joi.string().allow('').optional(),
        insuranceExpiry: Joi.date().allow(null).optional(),
        bankDetails: Joi.object({
          accountNumber: Joi.string().allow('').optional(),
          ifscCode: Joi.string().allow('').optional(),
          accountHolderName: Joi.string().allow('').optional()
        }).optional()
      }).optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const userId = req.user.userId;
    
    // Get current user for role validation
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prepare update object
    const updateObj = { ...value };
    
    // Update fullName if firstName or lastName provided
    if (value.firstName || value.lastName) {
      const firstName = value.firstName || currentUser.firstName;
      const lastName = value.lastName || currentUser.lastName;
      updateObj.fullName = `${firstName} ${lastName}`;
    }
    
    // Handle personalDetails (Aadhar/PAN for all users)
    if (value.personalDetails) {
      const { personalDetails } = value;
      
      if (personalDetails.aadharNumber && !/^\d{12}$/.test(personalDetails.aadharNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Aadhar number must be exactly 12 digits'
        });
      }
      
      if (personalDetails.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(personalDetails.panNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid PAN number format (ABCDE1234F)'
        });
      }
    }
    
    // Handle ownerDetails (backward compatibility + owner-specific fields)
    if (value.ownerDetails) {
      const { ownerDetails } = value;
      
      // Aadhar and PAN validation for backward compatibility
      if (ownerDetails.aadharNumber && !/^\d{12}$/.test(ownerDetails.aadharNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Aadhar number must be exactly 12 digits'
        });
      }
      
      if (ownerDetails.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(ownerDetails.panNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid PAN number format (ABCDE1234F)'
        });
      }
      
      // Additional validation for owners
      if (value.role === 'owner') {
        const requiredFields = ['vehicleRegistration', 'insuranceNumber'];
        const bankFields = ['accountNumber', 'ifscCode', 'accountHolderName'];
        
        for (const field of requiredFields) {
          if (!ownerDetails[field] || !ownerDetails[field].trim()) {
            return res.status(400).json({
              success: false,
              message: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required for owners`
            });
          }
        }
        
        if (ownerDetails.bankDetails) {
          for (const field of bankFields) {
            if (!ownerDetails.bankDetails[field] || !ownerDetails.bankDetails[field].trim()) {
              return res.status(400).json({
                success: false,
                message: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required for owners`
              });
            }
          }
        }
      }
    }
    
    // Use findById and save for better validation handling
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user fields
    Object.keys(updateObj).forEach(key => {
      if (key === 'personalDetails' && updateObj[key]) {
        // Handle personalDetails updates
        if (!user.personalDetails) {
          user.personalDetails = {};
        }
        
        const currentPersonalDetails = user.personalDetails.toObject ? user.personalDetails.toObject() : (user.personalDetails || {});
        const newPersonalDetails = updateObj[key];
        
        user.personalDetails = {
          ...currentPersonalDetails,
          ...newPersonalDetails
        };
        
        user.markModified('personalDetails');
        
        logger.info('Updating personalDetails', { 
          userId, 
          currentPersonalDetails, 
          newPersonalDetails, 
          finalPersonalDetails: user.personalDetails 
        });
      } else if (key === 'ownerDetails' && updateObj[key]) {
        // Initialize ownerDetails if it doesn't exist
        if (!user.ownerDetails) {
          user.ownerDetails = {};
        }
        
        // Get current ownerDetails safely
        const currentOwnerDetails = user.ownerDetails.toObject ? user.ownerDetails.toObject() : (user.ownerDetails || {});
        const newOwnerDetails = updateObj[key];
        
        // Merge ownerDetails properly
        user.ownerDetails = {
          ...currentOwnerDetails,
          ...newOwnerDetails
        };
        
        // Handle bankDetails separately if provided
        if (newOwnerDetails.bankDetails) {
          const currentBankDetails = currentOwnerDetails.bankDetails || {};
          user.ownerDetails.bankDetails = {
            ...currentBankDetails,
            ...newOwnerDetails.bankDetails
          };
        }
        
        // Mark as modified for mongoose
        user.markModified('ownerDetails');
        
        // Also update personalDetails for backward compatibility if Aadhar/PAN provided in ownerDetails
        if (newOwnerDetails.aadharNumber || newOwnerDetails.panNumber) {
          if (!user.personalDetails) {
            user.personalDetails = {};
          }
          
          if (newOwnerDetails.aadharNumber) {
            user.personalDetails.aadharNumber = newOwnerDetails.aadharNumber;
          }
          if (newOwnerDetails.panNumber) {
            user.personalDetails.panNumber = newOwnerDetails.panNumber;
          }
          
          user.markModified('personalDetails');
        }
        
        // Log the update for debugging
        logger.info('Updating ownerDetails', { 
          userId, 
          currentOwnerDetails, 
          newOwnerDetails, 
          finalOwnerDetails: user.ownerDetails 
        });
      } else if (key === 'address' && updateObj[key]) {
        // Handle address updates
        const currentAddress = user.address?.toObject ? user.address.toObject() : user.address || {};
        user.address = {
          ...currentAddress,
          ...updateObj[key]
        };
        user.markModified('address');
      } else if (key === 'drivingLicense' && updateObj[key]) {
        // Handle drivingLicense updates
        const currentLicense = user.drivingLicense?.toObject ? user.drivingLicense.toObject() : user.drivingLicense || {};
        user.drivingLicense = {
          ...currentLicense,
          ...updateObj[key]
        };
        user.markModified('drivingLicense');
      } else {
        user[key] = updateObj[key];
      }
    });
    
    await user.save();

    logger.info('User profile updated', { 
      userId, 
      updates: Object.keys(value),
      roleChanged: value.role && value.role !== currentUser.role
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: createUserResponse(user).user
    });

  } catch (error) {
    logger.error('Profile update error', { 
      userId: req.user?.userId, 
      error: error.message,
      stack: error.stack
    });
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: validationErrors[0] || 'Validation failed'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Delete profile
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await User.findByIdAndDelete(userId);
    res.clearCookie('authToken');
    
    logger.info('User profile deleted', { userId, email: user.email });
    
    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
    
  } catch (error) {
    logger.error('Delete profile error', { 
      userId: req.user?.userId, 
      error: error.message 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile'
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie('authToken');
    logger.info('User logged out', { userId: req.user?.userId });
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

module.exports = {
  googleSignup,
  completeProfile,
  emailLogin,
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteProfile,
  logout
};