const express = require('express');
const router = express.Router();
const {
  googleSignup,
  completeProfile,
  emailLogin,
  getCurrentUser,
  updateProfile,
  logout
} = require('../controllers/secureAuthController');
const {
  authenticateUser,
  requireCompleteProfile,
  authLimiter,
  strictAuthLimiter
} = require('../middleware/secureAuth');

// Public routes with rate limiting
router.post('/google-signup', authLimiter, googleSignup);
router.post('/email-login', strictAuthLimiter, emailLogin);

// Protected routes
router.post('/complete-profile', authenticateUser, completeProfile);
router.get('/me', authenticateUser, getCurrentUser);
router.put('/profile', authenticateUser, updateProfile);
router.post('/logout', authenticateUser, logout);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Secure auth system is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;