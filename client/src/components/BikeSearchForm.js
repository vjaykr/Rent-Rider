import React, { useState } from 'react';
import LocationAutocomplete from './LocationAutocomplete';

const BikeSearchForm = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    location: '',
    startDate: '',
    endDate: '',
    bikeType: ''
  });

  const handleLocationSelect = (locationData) => {
    setSearchData(prev => ({
      ...prev,
      location: locationData.address,
      placeId: locationData.placeId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchData);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Bike</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <LocationAutocomplete
              onLocationSelect={handleLocationSelect}
              placeholder="Where do you need a bike?"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={searchData.startDate}
              onChange={(e) => setSearchData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={searchData.endDate}
              onChange={(e) => setSearchData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={searchData.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Bike Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bike Type
            </label>
            <select
              value={searchData.bikeType}
              onChange={(e) => setSearchData(prev => ({ ...prev, bikeType: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="mountain">Mountain Bike</option>
              <option value="road">Road Bike</option>
              <option value="hybrid">Hybrid Bike</option>
              <option value="electric">Electric Bike</option>
              <option value="cruiser">Cruiser Bike</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Bikes
          </button>
        </div>
      </form>
    </div>
  );
};

export default BikeSearchForm;