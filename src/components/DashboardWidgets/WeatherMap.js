import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaTemperatureHigh, FaCloudRain, FaWind, FaCloud, FaTachometerAlt } from 'react-icons/fa';

// Fix for Leaflet icons
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

const WeatherMap = ({ location = { lat: 51.505, lng: -0.09, name: 'London' }, mode = 'weather' }) => {
  const [mapId] = useState(`map-${Math.random().toString(36).substr(2, 9)}`);
  const [activeLayer, setActiveLayer] = useState('temp_new');
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const layerRefs = useRef({});

  // Add weather map tile URL helper
  const getWeatherTileUrl = (layerId) => {
    const baseUrl = 'https://tile.openweathermap.org/map';
    const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
    const timestamp = Date.now();
    return `${baseUrl}/${layerId}/{z}/{x}/{y}.png?appid=${apiKey}&_t=${timestamp}`;
  };

  // Layer configuration
  const layerConfig = [
    { id: 'temp_new', name: 'Temperature', icon: <FaTemperatureHigh /> },
    { id: 'precipitation_new', name: 'Precipitation', icon: <FaCloudRain /> },
    { id: 'wind_new', name: 'Wind Speed', icon: <FaWind /> },
    { id: 'clouds_new', name: 'Clouds', icon: <FaCloud /> },
    { id: 'pressure_new', name: 'Pressure', icon: <FaTachometerAlt /> }
  ];

  // Initialize map when component mounts
  useEffect(() => {
    if (!window.L) {
      // Add Leaflet scripts dynamically
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      script.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
      script.crossOrigin = '';
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);
      
      // Add Leaflet CSS dynamically
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
      link.crossOrigin = '';
      document.head.appendChild(link);
    } else {
      initializeMap();
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  // Update the map when location changes
  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.setView([location.lat, location.lng], 8);
      
      // Update marker if it exists
      if (window.marker && mapRef.current.hasLayer(window.marker)) {
        window.marker.setLatLng([location.lat, location.lng]);
      }
    }
  }, [location]);

  // Initialize the map
  const initializeMap = () => {
    // Make sure element is in the DOM
    const mapContainer = document.getElementById(mapId);
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }
    
    // Fix Leaflet icons
    fixLeafletIcon();
    
    // Create map instance
    const map = L.map(mapId, {
      center: [location.lat, location.lng],
      zoom: 8,
      zoomControl: true
    });
    
    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker for the location
    window.marker = L.marker([location.lat, location.lng]).addTo(map);
    window.marker.bindPopup(`<b>${location.name}</b>`).openPopup();
    
    // Add initial weather layer
    const weatherLayer = L.tileLayer(getWeatherTileUrl(activeLayer), {
      attribution: '&copy; OpenWeatherMap',
      opacity: 0.5
    }).addTo(map);
    
    // Store layer reference
    layerRefs.current[activeLayer] = weatherLayer;
    
    // Store map reference
    mapRef.current = map;
    
    // Set loading to false
    setIsLoading(false);
    
    // Force map to recalculate size
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize(true);
      }
    }, 100);
  };

  // Handle layer change
  const handleLayerChange = (layerId) => {
    if (!mapRef.current) return;
    
    try {
      // Update state
      setActiveLayer(layerId);
      
      // Get map reference
      const map = mapRef.current;
      
      // Remove existing weather layer if it exists
      Object.keys(layerRefs.current).forEach(key => {
        const layer = layerRefs.current[key];
        if (layer && map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
      
      // Create new layer
      const newLayer = L.tileLayer(getWeatherTileUrl(layerId), {
        attribution: '&copy; OpenWeatherMap',
        opacity: 0.5
      }).addTo(map);
      
      // Store layer reference
      layerRefs.current[layerId] = newLayer;
    } catch (error) {
      console.error('Error changing layer:', error);
    }
  };

  // Render the component
  return (
    <div className="weather-map-container w-full h-full relative">
      <div id={mapId} className="w-full h-full min-h-[400px]"></div>
      
      {/* Layer controls */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded shadow-md p-2 z-[1000]">
        <div className="flex flex-col space-y-2">
          {layerConfig.map(layer => (
            <button
              key={layer.id}
              className={`p-2 rounded flex items-center transition-colors ${
                activeLayer === layer.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => handleLayerChange(layer.id)}
              title={layer.name}
            >
              <span className="mr-2">{layer.icon}</span>
              <span className="text-sm">{layer.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50">
          <div className="text-lg font-bold">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default WeatherMap;