const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  rating: {
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    vehicle: {
      condition: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      },
      cleanliness: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      },
      performance: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      }
    },
    owner: {
      communication: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      },
      punctuality: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      },
      helpfulness: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      }
    }
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    trim: true
  },
  photos: [{
    url: String,
    caption: String
  }],
  tags: [{
    type: String,
    enum: [
      'excellent_condition',
      'clean',
      'comfortable',
      'fuel_efficient',
      'responsive_owner',
      'good_communication',
      'punctual',
      'helpful',
      'easy_pickup',
      'smooth_dropoff',
      'value_for_money',
      'would_recommend',
      'needs_maintenance',
      'poor_condition',
      'late_delivery',
      'communication_issues',
      'overpriced'
    ]
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Owner's response to the review
  response: {
    message: {
      type: String,
      maxlength: [300, 'Response cannot exceed 300 characters']
    },
    respondedAt: Date
  },
  // Admin moderation
  moderation: {
    isApproved: {
      type: Boolean,
      default: true
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,
    moderationNotes: String
  },
  // Helpful votes from other users
  helpfulVotes: {
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    },
    voters: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      vote: {
        type: String,
        enum: ['helpful', 'not_helpful']
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }
}, {
  timestamps: true
});

// Indexes for better performance
reviewSchema.index({ booking: 1 });
reviewSchema.index({ customer: 1 });
reviewSchema.index({ vehicle: 1 });
reviewSchema.index({ owner: 1 });
reviewSchema.index({ 'rating.overall': -1 });
reviewSchema.index({ isPublic: 1 });
reviewSchema.index({ 'moderation.isApproved': 1 });
reviewSchema.index({ createdAt: -1 });

// Compound indexes
reviewSchema.index({ vehicle: 1, 'rating.overall': -1 });
reviewSchema.index({ owner: 1, 'rating.overall': -1 });
reviewSchema.index({ vehicle: 1, isPublic: 1, 'moderation.isApproved': 1 });

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

// Virtual for helpfulness ratio
reviewSchema.virtual('helpfulnessRatio').get(function() {
  const total = this.helpfulVotes.helpful + this.helpfulVotes.notHelpful;
  return total > 0 ? this.helpfulVotes.helpful / total : 0;
});

// Method to check if user has voted
reviewSchema.methods.hasUserVoted = function(userId) {
  return this.helpfulVotes.voters.some(voter => 
    voter.user.toString() === userId.toString()
  );
};

// Method to get user's vote
reviewSchema.methods.getUserVote = function(userId) {
  const voter = this.helpfulVotes.voters.find(voter => 
    voter.user.toString() === userId.toString()
  );
  return voter ? voter.vote : null;
};

// Post-save middleware to update vehicle and owner ratings
reviewSchema.post('save', async function() {
  try {
    // Update vehicle rating
    const Vehicle = mongoose.model('Vehicle');
    const vehicleReviews = await mongoose.model('Review').find({ 
      vehicle: this.vehicle,
      isPublic: true,
      'moderation.isApproved': true
    });
    
    if (vehicleReviews.length > 0) {
      const totalRating = vehicleReviews.reduce((sum, review) => sum + review.rating.overall, 0);
      const averageRating = totalRating / vehicleReviews.length;
      
      await Vehicle.findByIdAndUpdate(this.vehicle, {
        'rating.average': Math.round(averageRating * 10) / 10,
        'rating.count': vehicleReviews.length
      });
    }
    
    // Update owner rating
    const User = mongoose.model('User');
    const ownerReviews = await mongoose.model('Review').find({ 
      owner: this.owner,
      isPublic: true,
      'moderation.isApproved': true
    });
    
    if (ownerReviews.length > 0) {
      const totalRating = ownerReviews.reduce((sum, review) => sum + review.rating.overall, 0);
      const averageRating = totalRating / ownerReviews.length;
      
      await User.findByIdAndUpdate(this.owner, {
        'ownerDetails.rating': Math.round(averageRating * 10) / 10
      });
    }
  } catch (error) {
    console.error('Error updating ratings:', error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
