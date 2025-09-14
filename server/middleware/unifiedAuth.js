const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyIdToken } = require('../config/firebase');

// Unified authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Try JWT token first (for email/password auth)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token or user not active'
        });
      }

      req.user = {
        userId: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider
      };
      
      return next();
    } catch (jwtError) {
      // JWT failed, try Firebase token
    }

    // Try Firebase ID token
    const firebaseResult = await verifyIdToken(token);
    if (!firebaseResult.success) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid: firebaseResult.uid });
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or not active'
      });
    }

    req.user = {
      userId: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');

    // Try JWT token first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = {
          userId: user._id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          role: user.role,
          authProvider: user.authProvider
        };
      }
      
      return next();
    } catch (jwtError) {
      // JWT failed, try Firebase token
    }

    // Try Firebase ID token
    const firebaseResult = await verifyIdToken(token);
    if (firebaseResult.success) {
      const user = await User.findOne({ firebaseUid: firebaseResult.uid });
      if (user && user.isActive) {
        req.user = {
          userId: user._id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          role: user.role,
          authProvider: user.authProvider
        };
      }
    }

    next();
  } catch (error) {
    // Ignore errors in optional auth
    next();
  }
};

module.exports = {
  authenticateUser,
  authorize,
  optionalAuth
};