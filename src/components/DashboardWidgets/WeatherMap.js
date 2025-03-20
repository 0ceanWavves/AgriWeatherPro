import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import ReactDOMServer from 'react-dom/server';

import LocationAutocomplete from '../LocationAutocomplete';
import { fetchWeatherData } from '../../utils/weatherUtils';
import { fetchSimulatedCropData, fetchSimulatedIrrigationNeeds } from '../../utils/simulationUtils';
import { fetchRealWeatherData } from '../../services/weatherService';
import { fetchTradeEvents, fetchTradeEventsCount, fetchTariffRates, convertTradeEventsToGeoJSON } from '../../utils/tradeApiUtils';
import { supabaseClient } from '../../services/supabaseService';

// Function to get weather map tile URL
const getWeatherTileUrl = (layerId) => {
  // Define base OpenWeatherMap tile URL
  const baseUrl = 'https://tile.openweathermap.org/map';
  const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
  
  // Add a cache-busting timestamp parameter to prevent caching issues
  // This helps avoid NS_BINDING_ABORTED errors caused by interrupted previous requests
  const timestamp = Date.now();
  
  // Return URL with timestamp to prevent request abortion
  return `${baseUrl}/${layerId}/{z}/{x}/{y}.png?appid=${apiKey}&_t=${timestamp}`;
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
  // Set up state variables
  const [activeLayer, setActiveLayer] = useState('temp_new');
  const [mapId] = useState(() => `map-${Math.random().toString(36).substring(2, 9)}`);
  const [isPremiumOverlayVisible, setIsPremiumOverlayVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [currentWeather, setCurrentWeather] = useState({
    weatherDesc: 'Partly cloudy',
    tempC: 22,
    tempF: 72
  });
  const [useMetric, setUseMetric] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [showLayerPopup, setShowLayerPopup] = useState(null);
  const [tradeEventData, setTradeEventData] = useState([]);
  const [irrigationData, setIrrigationData] = useState([]);
  const [cropData, setCropData] = useState([]);
  const [tariffData, setTariffData] = useState([]);
  const [tariffDetailedData, setTariffDetailedData] = useState(null);
  const [tariffDataLoading, setTariffDataLoading] = useState(false);
  
  // Initialize user location state with the provided location
  const [userLocation, setUserLocation] = useState(location);
  
  // Use the location name directly with a fallback
  const locationName = userLocation?.name || location?.name || 'Unknown Location';
  
  // Get location coordinates with fallbacks
  const locationLat = userLocation?.lat || location?.lat || 51.505;
  const locationLng = userLocation?.lng || location?.lng || -0.09;
  
  // Update internal location state when props change
  useEffect(() => {
    setUserLocation(location);
  }, [location]);
  
  // Format temperature for display based on the current unit setting
  const displayTemp = formatTemperature(currentWeather.tempC);
  
  // References
  const mapRef = useRef(null);
  const layerRefs = useRef({});
  
  // Track when Leaflet is loaded
  useEffect(() => {
    const checkLeafletLoaded = () => {
      if (window.L) {
        console.log("Leaflet library loaded");
        setLeafletLoaded(true);
        fixLeafletIcons();
      } else {
        console.log("Waiting for Leaflet...");
        setTimeout(checkLeafletLoaded, 500);
      }
    };
    
    checkLeafletLoaded();
  }, []);
  
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
      { 
        name: 'Temperature', 
        id: 'temp_new', 
        icon: <FaTemperatureHigh color="#FF5722" />, 
        premium: false,
        tooltip: 'View temperature data across your region' 
      },
      { 
        name: 'Precipitation', 
        id: 'precipitation_new', 
        icon: <FaCloudRain color="#4FC3F7" />, 
        premium: false,
        tooltip: 'View precipitation and rainfall patterns' 
      },
      { 
        name: 'Wind speed', 
        id: 'wind_new', 
        icon: <FaWind color="#90A4AE" />, 
        premium: false,
        tooltip: 'Check wind speed and direction forecasts' 
      },
      { 
        name: 'Clouds', 
        id: 'clouds_new', 
        icon: <FaCloud color="#78909C" />, 
        premium: false,
        tooltip: 'See cloud coverage and patterns' 
      }
    ];
    
    // Irrigation-specific layers
    if (mode === 'irrigation') {
      return [
        ...commonLayers,
        { 
          name: 'Soil Moisture', 
          id: 'soil_moisture', 
          icon: <FaWater color="#2196F3" />, 
          premium: false,
          tooltip: 'Monitor soil moisture levels for optimal irrigation planning' 
        },
        { 
          name: 'Irrigation Needs', 
          id: 'irrigation_needs', 
          icon: <FaTint color="#1976D2" />, 
          premium: false,
          tooltip: 'See recommended irrigation schedules based on weather conditions' 
        },
        { 
          name: 'Crop Growth', 
          id: 'crop_growth', 
          icon: <FaSeedling color="#43A047" />, 
          premium: false,
          tooltip: 'Track crop growth stages and development based on weather conditions' 
        }
      ];
    }
    
    // Trade-specific layers
    if (mode === 'trade') {
      return [
        ...commonLayers,
        { 
          name: 'Trade Events', 
          id: 'trade_events', 
          icon: <FaCalendarAlt color="#8D6E63" />, 
          premium: false,
          tooltip: 'View upcoming agricultural trade events and expos' 
        },
        { 
          name: 'Tariffs', 
          id: 'tariffs', 
          icon: <FaFileInvoiceDollar color="#FF9800" />, 
          premium: false,
          tooltip: 'Access current tariff information for agricultural exports and imports' 
        },
        { 
          name: 'Export Markets', 
          id: 'export_markets', 
          icon: <FaGlobeAmericas color="#5E35B1" />, 
          premium: false,
          tooltip: 'Explore potential export markets for your agricultural products' 
        }
      ];
    }
    
    // Standard weather layers
    return [
      ...commonLayers,
      { 
        name: 'Pressure', 
        id: 'pressure_new', 
        icon: <FaTachometerAlt color="#7E57C2" />, 
        premium: false,
        tooltip: 'View atmospheric pressure patterns and changes' 
      }
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
  
  // Handle layer change from dropdown
  const handleLayerChange = (layerId) => {
    console.log(`Changing to layer: ${layerId}`);
    
    // Safety check - if map not initialized, do nothing
    if (!mapRef.current) {
      console.log("Map not initialized yet, cannot change layers");
      return;
    }
    
    try {
      const map = mapRef.current;
      
      // Verify the map has essential methods
      if (!map.hasLayer || !map.removeLayer || !map.addLayer) {
        console.error("Map object is missing critical methods");
        return;
      }
      
      // Check if map is loaded
      if (!map._loaded) {
        console.log("Map not fully loaded, delaying layer change");
        setTimeout(() => handleLayerChange(layerId), 500);
        return;
      }
      
      // Ensure all required panes exist
      const requiredPanes = ['tilePane', 'overlayPane', 'shadowPane', 'markerPane', 'tooltipPane', 'popupPane'];
      let allPanesExist = true;
      
      requiredPanes.forEach(pane => {
        if (!map.getPane(pane)) {
          allPanesExist = false;
          console.log(`Creating missing pane: ${pane}`);
          map.createPane(pane);
        }
      });
      
      if (!allPanesExist) {
        console.log("Created missing panes, reinitializing layer");
      }
      
      // Set the active layer state immediately for UI feedback
      setActiveLayer(layerId);
      
      // Get the new tile URL
      const tileUrl = getWeatherTileUrl(layerId);
      
      // First, remove existing weather layer with timeout to avoid request cancellation
      const existingLayer = layerRefs.current[activeLayer];
      if (existingLayer && map.hasLayer(existingLayer)) {
        console.log(`Removing existing layer: ${activeLayer}`);
        
        try {
          // Properly dispose of the layer
          if (existingLayer.off) existingLayer.off();  // Remove event listeners
          if (existingLayer._removeAllTiles) existingLayer._removeAllTiles(); // Clear tiles
          
          // Remove after short delay to allow in-flight requests to settle
          setTimeout(() => {
            try {
              map.removeLayer(existingLayer);
            } catch (err) {
              console.warn("Error removing layer (already handled):", err);
            }
          }, 100);
        } catch (err) {
          console.warn("Error preparing layer for removal:", err);
        }
      }
      
      // Create new layer after a short delay to avoid immediate destruction of in-flight requests
      setTimeout(() => {
        try {
          // Always create a fresh layer instance even for existing layers
          console.log(`Creating layer with URL: ${tileUrl}`);
          
          // Create the layer with better options
          const newLayer = L.tileLayer(tileUrl, {
            attribution: '© OpenWeatherMap',
            keepBuffer: 4,
            updateWhenIdle: true,
            updateWhenZooming: false,
            maxNativeZoom: 8,
            crossOrigin: true,
            tileSize: 256,
            className: 'weather-layer',
            pane: 'tilePane',  // Explicitly set the pane
            errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAQAAAD2e2DtAAAAh0lEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8G8qUAABQTVXwAAAAABJRU5ErkJggg=='
          });
          
          // Add error handling to retry failed tiles
          newLayer.on('tileerror', (error) => {
            console.warn(`Tile error on layer ${layerId}:`, error);
            
            // Retry after a short delay
            setTimeout(() => {
              try {
                if (map && map.hasLayer(newLayer)) {
                  console.log(`Retrying tile load for layer ${layerId}`);
                  newLayer.redraw();
                }
              } catch (e) {
                console.error("Error retrying tile load:", e);
              }
            }, 500);
          });
          
          // Store reference to the new layer
          layerRefs.current[layerId] = newLayer;
          
          // Add the layer to the map
          newLayer.addTo(map);
          
          // Force map to update size to ensure proper rendering
          map.invalidateSize(true);
          
          console.log(`Layer ${layerId} added successfully`);
        } catch (error) {
          console.error("Error changing layer:", error);
          
          // Try to recover
          try {
            console.log("Attempting recovery...");
            // Force map redraw
            map.invalidateSize(true);
          } catch (e) {
            console.error("Recovery failed:", e);
          }
        }
      }, 200);
    } catch (error) {
      console.error("Critical error in handleLayerChange:", error);
    }
  };
  
  // React to mode changes to update activeLayer
  useEffect(() => {
    // When mode changes, set an appropriate default layer for that mode
    if (mode === 'weather' && !['temp_new', 'precipitation_new', 'wind_new', 'clouds_new', 'pressure_new'].includes(activeLayer)) {
      setActiveLayer('temp_new');
    } else if (mode === 'irrigation' && !['precipitation_new', 'soil_moisture', 'irrigation_needs', 'crop_growth'].includes(activeLayer)) {
      setActiveLayer('precipitation_new');
    } else if (mode === 'trade' && !['temp_new', 'precipitation_new', 'trade_events', 'tariffs', 'export_markets'].includes(activeLayer)) {
      setActiveLayer('trade_events');
    }
  }, [mode]);
  
  // Modified to allow all features without premium restriction
  const handlePremiumActionClick = (layerId) => {
    // Just change to the requested layer without premium restriction
    console.log(`Accessing previously premium feature: ${layerId}`);
    if (layerId) {
      setActiveLayer(layerId);
    }
  };
  
  // No longer needed as we've removed premium restrictions
  const closePremiumOverlay = () => {
    // This is kept for backward compatibility but does nothing now
    console.log("All features are now accessible without premium restrictions");
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

  // Get location data for display
  const displayLocationName = getLocationValue('name', 'Current Location');
  const displayLocationLat = getLocationValue('lat', 51.505);
  const displayLocationLng = getLocationValue('lng', -0.09);

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
  const mainDisplayTemp = formatTemperature(currentWeather.temp);
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
      title: 'Temperature',
      content: () => (
        <div>
          <h3 className="text-lg font-semibold mb-2">Temperature Layer</h3>
          <p className="text-sm">Displays current temperature distribution. Colors range from blue (cold) to red (hot).</p>
          <div className="mt-2">
            <p className="text-xs">Current temperature: {useMetric ? `${currentWeather.temp}°C` : `${celsiusToFahrenheit(currentWeather.temp)}°F`}</p>
            <p className="text-xs">Feels like: {useMetric ? `${currentWeather.feelsLike}°C` : `${celsiusToFahrenheit(currentWeather.feelsLike)}°F`}</p>
          </div>
          
          {/* Temperature Triggers Integration */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold mb-1">Active Temperature Triggers</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">High Temp Alert</span>
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                  &gt; {useMetric ? '30°C' : '86°F'}
                </span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Frost Warning</span>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  &lt; {useMetric ? '0°C' : '32°F'}
                </span>
              </div>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors"
              onClick={() => window.location.href = '/dashboard/triggers'}
            >
              Manage Temperature Triggers
            </button>
          </div>
          
          {/* Reports Integration */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold mb-1">Temperature Reports</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
              <div className="flex justify-between items-center mb-1">
                <span>Monthly Avg:</span>
                <span className="font-medium">{useMetric ? '24.5°C' : '76.1°F'}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span>Historical High:</span>
                <span className="font-medium">{useMetric ? '38.2°C' : '100.8°F'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Compare to last year:</span>
                <span className="font-medium text-red-500">+2.1{useMetric ? '°C' : '°F'}</span>
              </div>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded transition-colors"
              onClick={() => {
                console.log('View Temperature Reports button clicked');
                // Using this approach ensures the hash change is detected
                if (window.location.pathname === '/dashboard') {
                  // If already on dashboard, just change the hash
                  window.location.hash = 'reports';
                } else {
                  // Otherwise navigate to dashboard with hash
                  window.location.href = '/dashboard#reports';
                }
              }}
            >
              View Temperature Reports
            </button>
          </div>
        </div>
      )
    },
    precipitation_new: {
      title: 'Precipitation',
      content: () => (
        <div>
          <h3 className="text-lg font-semibold mb-2">Precipitation Layer</h3>
          <p className="text-sm">Shows precipitation levels. Colors range from light blue (light rain) to dark blue (heavy rain).</p>
          <div className="mt-2">
            <p className="text-xs">Current precipitation: {currentWeather.precipitation} mm</p>
            <div className="mt-1 flex items-center text-xs">
              <span className="mr-1">Forecast:</span>
              <div className="flex space-x-1">
                <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-sm">Today: 5mm</span>
                <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-sm">Tomorrow: 12mm</span>
              </div>
            </div>
          </div>
          
          {/* Precipitation Triggers Integration */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold mb-1">Active Precipitation Triggers</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Heavy Rain Alert</span>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  &gt; 25mm/day
                </span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Flood Warning</span>
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                  &gt; 50mm/day
                </span>
            </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Drought Alert</span>
                <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                  No rain for 7+ days
                </span>
              </div>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors"
              onClick={() => window.location.href = '/dashboard/triggers'}
            >
              Manage Precipitation Triggers
            </button>
          </div>
          
          {/* Reports Integration */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold mb-1">Precipitation Data</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
              <div className="flex justify-between items-center mb-1">
                <span>7-day Accumulation:</span>
                <span className="font-medium">42mm</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span>30-day Accumulation:</span>
                <span className="font-medium">136mm</span>
              </div>
              <div className="flex justify-between items-center">
                <span>vs. Historical Average:</span>
                <span className="font-medium text-blue-500">+18mm</span>
              </div>
            </div>
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-xs font-medium mb-1">Monthly Precipitation</div>
              <div className="h-16 flex items-end space-x-1">
                {[20, 35, 15, 40, 25, 42, 30, 45, 22, 28, 36, 48].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-blue-400 dark:bg-blue-600 rounded-t" 
                    style={{ height: `${height}%` }}
                    title={`Month ${i+1}: ${height}mm`}
                  ></div>
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-gray-500">
                <span>Jan</span>
                <span>Dec</span>
              </div>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded transition-colors"
              onClick={() => {
                console.log('View Precipitation Reports button clicked');
                // Using this approach ensures the hash change is detected
                if (window.location.pathname === '/dashboard') {
                  // If already on dashboard, just change the hash
                  window.location.hash = 'reports';
                } else {
                  // Otherwise navigate to dashboard with hash
                  window.location.href = '/dashboard#reports';
                }
              }}
            >
              View Precipitation Reports
            </button>
          </div>
        </div>
      )
    },
    wind_new: {
      title: 'Wind',
      content: () => (
        <div className="layer-popup">
          <h3 className="text-lg font-bold mb-2">Wind Information</h3>
          <p className="text-sm mb-2">Shows wind speed and direction. Colors range from light blue (calm) to dark blue (strong winds).</p>
          <div className="mt-2">
            <p className="text-xs mb-1">Current speed: <span className="font-semibold">{currentWeather.windSpeed} m/s</span></p>
            <p className="text-xs mb-1">Direction: <span className="font-semibold">{currentWeather.windDirection}°</span></p>
          </div>
          <div className="wind-direction-indicator flex justify-center my-2">
            <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center">
              <div 
                className="w-4 h-1 bg-blue-500 origin-center transform"
                style={{ transform: `rotate(${currentWeather.windDirection}deg)` }}
              ></div>
          </div>
          </div>
          
          {/* Wind Triggers Integration */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold mb-1">Active Wind Triggers</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">High Wind Alert</span>
                <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded">
                  &gt; 15 m/s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Storm Warning</span>
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                  &gt; 25 m/s
                </span>
            </div>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors"
              onClick={() => window.location.href = '/dashboard/triggers'}
            >
              Manage Wind Triggers
            </button>
          </div>
          
          {/* Reports Integration */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold mb-1">Wind Data</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
              <div className="flex justify-between items-center mb-1">
                <span>Average Speed (24h):</span>
                <span className="font-medium">8.3 m/s</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span>Max Gust (24h):</span>
                <span className="font-medium">12.7 m/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Prevailing Direction:</span>
                <span className="font-medium">NW</span>
              </div>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded transition-colors"
              onClick={() => {
                console.log('View Wind Reports button clicked');
                // Using this approach ensures the hash change is detected
                if (window.location.pathname === '/dashboard') {
                  // If already on dashboard, just change the hash
                  window.location.hash = 'reports';
                } else {
                  // Otherwise navigate to dashboard with hash
                  window.location.href = '/dashboard#reports';
                }
              }}
            >
              View Wind Reports
            </button>
          </div>
        </div>
      )
    },
    clouds_new: {
      title: 'Clouds',
      content: () => (
        <div className="layer-popup">
          <h3 className="text-lg font-bold mb-2">Cloud Information</h3>
          <p className="text-sm mb-2">Shows cloud coverage. Colors range from light gray (few clouds) to dark gray (overcast).</p>
          <div className="mt-2">
            <p className="text-xs mb-1">Cloud cover: <span className="font-semibold">{currentWeather.clouds}%</span></p>
            <p className="text-xs mb-1">Weather: <span className="font-semibold">{currentWeather.weatherDesc}</span></p>
          </div>
          <div className="weather-icon text-center my-2">
            <img 
              src={`https://openweathermap.org/img/wn/${currentWeather.weatherIcon}@2x.png`} 
              alt={currentWeather.weatherDesc}
              className="inline-block w-16 h-16"
            />
          </div>
          
          {/* Cloud Triggers Integration */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold mb-1">Cloud Coverage Impact</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Solar Energy Production:</span>
                <span className={`px-2 py-0.5 ${currentWeather.clouds > 70 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'} rounded`}>
                  {currentWeather.clouds > 70 ? 'Reduced' : 'Optimal'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Crop Light Exposure:</span>
                <span className={`px-2 py-0.5 ${currentWeather.clouds > 80 ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'} rounded`}>
                  {currentWeather.clouds > 80 ? 'Insufficient' : 'Adequate'}
                </span>
              </div>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors"
              onClick={() => window.location.href = '/dashboard/triggers'}
            >
              Manage Cloud Triggers
            </button>
          </div>
          
          {/* Reports Integration */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold mb-1">Cloud Data</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
              <div className="flex justify-between items-center mb-1">
                <span>Average Coverage (7d):</span>
                <span className="font-medium">62%</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span>Clear Days (30d):</span>
                <span className="font-medium">8 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Overcast Days (30d):</span>
                <span className="font-medium">12 days</span>
              </div>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded transition-colors"
              onClick={() => {
                console.log('View Cloud Reports button clicked');
                // Using this approach ensures the hash change is detected
                if (window.location.pathname === '/dashboard') {
                  // If already on dashboard, just change the hash
                  window.location.hash = 'reports';
                } else {
                  // Otherwise navigate to dashboard with hash
                  window.location.href = '/dashboard#reports';
                }
              }}
            >
              View Cloud Reports
            </button>
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
            <p className="text-sm font-medium mb-1">Pressure Trend</p>
            <div className="h-16 flex items-end space-x-1">
              {[1008, 1010, 1012, 1015, 1013, 1010, 1009, 1010, 1012, 1014, 1013, 1012].map((value, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-purple-400 dark:bg-purple-600 rounded-t" 
                  style={{ height: `${Math.max(0, (value - 1000) / 30 * 100)}%` }}
                  title={`${value} hPa`}
                ></div>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-gray-500">
              <span>-24h</span>
              <span>Now</span>
            </div>
          </div>
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-sm font-medium">Weather Interpretation</p>
            <p className="text-xs mt-1">
              {currentWeather.pressure > 1013 
                ? "High pressure typically indicates fair weather conditions." 
                : "Low pressure can be associated with clouds and precipitation."}
            </p>
          </div>
        </div>
      )
    },
    // Add irrigation-specific layers info
    soil_moisture: {
      title: 'Soil Moisture',
      content: () => (
        <div className="layer-popup">
          <h3 className="text-lg font-bold mb-2">Soil Moisture Information</h3>
        <div>
            <p className="mb-2">Current: <span className="font-semibold">{currentWeather.soilMoisture}%</span></p>
            <p className="mb-2">Field Capacity: <span className="font-semibold">30%</span></p>
            <p className="mb-2">Wilting Point: <span className="font-semibold">12%</span></p>
            <div className="soil-moisture-gauge mt-3 relative h-4 bg-gray-200 rounded">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                style={{ width: `${Math.min(100, currentWeather.soilMoisture * 3)}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 text-gray-500">Soil Type: Loam</p>
          </div>
        </div>
      )
    },
    irrigation_needs: {
      title: 'Irrigation Needs',
      content: () => (
        <div className="layer-popup">
          <h3 className="text-lg font-bold mb-2">Irrigation Needs</h3>
        <div>
            <div className="irrigation-status mb-3">
              <div className={`p-2 rounded ${currentWeather.irrigationNeeded ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                <p className="font-semibold text-sm">
                  {currentWeather.irrigationNeeded ? 'Irrigation Needed' : 'No Irrigation Needed'}
                </p>
              </div>
            </div>
            <p className="mb-2">Water Deficit: <span className="font-semibold">{currentWeather.waterDeficit || 0} mm</span></p>
            <p className="mb-2">Evapotranspiration: <span className="font-semibold">{(currentWeather.evapotranspiration || 2.5).toFixed(1)} mm/day</span></p>
            <p className="mb-2">Recommendation: <span className="font-semibold">{currentWeather.irrigationNeeded ? `Apply ${currentWeather.irrigationAmount || 15}mm of water` : `Check again in ${currentWeather.daysUntilIrrigation || 3} days`}</span></p>
          </div>
        </div>
      )
    },
    crop_growth: {
      title: 'Crop Growth',
      content: () => (
        <div className="layer-popup">
          <h3 className="text-lg font-bold mb-2">Crop Growth Analysis</h3>
          <div>
            <div className="flex items-center mb-3">
              <div className="w-20 mr-4">
                <div className="text-center mb-1">
                  <FaSeedling className="inline-block text-green-500 text-xl" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold">Corn</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative pt-1">
                  <p className="text-xs mb-1 flex justify-between">
                    <span>Growth Progress:</span>
                    <span className="font-semibold">65%</span>
                  </p>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200">
                    <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                  </div>
                  <p className="text-xs mt-1">Stage: <span className="font-semibold">Flowering</span></p>
                </div>
              </div>
            </div>
            <p className="text-xs mb-1">Health Index: <span className="font-semibold">78/100</span></p>
            <p className="text-xs mb-1">Yield Estimate: <span className="font-semibold">85% of potential</span></p>
            <p className="text-xs mb-3">Days Since Planting: <span className="font-semibold">45</span></p>
            <div className="text-xs p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="font-semibold mb-1">Notes:</p>
              <p>Flowering stage beginning. Critical period for water and nutrient management.</p>
            </div>
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
          
          {/* Basic Tariff Data */}
          <div className="mt-2">
            <h4 className="text-xs font-semibold">Current Tariff Rates:</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded mt-1">
              {tariffDataLoading ? (
                <p className="text-xs text-center py-2">Loading tariff data...</p>
              ) : Object.keys(tariffData).length > 0 ? (
                <div className="space-y-1">
                  {Object.entries(tariffData).map(([hsCode, data]) => {
                    const productNames = {
                      '1001': 'Wheat',
                      '1005': 'Corn/Maize',
                      '1006': 'Rice',
                      '1201': 'Soybeans',
                      '0805': 'Citrus fruits'
                    };
                    
                    const rate = data?.results && data.results[0]?.tariff_rate 
                      ? `${data.results[0].tariff_rate}%` 
                      : 'N/A';
                    
                    // Add colors based on tariff rate
                    let rateColor = 'text-gray-800 dark:text-gray-200';
                    if (data?.results && data.results[0]?.tariff_rate) {
                      const rateValue = parseFloat(data.results[0].tariff_rate);
                      if (rateValue > 15) rateColor = 'text-red-600 dark:text-red-400';
                      else if (rateValue > 5) rateColor = 'text-yellow-600 dark:text-yellow-400';
                      else rateColor = 'text-green-600 dark:text-green-400';
                    }
                    
                    return (
                      <div key={hsCode} className="flex justify-between items-center text-xs">
                        <span className="font-medium">{productNames[hsCode] || hsCode}:</span>
                        <span className={`font-semibold ${rateColor}`}>{rate}</span>
          </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-center py-2">No tariff data available</p>
              )}
            </div>
          </div>
          
          {/* Detailed Tariff Data from Supabase */}
          {tariffDetailedData && tariffDetailedData.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-semibold mb-1">Historical Tariff Changes:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs max-h-40 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-1">Date</th>
                      <th className="text-left py-1">Product</th>
                      <th className="text-right py-1">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariffDetailedData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-1">{new Date(item.effective_date).toLocaleDateString()}</td>
                        <td className="py-1">{item.product_name}</td>
                        <td className={`text-right py-1 ${parseFloat(item.change) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Tariff Reports Integration */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-semibold mb-1">Trade Reports</h4>
            <div className="flex justify-between text-xs">
              <span>Impact on Revenue:</span>
              <span className="font-medium text-red-500">-$1.2M (Est.)</span>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded transition-colors"
              onClick={() => {
                window.location.href = '/dashboard#reports';
              }}
            >
              View Trade Impact Reports
            </button>
          </div>
          
          {/* Trigger Integration */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-semibold mb-1">Tariff Monitoring</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
              <div className="flex items-center justify-between">
                <span>Alert on tariff increases</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" id="tariffAlertToggle" className="sr-only" />
                  <span className="toggle-bg block overflow-hidden h-4 rounded-full bg-gray-300 cursor-pointer"></span>
                </div>
              </div>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors"
              onClick={() => window.location.href = '/dashboard/triggers/trade'}
            >
              Manage Tariff Triggers
            </button>
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
      
      // Also set the active layer to match the popup
      setActiveLayer(layerId);
      
      // Update the map to show the selected layer
      if (mapRef.current && layerRefs.current) {
        console.log(`Toggle popup for layer: ${layerId}`);
        
        // Add a delay to prevent NS_BINDING_ABORTED errors
        setTimeout(() => {
          // Remove all existing layers first
          weatherLayers.forEach(layer => {
            if (layerRefs.current[layer.id] && mapRef.current.hasLayer(layerRefs.current[layer.id])) {
              console.log(`Removing layer: ${layer.id}`);
              mapRef.current.removeLayer(layerRefs.current[layer.id]);
            }
          });
          
          // Add the selected layer if it exists
          if (layerRefs.current[layerId]) {
            console.log(`Adding layer: ${layerId}`);
            layerRefs.current[layerId].addTo(mapRef.current);
          }
          // Otherwise create it for standard weather layers
          else {
            const standardWeatherLayers = ['temp_new', 'precipitation_new', 'wind_new', 'clouds_new', 'pressure_new'];
            if (standardWeatherLayers.includes(layerId)) {
              console.log(`Creating new layer for: ${layerId}`);
              const weatherLayerUrl = getWeatherTileUrl(layerId);
              
              const newLayer = L.tileLayer(weatherLayerUrl, {
                opacity: 0.7,
                tileSize: 256,
                zoomOffset: 0,
                minZoom: 0,
                maxZoom: 18,
                // Add caching and throttling options
                updateWhenIdle: true,
                updateWhenZooming: false
              }).addTo(mapRef.current);
              
              // Store reference
              layerRefs.current[layerId] = newLayer;
            }
          }
        }, 100);
      }
    }
  };

  // Track Leaflet loading status
  // Variable already defined above, removed duplicate declaration
  
  // Set up improved network handling to prevent NS_BINDING_ABORTED errors
  useEffect(() => {
    // Fix for CORS and network issues
    const originalFetch = window.fetch;
    
    // Patch the fetch API to add CORS headers and improve timeout handling
    window.fetch = function patchedFetch(url, options = {}) {
      // Add timestamp to OpenWeatherMap and OpenStreetMap URLs to prevent caching issues
      let modifiedUrl = url;
      if (typeof url === 'string' && 
          (url.includes('openweathermap.org') || url.includes('openstreetmap.org'))) {
        const separator = url.includes('?') ? '&' : '?';
        modifiedUrl = `${url}${separator}_t=${Date.now()}`;
      }
      
      // Add CORS headers and credentials
      const modifiedOptions = {
        ...options,
        credentials: 'omit', // Don't send cookies for third-party APIs
        mode: 'cors',
        cache: 'no-cache', // Prevent browser cache issues
        headers: {
          ...options.headers,
          'Access-Control-Allow-Origin': '*',
        },
        // Add a timeout to prevent hanging requests
        signal: options.signal || (function() {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 10000); // 10-second timeout
          return controller.signal;
        })()
      };
      
      return originalFetch(modifiedUrl, modifiedOptions)
        .catch(error => {
          if (error.name === 'AbortError') {
            console.warn('Fetch aborted for URL:', modifiedUrl);
          }
          throw error;
        });
    };
    
    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Fix Leaflet icon issue
  const fixLeafletIcons = useCallback(() => {
    if (!window.L) return;
    
    try {
      // Fix icon paths
      delete window.L.Icon.Default.prototype._getIconUrl;
      window.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
      console.log("Leaflet icon paths fixed");
    } catch (error) {
      console.error("Error fixing Leaflet icons:", error);
    }
  }, []);
  
  // Add leaflet CSS and JS directly to ensure they're loaded
  useEffect(() => {
    // Prevent duplicate loading
    if (window.L || leafletLoaded) {
      console.log("Leaflet already loaded");
      setLeafletLoaded(true);
      fixLeafletIcons();
      return;
    }
    
    console.log("Loading Leaflet resources...");
    
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
        setLeafletLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      // If script already exists, ensure icon fix is applied
      fixLeafletIcons();
      setLeafletLoaded(true);
    }
  }, [fixLeafletIcons]);

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
      
      /* High contrast, highly readable map text styles */
      .leaflet-container {
        font-family: 'Arial', sans-serif !important;
        font-size: 16px !important;
      }
      
      /* Make ALL map labels extremely readable */
      .leaflet-tooltip,
      .leaflet-popup-content,
      .leaflet-control,
      .leaflet-control-attribution {
        font-size: 16px !important;
        font-weight: 700 !important;
        color: #000000 !important;
        text-shadow: 
          -1px -1px 0 #FFFFFF,
          1px -1px 0 #FFFFFF,
          -1px 1px 0 #FFFFFF,
          1px 1px 0 #FFFFFF,
          0 0 5px #FFFFFF !important;
        background-color: rgba(255, 255, 255, 0.95) !important;
        border: 2px solid rgba(0, 0, 0, 0.5) !important;
        border-radius: 5px !important;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5) !important;
        letter-spacing: 0.5px !important;
        line-height: 1.5 !important;
      }
      
      /* Dark mode version with reversed contrast */
      .dark-mode .leaflet-tooltip,
      .dark-mode .leaflet-popup-content,
      .dark-mode .leaflet-control,
      .dark-mode .leaflet-control-attribution {
        color: #FFFFFF !important;
        background-color: rgba(0, 0, 0, 0.9) !important;
        text-shadow: 
          -1px -1px 0 #000000,
          1px -1px 0 #000000,
          -1px 1px 0 #000000,
          1px 1px 0 #000000,
          0 0 5px #000000 !important;
        border: 2px solid rgba(255, 255, 255, 0.5) !important;
      }
      
      /* Force Popup content to be extremely readable */
      .leaflet-popup-content-wrapper {
        padding: 10px !important;
        background-color: rgba(255, 255, 255, 0.95) !important;
        color: #000 !important;
      }
      
      .dark-mode .leaflet-popup-content-wrapper {
        background-color: rgba(30, 30, 30, 0.95) !important;
        color: #FFFFFF !important;
      }
      
      /* Make popup content headings stand out */
      .leaflet-popup-content h3 {
        font-size: 18px !important;
        font-weight: 800 !important;
        margin-bottom: 10px !important;
        color: #2D7D46 !important;
        text-shadow: none !important;
      }
      
      .dark-mode .leaflet-popup-content h3 {
        color: #5BDF7B !important;
      }
      
      /* Ensure popup body text is readable */
      .leaflet-popup-content p {
        font-size: 16px !important;
        margin: 8px 0 !important;
        font-weight: 600 !important;
        line-height: 1.5 !important;
      }
      
      /* Extra-large markers and icons */
      .leaflet-div-icon, 
      .leaflet-marker-icon {
        transform: scale(1.5) !important;
        filter: drop-shadow(0 0 3px #FFF) drop-shadow(0 0 5px #FFF) !important;
      }
      
      /* High-contrast map controls */
      .leaflet-control-zoom a {
        font-size: 20px !important;
        font-weight: 800 !important;
        width: 36px !important;
        height: 36px !important;
        font-size: 14px !important;
      }
      
      .map-legend .text-xs {
        font-size: 13px !important;
        font-weight: 500 !important;
      }
      
      /* Toggle switch styles */
      .toggle-bg {
        transition: background-color 0.2s;
      }
      #tariffAlertToggle:checked + .toggle-bg {
        background-color: #3B82F6;
      }
      .toggle-bg::after {
        content: '';
        display: block;
        background-color: white;
        width: 1rem;
        height: 1rem;
        border-radius: 9999px;
        position: relative;
        top: -2px;
        left: 0;
        transition: transform 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      #tariffAlertToggle:checked + .toggle-bg::after {
        transform: translateX(1rem);
      }
      
      /* Layer popup styles */
      .leaflet-popup-content {
        margin: 10px 12px;
        max-width: 280px;
      }
      .leaflet-popup-content h3 {
        font-weight: 600;
        margin-bottom: 8px;
      }
      .leaflet-popup-content p {
        margin: 4px 0;
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

  // Add a prominent temperature unit selector
  const addTemperatureUnitSelector = (map) => {
    try {
      // Create a custom control for temperature unit
      const TempUnitControl = L.Control.extend({
        options: {
          position: 'topright'
        },
        
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control temp-unit-control');
          container.style.backgroundColor = 'white';
          container.style.padding = '6px 8px';
          container.style.borderRadius = '4px';
          container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
          container.style.cursor = 'pointer';
          container.style.margin = '10px 10px 0 0';
          container.style.color = '#000';
          container.style.fontWeight = 'bold';
          container.style.fontSize = '14px';
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';
          
          // Set content based on current unit
          container.innerHTML = useMetric ? '°C | <span style="color: #888;">°F</span>' : '<span style="color: #888;">°C</span> | °F';
          
          // Add click handler to toggle unit
          L.DomEvent.on(container, 'click', function(e) {
            L.DomEvent.stopPropagation(e);
            toggleTemperatureUnit();
            // Update display after toggling
            container.innerHTML = useMetric ? '°C | <span style="color: #888;">°F</span>' : '<span style="color: #888;">°C</span> | °F';
          });
          
          return container;
        }
      });
      
      // Add the control to the map
      new TempUnitControl().addTo(map);
    } catch (error) {
      console.error("Error adding temperature unit selector:", error);
    }
  };
  
  // Add a location display component at the top of the map
  const addLocationDisplay = (map) => {
    try {
      // Create a custom control for location
      const LocationControl = L.Control.extend({
        options: {
          position: 'topleft'
        },
        
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control location-display');
          container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          container.style.padding = '8px 12px';
          container.style.borderRadius = '4px';
          container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
          container.style.margin = '10px';
          container.style.color = '#000';
          container.style.fontWeight = 'bold';
          container.style.fontSize = '14px';
          container.style.maxWidth = '300px';
          container.style.whiteSpace = 'nowrap';
          container.style.overflow = 'hidden';
          container.style.textOverflow = 'ellipsis';
          
          // Bold location name with temperature
          const displayedTemp = formatTemperature(currentWeather.tempC);
          const displayedLocation = currentLocation?.name || 'Unknown Location';
          container.innerHTML = `<strong>${displayedLocation}</strong>: ${displayedTemp}`;
          
          return container;
        }
      });
      
      // Add the control to the map
      new LocationControl().addTo(map);
    } catch (error) {
      console.error("Error adding location display:", error);
    }
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        console.log("Cleaning up map and layers");
        
        const map = mapRef.current;
        
        // Check if map has the required methods
        if (typeof map.hasLayer !== 'function' || typeof map.removeLayer !== 'function' || typeof map.remove !== 'function') {
          console.warn("Map missing required methods during cleanup");
          mapRef.current = null;
          return;
        }
        
        try {
          // Remove all layers
          Object.values(layerRefs.current || {}).forEach(layer => {
            if (layer && map.hasLayer(layer)) {
              map.removeLayer(layer);
            }
          });
          
          // Remove marker
          if (window.marker && map.hasLayer(window.marker)) {
            map.removeLayer(window.marker);
            window.marker = null;
          }
          
          // Remove the map
          map.remove();
          mapRef.current = null;
        } catch (error) {
          console.error("Error during map cleanup:", error);
          mapRef.current = null;
        }
      }
    };
  }, []);

  // Make sure location updates are reflected in the map
  useEffect(() => {
    // Skip if map isn't initialized or is still loading
    if (!mapRef.current || isLoading) return;
    
    try {
      console.log(`Updating map location to: ${displayLocationName} [${displayLocationLat},${displayLocationLng}]`);
      const map = mapRef.current;
      
      // Make sure map methods are available
      if (!map || typeof map.setView !== 'function') {
        console.error("Map not properly initialized or missing methods", map);
        return;
      }
      
      // Update the center and zoom
      map.setView([displayLocationLat, displayLocationLng], 8);
      
      // Update the marker if it exists
      if (window.marker) {
        window.marker.setLatLng([displayLocationLat, displayLocationLng])
          .bindPopup(`${displayLocationName}<br>Temperature: ${mainDisplayTemp}<br>Weather: ${currentWeather.weatherDesc}`)
          .openPopup();
      } else {
        // Create a new marker if it doesn't exist
        window.marker = L.marker([displayLocationLat, displayLocationLng], { icon: cityIcon })
          .addTo(map)
          .bindPopup(`${displayLocationName}<br>Temperature: ${mainDisplayTemp}<br>Weather: ${currentWeather.weatherDesc}`)
          .openPopup();
      }
      
      // Ensure size is correct
      map.invalidateSize(true);
    } catch (error) {
      console.error("Error updating map location:", error);
    }
  }, [displayLocationLat, displayLocationLng, isLoading, displayLocationName, mainDisplayTemp, currentWeather.weatherDesc]);
  
  // Update weather layer when activeLayer changes
  useEffect(() => {
    // Skip if map isn't initialized or is still loading
    if (!mapRef.current || isLoading) return;
    
    try {
      console.log(`Active layer changed to: ${activeLayer}`);
      handleLayerChange(activeLayer);
    } catch (error) {
      console.error("Error updating active layer:", error);
    }
  }, [activeLayer, isLoading]);
  
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
          
          // Also fetch detailed tariff data from Supabase
          await fetchSupabaseTariffData(countryCode);
          
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

  // Fetch irrigation/crop data when irrigation mode or specific layers are active
  useEffect(() => {
    if (mode === 'irrigation' || activeLayer === 'soil_moisture' || activeLayer === 'irrigation_needs' || activeLayer === 'crop_growth') {
      const fetchIrrigationData = async () => {
        try {
          // Get weather data first if needed
          const weatherData = currentWeather.temp === 0 
            ? await fetchWeatherData(currentLocation.lat, currentLocation.lng) 
            : currentWeather;
          
          // Fetch irrigation data
          const irrigationData = await fetchSimulatedIrrigationNeeds(
            currentLocation.lat, 
            currentLocation.lng, 
            weatherData
          );
          
          // Fetch crop growth data
          const cropData = await fetchSimulatedCropData(
            currentLocation.lat, 
            currentLocation.lng, 
            weatherData
          );
          
          // Update the weather state with the new data
          setCurrentWeather(prev => ({
            ...prev,
            soilMoisture: irrigationData.soilMoisture,
            fieldCapacity: irrigationData.fieldCapacity,
            wiltingPoint: irrigationData.wiltingPoint,
            waterDeficit: irrigationData.waterDeficit,
            evapotranspiration: irrigationData.evapotranspiration,
            irrigationNeeded: irrigationData.irrigationNeeded,
            irrigationAmount: irrigationData.irrigationAmount,
            daysUntilIrrigation: irrigationData.daysUntilIrrigation,
            wateringRecommendation: irrigationData.wateringRecommendation,
            soilType: irrigationData.soilType,
            
            // Crop data
            cropType: cropData.cropType,
            growthPercentage: cropData.growthPercentage,
            growthStage: cropData.growthStage,
            healthIndex: cropData.healthIndex,
            yieldEstimate: cropData.yieldEstimate,
            cropNotes: cropData.details.notes,
            daysSincePlanting: cropData.details.daysSincePlanting,
            harvestDate: cropData.details.estimatedHarvestDate
          }));
          
          // Update visualization on the map if we have a reference
          updateIrrigationLayersOnMap(irrigationData, cropData);
          
        } catch (error) {
          console.error('Error fetching irrigation/crop data:', error);
        }
      };
      
      fetchIrrigationData();
    }
  }, [currentLocation, mode, activeLayer]);
  
  // Function to update irrigation and crop layers on the map
  const updateIrrigationLayersOnMap = (irrigationData, cropData) => {
    if (!mapRef.current) return;
    
    // Clear existing overlay layers first
    if (window.irrigationLayer) {
      mapRef.current.removeLayer(window.irrigationLayer);
    }
    
    if (window.cropLayer) {
      mapRef.current.removeLayer(window.cropLayer);
    }
    
    // For soil moisture or irrigation needs layer
    if (activeLayer === 'soil_moisture' || activeLayer === 'irrigation_needs') {
      // Create a circle showing irrigation status
      const radius = 2000; // 2km radius
      const irrigationCircle = L.circle([currentLocation.lat, currentLocation.lng], {
        radius: radius,
        color: irrigationData.irrigationNeeded ? '#FFA726' : '#4CAF50',
        fillColor: irrigationData.irrigationNeeded ? '#FFE0B2' : '#C8E6C9',
        fillOpacity: 0.5,
        weight: 2
      });
      
      // Add popup with irrigation info
      irrigationCircle.bindPopup(`
        <div class="irrigation-popup">
          <h3 class="text-lg font-semibold mb-2">${currentLocation.name} Field</h3>
          <p class="mb-1"><b>Soil Moisture:</b> ${irrigationData.soilMoisture}%</p>
          <p class="mb-1"><b>Water Deficit:</b> ${irrigationData.waterDeficit} mm</p>
          <p class="mb-1"><b>Status:</b> ${irrigationData.irrigationNeeded ? 'Irrigation Needed' : 'Adequate Moisture'}</p>
          <p class="mb-1"><b>Recommendation:</b> ${irrigationData.wateringRecommendation}</p>
        </div>
      `);
      
      // Add to map and store reference
      irrigationCircle.addTo(mapRef.current);
      window.irrigationLayer = irrigationCircle;
    }
    
    // For crop growth layer
    if (activeLayer === 'crop_growth') {
      // Create a marker showing crop status
      const cropIcon = L.divIcon({
        className: 'crop-marker',
        html: `<div class="crop-icon" style="
          width: 40px; 
          height: 40px; 
          background-color: #43A047; 
          color: white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 20px;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        ">
          <i class="fas fa-seedling"></i>
        </div>`,
        iconSize: [40, 40]
      });
      
      const cropMarker = L.marker([currentLocation.lat, currentLocation.lng], {
        icon: cropIcon
      });
      
      // Add popup with crop growth info
      cropMarker.bindPopup(`
        <div class="crop-popup">
          <h3 class="text-lg font-semibold mb-2">${cropData.cropType.charAt(0).toUpperCase() + cropData.cropType.slice(1)}</h3>
          <p class="mb-1"><b>Growth Stage:</b> ${cropData.growthStage}</p>
          <p class="mb-1"><b>Progress:</b> ${cropData.growthPercentage}%</p>
          <p class="mb-1"><b>Health:</b> ${cropData.healthIndex}/100</p>
          <p class="mb-1"><b>Est. Yield:</b> ${cropData.yieldEstimate}% of potential</p>
          <p class="mb-1"><b>Notes:</b> ${cropData.details.notes}</p>
        </div>
      `);
      
      // Add to map and store reference
      cropMarker.addTo(mapRef.current);
      window.cropLayer = cropMarker;
    }
  };

  // Function to fetch tariff data from Supabase
  const fetchSupabaseTariffData = async (countryCode) => {
    setTariffDataLoading(true);
    try {
      // Fetch tariff data from Supabase
      const { data, error } = await supabaseClient
        .from('tariff_data')
        .select('*')
        .eq('country_code', countryCode)
        .order('effective_date', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      setTariffDetailedData(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching tariff data from Supabase:', error);
      return [];
    } finally {
      setTariffDataLoading(false);
    }
  };

  // Update the MapLegend component styling and position
  const MapLegend = ({ selectedLayer }) => {
    // Legend configurations for each layer
    const legendConfigs = {
      temp_new: {
        title: 'Temperature (°C)',
        gradient: true,
        items: [
          { color: '#0000FF', label: '-20°C' },
          { color: '#00FFFF', label: '0°C' },
          { color: '#FFFF00', label: '20°C' },
          { color: '#FF0000', label: '40°C' }
        ]
      },
      precipitation_new: {
        title: 'Precipitation (mm)',
        gradient: true,
        items: [
          { color: '#FFFFFF', label: '0 mm' },
          { color: '#A4D3EE', label: '1 mm' },
          { color: '#1E90FF', label: '5 mm' },
          { color: '#0000CD', label: '10+ mm' }
        ]
      },
      wind_new: {
        title: 'Wind Speed (m/s)',
        gradient: true,
        items: [
          { color: '#E6F5FF', label: '0 m/s' },
          { color: '#99D6FF', label: '5 m/s' },
          { color: '#4DA6FF', label: '10 m/s' },
          { color: '#0066CC', label: '15+ m/s' }
        ]
      },
      clouds_new: {
        title: 'Cloud Coverage (%)',
        gradient: true,
        items: [
          { color: '#FFFFFF', label: '0%' },
          { color: '#D3D3D3', label: '25%' },
          { color: '#A9A9A9', label: '50%' },
          { color: '#696969', label: '75%' },
          { color: '#2F4F4F', label: '100%' }
        ]
      },
      pressure_new: {
        title: 'Pressure (hPa)',
        gradient: true,
        items: [
          { color: '#8C0000', label: '970 hPa' },
          { color: '#FF5349', label: '990 hPa' },
          { color: '#FFFFFF', label: '1013 hPa' },
          { color: '#ADD8E6', label: '1030 hPa' },
          { color: '#0000FF', label: '1050 hPa' }
        ]
      },
      soil_moisture: {
        title: 'Soil Moisture (%)',
        gradient: true,
        items: [
          { color: '#FEECB9', label: '0%' },
          { color: '#D8B365', label: '25%' },
          { color: '#8C510A', label: '50%' },
          { color: '#35978F', label: '75%' },
          { color: '#01665E', label: '100%' }
        ]
      },
      irrigation_needs: {
        title: 'Irrigation Needs',
        gradient: true,
        items: [
          { color: '#C8E6C9', label: 'None' },
          { color: '#81C784', label: 'Low' },
          { color: '#FFE0B2', label: 'Medium' },
          { color: '#FFA726', label: 'High' },
        ]
      },
      crop_growth: {
        title: 'Crop Growth',
        gradient: true,
        items: [
          { color: '#E8F5E9', label: 'Early' },
          { color: '#A5D6A7', label: 'Growing' },
          { color: '#66BB6A', label: 'Mature' },
          { color: '#43A047', label: 'Harvest' },
        ]
      },
      trade_events: {
        title: 'Trade Events',
        gradient: false,
        items: [
          { color: '#8D6E63', label: 'Events' },
        ]
      },
      tariffs: {
        title: 'Tariff Rates',
        gradient: true,
        items: [
          { color: '#C8E6C9', label: '0-5%' },
          { color: '#FFECB3', label: '6-15%' },
          { color: '#FFCCBC', label: '16-25%' },
          { color: '#FFAB91', label: '>25%' },
        ]
      },
      export_markets: {
        title: 'Export Potential',
        gradient: true,
        items: [
          { color: '#E8EAF6', label: 'Low' },
          { color: '#9FA8DA', label: 'Medium' },
          { color: '#5C6BC0', label: 'High' },
          { color: '#3D5AFE', label: 'Excellent' },
        ]
      }
    };

    const config = legendConfigs[selectedLayer] || null;
    
    if (!config) return null;

    return (
      <div className="absolute bottom-24 right-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow-md z-10 w-64 map-legend">
        <h4 className="text-base font-extrabold mb-3 text-center">{config.title}</h4>
        {config.gradient ? (
          <div className="w-full h-8 relative mb-3 rounded overflow-hidden">
            <div 
              className="w-full h-full" 
              style={{
                background: `linear-gradient(to right, ${config.items.map(item => item.color).join(', ')})`,
                boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-2">
            {config.items.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-6 h-6 mr-3 rounded-sm" 
                  style={{ backgroundColor: item.color, boxShadow: '0 0 3px rgba(0, 0, 0, 0.5)' }}
                />
                <span className="text-base font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between text-sm mt-2 font-bold">
          {config.gradient && config.items.map((item, index) => (
            <div key={index} className="text-center">
              {index === 0 || index === config.items.length - 1 ? item.label : ''}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function for safely handling layer switching with error prevention
  const safeLayerSwitch = (newLayerId) => {
    console.log(`Safe layer switch requested to: ${newLayerId}`);
    
    // Cancel any pending layer changes
    if (window.layerChangeTimeout) {
      clearTimeout(window.layerChangeTimeout);
    }
    
    // Set a flag to indicate we're in the middle of a layer change
    window.isChangingLayer = true;
    
    try {
      // Always set the active layer in the UI immediately for responsiveness
      setActiveLayer(newLayerId);
      
      // Delay the actual layer change to prevent rapid clicking issues
      window.layerChangeTimeout = setTimeout(() => {
        try {
          handleLayerChange(newLayerId);
        } catch (e) {
          console.error("Error in delayed layer change:", e);
          // Recovery: try to reinitialize the map completely
          if (mapRef.current) {
            try {
              mapRef.current.invalidateSize(true);
              
              // Final recovery attempt: force reload all layers
              setTimeout(() => {
                try {
                  handleLayerChange(newLayerId);
                } catch (finalError) {
                  console.error("Final recovery attempt failed:", finalError);
                }
              }, 1000);
            } catch (error) {
              console.error("Error during map recovery:", error);
            }
          }
        } finally {
          // Clear the flag when done
          window.isChangingLayer = false;
        }
      }, 500);
    } catch (error) {
      console.error("Error in safe layer switch:", error);
      window.isChangingLayer = false;
    }
  };
  
  // Layer button components with safe layer switching and enhanced tooltips
  const LayerButton = ({ layerId }) => {
    const layer = weatherLayers.find(layer => layer.id === layerId);
    
    return (
      <div className="relative group">
        <button 
          className={`p-3 rounded-lg ${activeLayer === layerId ? 'active' : ''} weather-layer-button flex items-center justify-center`}
          onClick={() => {
            safeLayerSwitch(layerId);
            togglePopup(layerId);
          }}
          title={layer?.name}
          style={getLayerButtonStyle(layerId, activeLayer === layerId)}
        >
          <span className="weather-layer-icon text-2xl">
            {layer?.icon}
          </span>
        </button>
        
        {/* Enhanced tooltip that appears on hover */}
        <div 
          className="absolute left-full ml-2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-48 z-50 pointer-events-none"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <div className="font-bold mb-1">{layer?.name}</div>
          <div>{layer?.tooltip || `View ${layer?.name.toLowerCase()} data`}</div>
          <div className="text-xs mt-1 text-green-400">Click to activate this layer</div>
        </div>
      </div>
    );
  };

  // Initialize the map when the component mounts
  useEffect(() => {
    // Don't initialize if already done, loading data, or Leaflet not ready
    if (mapRef.current || isLoading || !window.L) {
      return;
    }
    
    console.log("Initializing map with simplified approach to avoid pane errors...");
    
    try {
      // Get reference to Leaflet
      const L = window.L;
      
      // Force clear any existing map instance first
      const mapContainer = document.getElementById(mapId.current);
      if (mapContainer) {
        // Clear any existing content
        mapContainer.innerHTML = '';
        
        // Ensure the container has proper dimensions
        mapContainer.style.width = '100%';
        mapContainer.style.height = '500px';
        mapContainer.style.position = 'relative';
      } else {
        console.error(`Map container with ID ${mapId.current} not found`);
        return;
      }
      
      // Create a simpler map to avoid pane initialization issues
      console.log("Creating map with explicit pane creation");
      const map = new L.Map(mapId.current, {
        center: [currentLocation.lat, currentLocation.lng],
        zoom: 6,
        zoomControl: false,
        attributionControl: false
      });
      
      // Store the map immediately
      mapRef.current = map;
      
      // Create base panes explicitly
      console.log("Creating panes explicitly");
      if (!map.getPane('tilePane')) map.createPane('tilePane');
      if (!map.getPane('overlayPane')) map.createPane('overlayPane');
      if (!map.getPane('shadowPane')) map.createPane('shadowPane');
      if (!map.getPane('markerPane')) map.createPane('markerPane');
      if (!map.getPane('tooltipPane')) map.createPane('tooltipPane');
      if (!map.getPane('popupPane')) map.createPane('popupPane');
      
      // Add controls using native Leaflet methods
      console.log("Adding controls");
      L.control.attribution({
        prefix: '<strong>AgriWeather Pro</strong> | Map data',
        position: 'bottomright'
      }).addTo(map);
      
      L.control.zoom({
        position: 'topright',
      }).addTo(map);
      
      // Add the base tile layer with standard settings
      console.log("Adding base layer");
      const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        subdomains: ['a', 'b', 'c'],
        pane: 'tilePane' // Explicitly specify pane
      }).addTo(map);
      
      // Add marker for location with a clearer popup
      console.log("Adding location marker");
      const marker = L.marker([currentLocation.lat, currentLocation.lng], {
        pane: 'markerPane' // Explicitly specify pane
      }).addTo(map);
      
      // Format the temperature for display
      const formattedTemp = formatTemperature(currentWeather.tempC);
      
      // Bind a color-contrasting popup
      marker.bindPopup(`
        <div style="color: #000; background: #fff; padding: 8px; border-radius: 4px; min-width: 200px;">
          <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">${currentLocation.name}</h3>
          <p style="font-size: 14px; margin: 4px 0;"><strong>Temperature:</strong> ${formattedTemp}</p>
          <p style="font-size: 14px; margin: 4px 0;"><strong>Weather:</strong> ${currentWeather.weatherDesc}</p>
        </div>
      `);
      
      // Add a temperature unit selector control
      const TempUnitControl = L.Control.extend({
        options: {
          position: 'topright'
        },
        
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control temp-unit-control');
          container.style.backgroundColor = 'white';
          container.style.padding = '6px 8px';
          container.style.borderRadius = '4px';
          container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
          container.style.cursor = 'pointer';
          container.style.margin = '10px 10px 0 0';
          container.style.color = '#000';
          container.style.fontWeight = 'bold';
          container.style.fontSize = '14px';
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';
          
          // Set content based on current unit
          container.innerHTML = useMetric ? '°C | <span style="color: #888;">°F</span>' : '<span style="color: #888;">°C</span> | °F';
          
          // Add click handler to toggle unit
          L.DomEvent.on(container, 'click', function(e) {
            L.DomEvent.stopPropagation(e);
            toggleTemperatureUnit();
            // Update display after toggling
            container.innerHTML = useMetric ? '°C | <span style="color: #888;">°F</span>' : '<span style="color: #888;">°C</span> | °F';
          });
          
          return container;
        }
      });
      
      // Add the temperature control to the map
      new TempUnitControl().addTo(map);
      
      // Add a location display control
      const LocationControl = L.Control.extend({
        options: {
          position: 'topleft'
        },
        
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control location-display');
          container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          container.style.padding = '8px 12px';
          container.style.borderRadius = '4px';
          container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
          container.style.margin = '10px';
          container.style.color = '#000';
          container.style.fontWeight = 'bold';
          container.style.fontSize = '14px';
          container.style.maxWidth = '300px';
          container.style.whiteSpace = 'nowrap';
          container.style.overflow = 'hidden';
          container.style.textOverflow = 'ellipsis';
          
          // Bold location name with temperature
          container.innerHTML = `<strong>${currentLocation.name}</strong>: ${formattedTemp}`;
          
          return container;
        }
      });
      
      // Add the location control to the map
      new LocationControl().addTo(map);
      
      // Delay layer initialization to ensure map is ready
      setTimeout(() => {
        console.log("Initializing weather layer");
        handleLayerChange(activeLayer);
      }, 500);
      
      // Add an event listener to update location when map is clicked
      map.on('click', async (e) => {
        try {
          const { lat, lng } = e.latlng;
          
          // Add a loading indicator
          const loadingDiv = L.DomUtil.create('div', 'loading-location');
          loadingDiv.innerHTML = 'Getting location...';
          loadingDiv.style.position = 'absolute';
          loadingDiv.style.top = '10px';
          loadingDiv.style.left = '50%';
          loadingDiv.style.transform = 'translateX(-50%)';
          loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
          loadingDiv.style.color = 'white';
          loadingDiv.style.padding = '8px 16px';
          loadingDiv.style.borderRadius = '4px';
          loadingDiv.style.zIndex = '1000';
          document.body.appendChild(loadingDiv);
          
          // Reverse geocode
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=deeaa95f4b7b2543dc8c3d9cb96396c6`
          );
          const data = await response.json();
          
          // Remove loading indicator
          document.body.removeChild(loadingDiv);
          
          if (data && data.length > 0) {
            const newLocationName = data[0].name || 'Unknown Location';
            
            // Update location state
            setCurrentLocation({
              lat,
              lng,
              name: newLocationName
            });
            
            // Update marker
            marker.setLatLng([lat, lng]);
            marker.bindPopup(`
              <div style="color: #000; background: #fff; padding: 8px; border-radius: 4px; min-width: 200px;">
                <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">${newLocationName}</h3>
                <p style="font-size: 14px; margin: 4px 0;"><strong>Temperature:</strong> ${formattedTemp}</p>
                <p style="font-size: 14px; margin: 4px 0;"><strong>Weather:</strong> ${currentWeather.weatherDesc}</p>
              </div>
            `).openPopup();
            
            // Fetch weather for the new location
            fetchWeather();
          }
        } catch (error) {
          console.error("Error updating location:", error);
        }
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [isLoading, activeLayer, currentLocation, currentWeather, useMetric, formatTemperature, toggleTemperatureUnit, fetchWeather]);

  // Render with explicit dimensions and unique ID
  return (
    <div className="relative w-full h-full" style={{ minHeight: '500px' }}>
      {/* Map container - this div will become the Leaflet map */}
      <div 
        id={mapId.current} 
        className="absolute inset-0 w-full h-full bg-gray-100"
        style={{ zIndex: 1 }}
      >
        {!leafletLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p>Loading map resources...</p>
          </div>
        )}
        {leafletLoaded && !mapRef.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p>Initializing map...</p>
          </div>
        )}
      </div>
      
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
          data-label_1={displayLocationName}
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
          {displayLocationName} Weather
        </a>
      </div>

      {/* Map layers control with popups */}
      <div className="absolute bottom-24 left-4 z-10">
        <div className="flex flex-col space-y-3 relative">
          {weatherLayers.map(layer => (
            <div key={layer.id} className="relative">
              <LayerButton layerId={layer.id} />
              
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
      
      {/* Map Legend */}
      <div className="absolute top-32 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs">
        <h3 className="font-semibold mb-2 text-sm">Map Legend</h3>
        <div className="space-y-2">
          {weatherLayers.map(layer => (
            <div key={layer.id} className="flex items-center text-xs">
              <div 
                className="w-4 h-4 mr-2 rounded" 
                style={getLayerButtonStyle(layer.id, activeLayer === layer.id)}
              ></div>
              <span>{layer.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Click on layer buttons to toggle visibility</p>
        </div>
      </div>
      
      {/* Color scale legend */}
      <MapLegend selectedLayer={activeLayer} />
    </div>
  );
};

export default WeatherMap;