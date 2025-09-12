import React, { useState, useEffect, useRef } from 'react';
import GoogleMapsService from '../services/googleMapsService';
import toast from 'react-hot-toast';

const LocationPicker = ({ onLocationSelect, initialLocation = null, className = '' }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      setLoading(true);
      const google = await GoogleMapsService.loadGoogleMapsAPI();
      
      // Default to Mumbai if no initial location
      let center = { lat: 19.0760, lng: 72.8777 };
      
      if (initialLocation) {
        center = initialLocation;
      } else {
        // Try to get user's current location
        try {
          const userLocation = await GoogleMapsService.getCurrentLocation();
          center = userLocation;
        } catch (locationError) {
          console.warn('Could not get user location:', locationError);
        }
      }

      const mapInstance = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: center,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      const markerInstance = new google.maps.Marker({
        position: center,
        map: mapInstance,
        draggable: true,
        animation: google.maps.Animation.DROP
      });

      // Add click listener to map
      mapInstance.addListener('click', (event) => {
        const newPosition = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        updateMarkerPosition(newPosition);
      });

      // Add drag listener to marker
      markerInstance.addListener('dragend', (event) => {
        const newPosition = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        updateMarkerPosition(newPosition);
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setCurrentLocation(center);
      
      if (onLocationSelect) {
        onLocationSelect(center);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to load Google Maps. Please check your internet connection.');
      toast.error('Failed to load map');
    } finally {
      setLoading(false);
    }
  };

  const updateMarkerPosition = async (position) => {
    if (marker) {
      marker.setPosition(position);
    }
    if (map) {
      map.panTo(position);
    }
    
    setCurrentLocation(position);
    
    if (onLocationSelect) {
      try {
        // Get address for the new position
        const addressInfo = await GoogleMapsService.reverseGeocode(position.lat, position.lng);
        onLocationSelect({
          ...position,
          address: addressInfo.formatted_address
        });
      } catch (error) {
        console.warn('Could not get address for location:', error);
        onLocationSelect(position);
      }
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const userLocation = await GoogleMapsService.getCurrentLocation();
      updateMarkerPosition(userLocation);
      toast.success('Location updated to your current position');
    } catch (error) {
      console.error('Error getting current location:', error);
      toast.error('Could not get your current location');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-600">{error}</p>
        <button
          onClick={initializeMap}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg border border-gray-300"
        style={{ minHeight: '256px' }}
      />
      
      <button
        onClick={getCurrentLocation}
        disabled={loading}
        className="absolute top-2 right-2 bg-white text-gray-700 p-2 rounded-lg shadow-lg hover:bg-gray-50 disabled:opacity-50"
        title="Get current location"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      
      {currentLocation && (
        <div className="mt-2 text-xs text-gray-600">
          Selected: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
