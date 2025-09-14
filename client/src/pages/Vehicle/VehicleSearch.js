import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSecureAuth } from '../../context/SecureAuthContext';
import { vehicleService } from '../../services/vehicleService';

const VehicleSearch = () => {
  const { isAuthenticated } = useSecureAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    radius: searchParams.get('radius') || '5',
    vehicleType: searchParams.get('type') || '',
    priceRange: searchParams.get('price') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuel') || '',
    availability: searchParams.get('availability') || 'available',
    sortBy: searchParams.get('sort') || 'price'
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInfo, setSearchInfo] = useState(null);

  // Get user's coordinates from location string or GPS
  const getUserCoordinates = async (locationString) => {
    try {
      if (locationString) {
        // Mock coordinates based on city names
        const cityCoordinates = {
          'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
          'Delhi': { latitude: 28.7041, longitude: 77.1025 },
          'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
          'Pune': { latitude: 18.5204, longitude: 73.8567 },
          'Chennai': { latitude: 13.0827, longitude: 80.2707 },
          'Hyderabad': { latitude: 17.3850, longitude: 78.4867 }
        };
        
        const cityName = Object.keys(cityCoordinates).find(city => 
          locationString.toLowerCase().includes(city.toLowerCase())
        );
        
        if (cityName) {
          return cityCoordinates[cityName];
        }
      }
      
      // Try to get current location
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            () => {
              resolve({ latitude: 19.0760, longitude: 72.8777 });
            }
          );
        } else {
          resolve({ latitude: 19.0760, longitude: 72.8777 });
        }
      });
    } catch (error) {
      console.error('Error getting coordinates:', error);
      return { latitude: 19.0760, longitude: 72.8777 };
    }
  };

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user coordinates
      const coordinates = await getUserCoordinates(filters.location);
      
      // Prepare filters for the service
      const serviceFilters = {
        location: filters.location,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        radius: filters.radius,
        vehicleType: filters.vehicleType,
        priceRange: filters.priceRange,
        transmission: filters.transmission,
        fuelType: filters.fuelType,
        availability: filters.availability,
        sortBy: filters.sortBy
      };
      
      // Make API call using vehicle service
      const result = await vehicleService.getVehicles(serviceFilters);
      
      if (result.success) {
        setVehicles(result.data.vehicles);
        setSearchInfo(result.data.searchInfo);
      } else {
        // Use fallback data if API fails
        setError('Failed to fetch vehicles. Showing available vehicles.');
        setVehicles(result.fallbackData.vehicles);
        setSearchInfo(result.fallbackData.searchInfo);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to fetch vehicles. Please try again.');
      
      // Fallback to mock data
      setVehicles([
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Load vehicles when component mounts or filters change
  useEffect(() => {
    fetchVehicles();
  }, [filters.location, filters.radius, filters.vehicleType, filters.priceRange, filters.transmission, filters.fuelType, filters.availability, filters.sortBy]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for bikes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Vehicles</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchVehicles}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Available Bikes
          </h1>
          
          {/* Search Context */}
          {filters.location && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-blue-800 font-medium">
                    Searching in: {filters.location}
                  </p>
                  <p className="text-blue-600 text-sm">
                    Within {filters.radius} km • {searchInfo?.resultsFound || vehicles.length} bikes found
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results count and sorting */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {vehicles.length} bikes available
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="distance">Distance (Near to Far)</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              
              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={filters.vehicleType}
                  onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="scooter">Scooter</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="electric-bike">Electric Bike</option>
                  <option value="electric-scooter">Electric Scooter</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Fuel Types</option>
                  <option value="petrol">Petrol</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (Per Day)
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Prices</option>
                  <option value="0-300">₹0 - ₹300</option>
                  <option value="300-600">₹300 - ₹600</option>
                  <option value="600-1000">₹600 - ₹1000</option>
                  <option value="1000-2000">₹1000 - ₹2000</option>
                  <option value="2000-999999">₹2000+</option>
                </select>
              </div>

              {/* Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius
                </label>
                <select
                  value={filters.radius}
                  onChange={(e) => handleFilterChange('radius', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2">Within 2 km</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="20">Within 20 km</option>
                  <option value="50">Within 50 km</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available Now</option>
                  <option value="all">All Vehicles</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Grid */}
        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bikes found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search filters or location to find more bikes.
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search Again
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Vehicle Image */}
                <div className="relative">
                  <img
                    src={vehicle.images?.[0]?.url || '/api/placeholder/300/200'}
                    alt={vehicle.name || `${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Distance Badge */}
                  {vehicle.distance && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {formatDistance(vehicle.distance)}
                    </div>
                  )}
                  
                  {/* Availability Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                    vehicle.availability?.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.availability?.isAvailable ? 'Available' : 'Not Available'}
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vehicle.name || `${vehicle.brand} ${vehicle.model}`}
                    </h3>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {vehicle.rating?.average > 0 ? vehicle.rating.average.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="text-sm text-gray-600 mb-3">
                    <p className="flex items-center mb-1">
                      <span className="capitalize">{vehicle.type}</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{vehicle.fuelType}</span>
                      <span className="mx-2">•</span>
                      <span>{vehicle.year}</span>
                    </p>
                    <p className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {vehicle.location.address}, {vehicle.location.city}
                    </p>
                  </div>

                  {/* Features */}
                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {vehicle.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                        {vehicle.features.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            +{vehicle.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(vehicle.pricing.hourlyRate)}/hour
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(vehicle.pricing.dailyRate)}/day
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Owner</p>
                      <p className="text-sm font-medium">{vehicle.owner?.name || vehicle.owner?.firstName || 'Owner'}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/vehicle/${vehicle._id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                    >
                      View Details
                    </Link>
                    {vehicle.availability?.isAvailable && (
                      <Link
                        to={isAuthenticated ? `/booking/${vehicle._id}` : '/login'}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                      >
                        Book Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleSearch;
