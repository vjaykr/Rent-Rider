const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Public admin routes (no authentication required)
router.post('/login', adminController.adminLogin);

// Protected admin routes (authentication required)
const protectedRouter = express.Router();
protectedRouter.use(authenticateAdmin);

// Dashboard
protectedRouter.get('/dashboard/stats', adminController.getDashboardStats);

// Users management
protectedRouter.get('/users', adminController.getUsers);
protectedRouter.get('/users/:id', adminController.getUserDetails);
protectedRouter.put('/users/:id/status', adminController.updateUserStatus);

// Vehicles management
protectedRouter.get('/vehicles', adminController.getVehicles);
protectedRouter.post('/vehicles', adminController.addVehicle);
protectedRouter.put('/vehicles/:id/status', adminController.updateVehicleStatus);

// My Bikes management (for bike owners)
protectedRouter.get('/my-bikes', adminController.getMyBikes);
protectedRouter.get('/my-bikes/:id', adminController.getMyBikeDetails);
protectedRouter.put('/my-bikes/:id', adminController.updateMyBike);
protectedRouter.put('/my-bikes/:id/activate', adminController.activateMyBike);
protectedRouter.put('/my-bikes/:id/deactivate', adminController.deactivateMyBike);

// Mount protected routes
router.use('/', protectedRouter);

module.exports = router;
