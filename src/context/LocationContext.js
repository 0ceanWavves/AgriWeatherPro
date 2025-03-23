import React, { createContext, useContext, useState, useEffect } from 'react';

// Create LocationContext
const LocationContext = createContext();

// Sample default location (California for AgriWeather's default)
const DEFAULT_LOCATION = {
  id: 'default',
  name: 'Central Valley',
  region: 'California',
  country: 'United States',
  latitude: 36.7783,
  longitude: -119.4179
};

// Sample locations for testing
const SAMPLE_LOCATIONS = [
  DEFAULT_LOCATION,
  {
    id: 'location-1',
    name: 'Napa Valley',
    region: 'California',
    country: 'United States',
    latitude: 38.5025,
    longitude: -122.2654
  },
  {
    id: 'location-2',
    name: 'Salinas Valley',
    region: 'California',
    country: 'United States',
    latitude: 36.4761,
    longitude: -121.4437
  },
  {
    id: 'location-3',
    name: 'Central Iowa',
    region: 'Iowa',
    country: 'United States',
    latitude: 41.8780,
    longitude: -93.0977
  }
];

// LocationProvider component
export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState(SAMPLE_LOCATIONS);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user's location via browser geolocation (if available)
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // In a production app, you would reverse geocode here to get location name
            // For now, we'll just use the coordinates
            const newLocation = {
              id: 'user-location',
              name: 'Current Location',
              region: 'Detected',
              country: 'Based on GPS',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            
            // Add to locations list if not already present
            setLocations(prevLocations => {
              const exists = prevLocations.some(loc => loc.id === 'user-location');
              return exists ? prevLocations : [...prevLocations, newLocation];
            });
            
            // Set as current location
            setCurrentLocation(newLocation);
            setLoading(false);
          } catch (err) {
            console.error('Error processing location:', err);
            setError('Failed to process location. Using default.');
            setLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Unable to access your location. Using default.');
          setLoading(false);
        }
      );
    }
  }, []);

  // Function to get location by ID
  const getUserLocation = (locationId) => {
    return locations.find(loc => loc.id === locationId) || null;
  };

  // Function to add a new location
  const addLocation = (location) => {
    setLocations(prevLocations => [...prevLocations, location]);
  };

  // Function to set the current location
  const selectLocation = (locationId) => {
    const location = getUserLocation(locationId);
    if (location) {
      setCurrentLocation(location);
    }
  };

  // Context value
  const value = {
    locations,
    currentLocation,
    loading,
    error,
    getUserLocation,
    addLocation,
    selectLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook for using the location context
export const useGlobalLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useGlobalLocation must be used within a LocationProvider');
  }
  return context;
};
