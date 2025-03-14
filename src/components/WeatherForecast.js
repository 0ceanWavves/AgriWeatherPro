import React, { useState, useEffect } from 'react';
import { FaTemperatureHigh, FaWind, FaCloudRain, FaSun, FaCloud } from 'react-icons/fa';
import { getWeatherForecast } from '../api/weatherApi';
import LocationAutocomplete from './LocationAutocomplete';

const WeatherForecast = ({ initialLocation }) => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use the initial location (from geolocation) when component mounts
  useEffect(() => {
    if (initialLocation) {
      handleLocationSelect(initialLocation);
    }
  }, [initialLocation]);

  const handleLocationSelect = async (locationData) => {
    if (!locationData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get forecast data using coordinates
      const forecast = await getWeatherForecast(locationData.lat, locationData.lon);
      
      setForecastData({
        ...forecast,
        locationName: locationData.name,
        country: locationData.country
      });
    } catch (err) {
      console.error('Error fetching forecast:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Helper function to format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to get weather icon
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': <FaSun className="text-yellow-400 text-3xl" />,
      '01n': <FaSun className="text-yellow-400 text-3xl" />,
      '02d': <FaCloud className="text-gray-400 text-3xl" />,
      '02n': <FaCloud className="text-gray-400 text-3xl" />,
      '03d': <FaCloud className="text-gray-400 text-3xl" />,
      '03n': <FaCloud className="text-gray-400 text-3xl" />,
      '04d': <FaCloud className="text-gray-400 text-3xl" />,
      '04n': <FaCloud className="text-gray-400 text-3xl" />,
      '09d': <FaCloudRain className="text-blue-400 text-3xl" />,
      '09n': <FaCloudRain className="text-blue-400 text-3xl" />,
      '10d': <FaCloudRain className="text-blue-400 text-3xl" />,
      '10n': <FaCloudRain className="text-blue-400 text-3xl" />,
      '11d': <FaCloudRain className="text-blue-500 text-3xl" />,
      '11n': <FaCloudRain className="text-blue-500 text-3xl" />,
      '13d': <FaCloudRain className="text-blue-200 text-3xl" />,
      '13n': <FaCloudRain className="text-blue-200 text-3xl" />,
      '50d': <FaCloud className="text-gray-300 text-3xl" />,
      '50n': <FaCloud className="text-gray-300 text-3xl" />,
    };
    
    // Default icon if iconCode is not found in the map
    return iconMap[iconCode] || <FaCloud className="text-gray-400 text-3xl" />;
  };

  return (
    <div className="card max-w-5xl mx-auto">
      <h2 className="text-2xl font-heading font-bold mb-6">Weather Forecast</h2>
      
      <div className="mb-6">
        <LocationAutocomplete onLocationSelect={handleLocationSelect} />
      </div>
      
      {loading && <p className="text-center">Loading forecast data...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {forecastData && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">
              {forecastData.locationName}, {forecastData.country}
            </h3>
            <p className="text-gray-600">
              {formatDate(forecastData.current.dt)}
            </p>
          </div>
          
          {/* Current weather */}
          <div className="bg-primary/10 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  {getWeatherIcon(forecastData.current.weather[0].icon)}
                  <span className="text-3xl font-bold ml-2">
                    {Math.round(forecastData.current.temp)}°C
                  </span>
                </div>
                <p className="text-lg capitalize">
                  {forecastData.current.weather[0].description}
                </p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <FaTemperatureHigh className="mr-2 text-red-500" />
                  <span>Feels like: {Math.round(forecastData.current.feels_like)}°C</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaWind className="mr-2 text-blue-500" />
                  <span>Wind: {Math.round(forecastData.current.wind_speed)} m/s</span>
                </div>
                <div className="flex items-center">
                  <FaCloudRain className="mr-2 text-blue-400" />
                  <span>Humidity: {forecastData.current.humidity}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hourly forecast */}
          <h4 className="text-xl font-semibold mb-4">Hourly Forecast</h4>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4">
              {forecastData.hourly.slice(0, 24).map((hour, index) => (
                <div key={index} className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm min-w-[80px]">
                  <p className="text-sm text-gray-600">{formatTime(hour.dt)}</p>
                  {getWeatherIcon(hour.weather[0].icon)}
                  <p className="font-semibold">{Math.round(hour.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Daily forecast */}
          <h4 className="text-xl font-semibold my-4">7-Day Forecast</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {forecastData.daily.slice(0, 7).map((day, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-semibold text-center">
                  {index === 0 ? 'Today' : formatDate(day.dt)}
                </p>
                <div className="flex justify-center my-2">
                  {getWeatherIcon(day.weather[0].icon)}
                </div>
                <p className="text-center capitalize text-sm mb-2">
                  {day.weather[0].description}
                </p>
                <div className="flex justify-between text-sm">
                  <span>Min: {Math.round(day.temp.min)}°C</span>
                  <span>Max: {Math.round(day.temp.max)}°C</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;