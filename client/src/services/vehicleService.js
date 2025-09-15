import api from './api';

// Vehicle service functions
export const vehicleService = {
  // Get all vehicles with filters (PUBLIC - no auth required)
  getVehicles: async (filters = {}) => {
    try {
      const {
        location,
        latitude,
        longitude,
        radius = 5,
        vehicleType,
        priceRange,
        transmission,
        fuelType,
        availability = 'available',
        sortBy = 'price',
        page = 1,
        limit = 20
      } = filters;

      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (location) queryParams.append('location', location);
      if (latitude) queryParams.append('latitude', latitude);
      if (longitude) queryParams.append('longitude', longitude);
      if (radius) queryParams.append('radius', radius);
      if (vehicleType) queryParams.append('vehicleType', vehicleType);
      if (priceRange) queryParams.append('priceRange', priceRange);
      if (transmission) queryParams.append('transmission', transmission);
      if (fuelType) queryParams.append('fuelType', fuelType);
      if (availability) queryParams.append('availability', availability);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      // Use public API endpoint (no auth required)
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/vehicles?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message
        };
      } else {
        throw new Error(data.message || 'Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      
      // Return fallback data if API fails
      return {
        success: false,
        error: error.message || 'Failed to fetch vehicles',
        fallbackData: {
          vehicles: [
            {
              _id: 'V001',
              brand: 'Royal Enfield',
              model: 'Classic 350',
              type: 'motorcycle',
              year: 2023,
              fuelType: 'petrol',
              pricing: { hourlyRate: 100, dailyRate: 800 },
              location: { 
                address: 'Bandra West', 
                city: 'Mumbai', 
                state: 'Maharashtra',
                coordinates: { latitude: 19.0544, longitude: 72.8406 }
              },
              rating: { average: 4.8, count: 156 },
              features: ['GPS', 'Bluetooth', 'USB Charging'],
              images: [{ url: '/api/placeholder/300/200' }],
              availability: { isAvailable: true },
              owner: { name: 'Rajesh Kumar', rating: 4.9 },
              distance: 2.3
            },
            {
              _id: 'V002',
              brand: 'Honda',
              model: 'Activa 6G',
              type: 'scooter',
              year: 2022,
              fuelType: 'petrol',
              pricing: { hourlyRate: 60, dailyRate: 400 },
              location: { 
                address: 'Andheri East', 
                city: 'Mumbai', 
                state: 'Maharashtra',
                coordinates: { latitude: 19.1136, longitude: 72.8697 }
              },
              rating: { average: 4.6, count: 234 },
              features: ['Helmet Storage', 'Mobile Holder'],
              images: [{ url: '/api/placeholder/300/200' }],
              availability: { isAvailable: true },
              owner: { name: 'Priya Sharma', rating: 4.7 },
              distance: 3.1
            },
            {
              _id: 'V003',
              brand: 'Bajaj',
              model: 'Pulsar NS200',
              type: 'motorcycle',
              year: 2023,
              fuelType: 'petrol',
              pricing: { hourlyRate: 80, dailyRate: 600 },
              location: { 
                address: 'Koramangala', 
                city: 'Bangalore', 
                state: 'Karnataka',
                coordinates: { latitude: 12.9352, longitude: 77.6245 }
              },
              rating: { average: 4.5, count: 89 },
              features: ['Anti-theft Alarm', 'USB Charging'],
              images: [{ url: '/api/placeholder/300/200' }],
              availability: { isAvailable: false },
              owner: { name: 'Amit Patel', rating: 4.8 },
              distance: 1.8
            },
            {
              _id: 'V004',
              brand: 'TVS',
              model: 'Jupiter',
              type: 'scooter',
              year: 2022,
              fuelType: 'petrol',
              pricing: { hourlyRate: 50, dailyRate: 350 },
              location: { 
                address: 'Whitefield', 
                city: 'Bangalore', 
                state: 'Karnataka',
                coordinates: { latitude: 12.9698, longitude: 77.7500 }
              },
              rating: { average: 4.3, count: 167 },
              features: ['Mobile Holder', 'Helmet Storage'],
              images: [{ url: '/api/placeholder/300/200' }],
              availability: { isAvailable: true },
              owner: { name: 'Sneha Reddy', rating: 4.5 },
              distance: 5.2
            },
            {
              _id: 'V005',
              brand: 'Yamaha',
              model: 'R15 V3',
              type: 'motorcycle',
              year: 2023,
              fuelType: 'petrol',
              pricing: { hourlyRate: 120, dailyRate: 900 },
              location: { 
                address: 'Electronic City', 
                city: 'Bangalore', 
                state: 'Karnataka',
                coordinates: { latitude: 12.8456, longitude: 77.6603 }
              },
              rating: { average: 4.7, count: 78 },
              features: ['ABS', 'LED Headlights', 'Digital Display'],
              images: [{ url: '/api/placeholder/300/200' }],
              availability: { isAvailable: true },
              owner: { name: 'Karthik Nair', rating: 4.8 },
              distance: 7.8
            }
          ],
          searchInfo: {
            totalCount: 5,
            availableCount: 4,
            searchLocation: 'Current Location',
            searchRadius: 5
          }
        }
      };
    }
  },

  // Get vehicle by ID
  getVehicleById: async (vehicleId) => {
    try {
      const response = await api.get(`/vehicles/${vehicleId}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch vehicle');
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  },

  // Add new vehicle (Owner only)
  addVehicle: async (vehicleData) => {
    try {
      const response = await api.post('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  },

  // Add new vehicle with images (Owner only)
  addVehicleWithImages: async (formData) => {
    try {
      const response = await api.post('/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding vehicle with images:', error);
      throw error;
    }
  },

  // Update vehicle (Owner only)
  updateVehicle: async (vehicleId, updateData) => {
    try {
      const response = await api.put(`/vehicles/${vehicleId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  },

  // Delete vehicle (Owner only)
  deleteVehicle: async (vehicleId) => {
    try {
      const response = await api.delete(`/vehicles/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  },

  // Get owner's vehicles (requires authentication)
  getOwnerVehicles: async () => {
    try {
      const response = await api.get('/vehicles/owner/my-vehicles');
      return response.data;
    } catch (error) {
      console.error('Error fetching owner vehicles:', error);
      // Return empty array instead of throwing to prevent logout
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch vehicles'
      };
    }
  },

  // Search vehicles near location
  searchVehiclesNearLocation: async (location, radius = 5) => {
    try {
      // Get coordinates for location using Google Maps or fallback
      const coordinates = await getCoordinatesFromLocation(location);
      
      return await vehicleService.getVehicles({
        location,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        radius
      });
    } catch (error) {
      console.error('Error searching vehicles near location:', error);
      throw error;
    }
  }
};

// Helper function to get coordinates from location
const getCoordinatesFromLocation = async (locationString) => {
  try {
    if (!locationString) {
      // Get current location
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              console.error('Geolocation error:', error);
              // Fallback to Mumbai coordinates
              resolve({ latitude: 19.0760, longitude: 72.8777 });
            }
          );
        } else {
          resolve({ latitude: 19.0760, longitude: 72.8777 });
        }
      });
    }
    
    // City coordinates mapping
    const cityCoordinates = {
      'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
      'Delhi': { latitude: 28.7041, longitude: 77.1025 },
      'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
      'Pune': { latitude: 18.5204, longitude: 73.8567 },
      'Chennai': { latitude: 13.0827, longitude: 80.2707 },
      'Hyderabad': { latitude: 17.3850, longitude: 78.4867 },
      'Kolkata': { latitude: 22.5726, longitude: 88.3639 },
      'Ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
      'Jaipur': { latitude: 26.9124, longitude: 75.7873 },
      'Lucknow': { latitude: 26.8467, longitude: 80.9462 }
    };
    
    // Check if location matches any city
    const cityName = Object.keys(cityCoordinates).find(city => 
      locationString.toLowerCase().includes(city.toLowerCase())
    );
    
    if (cityName) {
      return cityCoordinates[cityName];
    }
    
    // For other locations, use Google Maps API if available
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: locationString }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve({
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng()
            });
          } else {
            resolve({ latitude: 19.0760, longitude: 72.8777 });
          }
        });
      });
    }
    
    // Fallback to Mumbai coordinates
    return { latitude: 19.0760, longitude: 72.8777 };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return { latitude: 19.0760, longitude: 72.8777 };
  }
};

export default vehicleService;
