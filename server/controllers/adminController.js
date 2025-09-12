const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if it's the default admin credentials
    if (email === 'admin@rentrider.com' && password === 'admin123') {
      // Create a token for the admin
      const adminToken = jwt.sign(
        { 
          id: 'admin', 
          email: 'admin@rentrider.com', 
          role: 'admin' 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        message: 'Admin login successful',
        token: adminToken,
        admin: {
          id: 'admin',
          email: 'admin@rentrider.com',
          role: 'admin',
          name: 'Admin User'
        }
      });
    }

    // Check if user exists and is an admin
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login'
    });
  }
};

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalVehicles,
      totalBookings,
      activeBookings,
      pendingVehicles,
      totalRevenue,
      monthlyBookings,
      monthlyRevenue
    ] = await Promise.all([
      User.countDocuments(),
      Vehicle.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'active' }),
      Vehicle.countDocuments({ status: 'pending' }),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
          }
        },
        { $count: 'total' }
      ]),
      Booking.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
          }
        },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVehicles,
        totalBookings,
        activeBookings,
        pendingVehicles,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyBookings: monthlyBookings[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// Get all users with pagination and filtering
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, status } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (role) filter.role = role;
    if (status) filter.isActive = status === 'active';
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const [users, totalCount] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password'),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's bookings and vehicles
    const [bookings, vehicles] = await Promise.all([
      Booking.find({ 
        $or: [{ customer: user._id }, { owner: user._id }] 
      })
        .populate('vehicle', 'name type images')
        .sort({ createdAt: -1 })
        .limit(10),
      Vehicle.find({ owner: user._id })
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      success: true,
      data: {
        user,
        bookings,
        vehicles,
        stats: {
          totalBookings: bookings.length,
          totalVehicles: vehicles.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// Get all vehicles with pagination and filtering
exports.getVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const [vehicles, totalCount] = await Promise.all([
      Vehicle.find(filter)
        .populate('owner', 'firstName lastName email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Vehicle.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: vehicles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
};

// Update vehicle status (approve/reject)
exports.updateVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const updateData = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const vehicle = await Vehicle.findByIdAndUpdate(id, updateData, { new: true })
      .populate('owner', 'firstName lastName email phone');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      message: `Vehicle ${status} successfully`,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle status',
      error: error.message
    });
  }
};

// Add new vehicle
exports.addVehicle = async (req, res) => {
  try {
    const vehicleData = req.body;
    
    // Create a default owner user if not exists
    let ownerUser = await User.findOne({ role: 'owner' });
    if (!ownerUser) {
      // Create default owner user
      ownerUser = await User.create({
        firstName: 'Default',
        lastName: 'Owner',
        email: 'owner@rentrider.com',
        password: await bcrypt.hash('owner123', 10),
        phone: '9999999998',
        role: 'owner',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male',
        isVerified: true,
        isActive: true
      });
    }

    // Set the owner and ensure proper status
    vehicleData.owner = ownerUser._id;
    vehicleData.verification = {
      isVerified: true, // Auto-verify admin-added vehicles
      verifiedAt: new Date(),
      verifiedBy: req.user._id // Assuming admin is logged in
    };
    vehicleData.isActive = true;
    vehicleData.availability = {
      isAvailable: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    };
    
    // Ensure required fields are set
    if (!vehicleData.location) {
      vehicleData.location = {
        address: 'Default Location',
        city: 'Mumbai',
        state: 'Maharashtra',
        coordinates: {
          latitude: 19.0760,
          longitude: 72.8777
        }
      };
    }
    
    // Set default pricing if not provided
    if (!vehicleData.pricing) {
      vehicleData.pricing = {
        hourlyRate: 100,
        dailyRate: 800,
        weeklyRate: 5000,
        monthlyRate: 18000
      };
    }

    // Create the vehicle
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    await vehicle.populate('owner', 'firstName lastName email phone');

    // Update owner's vehicle count
    await User.findByIdAndUpdate(ownerUser._id, {
      $inc: { totalVehicles: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding vehicle',
      error: error.message
    });
  }
};

// Get all bookings with pagination and filtering
exports.getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.bookingId = { $regex: search, $options: 'i' };
    }

    const [bookings, totalCount] = await Promise.all([
      Booking.find(filter)
        .populate('customer', 'firstName lastName email phone')
        .populate('owner', 'firstName lastName email phone')
        .populate('vehicle', 'name type brand model registrationNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get booking details
exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone')
      .populate('owner', 'firstName lastName email phone')
      .populate('vehicle', 'name type brand model registrationNumber images')
      .populate('review');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking details',
      error: error.message
    });
  }
};

// Get payment analytics
exports.getPaymentAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchFilter = { status: 'completed' };
    if (startDate || endDate) {
      matchFilter.createdAt = dateFilter;
    }

    const [
      totalRevenue,
      totalBookings,
      averageBookingValue,
      paymentMethodBreakdown,
      monthlyRevenue,
      dailyRevenue
    ] = await Promise.all([
      Booking.aggregate([
        { $match: matchFilter },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      Booking.countDocuments(matchFilter),
      Booking.aggregate([
        { $match: matchFilter },
        { $group: { _id: null, avg: { $avg: '$pricing.totalAmount' } } }
      ]),
      Booking.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$payment.paymentMethod', count: { $sum: 1 }, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      Booking.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$pricing.totalAmount' },
            bookings: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Booking.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            revenue: { $sum: '$pricing.totalAmount' },
            bookings: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        { $limit: 30 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalBookings,
        averageBookingValue: averageBookingValue[0]?.avg || 0,
        paymentMethodBreakdown,
        monthlyRevenue,
        dailyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment analytics',
      error: error.message
    });
  }
};

// Get all transactions for payment settlement
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentMethod } = req.query;
    const skip = (page - 1) * limit;

    let filter = { status: 'completed' };
    if (paymentMethod) filter['payment.paymentMethod'] = paymentMethod;

    const [transactions, totalCount] = await Promise.all([
      Booking.find(filter)
        .populate('customer', 'firstName lastName email')
        .populate('owner', 'firstName lastName email ownerDetails.bankDetails')
        .populate('vehicle', 'name type')
        .select('bookingId pricing payment owner customer vehicle createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};

// Process payment settlement
exports.processPaymentSettlement = async (req, res) => {
  try {
    const { bookingIds, settlementAmount } = req.body;

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Booking IDs are required'
      });
    }

    const bookings = await Booking.find({
      _id: { $in: bookingIds },
      status: 'completed'
    });

    if (bookings.length !== bookingIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some bookings not found or not completed'
      });
    }

    // Here you would integrate with your payment gateway to process settlements
    // For now, we'll just mark them as settled
    await Booking.updateMany(
      { _id: { $in: bookingIds } },
      { 
        $set: { 
          'payment.settledAt': new Date(),
          'payment.settlementAmount': settlementAmount
        }
      }
    );

    res.json({
      success: true,
      message: 'Payment settlement processed successfully',
      data: { processedBookings: bookings.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment settlement',
      error: error.message
    });
  }
};

