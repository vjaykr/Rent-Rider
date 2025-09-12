const Vehicle = require('../models/Vehicle');

// Middleware to check if user is owner of the vehicle
const requireVehicleOwnership = async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleId || req.params.id;
    
    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID is required'
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if user is the owner of the vehicle or admin
    if (req.user.role !== 'admin' && vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - you are not the owner of this vehicle'
      });
    }

    // Attach vehicle to request object for use in route handlers
    req.vehicle = vehicle;
    next();
  } catch (error) {
    console.error('Vehicle ownership middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking vehicle ownership'
    });
  }
};

// Middleware to check if user has owner role and required owner details
const requireCompleteOwnerProfile = (req, res, next) => {
  if (req.user.role !== 'owner' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Owner role required'
    });
  }

  // Check if owner has completed their profile (for non-admin users)
  if (req.user.role === 'owner') {
    const ownerDetails = req.user.ownerDetails;
    
    if (!ownerDetails || !ownerDetails.businessName) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your owner profile',
        code: 'INCOMPLETE_OWNER_PROFILE',
        requiredFields: ['businessName', 'businessLicense', 'bankDetails']
      });
    }

    // Check if bank details are provided
    if (!ownerDetails.bankDetails || 
        !ownerDetails.bankDetails.accountNumber || 
        !ownerDetails.bankDetails.ifscCode) {
      return res.status(400).json({
        success: false,
        message: 'Bank details are required for vehicle listing',
        code: 'INCOMPLETE_BANK_DETAILS'
      });
    }
  }

  next();
};

// Middleware to check if owner can perform certain actions
const checkOwnerPermissions = (action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id;
      
      switch (action) {
        case 'list_vehicle':
          // Check if owner has reached vehicle listing limit
          const vehicleCount = await Vehicle.countDocuments({ 
            owner: userId, 
            isActive: true 
          });
          
          const maxVehicles = req.user.role === 'admin' ? Infinity : 10; // Limit for regular owners
          
          if (vehicleCount >= maxVehicles) {
            return res.status(400).json({
              success: false,
              message: `Vehicle listing limit reached (${maxVehicles} vehicles)`,
              code: 'VEHICLE_LIMIT_EXCEEDED'
            });
          }
          break;
          
        case 'manage_bookings':
          // Add any booking management restrictions here
          break;
          
        default:
          break;
      }
      
      next();
    } catch (error) {
      console.error('Owner permissions check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking owner permissions'
      });
    }
  };
};

// Middleware to validate vehicle data for owners
const validateVehicleData = (req, res, next) => {
  const { type, pricing, location } = req.body;
  
  // Validate vehicle type
  const allowedTypes = ['bicycle', 'motorcycle', 'scooter', 'electric-bike', 'electric-scooter'];
  if (type && !allowedTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid vehicle type',
      allowedTypes
    });
  }

  // Validate pricing
  if (pricing) {
    if (pricing.hourlyRate && pricing.hourlyRate < 10) {
      return res.status(400).json({
        success: false,
        message: 'Hourly rate must be at least ₹10'
      });
    }
    
    if (pricing.dailyRate && pricing.dailyRate < 50) {
      return res.status(400).json({
        success: false,
        message: 'Daily rate must be at least ₹50'
      });
    }
    
    if (pricing.securityDeposit && pricing.securityDeposit < 100) {
      return res.status(400).json({
        success: false,
        message: 'Security deposit must be at least ₹100'
      });
    }
  }

  // Validate location
  if (location && location.coordinates) {
    const { latitude, longitude } = location.coordinates;
    
    if (latitude && (latitude < -90 || latitude > 90)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude value'
      });
    }
    
    if (longitude && (longitude < -180 || longitude > 180)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid longitude value'
      });
    }
  }

  next();
};

// Middleware to check if vehicle can be modified
const checkVehicleModificationPermissions = async (req, res, next) => {
  try {
    const vehicle = req.vehicle; // Assuming vehicle is attached by previous middleware
    
    // Check if vehicle has active bookings
    const Booking = require('../models/Booking');
    const activeBookings = await Booking.countDocuments({
      vehicle: vehicle._id,
      status: { $in: ['confirmed', 'paid', 'active'] }
    });
    
    if (activeBookings > 0) {
      // Restrict certain modifications if there are active bookings
      const restrictedFields = ['pricing', 'availability.isAvailable'];
      const hasRestrictedChanges = restrictedFields.some(field => 
        req.body.hasOwnProperty(field.split('.')[0])
      );
      
      if (hasRestrictedChanges) {
        return res.status(400).json({
          success: false,
          message: 'Cannot modify pricing or availability while vehicle has active bookings',
          code: 'ACTIVE_BOOKINGS_EXIST',
          activeBookings
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Vehicle modification check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking vehicle modification permissions'
    });
  }
};

module.exports = {
  requireVehicleOwnership,
  requireCompleteOwnerProfile,
  checkOwnerPermissions,
  validateVehicleData,
  checkVehicleModificationPermissions
};
