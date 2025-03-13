import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { OPENWEATHERMAP_API_KEY } from '../../utils/config';
import './LocationAutocomplete.css';
import { FaSearch, FaSpinner } from 'react-icons/fa';

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
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${OPENWEATHERMAP_API_KEY}`
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
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`
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
    <div className="location-autocomplete-container">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="relative flex-grow">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => value.length >= 3 && setShowSuggestions(true)}
            placeholder="Enter city, state or country..."
            className="input-field flex-grow px-4 py-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-full"
            autoComplete="on"
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
          
          {showSuggestions && suggestions.length > 0 && (
            <ul 
              ref={suggestionsRef}
              className="suggestions-list absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg z-10 max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className={`suggestion-item px-4 py-2 cursor-pointer hover:bg-gray-100 ${index === highlightedIndex ? 'bg-gray-100' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {suggestion.fullName}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <button 
          type="submit" 
          className="btn-primary rounded-l-none rounded-r-md px-4 py-2 flex items-center justify-center"
          disabled={isLoading}
          aria-label="Search"
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
        </button>
      </form>
    </div>
  );
};

export default LocationAutocomplete;