// Get reports
exports.getReports = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const baseMatch = {};
    if (startDate || endDate) {
      baseMatch.createdAt = dateFilter;
    }

    let reportData = {};

    switch (type) {
      case 'revenue':
        reportData = await Booking.aggregate([
          { $match: { ...baseMatch, status: 'completed' } },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              revenue: { $sum: '$pricing.totalAmount' },
              bookings: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        break;

      case 'users':
        reportData = await User.aggregate([
          { $match: baseMatch },
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 }
            }
          }
        ]);
        break;

      case 'vehicles':
        reportData = await Vehicle.aggregate([
          { $match: baseMatch },
          {
            $group: {
              _id: '$type',
              count: { $sum: 1 }
            }
          }
        ]);
        break;

      case 'bookings':
        reportData = await Booking.aggregate([
          { $match: baseMatch },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    res.json({
      success: true,
      data: reportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating reports',
      error: error.message
    });
  }
};

// My Bikes management (for bike owners)
exports.getMyBikes = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, search, isActive } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};

    // If this is not the default admin, filter by owner
    if (req.user.id !== 'admin') {
      filter.owner = req.user.id;
    }

    if (type) filter.type = type;
    if (status) {
      if (status === 'approved') filter['verification.isVerified'] = true;
      else if (status === 'pending') filter['verification.isVerified'] = false;
    }
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const [bikes, totalCount] = await Promise.all([
      Vehicle.find(filter)
        .populate('owner', 'firstName lastName email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Vehicle.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: bikes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your bikes',
      error: error.message
    });
  }
};

exports.getMyBikeDetails = async (req, res) => {
  try {
    let filter = { _id: req.params.id };
    
    // If not admin, add owner filter
    if (req.user.id !== 'admin') {
      filter.owner = req.user.id;
    }

    const bike = await Vehicle.findOne(filter);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found'
      });
    }

    res.json({
      success: true,
      data: bike
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bike details',
      error: error.message
    });
  }
};

exports.updateMyBike = async (req, res) => {
  try {
    let filter = { _id: req.params.id };
    
    // If not admin, add owner filter
    if (req.user.id !== 'admin') {
      filter.owner = req.user.id;
    }

    const bike = await Vehicle.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found'
      });
    }

    res.json({
      success: true,
      message: 'Bike updated successfully',
      data: bike
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating bike',
      error: error.message
    });
  }
};

exports.activateMyBike = async (req, res) => {
  try {
    let filter = { _id: req.params.id };
    
    // If not admin, add owner filter
    if (req.user.id !== 'admin') {
      filter.owner = req.user.id;
    }

    const bike = await Vehicle.findOneAndUpdate(
      filter,
      { 
        isActive: true,
        'availability.isAvailable': true 
      },
      { new: true }
    );

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found'
      });
    }

    res.json({
      success: true,
      message: 'Bike activated successfully',
      data: bike
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error activating bike',
      error: error.message
    });
  }
};

exports.deactivateMyBike = async (req, res) => {
  try {
    const { reason } = req.body;
    let filter = { _id: req.params.id };
    
    // If not admin, add owner filter
    if (req.user.id !== 'admin') {
      filter.owner = req.user.id;
    }
    
    const bike = await Vehicle.findOneAndUpdate(
      filter,
      { 
        isActive: false,
        'availability.isAvailable': false,
        deactivationReason: reason || 'Deactivated by owner',
        deactivatedAt: new Date()
      },
      { new: true }
    );

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found'
      });
    }

    res.json({
      success: true,
      message: 'Bike deactivated successfully',
      data: bike
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating bike',
      error: error.message
    });
  }
};
