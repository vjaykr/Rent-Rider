const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  paymentId: {
    type: String,
    unique: true,
    required: true
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: {
    total: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
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
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    additionalCharges: {
      type: Number,
      default: 0
    }
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'netbanking', 'upi', 'wallet', 'cash'],
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled',
      'refunded',
      'partially_refunded'
    ],
    default: 'pending'
  },
  gatewayResponse: {
    status: String,
    message: String,
    errorCode: String,
    errorDescription: String,
    transactionId: String,
    responseData: mongoose.Schema.Types.Mixed
  },
  paidAt: Date,
  failedAt: Date,
  refunds: [{
    refundId: String,
    amount: {
      type: Number,
      min: [0, 'Refund amount cannot be negative']
    },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    },
    processedAt: Date,
    gatewayRefundId: String,
    notes: String
  }],
  commission: {
    platformFee: {
      type: Number,
      default: 0
    },
    paymentGatewayFee: {
      type: Number,
      default: 0
    },
    ownerEarnings: {
      type: Number,
      default: 0
    }
  },
  notes: String,
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceInfo: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
paymentSchema.index({ booking: 1 });
paymentSchema.index({ customer: 1 });
paymentSchema.index({ owner: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Compound indexes
paymentSchema.index({ customer: 1, status: 1 });
paymentSchema.index({ owner: 1, status: 1 });

// Generate unique payment ID before saving
paymentSchema.pre('save', async function(next) {
  if (this.isNew && !this.paymentId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last payment of the day
    const lastPayment = await this.constructor.findOne({
      paymentId: new RegExp(`^PAY${year}${month}${day}`)
    }).sort({ paymentId: -1 });
    
    let sequence = 1;
    if (lastPayment) {
      const lastSequence = parseInt(lastPayment.paymentId.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.paymentId = `PAY${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Virtual for total refunded amount
paymentSchema.virtual('totalRefunded').get(function() {
  return this.refunds.reduce((total, refund) => {
    return refund.status === 'processed' ? total + refund.amount : total;
  }, 0);
});

// Virtual for refundable amount
paymentSchema.virtual('refundableAmount').get(function() {
  return this.amount.total - this.totalRefunded;
});

// Method to check if payment can be refunded
paymentSchema.methods.canBeRefunded = function() {
  return this.status === 'completed' && this.refundableAmount > 0;
};

// Method to calculate platform commission
paymentSchema.methods.calculateCommission = function() {
  const platformFeePercent = 0.05; // 5% platform fee
  const paymentGatewayFeePercent = 0.023; // 2.3% payment gateway fee
  
  this.commission.platformFee = this.amount.subtotal * platformFeePercent;
  this.commission.paymentGatewayFee = this.amount.total * paymentGatewayFeePercent;
  this.commission.ownerEarnings = this.amount.subtotal - this.commission.platformFee;
  
  return this.commission;
};

module.exports = mongoose.model('Payment', paymentSchema);
