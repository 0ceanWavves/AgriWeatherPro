import React, { createContext, useState, useContext } from 'react';

// Create the Location Context
const LocationContext = createContext();

// Location Provider Component
export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null); // Or your default location state

  const setLocation = (location) => {
    setCurrentLocation(location);
  };

  return (
    <LocationContext.Provider value={{ currentLocation, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the location context
export const useGlobalLocation = () => {
  return useContext(LocationContext);
}; 