import axios from 'axios';

// Dynamic API URL for network access
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Use current host for network access
  const currentHost = window.location.hostname;
  return `http://${currentHost}:5001/api`;
};

// Create axios instance with secure defaults
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  withCredentials: true, // Include HTTP-only cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error but don't auto-logout
    console.error('SecureAuth API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const secureAuthService = {
  // Google signup (first-time users only)
  async googleSignup(idToken) {
    try {
      const response = await api.post('/auth/google-signup', { idToken });
      // Extract token from Set-Cookie header if available
      this.extractAndStoreToken(response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Extract token from response and store in localStorage
  extractAndStoreToken(response) {
    try {
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        const authCookie = setCookieHeader.find(cookie => cookie.startsWith('authToken='));
        if (authCookie) {
          const token = authCookie.split('authToken=')[1].split(';')[0];
          if (token) {
            localStorage.setItem('token', token);
          }
        }
      }
    } catch (error) {
      console.error('Error extracting token:', error);
    }
  },

  // Complete profile after Google signup
  async completeProfile(profileData) {
    try {
      const response = await api.post('/auth/complete-profile', profileData);
      this.extractAndStoreToken(response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Email/password login (only for users who completed Google signup)
  async emailLogin(email, password) {
    try {
      const response = await api.post('/auth/email-login', { email, password });
      this.extractAndStoreToken(response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Logout
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      // Clear localStorage token
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      // Clear token even if logout fails
      localStorage.removeItem('token');
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Check auth health
  async checkHealth() {
    try {
      const response = await api.get('/auth/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  }
};