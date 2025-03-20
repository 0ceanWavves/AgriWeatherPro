import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaTemperatureHigh, FaCloudRain, FaWind, FaCloud, FaTachometerAlt, FaWater, FaTint, FaSeedling } from 'react-icons/fa';

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
  const [activeLayer, setActiveLayer] = useState(mode === 'irrigation' ? 'soil_moisture' : 'temp_new');
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const layerRefs = useRef({});
  
  // Store location internally to avoid undefined errors
  const [currentLocation, setCurrentLocation] = useState(location);
  
  // Update internal location when props change
  useEffect(() => {
    setCurrentLocation(location);
  }, [location]);

  // Add weather map tile URL helper
  const getWeatherTileUrl = (layerId) => {
    const baseUrl = 'https://tile.openweathermap.org/map';
    const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
    const timestamp = Date.now();
    return `${baseUrl}/${layerId}/{z}/{x}/{y}.png?appid=${apiKey}&_t=${timestamp}`;
  };

  // Mock irrigation data layer URL
  const getMockIrrigationTileUrl = (layerId) => {
    // This would be replaced with actual tile server URLs in production
    return `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=get_your_own_key`;
  };

  // Layer configuration with legend data
  const weatherLayerConfig = [
    { 
      id: 'temp_new', 
      name: 'Temperature', 
      icon: <FaTemperatureHigh />,
      legend: {
        title: 'Temperature (°C)',
        gradient: true,
        colors: ['#0000FF', '#00FFFF', '#FFFF00', '#FF0000'],
        labels: ['-20°C', '0°C', '20°C', '40°C']
      }
    },
    { 
      id: 'precipitation_new', 
      name: 'Precipitation', 
      icon: <FaCloudRain />,
      legend: {
        title: 'Precipitation (mm)',
        gradient: true,
        colors: ['#FFFFFF', '#A4D3EE', '#1E90FF', '#0000CD'],
        labels: ['0 mm', '1 mm', '5 mm', '10+ mm']
      }
    },
    { 
      id: 'wind_new', 
      name: 'Wind Speed', 
      icon: <FaWind />,
      legend: {
        title: 'Wind Speed (m/s)',
        gradient: true,
        colors: ['#E6F5FF', '#99D6FF', '#4DA6FF', '#0066CC'],
        labels: ['0 m/s', '5 m/s', '10 m/s', '15+ m/s']
      }
    },
    { 
      id: 'clouds_new', 
      name: 'Clouds', 
      icon: <FaCloud />,
      legend: {
        title: 'Cloud Coverage (%)',
        gradient: true,
        colors: ['#FFFFFF', '#D3D3D3', '#A9A9A9', '#696969'],
        labels: ['0%', '25%', '50%', '75%']
      }
    },
    { 
      id: 'pressure_new', 
      name: 'Pressure', 
      icon: <FaTachometerAlt />,
      legend: {
        title: 'Pressure (hPa)',
        gradient: true,
        colors: ['#8C0000', '#FF5349', '#FFFFFF', '#ADD8E6', '#0000FF'],
        labels: ['970 hPa', '990 hPa', '1013 hPa', '1030 hPa', '1050 hPa']
      }
    }
  ];

  // Irrigation-specific layers
  const irrigationLayerConfig = [
    { 
      id: 'soil_moisture', 
      name: 'Soil Moisture', 
      icon: <FaTint />,
      legend: {
        title: 'Soil Moisture (%)',
        gradient: true,
        colors: ['#E5D6BC', '#C4A484', '#8B4513', '#654321'],
        labels: ['0%', '25%', '50%', '75%']
      },
      mock: true
    },
    { 
      id: 'irrigation_needs', 
      name: 'Irrigation Needs', 
      icon: <FaWater />,
      legend: {
        title: 'Irrigation Needs (mm/day)',
        gradient: true,
        colors: ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'],
        labels: ['0 mm', '2 mm', '5 mm', '8+ mm']
      },
      mock: true
    },
    { 
      id: 'crop_growth', 
      name: 'Crop Growth', 
      icon: <FaSeedling />,
      legend: {
        title: 'Crop Growth Stage',
        gradient: false,
        colors: ['#90EE90', '#00FF00', '#006400', '#8B4513'],
        labels: ['Emergence', 'Vegetative', 'Flowering', 'Maturity']
      },
      mock: true
    },
    // Include standard weather layers as well
    ...weatherLayerConfig.slice(0, 3) // Include temperature, precipitation, wind
  ];

  // Select appropriate layer config based on mode
  const layerConfig = mode === 'irrigation' ? irrigationLayerConfig : weatherLayerConfig;

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
    if (mapRef.current && currentLocation) {
      mapRef.current.setView([currentLocation.lat, currentLocation.lng], 8);
      
      // Update marker if it exists
      if (window.marker && mapRef.current.hasLayer(window.marker)) {
        window.marker.setLatLng([currentLocation.lat, currentLocation.lng]);
      }
    }
  }, [currentLocation]);

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
      center: [currentLocation.lat, currentLocation.lng],
      zoom: 8,
      zoomControl: true
    });
    
    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker for the location
    window.marker = L.marker([currentLocation.lat, currentLocation.lng]).addTo(map);
    window.marker.bindPopup(`<b>${currentLocation.name}</b>`).openPopup();
    
    // Add initial layer
    const initialLayer = layerConfig.find(layer => layer.id === activeLayer);
    
    // Create either a real weather layer or a mock irrigation layer
    let dataLayer;
    if (initialLayer && initialLayer.mock) {
      // For demonstration, we're using a colored overlay instead of actual data tiles
      // In a real implementation, you would use actual data tiles from your API
      dataLayer = createMockIrrigationLayer(initialLayer);
    } else {
      dataLayer = L.tileLayer(getWeatherTileUrl(activeLayer), {
        attribution: '&copy; OpenWeatherMap',
        opacity: 0.5
      });
    }
    
    dataLayer.addTo(map);
    
    // Store layer reference
    layerRefs.current[activeLayer] = dataLayer;
    
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

  // Create a mock layer for irrigation data (would be replaced with real API in production)
  const createMockIrrigationLayer = (layerInfo) => {
    // This is a simplified mock implementation
    // In a real app, you would use real data tiles
    
    // Define an area around the current location
    const bounds = [
      [currentLocation.lat - 0.1, currentLocation.lng - 0.1],
      [currentLocation.lat + 0.1, currentLocation.lng + 0.1]
    ];
    
    // Create a rectangle with a gradient fill based on the layer's colors
    const colorIndex = Math.floor(Math.random() * layerInfo.legend.colors.length);
    const color = layerInfo.legend.colors[colorIndex];
    
    const rectangle = L.rectangle(bounds, {
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
      weight: 1
    });
    
    // For crop growth layer, create a mosaic of different colors
    if (layerInfo.id === 'crop_growth') {
      const featureGroup = L.featureGroup();
      
      // Create a grid of small rectangles with different colors
      for (let lat = currentLocation.lat - 0.1; lat < currentLocation.lat + 0.1; lat += 0.02) {
        for (let lng = currentLocation.lng - 0.1; lng < currentLocation.lng + 0.1; lng += 0.02) {
          const colorIndex = Math.floor(Math.random() * layerInfo.legend.colors.length);
          const color = layerInfo.legend.colors[colorIndex];
          
          const cellBounds = [
            [lat, lng],
            [lat + 0.02, lng + 0.02]
          ];
          
          const cell = L.rectangle(cellBounds, {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            weight: 1
          });
          
          featureGroup.addLayer(cell);
        }
      }
      
      return featureGroup;
    }
    
    return rectangle;
  };

  // Handle layer change
  const handleLayerChange = (layerId) => {
    if (!mapRef.current) return;
    
    try {
      // Update state
      setActiveLayer(layerId);
      
      // Get map reference
      const map = mapRef.current;
      
      // Remove existing layer if it exists
      Object.keys(layerRefs.current).forEach(key => {
        const layer = layerRefs.current[key];
        if (layer && map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
      
      // Get layer info
      const layerInfo = layerConfig.find(layer => layer.id === layerId);
      
      // Create new layer
      let newLayer;
      
      if (layerInfo && layerInfo.mock) {
        // Create mock layer for irrigation data
        newLayer = createMockIrrigationLayer(layerInfo);
      } else {
        // Create standard weather layer
        newLayer = L.tileLayer(getWeatherTileUrl(layerId), {
          attribution: '&copy; OpenWeatherMap',
          opacity: 0.5
        });
      }
      
      newLayer.addTo(map);
      
      // Store layer reference
      layerRefs.current[layerId] = newLayer;
    } catch (error) {
      console.error('Error changing layer:', error);
    }
  };

  // Get current layer config
  const currentLayerConfig = layerConfig.find(layer => layer.id === activeLayer) || layerConfig[0];
  const legendData = currentLayerConfig.legend;

  // Render the component
  return (
    <div className="weather-map-container w-full h-full relative">
      <div id={mapId} className="w-full h-full" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></div>
      
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
      
      {/* Legend */}
      {legendData && (
        <div className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 rounded shadow-md p-3 z-[1000] max-w-[250px]">
          <h3 className="text-sm font-bold mb-2 text-gray-800 dark:text-white">{legendData.title}</h3>
          
          {legendData.gradient ? (
            <>
              <div 
                className="h-4 w-full rounded-sm mb-1"
                style={{
                  background: `linear-gradient(to right, ${legendData.colors.join(', ')})`
                }}
              ></div>
              <div className="flex justify-between">
                {legendData.labels.map((label, index) => (
                  <span key={index} className={`text-xs ${index > 0 && index < legendData.labels.length - 1 ? 'invisible sm:visible' : ''}`}>
                    {label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-1">
              {legendData.colors.map((color, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-4 h-4 mr-2 rounded-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-xs text-gray-800 dark:text-white">{legendData.labels[index]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Field Data Panel - for irrigation mode */}
      {mode === 'irrigation' && (
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded shadow-md p-3 z-[1000] w-[280px]">
          <h3 className="text-sm font-bold mb-2 text-gray-800 dark:text-white">Field Data: {currentLocation.name}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Current Soil Moisture:</span>
              <span className="font-medium text-gray-800 dark:text-white">42%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Recommended Irrigation:</span>
              <span className="font-medium text-gray-800 dark:text-white">3.5 mm</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Rainfall:</span>
              <span className="font-medium text-gray-800 dark:text-white">0.8 mm (2 days ago)</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Next Forecast Rain:</span>
              <span className="font-medium text-gray-800 dark:text-white">None in 7 days</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Crop Type:</span>
              <span className="font-medium text-gray-800 dark:text-white">Almonds</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Growth Stage:</span>
              <span className="font-medium text-gray-800 dark:text-white">Flowering</span>
            </div>
          </div>
        </div>
      )}
      
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