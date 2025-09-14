const express = require('express');
const router = express.Router();
const {
  firebaseAuth,
  register,
  login,
  getProfile,
  updateProfile,
  logout
} = require('../controllers/unifiedAuthController');
const { authenticateUser } = require('../middleware/unifiedAuth');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  }
});

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  }
});

// Public routes
router.post('/firebase-auth', authLimiter, firebaseAuth);
router.post('/register', authLimiter, register);
router.post('/login', strictAuthLimiter, login);

// Protected routes
router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, updateProfile);
router.post('/logout', authenticateUser, logout);

// Health check for auth system
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth system is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;