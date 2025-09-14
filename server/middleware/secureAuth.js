const jwt = require('jsonwebtoken');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs for login
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Secure authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from HTTP-only cookie
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in database
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    // Add user to request object
    req.user = {
      userId: user._id,
      email: user.email,
      isProfileComplete: user.isProfileComplete
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.'
      });
    }

    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Middleware to check if profile is complete
const requireCompleteProfile = (req, res, next) => {
  if (!req.user.isProfileComplete) {
    return res.status(403).json({
      success: false,
      message: 'Please complete your profile first',
      requiresProfileCompletion: true
    });
  }
  next();
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (user && user.isActive) {
      req.user = {
        userId: user._id,
        email: user.email,
        isProfileComplete: user.isProfileComplete
      };
    }

    next();
  } catch (error) {
    // Ignore errors in optional auth
    next();
  }
};

module.exports = {
  authenticateUser,
  requireCompleteProfile,
  optionalAuth,
  authLimiter,
  strictAuthLimiter
};