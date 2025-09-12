import api from './api';

// Demo mode configuration
const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true' || process.env.NODE_ENV === 'development';
const DEMO_OTP = process.env.REACT_APP_DEMO_OTP || '123456';

export const authAPI = {
  // Send OTP for registration
  sendRegistrationOTP: async (phoneNumber) => {
    try {
      // Make API call to backend
      const response = await api.post('/auth/send-otp', { phone: phoneNumber });
      
      // Return the response as is - backend already handles demo mode
      return response;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  },
  
  // Verify OTP
  verifyOTP: async (phoneNumber, otp) => {
    try {
      // Make API call to backend for verification - backend handles demo mode
      const response = await api.post('/auth/verify-otp', { phone: phoneNumber, otp });
      return response;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },
  
  // Register new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  // Change password
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  
  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, newPassword) => api.post(`/auth/reset-password/${token}`, { newPassword }),
  
  // Verify email
  verifyEmail: (token) => api.post(`/auth/verify-email/${token}`),
  
  // Logout
  logout: () => api.post('/auth/logout'),
};
