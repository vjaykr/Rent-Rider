import api from './api';

// Owner service functions
export const ownerService = {
  // Get owner dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/owners/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get recent bookings for owner
  getRecentBookings: async (limit = 5) => {
    try {
      const response = await api.get(`/owners/bookings/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      throw error;
    }
  },

  // Get owner's vehicles
  getOwnerVehicles: async () => {
    try {
      const response = await api.get('/owners/vehicles');
      return response.data;
    } catch (error) {
      console.error('Error fetching owner vehicles:', error);
      throw error;
    }
  },

  // Get owner's earnings summary
  getEarningsSummary: async (period = 'monthly') => {
    try {
      const response = await api.get(`/owners/earnings/summary?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching earnings summary:', error);
      throw error;
    }
  },

  // Get booking notifications
  getBookingNotifications: async () => {
    try {
      const response = await api.get('/owners/notifications/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching booking notifications:', error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.put(`/owners/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }
};

export default ownerService;
