import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { OPENWEATHERMAP_API_KEY } from '../../utils/config';
import './LocationAutocomplete.css';
import { FaSearch, FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';

const LocationAutocomplete = ({ onLocationSelect }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch suggestions from OpenWeatherMap Geocoding API
  const fetchSuggestions = async (input) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=deeaa95f4b7b2543dc8c3d9cb96396c6`
      );
      
      const formattedSuggestions = response.data.map(location => ({
        name: location.name,
        fullName: location.state 
          ? `${location.name}, ${location.state}, ${location.country}`
          : `${location.name}, ${location.country}`,
        lat: location.lat,
        lon: location.lon,
        country: location.country
      }));
      
      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (newValue.length >= 3) {
      fetchSuggestions(newValue);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
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

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Arrow down
    if (e.keyCode === 40 && suggestions.length > 0) {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
    // Arrow up
    else if (e.keyCode === 38 && suggestions.length > 0) {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : 0
      );
    }
    // Enter
    else if (e.keyCode === 13) {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSuggestionClick(suggestions[highlightedIndex]);
        e.preventDefault();
      } else if (value.length >= 3) {
        // Submit form if no suggestion is selected
        handleSubmit(e);
      }
    }
    // Escape
    else if (e.keyCode === 27) {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion.fullName);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    
    onLocationSelect({
      name: suggestion.name,
      lat: suggestion.lat,
      lon: suggestion.lon,
      country: suggestion.country
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (value.length < 3) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=1&appid=deeaa95f4b7b2543dc8c3d9cb96396c6`
      );
      
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        onLocationSelect({
          name: location.name,
          lat: location.lat,
          lon: location.lon,
          country: location.country
        });
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    } finally {
      setIsLoading(false);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="forecast-search">
      <form onSubmit={handleSubmit} className="flex w-full relative">
        <div className="relative flex-grow">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FaMapMarkerAlt />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => value.length >= 3 && setShowSuggestions(true)}
            placeholder="Search for a city or zip code..."
            className="w-full pl-10 pr-10 py-3 border-2 border-green-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 shadow-md"
            autoComplete="off"
            autoCorrect="on"
            spellCheck="true"
            list="common-locations"
          />
          <datalist id="common-locations">
            <option value="New York, US">New York, US</option>
            <option value="London, GB">London, GB</option>
            <option value="Tokyo, JP">Tokyo, JP</option>
            <option value="Paris, FR">Paris, FR</option>
            <option value="Dubai, AE">Dubai, AE</option>
            <option value="Beijing, CN">Beijing, CN</option>
            <option value="Los Angeles, US">Los Angeles, US</option>
            <option value="Mumbai, IN">Mumbai, IN</option>
            <option value="Sydney, AU">Sydney, AU</option>
            <option value="Berlin, DE">Berlin, DE</option>
            <option value="20001">Washington DC, US</option>
            <option value="90210">Beverly Hills, US</option>
            <option value="75001">Paris, FR</option>
          </datalist>
          
          <button 
            type="submit" 
            className="absolute right-0 top-0 bottom-0 px-4 bg-green-700 hover:bg-green-800 text-white rounded-r-full transition-colors"
            disabled={isLoading}
            aria-label="Search"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
          </button>
          
          {showSuggestions && suggestions.length > 0 && (
            <ul 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto divide-y divide-gray-100"
            >
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className={`py-3 px-4 cursor-pointer transition-colors flex items-center
                    ${index === highlightedIndex ? 'bg-green-50' : 'hover:bg-green-50'}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <FaMapMarkerAlt className="text-green-600 mr-2" />
                  <span>{suggestion.fullName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
};

export default LocationAutocomplete;