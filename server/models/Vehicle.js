const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  name: {
    type: String,
    required: [true, 'Vehicle name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['bicycle', 'motorcycle', 'scooter', 'electric-bike', 'electric-scooter'],
    required: [true, 'Vehicle type is required']
  },
  category: {
    type: String,
    enum: ['standard', 'premium', 'luxury', 'sports'],
    default: 'standard'
  },
  year: {
    type: Number,
    required: [true, 'Manufacturing year is required'],
    min: [1990, 'Year must be 1990 or later'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'electric', 'hybrid', 'manual'],
    required: [true, 'Fuel type is required']
  },
  engineCapacity: {
    type: Number,
    min: [0, 'Engine capacity cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  features: [{
    type: String,
    trim: true
  }],
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  pricing: {
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate cannot be negative']
    },
    dailyRate: {
      type: Number,
      required: [true, 'Daily rate is required'],
      min: [0, 'Daily rate cannot be negative']
    },
    weeklyRate: {
      type: Number,
      min: [0, 'Weekly rate cannot be negative']
    },
    monthlyRate: {
      type: Number,
      min: [0, 'Monthly rate cannot be negative']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit cannot be negative']
    }
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    unavailableDates: [{
      startDate: Date,
      endDate: Date,
      reason: String
    }]
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  documents: {
    registrationCertificate: String,
    insurance: {
      policyNumber: String,
      expiryDate: Date,
      documentUrl: String
    },
    pollution: {
      certificateNumber: String,
      expiryDate: Date,
      documentUrl: String
    }
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationNotes: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deactivationReason: {
    type: String,
    trim: true
  },
  deactivatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// MongoDB Atlas optimized indexes
vehicleSchema.index({ owner: 1 });
vehicleSchema.index({ type: 1 });
vehicleSchema.index({ 'location.city': 1 });
vehicleSchema.index({ 'location.state': 1 });
vehicleSchema.index({ 'location.coordinates': '2dsphere' }); // Geospatial index for location-based queries
vehicleSchema.index({ 'pricing.hourlyRate': 1 });
vehicleSchema.index({ 'pricing.dailyRate': 1 });
vehicleSchema.index({ 'availability.isAvailable': 1 });
vehicleSchema.index({ 'verification.isVerified': 1 });
vehicleSchema.index({ isActive: 1 });
vehicleSchema.index({ createdAt: -1 });
vehicleSchema.index({ 'rating.average': -1 });
vehicleSchema.index({ registrationNumber: 1 }, { unique: true });

// Compound indexes for common queries
vehicleSchema.index({ type: 1, 'location.city': 1, 'availability.isAvailable': 1 });
vehicleSchema.index({ 'location.city': 1, isActive: 1, 'verification.isVerified': 1 });
vehicleSchema.index({ owner: 1, isActive: 1 });
vehicleSchema.index({ type: 1, 'pricing.hourlyRate': 1 });
vehicleSchema.index({ 'location.city': 1, 'rating.average': -1 });

// Virtual for primary image
vehicleSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Virtual for display name (fallback to brand + model if name not provided)
vehicleSchema.virtual('displayName').get(function() {
  return this.name || `${this.brand} ${this.model}`;
});

// Method to check if vehicle is available for given dates
vehicleSchema.methods.isAvailableForDates = function(startDate, endDate) {
  if (!this.availability.isAvailable) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return !this.availability.unavailableDates.some(period => {
    const periodStart = new Date(period.startDate);
    const periodEnd = new Date(period.endDate);
    
    return (start <= periodEnd && end >= periodStart);
  });
};

// Pre-save middleware to ensure only one primary image
vehicleSchema.pre('save', function(next) {
  if (this.isModified('images')) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // If multiple primary images, keep only the first one
      this.images.forEach((img, index) => {
        img.isPrimary = index === this.images.findIndex(i => i.isPrimary);
      });
    } else if (primaryImages.length === 0 && this.images.length > 0) {
      // If no primary image, make the first one primary
      this.images[0].isPrimary = true;
    }
  }
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
