const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const apiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('adminToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      let error;
      try {
        error = await response.json();
      } catch (e) {
        error = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      // Handle token expiration specifically
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

// Main admin API object
export const adminAPI = {
  login: async (credentials) => {
    // Fix: Change endpoint to match your backend route
    const response = await apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token and user info in localStorage
    if (response.success && response.token) {
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.admin));
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // Get current admin user from localStorage
  getCurrentAdmin: () => {
    const adminUser = localStorage.getItem('adminUser');
    return adminUser ? JSON.parse(adminUser) : null;
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminUser');
    return !!(token && admin);
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: async () => {
    return apiCall('/admin/dashboard/stats');
  },
};

// Users APIs
export const usersAPI = {
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getUserDetails: async (id) => {
    return apiCall(`/admin/users/${id}`);
  },

  updateUserStatus: async (id, status) => {
    return apiCall(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: status }),
    });
  },
};

// Vehicles APIs
export const vehiclesAPI = {
  getVehicles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/vehicles${queryString ? `?${queryString}` : ''}`);
  },
  
  addVehicle: async (vehicleData) => {
    // Debug: Log the data being sent
    console.log('Adding vehicle with data:', vehicleData);
    
    // Ensure proper data structure
    const formattedData = {
      ...vehicleData,
      // Ensure required fields are present
      status: 'approved',
      isActive: true,
      availability: {
        isAvailable: true,
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      // Add default owner if not present
      ...(vehicleData.owner ? {} : { 
        owner: null // Backend will assign default owner
      })
    };
    
    console.log('Formatted vehicle data:', formattedData);
    
    return apiCall('/admin/vehicles', {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
  },
  
  updateVehicleStatus: async (id, status, rejectionReason = null) => {
    const body = { status };
    if (rejectionReason) {
      body.rejectionReason = rejectionReason;
    }
    
    return apiCall(`/admin/vehicles/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
};

// Bookings APIs
export const bookingsAPI = {
  getBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/bookings${queryString ? `?${queryString}` : ''}`);
  },

  getBookingDetails: async (id) => {
    return apiCall(`/admin/bookings/${id}`);
  },
};

// Payments APIs
export const paymentsAPI = {
  getAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/payments/analytics${queryString ? `?${queryString}` : ''}`);
  },

  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/payments/transactions${queryString ? `?${queryString}` : ''}`);
  },

  processSettlement: async (bookingIds, settlementAmount) => {
    return apiCall('/admin/payments/settlement', {
      method: 'POST',
      body: JSON.stringify({ bookingIds, settlementAmount }),
    });
  },
};

// Reports APIs
export const reportsAPI = {
  getReports: async (type, params = {}) => {
    const queryString = new URLSearchParams({ type, ...params }).toString();
    return apiCall(`/admin/reports?${queryString}`);
  },
};

// My Bikes APIs (for bike owners)
export const myBikesAPI = {
  getMyBikes: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/my-bikes${queryString ? `?${queryString}` : ''}`);
  },

  activateBike: async (bikeId) => {
    return apiCall(`/admin/my-bikes/${bikeId}/activate`, {
      method: 'PUT',
    });
  },

  deactivateBike: async (bikeId, reason = '') => {
    return apiCall(`/admin/my-bikes/${bikeId}/deactivate`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },

  updateBike: async (bikeId, bikeData) => {
    return apiCall(`/admin/my-bikes/${bikeId}`, {
      method: 'PUT',
      body: JSON.stringify(bikeData),
    });
  },

  getBikeDetails: async (bikeId) => {
    return apiCall(`/admin/my-bikes/${bikeId}`);
  },
};

const adminAPIs = {
  adminAPI,
  dashboardAPI,
  usersAPI,
  vehiclesAPI,
  bookingsAPI,
  paymentsAPI,
  reportsAPI,
  myBikesAPI,
};

export default adminAPIs;
