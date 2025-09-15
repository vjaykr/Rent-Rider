import React, { useState, useEffect, useRef } from 'react';

const LocationAutocomplete = ({ onLocationSelect, placeholder = "Enter location..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;

  // Fallback locations for India
  const fallbackLocations = [
    'Mumbai, Maharashtra',
    'Delhi, Delhi',
    'Bangalore, Karnataka',
    'Pune, Maharashtra',
    'Chennai, Tamil Nadu',
    'Hyderabad, Telangana',
    'Kolkata, West Bengal',
    'Ahmedabad, Gujarat',
    'Surat, Gujarat',
    'Jaipur, Rajasthan',
    'Lucknow, Uttar Pradesh',
    'Kanpur, Uttar Pradesh',
    'Nagpur, Maharashtra',
    'Indore, Madhya Pradesh',
    'Thane, Maharashtra',
    'Bhopal, Madhya Pradesh',
    'Visakhapatnam, Andhra Pradesh',
    'Pimpri-Chinchwad, Maharashtra',
    'Patna, Bihar',
    'Vadodara, Gujarat',
    'Ghaziabad, Uttar Pradesh',
    'Ludhiana, Punjab',
    'Agra, Uttar Pradesh',
    'Nashik, Maharashtra',
    'Faridabad, Haryana',
    'Meerut, Uttar Pradesh',
    'Rajkot, Gujarat',
    'Kalyan-Dombivali, Maharashtra',
    'Vasai-Virar, Maharashtra',
    'Varanasi, Uttar Pradesh'
  ];

  const searchPlaces = async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Use Geoapify API if key is available
      if (API_KEY && API_KEY.trim() && API_KEY !== 'your_geoapify_api_key_here') {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchQuery)}&bias=countrycode:in&apiKey=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Geoapify API error: ${response.status}`);
        }
        
        const data = await response.json();
        setSuggestions(data.features || []);
      } else {
        // Fallback to Nominatim if no Geoapify key
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&countrycodes=in&q=${encodeURIComponent(searchQuery)}`;
        
        const response = await fetch(url, {
          headers: { 'User-Agent': 'RentRider-App' }
        });
        
        if (!response.ok) {
          throw new Error(`Nominatim API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const formattedSuggestions = data.map((item, index) => ({
          properties: {
            formatted: item.display_name,
            place_id: item.place_id || `nominatim_${index}`
          },
          geometry: {
            coordinates: [parseFloat(item.lon), parseFloat(item.lat)]
          }
        }));
        
        setSuggestions(formattedSuggestions);
      }
      
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching places:', error);
      // Fallback to local filtering on any error
      const filtered = fallbackLocations
        .filter(location => 
          location.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 10)
        .map((location, index) => ({
          properties: {
            formatted: location,
            place_id: `fallback_${index}`
          },
          geometry: {
            coordinates: [0, 0]
          }
        }));
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 500);
  };

  const handleSuggestionClick = (suggestion) => {
    const address = suggestion.properties.formatted;
    setQuery(address);
    setShowSuggestions(false);
    setSuggestions([]);
    
    if (onLocationSelect) {
      onLocationSelect({
        address: address,
        coordinates: suggestion.geometry.coordinates,
        placeId: suggestion.properties.place_id || suggestion.properties.osm_id
      });
    }
  };

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {showSuggestions && query.length > 1 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion.properties.place_id || suggestion.properties.osm_id || index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">{suggestion.properties.formatted}</span>
                </div>
              </div>
            ))
          ) : query.length > 2 ? (
            <div className="p-3 text-center text-gray-500 text-sm">
              No locations found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;