const express = require('express');
const router = express.Router();
const {
  googleSignup,
  completeProfile,
  emailLogin,
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteProfile,
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
router.put('/change-password', authenticateUser, changePassword);
router.delete('/profile', authenticateUser, deleteProfile);
router.post('/logout', authenticateUser, logout);

module.exports = router;