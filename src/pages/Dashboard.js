import React, { useState, useEffect } from 'react';
import ServiceAwareMap from '../components/DashboardWidgets/ServiceAwareMap';
import LocationSearch from '../components/LocationSearch';
import { FaCalendarAlt, FaWater, FaSeedling, FaBug, FaCloudSun } from 'react-icons/fa';
import { getLocationWeather } from '../api/weatherApi';

const Dashboard = () => {
  const [currentWeather, setCurrentWeather] = useState({
    temp: 26.5,
    feelsLike: 24.5,
    windSpeed: 9.75,
    windDirection: 180,
    humidity: 44,
    precipitation: 0,
    pressure: 1015,
    clouds: 40
  });
  
  const [location, setLocation] = useState({
    name: 'San Francisco',
    lat: 37.7749,
    lng: -122.4194
  });
  
  const [activeMapLayer, setActiveMapLayer] = useState('Temperature');
  
  // Fetch weather data when location changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getLocationWeather(location.lat, location.lng);
        setCurrentWeather({
          ...data,
          // If API returns no data, keep current values
          temp: data.temp || currentWeather.temp,
          feelsLike: data.feelsLike || currentWeather.feelsLike,
          windSpeed: data.windSpeed || currentWeather.windSpeed,
          humidity: data.humidity || currentWeather.humidity,
          precipitation: data.precipitation || currentWeather.precipitation,
          pressure: data.pressure || currentWeather.pressure,
          clouds: data.clouds || currentWeather.clouds
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    
    fetchWeatherData();
  }, [location]);
  
  // Mock forecast data
  const forecastData = [
    { day: 'Today', temp: 72, condition: 'sunny' },
    { day: 'Tomorrow', temp: 75, condition: 'sunny' },
    { day: 'Wednesday', temp: 70, condition: 'partly-cloudy' },
    { day: 'Thursday', temp: 68, condition: 'rainy' },
    { day: 'Friday', temp: 71, condition: 'partly-cloudy' },
    { day: 'Saturday', temp: 73, condition: 'sunny' },
    { day: 'Sunday', temp: 72, condition: 'sunny' }
  ];
  
  // Mock pest alerts
  const pestAlerts = [
    {
      level: 'Medium',
      pest: 'Navel Orangeworm',
      description: 'Conditions favorable for pest activity in almond orchards.'
    },
    {
      level: 'Low',
      pest: 'Peach Twig Borer',
      description: 'Current conditions unfavorable for significant pest pressure.'
    }
  ];
  
  // Get condition icon
  const getConditionIcon = (condition) => {
    switch(condition) {
      case 'sunny': return '☀️';
      case 'partly-cloudy': return '⛅';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      default: return '☀️';
    }
  };
  
  // Handle map layer selection
  const handleLayerChange = (layer) => {
    setActiveMapLayer(layer);
  };
  
  // Handle location selection from search
  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
  };
  
  return (
    <div className="bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Agricultural Weather Dashboard</h1>
          <p className="text-xs text-gray-600">
            Monitor weather conditions, pest alerts, and optimize farming operations
          </p>
        </div>
        <div>
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>
      </div>
      
      {/* Current weather stats bar */}
      <div className="bg-white rounded-md shadow-sm p-2 mb-4 flex justify-between">
        <div className="flex items-center">
          <div className="text-3xl font-bold text-gray-800 mr-3">{currentWeather.temp}°F</div>
          <div className="text-xs text-gray-600">
            <div>Feels like</div>
            <div className="font-semibold">{currentWeather.feelsLike}°F</div>
          </div>
        </div>
        
        <div className="flex space-x-6">
          <div className="text-xs">
            <div className="text-gray-500">Wind</div>
            <div className="font-semibold">{currentWeather.windSpeed} mph</div>
          </div>
          <div className="text-xs">
            <div className="text-gray-500">Humidity</div>
            <div className="font-semibold">{currentWeather.humidity}%</div>
          </div>
          <div className="text-xs">
            <div className="text-gray-500">Precipitation</div>
            <div className="font-semibold">{currentWeather.precipitation}"</div>
          </div>
          <div className="text-xs">
            <div className="text-gray-500">Pressure</div>
            <div className="font-semibold">{currentWeather.pressure} hPa</div>
          </div>
          <div className="text-xs">
            <div className="text-gray-500">Clouds</div>
            <div className="font-semibold">{currentWeather.clouds}%</div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-4 gap-4">
        {/* Main map - takes 3/4 of the width */}
        <div className="col-span-3">
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 border-b">
              <h2 className="font-semibold text-gray-700 text-sm">Weather Map • {location.name}</h2>
              <div className="flex space-x-1">
                <button 
                  className={`px-2 py-0.5 text-xs rounded ${activeMapLayer === 'Temperature' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => handleLayerChange('Temperature')}
                >
                  Temperature
                </button>
                <button 
                  className={`px-2 py-0.5 text-xs rounded ${activeMapLayer === 'Precipitation' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => handleLayerChange('Precipitation')}
                >
                  Precipitation
                </button>
                <button 
                  className={`px-2 py-0.5 text-xs rounded ${activeMapLayer === 'Wind' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => handleLayerChange('Wind')}
                >
                  Wind Speed
                </button>
                <button 
                  className={`px-2 py-0.5 text-xs rounded ${activeMapLayer === 'Clouds' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => handleLayerChange('Clouds')}
                >
                  Clouds
                </button>
                <button 
                  className={`px-2 py-0.5 text-xs rounded ${activeMapLayer === 'Pressure' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => handleLayerChange('Pressure')}
                >
                  Pressure
                </button>
              </div>
            </div>
            <div className="h-[600px]">
              <ServiceAwareMap selectedLayer={activeMapLayer} location={location} />
            </div>
            <div className="flex justify-between px-3 py-1 bg-gray-50 border-t text-xs text-gray-500">
              <div>Current weather conditions and forecasts.</div>
              <div className="flex items-center">
                <div className="temperature-key flex items-center mr-4">
                  <span className="text-xs mr-1">Temperature (°F):</span>
                  <div className="w-24 h-2 rounded" style={{ background: 'linear-gradient(to right, #0000FF, #00FF00, #FFFF00, #FF0000)' }}></div>
                  <span className="text-xs ml-1">Cold → Hot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Pest alerts panel */}
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 border-b">
              <h2 className="font-semibold text-gray-700 text-sm flex items-center">
                <FaBug className="mr-1.5 text-green-600 h-3 w-3" /> Pest Alerts
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {pestAlerts.map((alert, index) => (
                <div key={index} className="p-2">
                  <div className="flex items-start">
                    <div className={`w-2 h-2 mt-1 rounded-full mr-1.5 ${
                      alert.level === 'High' ? 'bg-red-500' :
                      alert.level === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="font-medium text-xs">{alert.level} Risk: {alert.pest}</div>
                      <p className="text-xs text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 7-day forecast */}
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 border-b">
              <h2 className="font-semibold text-gray-700 text-sm flex items-center">
                <FaCalendarAlt className="mr-1.5 text-green-600 h-3 w-3" /> 7-Day Forecast
              </h2>
            </div>
            <div className="p-0">
              {forecastData.map((day, index) => (
                <div key={index} className="flex justify-between items-center px-3 py-1.5 border-b last:border-b-0 text-xs">
                  <div className="font-medium">{day.day}</div>
                  <div className="flex items-center">
                    <span className="mr-1">{day.temp}°F</span>
                    <span>{getConditionIcon(day.condition)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Irrigation Status */}
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 border-b">
              <h2 className="font-semibold text-gray-700 text-sm flex items-center">
                <FaWater className="mr-1.5 text-green-600 h-3 w-3" /> Irrigation Status
              </h2>
            </div>
            <div className="p-2">
              <div className="mb-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Soil Moisture</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>Dry</span>
                  <span>Optimal</span>
                  <span>Wet</span>
                </div>
              </div>
              <div className="text-xs text-gray-700">
                Next irrigation recommended in 2 days.
              </div>
            </div>
          </div>
          
          {/* Crop Calendar */}
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 border-b">
              <h2 className="font-semibold text-gray-700 text-sm flex items-center">
                <FaSeedling className="mr-1.5 text-green-600 h-3 w-3" /> Crop Calendar
              </h2>
            </div>
            <div className="p-0">
              <div className="flex justify-between items-center px-3 py-1.5 border-b text-xs">
                <span className="font-medium">Almonds</span>
                <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px]">Harvest</span>
              </div>
              <div className="flex justify-between items-center px-3 py-1.5 border-b text-xs">
                <span className="font-medium">Grapes</span>
                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-[10px]">Growing</span>
              </div>
              <div className="flex justify-between items-center px-3 py-1.5 border-b text-xs">
                <span className="font-medium">Tomatoes</span>
                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-[10px]">Growing</span>
              </div>
              <div className="flex justify-between items-center px-3 py-1.5 text-xs">
                <span className="font-medium">Lettuce</span>
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px]">Planting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;