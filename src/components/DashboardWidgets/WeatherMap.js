import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaTemperatureHigh, FaCloudRain, FaWind, FaCloud, FaTachometerAlt } from 'react-icons/fa';

// Mock function until real API is connected
const getWeatherMapUrl = (layerId) => {
  return `https://tile.openweathermap.org/map/${layerId}/{z}/{x}/{y}.png?appid=YOUR_API_KEY`;
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

const WeatherMap = ({ location = { lat: 51.505, lng: -0.09, name: 'London' } }) => {
  const [activeLayer, setActiveLayer] = useState('temp_new');
  const [currentWeather, setCurrentWeather] = useState({
    temp: -8.8,
    feelsLike: -11.9,
    precipitation: 0,
    windSpeed: 1.54,
    windDirection: 20,
    humidity: 94,
    clouds: 100,
    pressure: 1017
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
  
  const weatherLayers = [
    { name: 'Temperature', id: 'temp_new', icon: <FaTemperatureHigh /> },
    { name: 'Precipitation', id: 'precipitation_new', icon: <FaCloudRain /> },
    { name: 'Pressure', id: 'pressure_new', icon: <FaTachometerAlt /> },
    { name: 'Wind speed', id: 'wind_new', icon: <FaWind /> },
    { name: 'Clouds', id: 'clouds_new', icon: <FaCloud /> }
  ];

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
  
  const handleLayerChange = (layerId) => {
    setActiveLayer(layerId);
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
      <div className="map-header">
        <div className="map-title">
          <h1>Dashboard: {location.name}</h1>
          <span className="date-display">27 November 2024</span>
        </div>
        
        <div className="map-layers">
          {weatherLayers.map(layer => (
            <button 
              key={layer.id}
              className={`layer-button ${activeLayer === layer.id ? 'active' : ''}`}
              onClick={() => handleLayerChange(layer.id)}
              type="button"
            >
              {layer.icon}
              <span>{layer.name}</span>
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
          <input type="text" placeholder="Name or zip code..." />
        </div>
        
        <div className="weather-details-panel">
          <div className="weather-current">
            <h2 className="current-temp">{currentWeather.temp} °C</h2>
            <div className="weather-icon-large">☁️</div>
            <p>Feels like <span>{currentWeather.feelsLike} °C</span></p>
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
              <p className="metric-name">Wind Direction</p>
              <p className="metric-value">{currentWeather.windDirection} deg</p>
            </div>
            <div className="metric">
              <p className="metric-name">Humidity</p>
              <p className="metric-value">{currentWeather.humidity} %</p>
            </div>
            <div className="metric">
              <p className="metric-name">Clouds</p>
              <p className="metric-value">{currentWeather.clouds} %</p>
            </div>
            <div className="metric">
              <p className="metric-name">Pressure</p>
              <p className="metric-value">{currentWeather.pressure} hPa</p>
            </div>
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
      </div>
    </div>
  );
};

export default WeatherMap;