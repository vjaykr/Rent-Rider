import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LocationAutocomplete from '../../components/LocationAutocomplete';
import { vehicleService } from '../../services/vehicleService';

const Home = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchRadius, setSearchRadius] = useState('5');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isWatchingLocation, setIsWatchingLocation] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [locationPermission, setLocationPermission] = useState('unknown');
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  
  // Google Places API
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [placesService, setPlacesService] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeGooglePlaces();
        return;
      }

      // Skip loading if API key is not set (placeholder)
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'GOOGLE_MAPS_API_KEY';
      if (apiKey === 'GOOGLE_MAPS_API_KEY' || !apiKey) {
        console.warn('Google Maps API key not configured. Place autocomplete will not work.');
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      // Add error handling
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
      };
      
      // Define callback function
      window.initGoogleMaps = () => {
        setIsGoogleMapsLoaded(true);
        initializeGooglePlaces();
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();

    return () => {
      // Cleanup
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
    };
  }, []);

  const initializeGooglePlaces = () => {
    if (!window.google || !window.google.maps || !inputRef.current) {
      console.warn('Google Maps not loaded or input ref not available');
      return;
    }

    try {
      // Initialize autocomplete with Indian restrictions
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: ['in'] }, // Restrict to India
        fields: ['address_components', 'geometry', 'name', 'formatted_address'],
        types: ['geocode', 'establishment'] // Allow both addresses and places
      });

      autocompleteRef.current = autocomplete;

      // Listen for place selection
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (place.formatted_address) {
          setSearchLocation(place.formatted_address);
          
          // If place has geometry, update current position
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setCurrentPosition({ latitude: lat, longitude: lng });
          }
        }
      });

      console.log('Google Places Autocomplete initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Places:', error);
    }
  }; // 'granted', 'denied', 'prompt', 'unknown'

  // Check location permission on component mount
  React.useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        result.addEventListener('change', () => {
          setLocationPermission(result.state);
        });
      });
    }
  }, []);

  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      // Navigate to vehicles page with location and radius parameters
      navigate(`/vehicles?location=${encodeURIComponent(searchLocation.trim())}&radius=${searchRadius}`);
    }
  };

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Using a free geocoding service (you can replace with Google Maps API for production)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      if (data.locality && data.city) {
        return `${data.locality}, ${data.city}, ${data.principalSubdivision}`;
      } else if (data.city) {
        return `${data.city}, ${data.principalSubdivision}`;
      } else {
        return `${data.principalSubdivision}, ${data.countryName}`;
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentPosition({ latitude, longitude });
        setLocationAccuracy(accuracy);
        
        try {
          const address = await reverseGeocode(latitude, longitude);
          setSearchLocation(address);
          setIsGettingLocation(false);
        } catch (error) {
          console.error('Error getting address:', error);
          setSearchLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        console.error('Error getting location:', error);
        
        let errorMessage = 'Unable to get your current location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        alert(errorMessage);
      },
      options
    );
  };

  // Function to start watching location continuously
  const startWatchingLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000 // 30 seconds cache for watching
    };

    setIsWatchingLocation(true);
    
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentPosition({ latitude, longitude });
        setLocationAccuracy(accuracy);
        
        try {
          const address = await reverseGeocode(latitude, longitude);
          setSearchLocation(address);
        } catch (error) {
          console.error('Error getting address:', error);
        }
      },
      (error) => {
        console.error('Error watching location:', error);
        setIsWatchingLocation(false);
      },
      options
    );

    setWatchId(id);
  };

  // Function to stop watching location
  const stopWatchingLocation = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsWatchingLocation(false);
    }
  };

  // Load featured vehicles
  useEffect(() => {
    const loadFeaturedVehicles = async () => {
      try {
        setLoadingVehicles(true);
        const result = await vehicleService.getVehicles({ limit: 6, sortBy: 'rating' });
        
        if (result.success) {
          setFeaturedVehicles(result.data.vehicles || []);
        } else if (result.fallbackData) {
          setFeaturedVehicles(result.fallbackData.vehicles.slice(0, 6));
        }
      } catch (error) {
        console.error('Error loading featured vehicles:', error);
        // Use fallback data
        setFeaturedVehicles([
          {
            _id: 'featured-1',
            brand: 'Royal Enfield',
            model: 'Classic 350',
            type: 'motorcycle',
            pricing: { hourlyRate: 100, dailyRate: 800 },
            location: { city: 'Mumbai', address: 'Bandra West' },
            rating: { average: 4.8 },
            images: [{ url: '/api/placeholder/300/200' }],
            availability: { isAvailable: true }
          },
          {
            _id: 'featured-2',
            brand: 'Honda',
            model: 'Activa 6G',
            type: 'scooter',
            pricing: { hourlyRate: 60, dailyRate: 400 },
            location: { city: 'Mumbai', address: 'Andheri East' },
            rating: { average: 4.6 },
            images: [{ url: '/api/placeholder/300/200' }],
            availability: { isAvailable: true }
          },
          {
            _id: 'featured-3',
            brand: 'Bajaj',
            model: 'Pulsar NS200',
            type: 'motorcycle',
            pricing: { hourlyRate: 80, dailyRate: 600 },
            location: { city: 'Bangalore', address: 'Koramangala' },
            rating: { average: 4.5 },
            images: [{ url: '/api/placeholder/300/200' }],
            availability: { isAvailable: true }
          }
        ]);
      } finally {
        setLoadingVehicles(false);
      }
    };

    loadFeaturedVehicles();
  }, []);

  // Cleanup on component unmount
  React.useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Rydigo
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Your trusted bike rental platform. Find and rent bikes easily and safely 
            from verified owners in your city.
          </p>

          {/* Location Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            {/* Location Permission Status */}
            {locationPermission !== 'unknown' && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                locationPermission === 'granted' 
                  ? 'bg-green-100 border border-green-300 text-green-800'
                  : locationPermission === 'denied'
                  ? 'bg-red-100 border border-red-300 text-red-800'
                  : 'bg-yellow-100 border border-yellow-300 text-yellow-800'
              }`}>
                <div className="flex items-center">
                  {locationPermission === 'granted' && (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>✅ Location access granted - You can use live location features</span>
                    </>
                  )}
                  {locationPermission === 'denied' && (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>❌ Location access denied - Please enable location in browser settings to use GPS features</span>
                    </>
                  )}
                  {locationPermission === 'prompt' && (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>ℹ️ Click "Current" button to allow location access for precise bike search</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleLocationSearch} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Search Location
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <LocationAutocomplete
                        placeholder="Enter city, area, or landmark"
                        onLocationSelect={(location) => {
                          setSearchLocation(location.address);
                          if (location.coordinates) {
                            setCurrentPosition({
                              latitude: location.coordinates[1],
                              longitude: location.coordinates[0]
                            });
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className={`px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                        isGettingLocation 
                          ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                          : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                      }`}
                    >
                      {isGettingLocation ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-48">
                  <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Search Radius
                  </label>
                  <select
                    id="radius"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="2">Within 2 km</option>
                    <option value="5">Within 5 km</option>
                    <option value="10">Within 10 km</option>
                    <option value="20">Within 20 km</option>
                    <option value="50">Within 50 km</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Bikes
                </button>
              </div>

              {/* Popular Locations */}
              <div className="mt-4 text-left">
                <p className="text-sm text-gray-600 mb-2">Popular locations:</p>
                <div className="flex flex-wrap gap-2">
                  {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'vadodara' , 'kota', 'Hyderabad'].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setSearchLocation(city);
                        // Trigger a search for the city to get coordinates
                        const searchCity = async () => {
                          try {
                            const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
                            
                            if (apiKey && apiKey.trim() && apiKey !== 'your_geoapify_api_key_here') {
                              // Use Geoapify API
                              const response = await fetch(
                                `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&bias=countrycode:in&apiKey=${apiKey}`
                              );
                              const data = await response.json();
                              if (data.features && data.features.length > 0) {
                                const coords = data.features[0].geometry.coordinates;
                                setCurrentPosition({
                                  latitude: coords[1],
                                  longitude: coords[0]
                                });
                              }
                            } else {
                              // Fallback to Nominatim
                              const response = await fetch(
                                `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(city)}`,
                                { headers: { 'User-Agent': 'RentRider-App' } }
                              );
                              const data = await response.json();
                              if (data && data.length > 0) {
                                setCurrentPosition({
                                  latitude: parseFloat(data[0].lat),
                                  longitude: parseFloat(data[0].lon)
                                });
                              }
                            }
                          } catch (error) {
                            console.error('Error geocoding city:', error);
                          }
                        };
                        searchCity();
                      }}
                      className="px-3 py-1 text-xs bg-green-400 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Location Info */}
              {currentPosition && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${isWatchingLocation ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
                      <span className="text-sm font-medium text-green-800">
                        {isWatchingLocation ? 'Live Location Tracking' : 'Location Detected'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {!isWatchingLocation ? (
                        <button
                          onClick={startWatchingLocation}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                        >
                          Track Live
                        </button>
                      ) : (
                        <button
                          onClick={stopWatchingLocation}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                        >
                          Stop Tracking
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-green-700 space-y-1">
                    <div className="flex justify-between">
                      <span>📍 Latitude:</span>
                      <span className="font-mono">{currentPosition.latitude.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>📍 Longitude:</span>
                      <span className="font-mono">{currentPosition.longitude.toFixed(6)}</span>
                    </div>
                    {locationAccuracy && (
                      <div className="flex justify-between">
                        <span>🎯 Accuracy:</span>
                        <span className="font-mono">
                          ±{Math.round(locationAccuracy)}m
                          {locationAccuracy < 10 && ' (High Precision)'}
                          {locationAccuracy >= 10 && locationAccuracy < 50 && ' (Good)'}
                          {locationAccuracy >= 50 && ' (Approximate)'}
                        </span>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <div className="flex items-center text-green-600">
                        {isWatchingLocation ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping mr-2"></div>
                            <span>Continuously updating location...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Location locked</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="space-x-4">
            <Link to="/vehicles" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse All Bikes
            </Link>
            <Link to="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose RentRider?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make bike rental simple, safe, and affordable for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚲</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Choose from hundreds of bikes including electric bikes, motorcycles, and bicycles.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">All bikes are verified and insured. Secure payment with full protection.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive rates with flexible pricing options - hourly, daily, or monthly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Vehicles Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Bikes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover popular bikes available for rent in your city
            </p>
          </div>
          
          {loadingVehicles ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={vehicle.images?.[0]?.url || '/api/placeholder/300/200'}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Available
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {vehicle.rating?.average?.toFixed(1) || '4.5'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 capitalize">
                      {vehicle.type} • {vehicle.location.city}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{vehicle.pricing.hourlyRate}/hour
                        </p>
                        <p className="text-sm text-gray-600">
                          ₹{vehicle.pricing.dailyRate}/day
                        </p>
                      </div>
                    </div>
                    
                    <Link
                      to={`/vehicles/${vehicle._id}`}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link
              to="/vehicles"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              View All Bikes
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-300 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Riding?</h2>
          <p className="text-lg mb-8">Join thousands of happy riders on RentRider</p>
          <div className="space-x-4">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Sign Up Now
            </Link>
            <Link 
              to="/vehicles" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
            >
              Browse Bikes
            </Link>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Home;
