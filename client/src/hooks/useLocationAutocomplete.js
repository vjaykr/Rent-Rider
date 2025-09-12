import { useState, useEffect, useRef } from 'react';
import locationService from '../services/locationService';

const useLocationAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const debounceRef = useRef(null);

  const searchPlaces = async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await locationService.getPlaceSuggestions(searchQuery);
      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);
  };

  const selectLocation = async (suggestion) => {
    setQuery(suggestion.properties.formatted);
    setSuggestions([]);
    
    setSelectedLocation({
      address: suggestion.properties.formatted,
      placeId: suggestion.properties.place_id || suggestion.properties.osm_id,
      coordinates: {
        lat: suggestion.geometry.coordinates[1],
        lon: suggestion.geometry.coordinates[0]
      }
    });
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const coords = await locationService.getCurrentLocation();
      const address = await locationService.getAddressFromCoordinates(coords.lat, coords.lng);
      
      if (address) {
        setQuery(address);
        setSelectedLocation({
          address,
          coordinates: coords,
          placeId: null
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    query,
    suggestions,
    isLoading,
    selectedLocation,
    handleInputChange,
    selectLocation,
    getCurrentLocation
  };
};

export default useLocationAutocomplete;