import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaSearch, FaGlobeAmericas, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

const GlobalLocationSelector = ({ onLocationSelect, currentLocation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentLocations, setRecentLocations] = useState([]);
  const [popularLocations, setPopularLocations] = useState([
    { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
    { name: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
    { name: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
    { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
    { name: "New Delhi", country: "India", lat: 28.6139, lng: 77.2090 }
  ]);
  
  const wrapperRef = useRef(null);

  // Load recent locations from localStorage on component mount
  useEffect(() => {
    const savedLocations = localStorage.getItem('recentLocations');
    if (savedLocations) {
      setRecentLocations(JSON.parse(savedLocations));
    }
  }, []);

  // Save recent locations to localStorage when updated
  useEffect(() => {
    if (recentLocations.length > 0) {
      localStorage.setItem('recentLocations', JSON.stringify(recentLocations));
    }
  }, [recentLocations]);

  // Handle clicks outside the component to close suggestion box
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Search for locations using OpenWeatherMap Geocoding API
  const searchLocations = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6'; // Should use env variable
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${apiKey}`
      );

      if (response.data && response.data.length > 0) {
        const formattedSuggestions = response.data.map(location => ({
          name: location.name,
          country: location.country,
          state: location.state,
          lat: location.lat,
          lng: location.lon,
          fullName: location.state 
            ? `${location.name}, ${location.state}, ${location.country}`
            : `${location.name}, ${location.country}`
        }));
        
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle location selection
  const handleSelectLocation = (location) => {
    // Call the parent component's handler
    onLocationSelect(location);
    
    // Add to recent locations if not already present
    const exists = recentLocations.some(loc => 
      loc.lat === location.lat && loc.lng === location.lng
    );
    
    if (!exists) {
      const updatedRecent = [location, ...recentLocations.slice(0, 4)];
      setRecentLocations(updatedRecent);
    }
    
    // Reset UI state
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <div className="mb-4" ref={wrapperRef}>
      <h2 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
        <FaGlobeAmericas className="mr-2" /> Global Location Selector
      </h2>
      
      <div className="relative">
        <div className="flex items-center">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600">
            <FaMapMarkerAlt />
          </div>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.length >= 3) {
                searchLocations(e.target.value);
              } else {
                setSuggestions([]);
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (searchTerm.length >= 3) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Search for any location worldwide..."
            className="w-full pl-10 pr-10 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          
          <button
            onClick={() => searchLocations(searchTerm)}
            disabled={searchTerm.length < 3 || loading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800 disabled:text-gray-400"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
          </button>
        </div>
        
        {/* Location suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-green-200 overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer flex items-center"
                  onClick={() => handleSelectLocation(suggestion)}
                >
                  <FaMapMarkerAlt className="text-green-600 mr-2" />
                  <span>{suggestion.fullName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Show "no results" message */}
        {showSuggestions && searchTerm.length >= 3 && suggestions.length === 0 && !loading && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-green-200 p-3 text-center text-gray-500">
            No locations found. Try a different search term.
          </div>
        )}
      </div>
      
      {/* Current location indicator */}
      {currentLocation && (
        <div className="mt-2 text-sm text-green-800 bg-green-50 p-2 rounded-lg flex items-center">
          <FaMapMarkerAlt className="mr-1" /> 
          Current: {currentLocation.name || 'Custom Location'} ({currentLocation.lat.toFixed(2)}, {currentLocation.lng.toFixed(2)})
        </div>
      )}
      
      {/* Quick access buttons */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {/* Recent locations */}
          {recentLocations.length > 0 && (
            <div className="w-full">
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Recent Locations</h3>
              <div className="flex flex-wrap gap-2">
                {recentLocations.map((location, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={() => handleSelectLocation(location)}
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 border border-blue-200"
                  >
                    {location.name}, {location.country}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Popular locations */}
          <div className="w-full mt-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Popular Locations</h3>
            <div className="flex flex-wrap gap-2">
              {popularLocations.map((location, index) => (
                <button
                  key={`popular-${index}`}
                  onClick={() => handleSelectLocation(location)}
                  className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100 border border-green-200"
                >
                  {location.name}, {location.country}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLocationSelector;