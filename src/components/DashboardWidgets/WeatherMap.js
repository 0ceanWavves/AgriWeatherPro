import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaTemperatureHigh, FaCloudRain, FaWind, FaCloud, FaTachometerAlt, FaWater, FaTint, FaSeedling, FaLock } from 'react-icons/fa';

import { OPENWEATHERMAP_API_KEY } from '../../utils/config';

// Function to get weather map tile URL
const getWeatherMapUrl = (layerId) => {
  const apiKey = OPENWEATHERMAP_API_KEY || '11d494e6c254ca3a724c694a4ebeb27f'; // Demo API key as fallback
  return `https://tile.openweathermap.org/map/${layerId}/{z}/{x}/{y}.png?appid=${apiKey}`;
};

// Mock function until real API is connected
const getLocationWeather = async (lat, lng) => {
  // In a real app, this would fetch from an API
  return {
    temp: -8.8,
    feelsLike: -11.9,
    precipitation: 0,
    windSpeed: 1.54,
    windDirection: 20,
    humidity: 94,
    clouds: 100,
    pressure: 1017
  };
};

// Fix for Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const cityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const WeatherMap = ({ location = { lat: 51.505, lng: -0.09, name: 'London' }, mode = 'weather' }) => {
  const [activeLayer, setActiveLayer] = useState(mode === 'irrigation' ? 'precipitation_new' : 'temp_new');
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [currentWeather, setCurrentWeather] = useState({
    temp: -8.8,
    feelsLike: -11.9,
    precipitation: 0,
    windSpeed: 1.54,
    windDirection: 20,
    humidity: 94,
    clouds: 100,
    pressure: 1017,
    soilMoisture: 42, // New field for irrigation planning
    irrigationNeeded: true // New field for irrigation planning
  });
  
  // Fetch weather data for the main location
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherData = await getLocationWeather(location.lat, location.lng);
        setCurrentWeather(weatherData);
      } catch (error) {
        console.error("Failed to fetch current weather:", error);
      }
    };
    
    fetchWeather();
  }, [location]);
  
  // Get the appropriate layers based on the current mode
  const getLayers = () => {
    const commonLayers = [
      { name: 'Temperature', id: 'temp_new', icon: <FaTemperatureHigh />, premium: false },
      { name: 'Precipitation', id: 'precipitation_new', icon: <FaCloudRain />, premium: false },
      { name: 'Wind speed', id: 'wind_new', icon: <FaWind />, premium: false },
      { name: 'Clouds', id: 'clouds_new', icon: <FaCloud />, premium: false }
    ];
    
    // Irrigation-specific layers
    if (mode === 'irrigation') {
      return [
        ...commonLayers,
        { name: 'Soil Moisture', id: 'soil_moisture', icon: <FaWater />, premium: true },
        { name: 'Irrigation Needs', id: 'irrigation_needs', icon: <FaTint />, premium: true },
        { name: 'Crop Growth', id: 'crop_growth', icon: <FaSeedling />, premium: true }
      ];
    }
    
    // Standard weather layers
    return [
      ...commonLayers,
      { name: 'Pressure', id: 'pressure_new', icon: <FaTachometerAlt />, premium: false }
    ];
  };
  
  const weatherLayers = getLayers();

  // Cities with their names, positions, and temperatures
  const cities = [
    { name: 'London', position: [51.505, -0.09], temp: -8.8 },
    { name: 'Liverpool', position: [53.4084, -2.9916], temp: 5 },
    { name: 'Norwich', position: [52.6309, 1.2974], temp: 6 },
    { name: 'Alkmaar', position: [52.6324, 4.7534], temp: 8 },
    { name: 'Waterford', position: [52.2593, -7.1101], temp: 5 },
    { name: 'Cork', position: [51.8986, -8.4706], temp: 5 },
    { name: 'Cardiff', position: [51.4816, -3.1791], temp: 6 },
    { name: 'Bournemouth', position: [50.7192, -1.8808], temp: 6 },
    { name: 'Lille', position: [50.6292, 3.0573], temp: 12 },
    { name: 'Plymouth', position: [50.3755, -4.1427], temp: 7 },
    { name: 'Saint Malo', position: [48.6493, -2.0136], temp: 10 },
  ];
  
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

  // Mock timeline data
  const timeSlots = ['10:10', '10:20', '10:30', '10:40', '10:50', '11:00', '11:10', '11:20', '11:30', '11:40', '11:50'];
  const forecastSlots = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  
  // Mock weather forecast data
  const weatherForecast = [
    { time: '12:00', temp: 25, icon: 'moon', alert: false, humidity: 68 },
    { time: '13:00', temp: 25, icon: 'cloudy-day', alert: false, humidity: 69 },
    { time: '14:00', temp: 24, icon: 'cloudy', alert: false, humidity: 71 },
    { time: '15:00', temp: 24, icon: 'cloudy', alert: false, humidity: 71 },
    { time: '16:00', temp: 23, icon: 'cloudy', alert: false, humidity: 71 },
    { time: '17:00', temp: 22, icon: 'cloudy', alert: false, humidity: 71 },
  ];
  
  // Get weather icon component
  const getWeatherIcon = (icon) => {
    switch(icon) {
      case 'moon':
        return <span className="weather-icon">☾</span>;
      case 'cloudy-day':
        return <span className="weather-icon">⛅</span>;
      case 'cloudy':
        return <span className="weather-icon">☁️</span>;
      default:
        return <span className="weather-icon">☁️</span>;
    }
  };

  return (
    <div className="dashboard-weather-map">
      {/* Premium content overlay */}
      {showPremiumOverlay && (
        <div className="premium-overlay fixed inset-0 bg-black/75 z-50 flex items-center justify-center">
          <div className="premium-card bg-white p-6 rounded-lg shadow-xl max-w-md text-center">
            <FaLock className="text-4xl mx-auto mb-4 text-orange-1" />
            <h2 className="text-xl font-bold mb-2">Premium Feature</h2>
            <p className="mb-4">
              This advanced irrigation feature requires a premium subscription to access.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handlePremiumActionClick}
                className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2"
                type="button"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={closePremiumOverlay}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                type="button"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    
      <div className="map-header">
        <div className="map-title">
          <h1>{mode === 'irrigation' ? 'Irrigation Planning' : 'Weather Map'}: {location.name}</h1>
          <span className="date-display">27 November 2024</span>
        </div>
        
        <div className="map-layers">
          {weatherLayers.map(layer => (
            <button 
              key={layer.id}
              className={`layer-button ${activeLayer === layer.id ? 'active' : ''} 
                ${layer.premium ? 'premium-feature flex items-center' : ''}`}
              onClick={() => handleLayerChange(layer.id, layer.premium)}
              type="button"
            >
              {layer.icon}
              <span>{layer.name}</span>
              {layer.premium && !isPremiumUser && (
                <FaLock className="ml-1 text-xs" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="map-container">
        <MapContainer 
          center={[location.lat, location.lng]} 
          zoom={6} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position="topleft" />
          
          {/* Dark theme map tiles */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {/* Weather layer */}
          <TileLayer
            url={getWeatherMapUrl(activeLayer)}
            attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
          />
          
          {/* Map Legend */}
          <div className="map-legend bg-white bg-opacity-90 px-3 py-2 rounded shadow-md absolute bottom-5 right-5 z-500">
            <h4 className="font-bold text-sm mb-2">{weatherLayers.find(layer => layer.id === activeLayer)?.name || 'Map Legend'}</h4>
            {activeLayer === 'temp_new' && (
              <div className="legend-items flex flex-col gap-1 text-xs">
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-purple-900"></span>Below -20°C</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-700"></span>-20°C to -10°C</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-500"></span>-10°C to 0°C</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-green-500"></span>0°C to 10°C</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-yellow-500"></span>10°C to 20°C</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-orange-500"></span>20°C to 30°C</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-red-500"></span>Above 30°C</div>
              </div>
            )}
            {activeLayer === 'precipitation_new' && (
              <div className="legend-items flex flex-col gap-1 text-xs">
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-100"></span>0-0.1 mm/h</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-300"></span>0.1-1 mm/h</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-500"></span>1-2 mm/h</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-700"></span>2-4 mm/h</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-900"></span>Above 4 mm/h</div>
              </div>
            )}
            {activeLayer === 'wind_new' && (
              <div className="legend-items flex flex-col gap-1 text-xs">
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-green-200"></span>0-3 m/s</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-green-400"></span>3-6 m/s</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-yellow-400"></span>6-9 m/s</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-orange-400"></span>9-12 m/s</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-red-500"></span>Above 12 m/s</div>
              </div>
            )}
            {activeLayer === 'clouds_new' && (
              <div className="legend-items flex flex-col gap-1 text-xs">
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-100"></span>0-20%</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-200"></span>20-40%</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-300"></span>40-60%</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-400"></span>60-80%</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-500"></span>80-100%</div>
              </div>
            )}
            {activeLayer === 'pressure_new' && (
              <div className="legend-items flex flex-col gap-1 text-xs">
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-purple-500"></span>Below 950 hPa</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-blue-500"></span>950-980 hPa</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-green-500"></span>980-1010 hPa</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-yellow-500"></span>1010-1040 hPa</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-red-500"></span>Above 1040 hPa</div>
              </div>
            )}
            {(activeLayer === 'soil_moisture' || activeLayer === 'irrigation_needs' || activeLayer === 'crop_growth') && (
              <div className="legend-items flex flex-col gap-1 text-xs">
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-red-500"></span>Very Low</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-orange-400"></span>Low</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-yellow-400"></span>Medium</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-green-400"></span>Good</div>
                <div className="flex items-center"><span className="w-4 h-4 inline-block mr-2 bg-green-600"></span>Optimal</div>
              </div>
            )}
          </div>
          
          {/* City markers */}
          {cities.map((city, index) => (
            <Marker 
              key={index} 
              position={city.position} 
              icon={cityIcon}
            >
              <Popup>
                <div className="city-popup">
                  <h3>{city.name}</h3>
                  <p>{city.temp}°C</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <div className="city-search">
          <input 
            type="text" 
            placeholder="Name or zip code..." 
            autoComplete="on" 
            spellCheck="true"
            list="city-suggestions"
          />
          <datalist id="city-suggestions">
            <option value="New York, US">New York, US</option>
            <option value="London, GB">London, GB</option>
            <option value="Tokyo, JP">Tokyo, JP</option>
            <option value="Paris, FR">Paris, FR</option>
            <option value="Dubai, AE">Dubai, AE</option>
            <option value="20001">Washington DC, US</option>
            <option value="90210">Beverly Hills, US</option>
            <option value="75001">Paris, FR</option>
          </datalist>
        </div>
        
        <div className="weather-details-panel">
          <div className="weather-current">
            <h2 className="current-temp">{currentWeather.temp} °C</h2>
            <div className="weather-icon-large">☁️</div>
            <p>Feels like <span>{currentWeather.feelsLike} °C</span></p>
            
            {/* Irrigation status indicator - only show for irrigation mode */}
            {mode === 'irrigation' && (
              <div className="mt-3 p-2 rounded bg-blue-100 text-blue-800 text-center">
                {isPremiumUser ? (
                  <>
                    <div className="font-bold">{currentWeather.irrigationNeeded ? 'Irrigation Needed' : 'No Irrigation Needed'}</div>
                    <div className="text-xs">Based on soil moisture and forecast</div>
                  </>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setShowPremiumOverlay(true)}
                    className="flex items-center justify-center w-full text-blue-800 hover:text-blue-900"
                  >
                    <FaLock className="mr-2" />
                    <span>Irrigation Status (Premium)</span>
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="weather-metrics">
            <div className="metric">
              <p className="metric-name">Precipitation</p>
              <p className="metric-value">{currentWeather.precipitation} mm</p>
            </div>
            <div className="metric">
              <p className="metric-name">Wind speed</p>
              <p className="metric-value">{currentWeather.windSpeed} m/s</p>
            </div>
            <div className="metric">
              <p className="metric-name">Humidity</p>
              <p className="metric-value">{currentWeather.humidity} %</p>
            </div>
            
            {/* Standard weather metrics */}
            {mode !== 'irrigation' && (
              <>
                <div className="metric">
                  <p className="metric-name">Wind Direction</p>
                  <p className="metric-value">{currentWeather.windDirection} deg</p>
                </div>
                <div className="metric">
                  <p className="metric-name">Clouds</p>
                  <p className="metric-value">{currentWeather.clouds} %</p>
                </div>
                <div className="metric">
                  <p className="metric-name">Pressure</p>
                  <p className="metric-value">{currentWeather.pressure} hPa</p>
                </div>
              </>
            )}
            
            {/* Irrigation-specific metrics */}
            {mode === 'irrigation' && (
              <>
                <div className="metric">
                  <p className="metric-name">Soil Moisture</p>
                  {isPremiumUser ? (
                    <p className="metric-value">{currentWeather.soilMoisture}%</p>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setShowPremiumOverlay(true)}
                      className="metric-value flex items-center text-blue-600"
                    >
                      <FaLock className="mr-1 text-xs" />
                      <span>Premium</span>
                    </button>
                  )}
                </div>
                <div className="metric">
                  <p className="metric-name">Water Needs</p>
                  {isPremiumUser ? (
                    <p className="metric-value">32 mm</p>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setShowPremiumOverlay(true)}
                      className="metric-value flex items-center text-blue-600"
                    >
                      <FaLock className="mr-1 text-xs" />
                      <span>Premium</span>
                    </button>
                  )}
                </div>
                <div className="metric">
                  <p className="metric-name">Irrigation Efficiency</p>
                  {isPremiumUser ? (
                    <p className="metric-value">86%</p>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setShowPremiumOverlay(true)}
                      className="metric-value flex items-center text-blue-600"
                    >
                      <FaLock className="mr-1 text-xs" />
                      <span>Premium</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="time-navigation">
        <p className="time-label">27 November at 11:00</p>
        <div className="timeline">
          <button className="prev-time-btn" type="button">‹</button>
          {timeSlots.map((time, index) => (
            <button 
              key={index}
              className={`time-slot ${time === '11:00' ? 'active' : ''}`}
              type="button"
            >
              {time}
            </button>
          ))}
          <button className="next-time-btn" type="button">›</button>
        </div>
      </div>
      
      <div className="forecast-table">
        <div className="forecast-row">
          <div className="forecast-cell header">
            <span>Weather</span>
          </div>
          {forecastSlots.map((time, index) => (
            <div key={index} className="forecast-cell">
              {getWeatherIcon(weatherForecast[index].icon)}
            </div>
          ))}
        </div>
        
        <div className="forecast-row">
          <div className="forecast-cell header">
            <span>Alert</span>
          </div>
          {forecastSlots.map((time, index) => (
            <div key={index} className="forecast-cell">
              -
            </div>
          ))}
        </div>
        
        <div className="forecast-row">
          <div className="forecast-cell header">
            <span>Temp (°C)</span>
          </div>
          {forecastSlots.map((time, index) => (
            <div key={index} className="forecast-cell">
              {weatherForecast[index].temp}
            </div>
          ))}
        </div>
        
        <div className="forecast-row">
          <div className="forecast-cell header">
            <span>Relative Humidity %</span>
          </div>
          {forecastSlots.map((time, index) => (
            <div key={index} className="forecast-cell">
              {weatherForecast[index].humidity}
            </div>
          ))}
        </div>
        
        {/* Irrigation-specific forecast rows */}
        {mode === 'irrigation' && (
          <>
            <div className="forecast-row">
              <div className="forecast-cell header premium-header">
                <span className="flex items-center">
                  Irrigation Need
                  {!isPremiumUser && <FaLock className="ml-1 text-xs" />}
                </span>
              </div>
              {forecastSlots.map((time, index) => (
                <div key={index} className="forecast-cell">
                  {isPremiumUser ? (
                    <span className={index % 2 === 0 ? 'text-green-600' : 'text-red-500'}>
                      {index % 2 === 0 ? 'Low' : 'High'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPremiumOverlay(true)}
                      className="text-blue-600 hover:underline"
                    >
                      <FaLock />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="forecast-row">
              <div className="forecast-cell header premium-header">
                <span className="flex items-center">
                  Water Amount
                  {!isPremiumUser && <FaLock className="ml-1 text-xs" />}
                </span>
              </div>
              {forecastSlots.map((time, index) => (
                <div key={index} className="forecast-cell">
                  {isPremiumUser ? (
                    <span>{Math.floor(Math.random() * 15) + 10} mm</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPremiumOverlay(true)}
                      className="text-blue-600 hover:underline"
                    >
                      <FaLock />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Premium banner at bottom for irrigation mode */}
      {mode === 'irrigation' && !isPremiumUser && (
        <div className="premium-banner mt-4 bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-800 mb-1">
            Upgrade to Premium for Advanced Irrigation Features
          </h3>
          <p className="text-sm text-blue-600 mb-2">
            Access soil moisture data, irrigation scheduling, water efficiency insights, and more.
          </p>
          <button
            type="button"
            onClick={handlePremiumActionClick}
            className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherMap;