import React, { useState, useEffect, useRef } from 'react';
// REMOVE React-Leaflet imports as they conflict with direct Leaflet usage
// import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  FaTemperatureHigh, 
  FaCloudRain, 
  FaWind, 
  FaCloud, 
  FaTachometerAlt, 
  FaWater, 
  FaTint, 
  FaSeedling, 
  FaLock, 
  FaExchangeAlt, 
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaGlobeAmericas
} from 'react-icons/fa';
import { WiDaySunny } from 'react-icons/wi';

import LocationAutocomplete from '../LocationAutocomplete';
import { fetchWeatherData } from '../../utils/weatherUtils';
import { fetchSimulatedCropData, fetchSimulatedIrrigationNeeds } from '../../utils/simulationUtils';
import { fetchRealWeatherData } from '../../services/weatherService';
import { fetchTradeEvents, fetchTradeEventsCount, fetchTariffRates, convertTradeEventsToGeoJSON } from '../../utils/tradeApiUtils';

// Function to get weather map tile URL
const getWeatherTileUrl = (layerId) => {
  const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
  return `https://tile.openweathermap.org/map/${layerId}/{z}/{x}/{y}.png?appid=${apiKey}`;
};

// Fix for Leaflet icons
const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Custom marker icon
const cityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Temperature conversion functions
const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

// Define button styling based on layer type
const getLayerButtonStyle = (layerId, isActive) => {
  // Default styling
  let baseStyle = {
    width: '48px', 
    height: '48px',
    border: '2px solid #fff',
  };
  
  // Add layer-specific background colors
  if (isActive) {
    // Active button gets blue background regardless
    return { ...baseStyle, backgroundColor: '#3B82F6' };
  }
  
  // Layer-specific styling for inactive buttons
  switch(layerId) {
    case 'temp_new':
      return { ...baseStyle, backgroundColor: '#FFEBEE' }; // Light red for temperature
    case 'precipitation_new':
      return { ...baseStyle, backgroundColor: '#E3F2FD' }; // Light blue for precipitation
    case 'wind_new':
      return { ...baseStyle, backgroundColor: '#F5F5F5' }; // Light gray for wind
    case 'clouds_new':
      return { ...baseStyle, backgroundColor: '#ECEFF1' }; // Light blue-gray for clouds
    case 'pressure_new':
      return { ...baseStyle, backgroundColor: '#EDE7F6' }; // Light purple for pressure
    case 'soil_moisture':
      return { ...baseStyle, backgroundColor: '#E1F5FE' }; // Light blue for soil moisture
    case 'irrigation_needs':
      return { ...baseStyle, backgroundColor: '#E1F5FE' }; // Light blue for irrigation
    case 'crop_growth':
      return { ...baseStyle, backgroundColor: '#E8F5E9' }; // Light green for crop growth
    default:
      return baseStyle;
  }
};

// Component to create and manage map directly
const WeatherMap = ({ location = { lat: 51.505, lng: -0.09, name: 'London' }, mode = 'weather' }) => {
  // Map container reference
  const mapRef = useRef(null);
  const mapInitializedRef = useRef(false);
  
  const [activeLayer, setActiveLayer] = useState(mode === 'irrigation' ? 'precipitation_new' : 'temp_new');
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(location);
  const [currentWeather, setCurrentWeather] = useState({
    temp: 0,
    feelsLike: 0,
    precipitation: 0,
    windSpeed: 0,
    windDirection: 0,
    humidity: 0,
    clouds: 0,
    pressure: 1000,
    soilMoisture: 0,
    irrigationNeeded: false,
    weatherIcon: '01d',
    weatherDesc: 'Clear sky'
  });
  const [useMetric, setUseMetric] = useState(true); // true = Celsius, false = Fahrenheit
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRioForecast, setShowRioForecast] = useState(false);
  
  // Trade data state
  const [tradeEvents, setTradeEvents] = useState([]);
  const [tradeEventsLoading, setTradeEventsLoading] = useState(false);
  const [tradeEventsError, setTradeEventsError] = useState(null);
  const [tariffData, setTariffData] = useState({});
  const [tradeEventsLayer, setTradeEventsLayer] = useState(null);
  
  // Update internal location state when props change
  useEffect(() => {
    console.log("Location prop changed:", location);
    setCurrentLocation(location);
  }, [location]);
  
  // Fetch weather data for the current location
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching weather for:", currentLocation.lat, currentLocation.lng);
        const weatherData = await fetchRealWeatherData(currentLocation.lat, currentLocation.lng);
        console.log("Weather data received:", weatherData);
        setCurrentWeather(weatherData);
        
        // Refresh the weather widget when location changes
        // This will update the data-label_1 with the new location name
        // Note: The actual weather data comes from Phoenix regardless of location
        // as weatherwidget.io requires static city URLs
        if (window.__weatherwidget_init) {
          window.__weatherwidget_init();
        }
      } catch (error) {
        console.error("Failed to fetch current weather:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeather();
  }, [currentLocation.lat, currentLocation.lng]); // Only re-fetch when coordinates change
  
  // Get the appropriate layers based on the current mode
  const getLayers = () => {
    const commonLayers = [
      { name: 'Temperature', id: 'temp_new', icon: <FaTemperatureHigh color="#FF5722" />, premium: false },
      { name: 'Precipitation', id: 'precipitation_new', icon: <FaCloudRain color="#4FC3F7" />, premium: false },
      { name: 'Wind speed', id: 'wind_new', icon: <FaWind color="#90A4AE" />, premium: false },
      { name: 'Clouds', id: 'clouds_new', icon: <FaCloud color="#78909C" />, premium: false }
    ];
    
    // Irrigation-specific layers
    if (mode === 'irrigation') {
      return [
        ...commonLayers,
        { name: 'Soil Moisture', id: 'soil_moisture', icon: <FaWater color="#2196F3" />, premium: true },
        { name: 'Irrigation Needs', id: 'irrigation_needs', icon: <FaTint color="#1976D2" />, premium: true },
        { name: 'Crop Growth', id: 'crop_growth', icon: <FaSeedling color="#43A047" />, premium: true }
      ];
    }
    
    // Trade-specific layers
    if (mode === 'trade') {
      return [
        ...commonLayers,
        { name: 'Trade Events', id: 'trade_events', icon: <FaCalendarAlt color="#8D6E63" />, premium: true },
        { name: 'Tariffs', id: 'tariffs', icon: <FaFileInvoiceDollar color="#FF9800" />, premium: true },
        { name: 'Export Markets', id: 'export_markets', icon: <FaGlobeAmericas color="#5E35B1" />, premium: true }
      ];
    }
    
    // Standard weather layers
    return [
      ...commonLayers,
      { name: 'Pressure', id: 'pressure_new', icon: <FaTachometerAlt color="#7E57C2" />, premium: false }
    ];
  };
  
  const weatherLayers = getLayers();

  // Handle location selection from autocomplete
  const handleLocationSelect = (locationData) => {
    if (!locationData) return;
    
    console.log("Location selected:", locationData);
    
    try {
      // Update our internal location state - this will trigger the useEffect to fetch new weather
      setCurrentLocation({
        lat: locationData.lat,
        lng: locationData.lon,
        name: locationData.name
      });
    } catch (error) {
      console.error("Error updating map location:", error);
    }
  };
  
  const handleLayerChange = (layerId, isPremium) => {
    if (isPremium && !isPremiumUser) {
      // Show premium overlay if trying to access premium layer
      setShowPremiumOverlay(true);
    } else {
      setActiveLayer(layerId);
    }
  };
  
  const handlePremiumActionClick = () => {
    // This would actually redirect to payment or show payment modal
    alert("This feature requires a premium subscription. Would redirect to payment page in production.");
  };
  
  const closePremiumOverlay = () => {
    setShowPremiumOverlay(false);
  };

  // Handle keyboard input for location search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Call the geocoding API to get location suggestions
      const searchTerm = searchValue.trim();
      if (searchTerm.length > 2) {
        fetchLocationSuggestions(searchTerm);
      }
    }
  };

  // Handle click on a location suggestion
  const handleSuggestionClick = (suggestion) => {
    // Set the selected location
    handleLocationSelect({
      name: suggestion.name,
      lat: suggestion.lat,
      lng: suggestion.lng
    });
    // Clear suggestions
    setSuggestions([]);
    // Reset search value
    setSearchValue('');
  };

  // Get the appropriate value from currentLocation with fallback
  const getLocationValue = (property, defaultValue) => {
    if (!currentLocation) return defaultValue;
    return currentLocation[property] || defaultValue;
  };

  // Get location data safely
  const locationName = getLocationValue('name', 'Current Location');
  const locationLat = getLocationValue('lat', 51.505);
  const locationLng = getLocationValue('lng', -0.09);

  // Mock function to fetch location suggestions with OpenWeatherMap geocoding API
  const fetchLocationSuggestions = async (query) => {
    try {
      const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
      const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }
      
      const data = await response.json();
      
      // Map to a consistent format
      const formattedResults = data.map(item => ({
        name: item.name + (item.state ? `, ${item.state}` : '') + (item.country ? `, ${item.country}` : ''),
        lat: item.lat,
        lng: item.lon
      }));
      
      console.log("Location suggestions:", formattedResults);
      setSuggestions(formattedResults);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    }
  };

  // Toggle between Celsius and Fahrenheit
  const toggleTemperatureUnit = () => {
    setUseMetric(!useMetric);
    // This will trigger a reinitialization of the weather widget
    if (window.__weatherwidget_init) {
      setTimeout(() => {
        window.__weatherwidget_init();
      }, 100);
    }
  };

  // Format temperature with proper unit
  const formatTemperature = (tempC) => {
    if (!tempC && tempC !== 0) return "N/A";
    
    const temp = useMetric ? tempC : celsiusToFahrenheit(tempC);
    const unit = useMetric ? "°C" : "°F";
    return `${Math.round(temp * 10) / 10}${unit}`;
  };

  // Get temperature for display
  const displayTemp = formatTemperature(currentWeather.temp);
  const displayFeelsLike = formatTemperature(currentWeather.feelsLike);

  // Load the weather widget script
  useEffect(() => {
    // Only add the script if it doesn't exist and we have a current location
    if (!document.getElementById('weatherwidget-io-js') && currentLocation) {
      const script = document.createElement('script');
      script.src = 'https://weatherwidget.io/js/widget.min.js';
      script.id = 'weatherwidget-io-js';
      script.async = true;
      
      // Add event listener to ensure the script loaded properly
      script.onload = () => {
        console.log("Weather widget script loaded");
        if (window.__weatherwidget_init) {
          window.__weatherwidget_init();
        }
      };
      
      document.body.appendChild(script);
    } else if (window.__weatherwidget_init) {
      // If the script is already loaded, just reinitialize the widget
      console.log("Reinitializing weather widget");
      setTimeout(() => {
        window.__weatherwidget_init();
      }, 500);
    }
    
    // Cleanup on unmount
    return () => {
      // No need to remove the script as it's shared globally
    };
  }, [currentLocation]);
  
  // Additional effect to reinitialize the widget when needed
  useEffect(() => {
    // Force reinitialize after component mounts
    const timer = setTimeout(() => {
      if (window.__weatherwidget_init) {
        console.log("Forced reinitialization of weather widget");
        window.__weatherwidget_init();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Force widget refresh when temperature unit changes
  useEffect(() => {
    if (window.__weatherwidget_init) {
      setTimeout(() => {
        window.__weatherwidget_init();
      }, 100);
    }
  }, [useMetric]);

  // Hook to detect dark mode from system preference or localStorage
  useEffect(() => {
    // Check if dark mode is set in localStorage
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    
    // Alternatively, check if the document has a dark class
    const isDarkModeFromClass = document.documentElement.classList.contains('dark');
    
    // Set the dark mode state
    setIsDarkMode(darkModePreference || isDarkModeFromClass);
    
    // Set up a listener for dark mode changes
    const handleDarkModeChange = () => {
      const darkModeUpdated = localStorage.getItem('darkMode') === 'true' || 
                              document.documentElement.classList.contains('dark');
      setIsDarkMode(darkModeUpdated);
      
      // Refresh the weather widget to update styling
      if (window.__weatherwidget_init) {
        window.__weatherwidget_init();
      }
    };
    
    // Set up observers for dark mode changes
    const observer = new MutationObserver(handleDarkModeChange);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    // Listen for storage events (for localStorage changes)
    window.addEventListener('storage', handleDarkModeChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleDarkModeChange);
    };
  }, []);

  // Map layer info content
  const layerInfo = {
    temp_new: {
      content: () => (
        <div>
          <h3 className="text-lg font-semibold mb-2">Temperature Layer</h3>
          <p className="text-sm">Displays current temperature distribution. Colors range from blue (cold) to red (hot).</p>
          <div className="mt-2">
            <p className="text-xs">Current temperature: {useMetric ? `${currentWeather.temp}°C` : `${celsiusToFahrenheit(currentWeather.temp)}°F`}</p>
            <p className="text-xs">Feels like: {useMetric ? `${currentWeather.feelsLike}°C` : `${celsiusToFahrenheit(currentWeather.feelsLike)}°F`}</p>
          </div>
        </div>
      )
    },
    precipitation_new: {
      content: () => (
        <div>
          <h3 className="text-lg font-semibold mb-2">Precipitation Layer</h3>
          <p className="text-sm">Shows precipitation levels. Colors range from light blue (light rain) to dark blue (heavy rain).</p>
          <div className="mt-2">
            <p className="text-xs">Current precipitation: {currentWeather.precipitation} mm</p>
          </div>
        </div>
      )
    },
    wind_new: {
      title: 'Wind',
      content: () => (
        <div className="layer-popup">
          <h3 className="text-lg font-bold mb-2">Wind Information</h3>
          <p className="mb-2">Speed: <span className="font-semibold">{currentWeather.windSpeed} m/s</span></p>
          <p className="mb-2">Direction: <span className="font-semibold">{currentWeather.windDirection}°</span></p>
          <div className="wind-direction-indicator flex justify-center my-2">
            <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center">
              <div 
                className="w-4 h-1 bg-blue-500 origin-center transform"
                style={{ transform: `rotate(${currentWeather.windDirection}deg)` }}
              ></div>
            </div>
          </div>
        </div>
      )
    },
    clouds_new: {
      title: 'Clouds',
      content: () => (
        <div className="layer-popup">
          <h3 className="text-lg font-bold mb-2">Cloud Information</h3>
          <p className="mb-2">Cloud cover: <span className="font-semibold">{currentWeather.clouds}%</span></p>
          <p className="mb-2">Weather: <span className="font-semibold">{currentWeather.weatherDesc}</span></p>
          <div className="weather-icon text-center my-2">
            <img 
              src={`https://openweathermap.org/img/wn/${currentWeather.weatherIcon}@2x.png`} 
              alt={currentWeather.weatherDesc}
              className="inline-block w-16 h-16"
            />
          </div>
        </div>
      )
    },
    pressure_new: {
      title: 'Pressure',
      content: () => (
        <div className="layer-popup">
          <h3 className="text-lg font-bold mb-2">Pressure Information</h3>
          <p className="mb-2">Current: <span className="font-semibold">{currentWeather.pressure} hPa</span></p>
          <div className="pressure-trend mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-300">Pressure trend available in premium</p>
          </div>
        </div>
      )
    },
    trade_events: {
      content: () => (
        <div>
          <h3 className="text-lg font-semibold mb-2">Trade Events</h3>
          <p className="text-sm">Displays upcoming trade events relevant to agriculture and exports.</p>
          <div className="mt-2">
            {tradeEventsLoading ? (
              <p className="text-xs">Loading trade events...</p>
            ) : tradeEventsError ? (
              <p className="text-xs text-red-500">Error: {tradeEventsError}</p>
            ) : (
              <div>
                <p className="text-xs font-semibold">Events found: {tradeEvents?.results?.length || 0}</p>
                <p className="text-xs">Click on markers to view event details</p>
              </div>
            )}
          </div>
        </div>
      )
    },
    tariffs: {
      content: () => (
        <div>
          <h3 className="text-lg font-semibold mb-2">Agricultural Tariffs</h3>
          <p className="text-sm">Shows tariff rates for key agricultural exports based on location.</p>
          <div className="mt-2">
            <p className="text-xs font-semibold">Tariff data for common agricultural products:</p>
            <ul className="text-xs mt-1">
              {Object.keys(tariffData).length > 0 ? (
                Object.entries(tariffData).map(([hsCode, data]) => {
                  const productNames = {
                    '1001': 'Wheat',
                    '1005': 'Corn/Maize',
                    '1006': 'Rice',
                    '1201': 'Soybeans',
                    '0805': 'Citrus fruits'
                  };
                  
                  return (
                    <li key={hsCode} className="mb-1">
                      {productNames[hsCode] || hsCode}: {data?.results ? 
                        `${data.results[0]?.tariff_rate || 'N/A'}%` : 
                        'Data not available'}
                    </li>
                  );
                })
              ) : (
                <li>Loading tariff data...</li>
              )}
            </ul>
          </div>
        </div>
      )
    },
    export_markets: {
      content: () => (
        <div>
          <h3 className="text-lg font-semibold mb-2">Export Markets</h3>
          <p className="text-sm">Highlights potential export markets for agricultural products.</p>
          <div className="mt-2">
            <p className="text-xs">Click on countries to view market information</p>
            <p className="text-xs mt-1"><b>Note:</b> This feature uses the Trade.gov API with your API key to provide real-time export market data.</p>
          </div>
        </div>
      )
    },
  };
  
  // State for tracking the active popup
  const [activePopup, setActivePopup] = useState(null);
  
  // Toggle popup visibility
  const togglePopup = (layerId) => {
    if (activePopup === layerId) {
      setActivePopup(null);
    } else {
      setActivePopup(layerId);
    }
  };

  // Create a unique map ID to avoid conflicts
  const mapId = useRef(`map-${Math.random().toString(36).substring(2, 9)}`);

  // Add leaflet CSS and JS directly to ensure they're loaded
  useEffect(() => {
    // Add Leaflet CSS
    const existingCss = document.getElementById('leaflet-css');
    if (!existingCss) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
    
    // Add Leaflet JS
    const existingScript = document.getElementById('leaflet-js');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      script.crossOrigin = '';
      script.onload = () => {
        console.log("Leaflet script loaded from CDN");
        fixLeafletIcons();
      };
      document.head.appendChild(script);
    } else {
      // If script already exists, ensure icon fix is applied
      fixLeafletIcons();
    }
  }, []);

  // Force map height with CSS
  useEffect(() => {
    // Add a global style to ensure leaflet containers are sized properly
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container {
        width: 100%;
        height: 100%;
        min-height: 500px;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Force iframe reload trick to ensure proper map sizing
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.position = 'absolute';
    iframe.onload = () => {
      setIframeLoaded(true);
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 100);
    };
    document.body.appendChild(iframe);
    
    return () => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    };
  }, []);

  // Completely recreate the map on each render (will only run when map should change)
  useEffect(() => {
    // First, ensure we clean up any existing map
    if (window.weatherMap && window.weatherMap.map) {
      console.log("Removing existing map instance");
      try {
        window.weatherMap.map.remove();
        window.weatherMap = null;
      } catch (e) {
        console.error("Error cleaning up map:", e);
      }
    }
    
    // Wait for loading to complete and iframe to load
    if (isLoading || !iframeLoaded) {
      console.log("Waiting for loading to complete or iframe to load");
      return;
    }
    
    // Create map with a delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      console.log("Creating map with ID:", mapId.current);
      
      try {
        // Verify map container exists and has size
        const container = document.getElementById(mapId.current);
        if (!container) {
          console.error("Map container not found");
          return;
        }
        
        // Check dimensions
        console.log("Container dimensions:", container.clientWidth, container.clientHeight);
        if (container.clientWidth === 0 || container.clientHeight === 0) {
          console.error("Container has no dimensions");
          container.style.width = '100%';
          container.style.height = '500px';
        }
        
        // Create the map
        const map = L.map(mapId.current, {
          center: [locationLat, locationLng],
          zoom: 8,
          zoomControl: false
        });
        
        // Add the base layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add the weather layer
        const weatherLayer = L.tileLayer(getWeatherTileUrl(activeLayer), {
          opacity: 0.7
        }).addTo(map);
        
        // Add marker
        const marker = L.marker([locationLat, locationLng], { icon: cityIcon })
          .addTo(map)
          .bindPopup(`${locationName}<br>Temperature: ${displayTemp}<br>Weather: ${currentWeather.weatherDesc}`);
        
        // Add zoom control
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        
        // Store reference
        window.weatherMap = { map, weatherLayer, marker };
        mapInitializedRef.current = true;
        
        // Force invalidate size
        setTimeout(() => {
          map.invalidateSize(true);
          console.log("Map size invalidated");
        }, 300);
      } catch (error) {
        console.error("Error creating map:", error);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, iframeLoaded, locationLat, locationLng, activeLayer, locationName, displayTemp, currentWeather.weatherDesc]);

  // Make sure location updates are reflected in the map
  useEffect(() => {
    // Skip if map isn't initialized or is still loading
    if (!window.weatherMap || !window.weatherMap.map || isLoading) return;
    
    try {
      console.log(`Updating map location to: ${locationName} [${locationLat},${locationLng}]`);
      const { map, marker } = window.weatherMap;
      
      // Update the center and zoom
      map.setView([locationLat, locationLng], 8);
      
      // Update the marker
      marker.setLatLng([locationLat, locationLng])
        .bindPopup(`${locationName}<br>Temperature: ${displayTemp}<br>Weather: ${currentWeather.weatherDesc}`)
        .openPopup();
      
      // Ensure size is correct
      map.invalidateSize(true);
    } catch (error) {
      console.error("Error updating map location:", error);
    }
  }, [locationLat, locationLng, isLoading]);
  
  // Update weather layer when active layer changes
  useEffect(() => {
    // Skip if map isn't initialized or is loading
    if (!window.weatherMap || !window.weatherMap.map || isLoading) return;
    
    try {
      console.log(`Changing weather layer to: ${activeLayer}`);
      const { map, weatherLayer } = window.weatherMap;
      
      // Remove current layer
      if (weatherLayer) {
        map.removeLayer(weatherLayer);
      }
      
      // Add new layer
      const newLayer = L.tileLayer(getWeatherTileUrl(activeLayer), {
        opacity: 0.7
      }).addTo(map);
      
      // Update reference
      window.weatherMap.weatherLayer = newLayer;
    } catch (error) {
      console.error("Error updating weather layer:", error);
    }
  }, [activeLayer, isLoading]);

  // Add this CSS to the component as a global style
  useEffect(() => {
    // Add a global style for weather layer buttons
    const style = document.createElement('style');
    style.textContent = `
      .weather-layer-button {
        transition: all 0.2s ease-in-out;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .weather-layer-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
      }
      .weather-layer-button.active {
        transform: translateY(1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .weather-layer-icon {
        filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.3));
      }
      
      /* Trade event marker styles */
      .trade-event-marker {
        background: transparent !important;
      }
      .event-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        background-color: #8D6E63;
        color: white;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        font-size: 14px;
      }
      .trade-event-popup {
        font-family: Arial, sans-serif;
        max-width: 280px;
      }
      .trade-event-popup h3 {
        margin-top: 0;
        color: #5D4037;
        font-size: 16px;
        font-weight: bold;
      }
      .trade-event-popup p {
        margin: 8px 0;
        font-size: 12px;
      }
      .event-links {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .event-links a {
        display: inline-block;
        padding: 4px 8px;
        background-color: #8D6E63;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 12px;
        text-align: center;
      }
      .event-links a:hover {
        background-color: #6D4C41;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch trade events when trade mode is active
  useEffect(() => {
    if (mode === 'trade' && activeLayer === 'trade_events') {
      const fetchEvents = async () => {
        setTradeEventsLoading(true);
        try {
          const data = await fetchTradeEvents({
            industries: 'Agricultural Equipment,Food Processing and Packaging,Agribusiness'
          });
          setTradeEvents(data);
          
          // Convert to GeoJSON and add to map
          const geoJson = convertTradeEventsToGeoJSON(data);
          updateTradeEventsOnMap(geoJson);
          
        } catch (error) {
          console.error('Error fetching trade events:', error);
          setTradeEventsError(error.message);
        } finally {
          setTradeEventsLoading(false);
        }
      };
      
      fetchEvents();
    }
  }, [mode, activeLayer]);
  
  // Fetch tariff data when that layer is active
  useEffect(() => {
    if (mode === 'trade' && activeLayer === 'tariffs') {
      const fetchTariffs = async () => {
        try {
          // Get country code based on current location
          // This is a simplified example - in a real implementation,
          // you would need to reverse geocode to get the country code
          const countryCode = 'BR'; // Example: Brazil
          
          // HS codes for common agricultural products
          const hsCodes = [
            '1001', // Wheat
            '1005', // Corn/Maize
            '1006', // Rice
            '1201', // Soybeans
            '0805', // Citrus fruits
          ];
          
          const tariffResults = {};
          
          // Fetch tariff data for each product
          for (const hsCode of hsCodes) {
            const data = await fetchTariffRates(countryCode, hsCode);
            tariffResults[hsCode] = data;
          }
          
          setTariffData(tariffResults);
          
        } catch (error) {
          console.error('Error fetching tariff data:', error);
        }
      };
      
      fetchTariffs();
    }
  }, [mode, activeLayer]);
  
  // Function to update trade events on the map
  const updateTradeEventsOnMap = (geoJson) => {
    if (!mapRef.current || !geoJson) return;
    
    // Remove existing layer if it exists
    if (tradeEventsLayer) {
      mapRef.current.removeLayer(tradeEventsLayer);
    }
    
    // Create a new layer
    const newLayer = L.geoJSON(geoJson, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, {
          icon: L.divIcon({
            className: 'trade-event-marker',
            html: '<div class="event-icon"><i class="fa fa-calendar"></i></div>',
            iconSize: [30, 30]
          })
        });
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        
        layer.bindPopup(`
          <div class="trade-event-popup">
            <h3>${props.name}</h3>
            <p><strong>Date:</strong> ${new Date(props.startDate).toLocaleDateString()} - ${new Date(props.endDate).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${props.city}, ${props.country}</p>
            ${props.industry ? `<p><strong>Industry:</strong> ${props.industry}</p>` : ''}
            <div class="event-links">
              ${props.website ? `<a href="${props.website}" target="_blank" rel="noopener noreferrer">Visit Event Website</a>` : ''}
              ${props.registrationLink ? `<a href="${props.registrationLink}" target="_blank" rel="noopener noreferrer">Register</a>` : ''}
            </div>
          </div>
        `);
      }
    });
    
    // Add the layer to the map
    newLayer.addTo(mapRef.current);
    setTradeEventsLayer(newLayer);
  };

  // Render with explicit dimensions and unique ID
  return (
    <div className="relative w-full h-full" style={{ minHeight: '500px' }}>
      {/* Weather search bar */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a location..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full p-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={handleKeyPress}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400" />
          </div>
          {suggestions.length > 0 && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weather widget */}
      <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 max-w-xs">
        <a 
          className="weatherwidget-io" 
          href="https://forecast7.com/en/51d51n0d13/london/"
          data-label_1={locationName}
          data-label_2={useMetric ? "°C" : "°F"}
          data-theme="original" 
          data-accent={isDarkMode ? "#4786C6" : "#0D2E5C"}
          data-textcolor={isDarkMode ? "#FFFFFF" : "#000000"}
          data-highcolor="#FF5722"
          data-lowcolor="#03A9F4"
          data-suncolor="#FFB300"
          data-mooncolor="#9FA8DA"
          data-cloudcolor="#BDBDBD"
          data-cloudfill="#BDBDBD"
          data-raincolor="#4FC3F7"
          data-snowcolor="#B0E0E6"
          data-icons="Climacons Animated"
          data-days="3"
        >
          {locationName} Weather
        </a>
      </div>

      {/* Map layers control with popups */}
      <div className="absolute bottom-24 left-4 z-10">
        <div className="flex flex-col space-y-3 relative">
          {weatherLayers.map(layer => (
            <div key={layer.id} className="relative">
              <button 
                className={`p-3 rounded-lg ${activeLayer === layer.id ? 'active' : ''} weather-layer-button flex items-center justify-center`}
                onClick={() => {
                  handleLayerChange(layer.id, layer.premium);
                  togglePopup(layer.id);
                }}
                title={layer.name}
                style={getLayerButtonStyle(layer.id, activeLayer === layer.id)}
              >
                <span className="weather-layer-icon text-2xl">
                  {layer.icon}
                </span>
                {layer.premium && <FaLock className="absolute top-1 right-1 text-xs text-yellow-500" />}
              </button>
              
              {/* Layer info popup */}
              {activePopup === layer.id && layerInfo[layer.id] && (
                <div className="absolute bottom-0 left-14 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-30 transform -translate-y-1/2">
                  <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white dark:border-r-gray-800"></div>
                  </div>
                  {layerInfo[layer.id].content()}
                </div>
              )}
            </div>
          ))}
          {/* Additional widget for Rio weather */}
          <div className="relative">
            <button 
              className={`p-3 rounded-lg ${showRioForecast ? 'active' : ''} weather-layer-button flex items-center justify-center`}
              onClick={() => setShowRioForecast(!showRioForecast)}
              title="Rio Weather Forecast"
              style={{
                width: '48px',
                height: '48px',
                border: '2px solid #fff',
                backgroundColor: showRioForecast ? '#3B82F6' : '#E1F5FE'
              }}
            >
              <span className="weather-layer-icon text-2xl">
                <FaCloud color="#1565C0" />
              </span>
            </button>
            
            {/* Rio Weather Forecast popup */}
            {showRioForecast && (
              <div className="absolute bottom-0 left-12 w-[800px] max-w-screen-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-30 transform -translate-y-1/2">
                <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white dark:border-r-gray-800"></div>
                </div>
                <div className="rio-forecast">
                  <h3 className="text-lg font-bold mb-2">Rio de Janeiro Weather Forecast</h3>
                  
                  <div className="overflow-x-auto">
                    <div className="detailed-forecast min-w-max">
                      {/* Rio Weather Forecast Content similar to image 2 */}
                      <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        <div className="flex flex-col">
                          <div className="font-bold">Tue</div>
                          <div className="text-xs">1-16</div>
                          <div className="bg-blue-300 p-2 flex justify-center items-center">
                            <span className="inline-block h-8 w-8 bg-yellow-300 rounded-full"></span>
                          </div>
                          <div className="bg-red-500 p-1 text-white font-bold">34 °C</div>
                          <div className="bg-yellow-400 p-1 font-bold">27 °C</div>
                          <div className="py-1">16 km/h</div>
                          <div className="py-1">26 km/h</div>
                          <div className="py-1">↙</div>
                          <div className="bg-purple-300 p-1 font-bold">11+</div>
                          <div className="py-1">74% rh</div>
                          <div className="py-1 text-blue-500">-</div>
                          <div className="py-1 text-blue-500">1%</div>
                          <div className="p-1 border">
                            <div className="w-full h-14 rounded-full border-2 border-gray-400 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-teal-300"></div>
                            </div>
                          </div>
                          <div className="py-1">1012 hPa</div>
                        </div>
                        
                        <div className="flex flex-col">
                          <div className="font-bold">Wed</div>
                          <div className="text-xs">1-17</div>
                          <div className="bg-blue-300 p-2 flex justify-center items-center">
                            <span className="inline-block h-8 w-8 bg-yellow-300 rounded-full"></span>
                          </div>
                          <div className="bg-red-500 p-1 text-white font-bold">35 °C</div>
                          <div className="bg-yellow-400 p-1 font-bold">27 °C</div>
                          <div className="py-1">15 km/h</div>
                          <div className="py-1">24 km/h</div>
                          <div className="py-1">↓</div>
                          <div className="bg-purple-300 p-1 font-bold">11+</div>
                          <div className="py-1">69% rh</div>
                          <div className="py-1 text-blue-500">-</div>
                          <div className="py-1 text-blue-500">8%</div>
                          <div className="p-1 border">
                            <div className="w-full h-14 rounded-full border-2 border-gray-400 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-teal-300"></div>
                            </div>
                          </div>
                          <div className="py-1">1012 hPa</div>
                        </div>
                        
                        {/* The other 5 days would follow similar pattern */}
                        {/* Additional days condensed for brevity */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Temperature unit toggle */}
      <div className="absolute bottom-4 left-4 z-10">
        <button 
          className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg"
          onClick={toggleTemperatureUnit}
        >
          {useMetric ? "°C" : "°F"}
        </button>
      </div>

      {/* Map container with explicit dimensions and unique ID */}
      <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div 
            id={mapId.current} 
            ref={mapRef}
            className="w-full h-full rounded-lg overflow-hidden border border-gray-300" 
            style={{ 
              minHeight: '500px', 
              height: '500px',
              backgroundColor: '#e9eef2' 
            }}
          ></div>
        )}
        {/* Debug info */}
        <div className="absolute bottom-0 right-0 bg-white bg-opacity-75 text-xs p-1 z-10">
          Map ID: {mapId.current} | Initialized: {mapInitializedRef.current ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;