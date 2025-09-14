const express = require('express');
const router = express.Router();

const {
  register,
  login,
  completeProfile,
  getProfile
} = require('../controllers/simpleAuthController');

const {
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  sendRegistrationOTP,
  verifyOTP,
} = require('../controllers/authController');

const {
  firebaseLogin,
  firebaseSignup,
  getProfile: getFirebaseProfile,
  updateProfile: updateFirebaseProfile
} = require('../controllers/firebaseAuthController');

const { adminLogin } = require('../controllers/adminController');

const { 
  authenticateToken,
  requireEmailVerification 
} = require('../middleware/authMiddleware');

// Public routes
router.post('/send-otp', sendRegistrationOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/firebase-login', firebaseLogin);
router.post('/firebase-signup', firebaseSignup);
router.post('/admin/login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-email/:token', verifyEmail);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.get('/profile', getFirebaseProfile);
router.put('/profile', updateFirebaseProfile);
router.put('/complete-profile', completeProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

module.exports = router;
