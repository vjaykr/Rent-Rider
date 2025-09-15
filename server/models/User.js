const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    index: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  photoURL: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  bio: {
    type: String,
    default: null,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  firebaseUid: {
    type: String,
    required: [true, 'Firebase UID is required'],
    unique: true,
    index: true
  },
  hasPassword: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'email' && this.hasPassword;
    },
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'owner', 'admin'],
    default: 'customer'
  },
  authProvider: {
    type: String,
    enum: ['email', 'google', 'phone'],
    default: 'google'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  drivingLicense: {
    number: String,
    expiryDate: Date,
    verified: {
      type: Boolean,
      default: false
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },

  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' }
  },
  // Personal Details Section
  personalDetails: {
    aadharNumber: {
      type: String,
      validate: {
        validator: function(v) {
          if (v && v.trim()) {
            return /^\d{12}$/.test(v);
          }
          return true;
        },
        message: 'Aadhar number must be exactly 12 digits'
      }
    },
    panNumber: {
      type: String,
      validate: {
        validator: function(v) {
          if (v && v.trim()) {
            return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
          }
          return true;
        },
        message: 'PAN number must follow format ABCDE1234F'
      }
    }
  },

  // For owners
  ownerDetails: {
    aadharNumber: {
      type: String,
      validate: {
        validator: function(v) {
          if (v && v.trim()) {
            return /^\d{12}$/.test(v);
          }
          return true;
        },
        message: 'Aadhar number must be exactly 12 digits'
      }
    },
    panNumber: {
      type: String,
      validate: {
        validator: function(v) {
          if (v && v.trim()) {
            return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
          }
          return true;
        },
        message: 'PAN number must follow format ABCDE1234F'
      }
    },
    vehicleRegistration: {
      type: String,
      validate: {
        validator: function(v) {
          if (this.role === 'owner') {
            return v && v.trim().length > 0;
          }
          return true;
        },
        message: 'Vehicle registration is required for owners'
      }
    },
    insuranceNumber: {
      type: String,
      validate: {
        validator: function(v) {
          if (this.role === 'owner') {
            return v && v.trim().length > 0;
          }
          return true;
        },
        message: 'Insurance number is required for owners'
      }
    },
    insuranceExpiry: {
      type: Date
    },
    bankDetails: {
      accountNumber: {
        type: String,
        validate: {
          validator: function(v) {
            if (this.parent().parent().role === 'owner') {
              return v && v.trim().length > 0;
            }
            return true;
          },
          message: 'Account number is required for owners'
        }
      },
      ifscCode: {
        type: String,
        validate: {
          validator: function(v) {
            if (this.parent().parent().role === 'owner') {
              return v && v.trim().length > 0;
            }
            return true;
          },
          message: 'IFSC code is required for owners'
        }
      },
      accountHolderName: {
        type: String,
        validate: {
          validator: function(v) {
            if (this.parent().parent().role === 'owner') {
              return v && v.trim().length > 0;
            }
            return true;
          },
          message: 'Account holder name is required for owners'
        }
      }
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    documents: [{
      type: {
        type: String,
        enum: ['aadhar', 'pan', 'business_license', 'other'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      verified: {
        type: Boolean,
        default: false
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }
}, {
  timestamps: true
});

// MongoDB Atlas optimized indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ firebaseUid: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'ownerDetails.isVerified': 1 });
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1, isActive: 1 });

// Pre-save middleware for fullName and password
userSchema.pre('save', async function(next) {
  try {
    // Update fullName when firstName or lastName changes
    if (this.isModified('firstName') || this.isModified('lastName')) {
      this.fullName = `${this.firstName} ${this.lastName}`;
    }
    
    // Hash password if modified
    if (this.isModified('password') && this.password) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Transform JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
