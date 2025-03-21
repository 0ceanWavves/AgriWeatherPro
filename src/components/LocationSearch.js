import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

// Mock geocoding API data
const mockGeocodeResults = {
  "Dubai": { lat: 25.276987, lon: 55.296249 },
  "Dublin": { lat: 53.349805, lon: -6.26031 },
  "Dubrovnik": { lat: 42.650661, lon: 18.094424 },
  "Dubuque": { lat: 42.504321, lon: -90.664413 },
  "Duluth": { lat: 46.786671, lon: -92.100487 },
  "Durban": { lat: -29.857901, lon: 31.029399 },
  "Durham": { lat: 35.994034, lon: -78.898621 },
  "Denver": { lat: 39.739235, lon: -104.990250 },
  "Dallas": { lat: 32.776665, lon: -96.796989 },
  "Delhi": { lat: 28.651718, lon: 77.221939 }
};

const LocationSearch = ({ onLocationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Filter suggestions based on search term
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filteredLocations = Object.keys(mockGeocodeResults).filter(city => 
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredLocations);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    // Handle search for current term
    if (searchTerm && mockGeocodeResults[searchTerm]) {
      onLocationSelect({
        name: searchTerm,
        lat: mockGeocodeResults[searchTerm].lat,
        lng: mockGeocodeResults[searchTerm].lon
      });
      setShowSuggestions(false);
    } else if (searchTerm && suggestions.length > 0) {
      // If there's no exact match but we have suggestions, use the first one
      const firstSuggestion = suggestions[0];
      onLocationSelect({
        name: firstSuggestion,
        lat: mockGeocodeResults[firstSuggestion].lat,
        lng: mockGeocodeResults[firstSuggestion].lon
      });
      setSearchTerm(firstSuggestion);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onLocationSelect({
      name: suggestion,
      lat: mockGeocodeResults[suggestion].lat,
      lng: mockGeocodeResults[suggestion].lon
    });
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="flex" ref={inputRef}>
        <div className="relative flex-grow">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a location..."
            className="pl-8 pr-8 py-1 w-full rounded-l-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-xs"
          />
          <FaSearch className="absolute left-2.5 top-1.5 text-gray-400 h-3 w-3" />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="h-3 w-3" />
            </button>
          )}
        </div>
        <button 
          onClick={handleSearch}
          className="bg-green-600 text-white rounded-r-md px-3 py-1 text-xs flex items-center"
        >
          Latest Data
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;