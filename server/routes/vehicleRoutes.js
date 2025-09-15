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
const { uploadVehicleFiles } = require('../middleware/upload');

// Public routes (no authentication required)
router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/dev/mock-data', addMockData);

// Owner routes (require authentication and owner role)
router.post('/', authenticateToken, requireRole('owner'), uploadVehicleFiles, createVehicle);
router.put('/:id', authenticateToken, requireRole('owner'), requireVehicleOwnership, updateVehicle);
router.delete('/:id', authenticateToken, requireRole('owner'), requireVehicleOwnership, deleteVehicle);
router.get('/owner/my-vehicles', authenticateToken, requireRole('owner'), getVehiclesByOwner);

module.exports = router;
