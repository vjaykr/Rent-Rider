import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationAutocomplete from '../components/LocationAutocomplete';

const Search = () => {
  const [filters, setFilters] = useState({
    location: '',
    vehicleType: '',
    priceRange: '',
    availability: 'all'
  });
  
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationSelect = (locationData) => {
    setFilters({
      ...filters,
      location: locationData.address
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/vehicles?${queryParams.toString()}`);
  };

  const vehicleTypes = [
    { value: '', label: 'All Types' },
    { value: 'bike', label: 'Bike' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'car', label: 'Car' },
    { value: 'motorcycle', label: 'Motorcycle' }
  ];

  const priceRanges = [
    { value: '', label: 'All Prices' },
    { value: '0-50', label: '₹0 - ₹50' },
    { value: '51-100', label: '₹51 - ₹100' },
    { value: '101-200', label: '₹101 - ₹200' },
    { value: '201-500', label: '₹201 - ₹500' },
    { value: '500+', label: '₹500+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Ride</h1>
          <p className="text-gray-600">
            Use our advanced search filters to find the perfect vehicle for your needs
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <LocationAutocomplete
                  onLocationSelect={handleLocationSelect}
                  placeholder="Enter city or area"
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={filters.vehicleType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {vehicleTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  id="priceRange"
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={filters.availability}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Vehicles</option>
                  <option value="available">Available Now</option>
                  <option value="today">Available Today</option>
                  <option value="tomorrow">Available Tomorrow</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Search Vehicles
              </button>
            </div>
          </form>
        </div>

        {/* Quick Search Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => navigate('/vehicles?vehicleType=bike')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Bikes</h3>
            <p className="text-gray-600 text-center text-sm">Eco-friendly and efficient</p>
          </div>

          <div 
            onClick={() => navigate('/vehicles?vehicleType=scooter')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Scooters</h3>
            <p className="text-gray-600 text-center text-sm">Quick and convenient</p>
          </div>

          <div 
            onClick={() => navigate('/vehicles?vehicleType=car')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Cars</h3>
            <p className="text-gray-600 text-center text-sm">Comfortable and spacious</p>
          </div>

          <div 
            onClick={() => navigate('/vehicles?vehicleType=motorcycle')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Motorcycles</h3>
            <p className="text-gray-600 text-center text-sm">Powerful and stylish</p>
          </div>
        </div>

        {/* Popular Locations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Popular Locations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur'].map(city => (
              <button
                key={city}
                onClick={() => navigate(`/vehicles?location=${city}`)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
