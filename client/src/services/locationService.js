class LocationService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
    this.baseUrl = 'https://api.geoapify.com/v1';
  }

  // Get place autocomplete suggestions
  async getPlaceSuggestions(input, options = {}) {
    try {
      const requestOptions = {
        method: 'GET',
      };
      
      const response = await fetch(
        `${this.baseUrl}/geocode/autocomplete?text=${encodeURIComponent(input)}&apiKey=${this.apiKey}`,
        requestOptions
      );
      
      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Error fetching place suggestions:', error);
      return [];
    }
  }

  // Get place details by coordinates
  async getPlaceDetails(lat, lon) {
    try {
      const requestOptions = {
        method: 'GET',
      };
      
      const response = await fetch(
        `${this.baseUrl}/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${this.apiKey}`,
        requestOptions
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0];
      }
      throw new Error('Failed to fetch place details');
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  // Get user's current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  // Reverse geocoding - get address from coordinates
  async getAddressFromCoordinates(lat, lon) {
    try {
      const requestOptions = {
        method: 'GET',
      };
      
      const response = await fetch(
        `${this.baseUrl}/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${this.apiKey}`,
        requestOptions
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].properties.formatted;
      }
      throw new Error('No address found');
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  // Calculate distance between two points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

export default new LocationService();