// Toast Usage Examples for RentRider Application
import { showToast } from '../components/CustomToast';
import { appToastEvents } from '../utils/toastEvents';

// ============================================================================
// BASIC TOAST USAGE EXAMPLES
// ============================================================================

export const basicToastExamples = {
  // Standard toasts
  showSuccess: () => showToast.success('Operation completed successfully!'),
  showError: () => showToast.error('Something went wrong. Please try again.'),
  showWarning: () => showToast.warning('Please check your input before proceeding.'),
  showInfo: () => showToast.info('Here\'s some helpful information.'),
  
  // Trending and special toasts
  showTrending: () => showToast.trending('🔥 Hot feature: New vehicles added!'),
  showCelebration: () => showToast.celebration('🎉 Congratulations! Milestone achieved!'),
  
  // Loading toasts
  showLoading: () => {
    const loadingToast = showToast.loading('Processing your request...');
    
    // Simulate async operation
    setTimeout(() => {
      showToast.dismiss(loadingToast);
      showToast.success('Request processed successfully!');
    }, 3000);
  },
  
  // Toast with action button
  showWithAction: () => showToast.info('New update available!', {
    action: {
      label: 'Update Now',
      onClick: () => {
        showToast.success('Update started!');
        // Handle update logic
      }
    }
  })
};

// ============================================================================
// AUTHENTICATION FLOW EXAMPLES
// ============================================================================

export const authToastExamples = {
  // Login flow
  handleGoogleLogin: async () => {
    const loadingToast = showToast.auth.googleLoginStart();
    
    try {
      // Simulate Google login API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast.dismiss(loadingToast);
      showToast.auth.googleLoginSuccess('John Doe');
    } catch (error) {
      showToast.dismiss(loadingToast);
      showToast.auth.loginFailed('Google authentication failed');
    }
  },
  
  // Email login
  handleEmailLogin: async (email, password) => {
    const loadingToast = showToast.loading('Signing you in...');
    
    try {
      // Simulate email login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast.dismiss(loadingToast);
      showToast.auth.loginSuccess('Welcome back!');
    } catch (error) {
      showToast.dismiss(loadingToast);
      showToast.auth.loginFailed('Invalid credentials');
    }
  },
  
  // Profile completion
  handleProfileCompletion: async (profileData) => {
    const loadingToast = showToast.loading('Completing your profile...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast.dismiss(loadingToast);
      showToast.special.welcome(profileData.firstName);
    } catch (error) {
      showToast.dismiss(loadingToast);
      showToast.profile.updateFailed('Profile completion failed');
    }
  },
  
  // Logout
  handleLogout: () => {
    showToast.auth.logoutSuccess();
  }
};

// ============================================================================
// VEHICLE MANAGEMENT EXAMPLES
// ============================================================================

export const vehicleToastExamples = {
  // Add new vehicle
  handleAddVehicle: async (vehicleData) => {
    const loadingToast = showToast.loading('Adding your vehicle...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      showToast.dismiss(loadingToast);
      appToastEvents.vehicle.added(vehicleData.name);
    } catch (error) {
      showToast.dismiss(loadingToast);
      appToastEvents.vehicle.saveError('Network connection failed');
    }
  },
  
  // Upload vehicle images
  handleImageUpload: async (files) => {
    const uploadToast = showToast.file.uploading('vehicle images');
    
    try {
      // Simulate file upload
      for (let i = 0; i < files.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      showToast.dismiss(uploadToast);
      appToastEvents.vehicle.imageUploaded();
    } catch (error) {
      showToast.dismiss(uploadToast);
      appToastEvents.vehicle.uploadError('Upload failed');
    }
  },
  
  // Update vehicle availability
  toggleAvailability: (isAvailable) => {
    appToastEvents.vehicle.availabilityToggled(isAvailable);
  },
  
  // Update pricing
  updatePricing: () => {
    appToastEvents.vehicle.priceUpdated();
  },
  
  // Delete vehicle
  deleteVehicle: (vehicleName) => {
    appToastEvents.vehicle.deleted(vehicleName);
  }
};

// ============================================================================
// BOOKING FLOW EXAMPLES
// ============================================================================

export const bookingToastExamples = {
  // Create booking request
  handleBookingRequest: async (bookingData) => {
    const requestToast = appToastEvents.booking.requestSent();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast.dismiss(requestToast);
      appToastEvents.booking.created();
    } catch (error) {
      showToast.dismiss(requestToast);
      appToastEvents.booking.conflictError();
    }
  },
  
  // Payment flow
  handlePayment: async (amount) => {
    const paymentToast = showToast.loading('Processing payment...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      showToast.dismiss(paymentToast);
      appToastEvents.booking.paymentSuccess();
    } catch (error) {
      showToast.dismiss(paymentToast);
      appToastEvents.booking.paymentFailed();
    }
  },
  
  // Cancel booking
  cancelBooking: () => {
    appToastEvents.booking.cancelled();
  },
  
  // Complete booking
  completeBooking: () => {
    appToastEvents.booking.completed();
  }
};

// Export all examples
export default {
  basic: basicToastExamples,
  auth: authToastExamples,
  vehicle: vehicleToastExamples,
  booking: bookingToastExamples
};