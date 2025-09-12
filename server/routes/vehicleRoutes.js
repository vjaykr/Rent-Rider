const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByOwner,
  addMockData
} = require('../controllers/vehicleController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const { requireVehicleOwnership } = require('../middleware/ownerMiddleware');

// Public routes
router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Development route for adding mock data (before auth)
router.post('/dev/mock-data', addMockData);

// Protected routes (require authentication)
router.use(authenticateToken);

// Owner routes (require owner role)
router.post('/', requireRole('owner'), createVehicle);
router.put('/:id', requireRole('owner'), requireVehicleOwnership, updateVehicle);
router.delete('/:id', requireRole('owner'), requireVehicleOwnership, deleteVehicle);
router.get('/owner/my-vehicles', requireRole('owner'), getVehiclesByOwner);

module.exports = router;
