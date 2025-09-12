const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { calculateDistance } = require('../utils/geoutils');

// Get dashboard statistics for owner
const getDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    // Get total vehicles
    const totalVehicles = await Vehicle.countDocuments({ owner: ownerId });
    
    // Get active bookings count
    const activeBookings = await Booking.countDocuments({
      'vehicle.owner': ownerId,
      status: { $in: ['confirmed', 'in-progress'] }
    });
    
    // Get monthly earnings (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyEarningsResult = await Booking.aggregate([
      {
        $match: {
          'vehicle.owner': ownerId,
          status: 'completed',
          endDate: { $gte: firstDay }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const monthlyEarnings = monthlyEarningsResult[0]?.total || 0;
    
    // Get total earnings (all time)
    const totalEarningsResult = await Booking.aggregate([
      {
        $match: {
          'vehicle.owner': ownerId,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalEarnings = totalEarningsResult[0]?.total || 0;
    
    res.status(200).json({
      success: true,
      data: {
        totalVehicles,
        activeBookings,
        monthlyEarnings,
        totalEarnings
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get recent bookings for owner
const getRecentBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;
    
    const bookings = await Booking.find({ 'vehicle.owner': ownerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('vehicle', 'name')
      .populate('user', 'firstName lastName')
      .lean();
    
    res.status(200).json({
      success: true,
      data: { bookings }
    });
    
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent bookings',
      error: error.message
    });
  }
};

// Get owner's vehicles
const getOwnerVehicles = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    const vehicles = await Vehicle.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      data: { vehicles }
    });
    
  } catch (error) {
    console.error('Error fetching owner vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles',
      error: error.message
    });
  }
};

// Get earnings summary for owner
const getEarningsSummary = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const period = req.query.period || 'monthly'; // weekly, monthly, yearly
    
    let startDate = new Date();
    let groupBy = { $month: '$endDate' };
    
    if (period === 'weekly') {
      startDate.setDate(startDate.getDate() - 7);
      groupBy = { $week: '$endDate' };
    } else if (period === 'yearly') {
      startDate.setFullYear(startDate.getFullYear() - 1);
      groupBy = { $year: '$endDate' };
    } else {
      // Default to monthly
      startDate.setMonth(startDate.getMonth() - 12);
    }
    
    const earningsData = await Booking.aggregate([
      {
        $match: {
          'vehicle.owner': ownerId,
          status: 'completed',
          endDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalEarnings: { $sum: '$totalAmount' },
          bookingCount: { $sum: 1 },
          averageEarning: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: { earningsData, period }
    });
    
  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch earnings summary',
      error: error.message
    });
  }
};

// Get booking notifications for owner
const getBookingNotifications = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    // Get recent bookings that need attention
    const notifications = await Booking.find({
      'vehicle.owner': ownerId,
      status: { $in: ['pending', 'confirmed'] },
      startDate: { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) } // Next 24 hours
    })
    .sort({ startDate: 1 })
    .limit(10)
    .populate('vehicle', 'name')
    .populate('user', 'firstName lastName')
    .lean();
    
    res.status(200).json({
      success: true,
      data: { notifications }
    });
    
  } catch (error) {
    console.error('Error fetching booking notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking notifications',
      error: error.message
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const ownerId = req.user.id;
    
    // Validate status
    if (!['confirmed', 'rejected', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }
    
    // Find and update booking
    const booking = await Booking.findOneAndUpdate(
      { 
        _id: bookingId,
        'vehicle.owner': ownerId,
        status: { $ne: 'completed' } // Can't update completed bookings
      },
      { status },
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not authorized'
      });
    }
    
    // If booking is confirmed, update vehicle availability
    if (status === 'confirmed') {
      await Vehicle.findByIdAndUpdate(
        booking.vehicle,
        { 'availability.isAvailable': false }
      );
    }
    
    // If booking is completed, make vehicle available again
    if (status === 'completed') {
      await Vehicle.findByIdAndUpdate(
        booking.vehicle,
        { 'availability.isAvailable': true }
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking }
    });
    
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentBookings,
  getOwnerVehicles,
  getEarningsSummary,
  getBookingNotifications,
  updateBookingStatus
};
