const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  bookingId: {
    type: String,
    unique: true
  },
  duration: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    }
  },
  pricing: {
    rateType: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly'],
      required: true
    },
    baseRate: {
      type: Number,
      required: true,
      min: [0, 'Base rate cannot be negative']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    taxes: {
      gst: {
        type: Number,
        default: 0
      },
      serviceTax: {
        type: Number,
        default: 0
      }
    },
    securityDeposit: {
      type: Number,
      required: true,
      min: [0, 'Security deposit cannot be negative']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    discount: {
      amount: {
        type: Number,
        default: 0
      },
      couponCode: String,
      reason: String
    }
  },
  status: {
    type: String,
    enum: [
      'pending',        // Booking created, awaiting confirmation
      'confirmed',      // Booking confirmed by owner
      'payment_pending', // Awaiting payment
      'paid',          // Payment completed
      'active',        // Vehicle picked up, booking in progress
      'completed',     // Booking completed successfully
      'cancelled',     // Booking cancelled
      'refunded',      // Payment refunded
      'disputed'       // Dispute raised
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    reason: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  pickup: {
    location: {
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    scheduledTime: Date,
    actualTime: Date,
    otp: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    photos: [String], // URLs of pickup photos
    notes: String
  },
  dropoff: {
    location: {
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    scheduledTime: Date,
    actualTime: Date,
    otp: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    photos: [String], // URLs of dropoff photos
    notes: String,
    vehicleCondition: {
      fuelLevel: Number,
      mileage: Number,
      damages: [String],
      cleanliness: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      }
    }
  },
  payment: {
    paymentId: String,
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'wallet', 'cash']
    },
    transactionId: String,
    paidAmount: Number,
    paidAt: Date,
    refundAmount: Number,
    refundId: String,
    refundedAt: Date
  },
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    reason: String,
    refundAmount: Number,
    cancellationFee: Number
  },
  communication: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['message', 'system', 'notification']
    }
  }],
  additionalCharges: [{
    type: {
      type: String,
      enum: ['late_return', 'damage', 'cleaning', 'fuel', 'extra_km', 'other']
    },
    amount: Number,
    description: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }
}, {
  timestamps: true
});

// MongoDB Atlas optimized indexes
bookingSchema.index({ customer: 1 });
bookingSchema.index({ vehicle: 1 });
bookingSchema.index({ owner: 1 });
bookingSchema.index({ bookingId: 1 }, { unique: true });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'duration.startDate': 1 });
bookingSchema.index({ 'duration.endDate': 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ updatedAt: -1 });
bookingSchema.index({ 'payment.paymentId': 1 });
bookingSchema.index({ 'payment.transactionId': 1 });

// Compound indexes for common queries
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });
bookingSchema.index({ vehicle: 1, 'duration.startDate': 1, 'duration.endDate': 1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ owner: 1, createdAt: -1 });
bookingSchema.index({ 'duration.startDate': 1, status: 1 });
bookingSchema.index({ vehicle: 1, status: 1 });

// Generate unique booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last booking of the day
    const lastBooking = await this.constructor.findOne({
      bookingId: new RegExp(`^RR${year}${month}${day}`)
    }).sort({ bookingId: -1 });
    
    let sequence = 1;
    if (lastBooking) {
      const lastSequence = parseInt(lastBooking.bookingId.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.bookingId = `RR${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Virtual for booking duration in hours
bookingSchema.virtual('durationInHours').get(function() {
  if (this.duration.startDate && this.duration.endDate) {
    const diffMs = this.duration.endDate - this.duration.startDate;
    return Math.ceil(diffMs / (1000 * 60 * 60));
  }
  return 0;
});

// Virtual for booking duration in days
bookingSchema.virtual('durationInDays').get(function() {
  if (this.duration.startDate && this.duration.endDate) {
    const diffMs = this.duration.endDate - this.duration.startDate;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const cancellableStatuses = ['pending', 'confirmed', 'payment_pending', 'paid'];
  return cancellableStatuses.includes(this.status);
};

// Method to calculate cancellation fee
bookingSchema.methods.calculateCancellationFee = function() {
  const now = new Date();
  const startDate = new Date(this.duration.startDate);
  const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);
  
  if (hoursUntilStart > 24) {
    return 0; // Free cancellation
  } else if (hoursUntilStart > 6) {
    return this.pricing.totalAmount * 0.25; // 25% fee
  } else {
    return this.pricing.totalAmount * 0.50; // 50% fee
  }
};

module.exports = mongoose.model('Booking', bookingSchema);
