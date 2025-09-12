// Google Maps API Service
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export class GoogleMapsService {
  static isLoaded = false;
  static loadPromise = null;

  // Load Google Maps API
  static async loadGoogleMapsAPI() {
    if (this.isLoaded) {
      return window.google;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      if (window.google) {
        this.isLoaded = true;
        resolve(window.google);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded = true;
        resolve(window.google);
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
      };
      
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // Get user's current location
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
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
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Geocode address to coordinates
  static async geocodeAddress(address) {
    const google = await this.loadGoogleMapsAPI();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            formatted_address: results[0].formatted_address
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }

  // Reverse geocode coordinates to address
  static async reverseGeocode(lat, lng) {
    const google = await this.loadGoogleMapsAPI();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            formatted_address: results[0].formatted_address,
            address_components: results[0].address_components
          });
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      });
    });
  }

  // Get place predictions for autocomplete
  static async getPlacePredictions(input, options = {}) {
    const google = await this.loadGoogleMapsAPI();
    const service = new google.maps.places.AutocompleteService();

    return new Promise((resolve, reject) => {
      service.getPlacePredictions(
        {
          input,
          types: options.types || ['geocode'],
          componentRestrictions: options.componentRestrictions || { country: 'in' }
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(predictions || []);
          } else {
            reject(new Error(`Place predictions failed: ${status}`));
          }
        }
      );
    });
  }

  // Get place details
  static async getPlaceDetails(placeId) {
    const google = await this.loadGoogleMapsAPI();
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId,
          fields: ['place_id', 'formatted_address', 'geometry', 'name']
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve({
              place_id: place.place_id,
              formatted_address: place.formatted_address,
              name: place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });
          } else {
            reject(new Error(`Place details failed: ${status}`));
          }
        }
      );
    });
  }

  // Calculate distance between two points
  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Get directions between two points
  static async getDirections(origin, destination, travelMode = 'DRIVING') {
    const google = await this.loadGoogleMapsAPI();
    const service = new google.maps.DirectionsService();

    return new Promise((resolve, reject) => {
      service.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode[travelMode]
        },
        (result, status) => {
          if (status === 'OK') {
            resolve(result);
          } else {
            reject(new Error(`Directions failed: ${status}`));
          }
        }
      );
    });
  }
}

export default GoogleMapsService;
