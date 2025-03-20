import React, { useState, useEffect } from 'react';
import { FaTemperatureHigh, FaWind, FaCloudRain, FaSun, FaCloud, FaLeaf, FaChartBar, FaExternalLinkAlt, FaTint, FaInfoCircle } from 'react-icons/fa';
import { getWeatherForecast } from '../api/weatherApi';
import LocationAutocomplete from './LocationAutocomplete';
import '../styles/weather-forecast.css';
import { Link } from 'react-router-dom';

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

  // Get agricultural tip based on weather conditions
  const getAgTip = (weather) => {
    if (!weather) return {
      tip: "Check the forecast regularly for planning field operations.",
      stats: [
        { label: "Weather-related crop loss", value: "12%" },
        { label: "Planning efficiency increase", value: "23%" }
      ],
      redirectPath: "/methodology",
      redirectLabel: "Learn about agricultural planning" 
    };
    
    const weatherMain = weather.weather[0].main.toLowerCase();
    const temp = weather.temp;
    
    if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) {
      return {
        tip: "Consider delaying pesticide application as rain may wash away chemicals. Check field drainage systems.",
        stats: [
          { label: "Pesticide effectiveness reduction", value: "60-95%" },
          { label: "Average runoff increase", value: "+75%" }
        ],
        redirectPath: "/services/irrigation-planning",
        redirectLabel: "View irrigation planning tools"
      };
    } else if (weatherMain.includes("clear") && temp > 30) {
      return {
        tip: "High temperatures expected. Ensure adequate irrigation and consider applying protective measures for heat-sensitive crops.",
        stats: [
          { label: "Crop yield reduction per °C above optimal", value: "8%" },
          { label: "Water need increase", value: "+30%" }
        ],
        redirectPath: "/services/irrigation-planning",
        redirectLabel: "Explore irrigation techniques"
      };
    } else if (weatherMain.includes("clear") && temp < 10) {
      return {
        tip: "Cool temperatures expected. Monitor frost-sensitive crops and consider protective measures if temperatures drop further.",
        stats: [
          { label: "Frost damage threshold", value: "0°C" },
          { label: "Crop protection effectiveness", value: "85%" }
        ],
        redirectPath: "/crop-yields",
        redirectLabel: "View frost protection methods"
      };
    } else if (weatherMain.includes("cloud")) {
      return {
        tip: "Cloudy conditions are ideal for transplanting seedlings and applying foliar sprays.",
        stats: [
          { label: "Transplant stress reduction", value: "40%" },
          { label: "Foliar spray efficiency", value: "+25%" }
        ],
        redirectPath: "/services/pest-management",
        redirectLabel: "Browse pesticide application guides"
      };
    } else if (weatherMain.includes("snow") || weatherMain.includes("ice")) {
      return {
        tip: "Freezing conditions expected. Protect sensitive crops and irrigation equipment from frost damage.",
        stats: [
          { label: "Equipment damage risk", value: "High" },
          { label: "Snow insulation benefit", value: "+4°C" }
        ],
        redirectPath: "/methodology",
        redirectLabel: "Learn about winter crop protection"
      };
    } else if (weatherMain.includes("wind") || weather.wind_speed > 8) {
      return {
        tip: "High winds expected. Delay spraying operations and secure loose equipment and structures.",
        stats: [
          { label: "Spray drift increase", value: "85%" },
          { label: "Structural damage threshold", value: "75 km/h" }
        ],
        redirectPath: "/services/pest-management",
        redirectLabel: "View spraying best practices"
      };
    }
    
    return {
      tip: "Weather conditions are favorable for most field operations. Plan accordingly.",
      stats: [
        { label: "Optimal condition window", value: "24-48 hrs" },
        { label: "Productivity increase", value: "+15%" }
      ],
      redirectPath: "/maps",
      redirectLabel: "View detailed weather maps"
    };
  };

  return (
    <div className="forecast-page">
      <div className="container mx-auto px-4">
        <h1 className="weather-forecast-title">Weather Forecast</h1>
        <p className="weather-forecast-subtitle">
          Get accurate, detailed weather forecasts specific to your agricultural needs. Plan your field operations,
          irrigation, and harvesting with confidence.
        </p>
        
        <div className="card max-w-5xl mx-auto">
          <div className="forecast-search mb-6 p-4">
            <LocationAutocomplete onLocationSelect={handleLocationSelect} />
          </div>
          
          {loading && (
            <div className="flex justify-center items-center p-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
              <span className="ml-3 text-lg">Loading forecast data...</span>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-center p-10 bg-red-50 rounded-lg">
              <FaCloud className="text-4xl mx-auto mb-3 text-red-300" />
              <p className="text-lg font-semibold">{error}</p>
              <p className="mt-2">Please check your connection or try a different location.</p>
            </div>
          )}
          
          {forecastData && (
            <div>
              <div className="current-weather mx-4 mb-6">
                <div className="current-location">
                  <h2>{forecastData.locationName}, {forecastData.country}</h2>
                  <p>{formatDate(forecastData.current.dt)}</p>
                </div>
                
                <div className="current-temp">
                  <div className="mr-4">
                    {getWeatherIcon(forecastData.current.weather[0].icon)}
                  </div>
                  <div>
                    <div className="temp-value">{Math.round(forecastData.current.temp)}°C</div>
                    <p className="temp-condition capitalize">{forecastData.current.weather[0].description}</p>
                  </div>
                </div>
                
                <div className="current-details">
                  <div className="detail-item">
                    <FaTemperatureHigh className="text-yellow-200" />
                    <span>Feels like: {Math.round(forecastData.current.feels_like)}°C</span>
                  </div>
                  <div className="detail-item">
                    <FaWind className="text-blue-200" />
                    <span>Wind: {Math.round(forecastData.current.wind_speed)} m/s</span>
                  </div>
                  <div className="detail-item">
                    <FaCloudRain className="text-blue-200" />
                    <span>Humidity: {forecastData.current.humidity}%</span>
                  </div>
                  <div className="detail-item">
                    <FaTint className="text-blue-200" />
                    <span>Precipitation: {Math.round(forecastData.current.pop * 100 || 0)}%</span>
                  </div>
                </div>
              </div>
              
              {/* Hourly forecast */}
              <div className="hourly-forecast-container mx-4 mb-6">
                <h3 className="text-xl font-semibold">Hourly Forecast</h3>
                <div className="hourly-forecast">
                  {forecastData.hourly.slice(0, 24).map((hour, index) => (
                    <div key={index} className="hour-card">
                      <div className="hour-time">{formatTime(hour.dt)}</div>
                      <div className="hour-icon">
                        {getWeatherIcon(hour.weather[0].icon)}
                      </div>
                      <div className="hour-temp">{Math.round(hour.temp)}°C</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Daily forecast */}
              <div className="daily-forecast-container mx-4">
                <h3 className="text-xl font-semibold">7-Day Forecast</h3>
                <div className="daily-forecast">
                  {forecastData.daily.slice(0, 7).map((day, index) => (
                    <div key={index} className="day-row">
                      <div className="day-date">
                        {index === 0 ? 'Today' : formatDate(day.dt)}
                      </div>
                      <div className="day-condition">
                        <div className="day-icon">
                          {getWeatherIcon(day.weather[0].icon)}
                        </div>
                        <div className="day-condition-text capitalize">
                          {day.weather[0].description}
                        </div>
                      </div>
                      <div className="day-temps">
                        <div className="min-temp">
                          Min: {Math.round(day.temp.min)}°C
                        </div>
                        <div className="max-temp">
                          Max: {Math.round(day.temp.max)}°C
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Enhanced Agricultural tip with stats and redirect */}
              {forecastData.daily && forecastData.daily.length > 0 && (
                <div className="ag-tips mx-4 mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="flex items-center text-lg font-semibold">
                      <FaLeaf className="mr-2 text-green-700" /> Agricultural Tip
                    </h4>
                    <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      <FaInfoCircle className="inline mr-1" /> Weather-Based Recommendation
                    </span>
                  </div>
                  
                  {(() => {
                    const agTipData = getAgTip(forecastData.daily[0]);
                    return (
                      <>
                        <p className="mb-4 text-gray-800 font-medium">{agTipData.tip}</p>
                        
                        <div className="stats-container mb-4">
                          <h5 className="text-sm font-semibold mb-2 flex items-center">
                            <FaChartBar className="mr-2 text-green-700" /> Related Statistics
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {agTipData.stats.map((stat, index) => (
                              <div 
                                key={index} 
                                className="stat-item bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-700"
                              >
                                <div className="text-xs text-gray-600">{stat.label}</div>
                                <div className="text-lg font-bold text-green-800">{stat.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <Link 
                            to={agTipData.redirectPath} 
                            className="inline-block bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-4 rounded-full transition-colors"
                          >
                            {agTipData.redirectLabel} <FaExternalLinkAlt className="inline ml-1" />
                          </Link>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;