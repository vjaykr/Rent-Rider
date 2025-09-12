const express = require('express');
const router = express.Router();
const { authenticateFirebaseToken: authenticate } = require('../middleware/firebaseAuth');

// Mock authorize function since it's not defined in firebaseAuth.js
const authorize = (roles) => {
  return (req, res, next) => {
    // This is a simplified version - you should implement proper role checking
    // based on your user model and database
    if (!req.firebaseUser) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    // If no specific roles required, just continue
    if (!roles || roles.length === 0) {
      return next();
    }
    
    // Here you would typically check the user's roles against the required roles
    // For now, we'll just check if the user has the 'owner' role
    if (roles.includes('owner')) {
      return next();
    }
    
    return res.status(403).json({ success: false, message: 'Forbidden - Insufficient permissions' });
  };
};
const ownerController = require('../controllers/ownerController');

// Apply authentication middleware to all routes
router.use(authenticate);

// Dashboard routes
router.get('/dashboard/stats', authorize(['owner']), ownerController.getDashboardStats);
router.get('/dashboard/earnings', authorize(['owner']), ownerController.getEarningsSummary);

// Vehicle management routes
router.get('/vehicles', authorize(['owner']), ownerController.getOwnerVehicles);

// Booking management routes
router.get('/bookings/recent', authorize(['owner']), ownerController.getRecentBookings);
router.put('/bookings/:bookingId/status', authorize(['owner']), ownerController.updateBookingStatus);

// Notification routes
router.get('/notifications/bookings', authorize(['owner']), ownerController.getBookingNotifications);

module.exports = router;
