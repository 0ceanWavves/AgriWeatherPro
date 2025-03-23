import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import LocationSearch from '../components/LocationSearch';
import { FaBug, FaWater, FaSeedling, FaChartLine } from 'react-icons/fa';
import { getLocationWeather } from '../api/weatherApi';

// Import region utilities
import { 
  isMiddleEastRegion, 
  isCaliforniaRegion, 
  getDefaultLocationForRegion, 
  getPestDataByRegion,
  getCropDataByRegion,
  getServicesDataByRegion
} from '../utils/regionUtils';

// Import modular components
import CurrentWeatherStats from '../components/DashboardWidgets/CurrentWeatherStats';
import WeatherMapContainer from '../components/DashboardWidgets/WeatherMapContainer';
import PestAlertsPanel from '../components/DashboardWidgets/PestAlertsPanel';
import ServicesWidget from '../components/DashboardWidgets/ServicesWidget';
import WeatherForecastPanel from '../components/DashboardWidgets/WeatherForecastPanel';
import IrrigationStatusPanel from '../components/DashboardWidgets/IrrigationStatusPanel';
import CropCalendarPanel from '../components/DashboardWidgets/CropCalendarPanel';
import TariffWidget from '../components/DashboardWidgets/TariffWidget';

const Dashboard = () => {
  const routeLocation = useLocation();
  const [searchParams] = useSearchParams();
  
  // Initialize location data based on URL parameters or default
  const initializeLocation = () => {
    // Check if we have a region specified in the URL
    const region = searchParams.get('region');
    
    if (region) {
      return getDefaultLocationForRegion(region);
    }
    
    // Check if specific coordinates are provided
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const name = searchParams.get('name') || 'Custom Location';
    
    if (lat && lng) {
      return {
        name,
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
    }
    
    // Default location
    return {
      name: 'San Francisco',
      lat: 37.7749,
      lng: -122.4194
    };
  };

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
  
  const [location, setLocation] = useState(initializeLocation);
  const [activeMapLayer, setActiveMapLayer] = useState('Temperature');
  const [showServicesOverlay, setShowServicesOverlay] = useState(false);
  
  // Get region-specific pest data
  const pestAlerts = getPestDataByRegion(location);
  
  // Get region-specific crop data
  const cropData = getCropDataByRegion(location);
  
  // Get region-specific services
  const availableServices = getServicesDataByRegion(location).map(service => {
    // Convert icon string to actual React component
    const iconMap = {
      'bug': <FaBug className="text-green-600" />,
      'water': <FaWater className="text-blue-600" />,
      'seedling': <FaSeedling className="text-yellow-600" />,
      'chart-line': <FaChartLine className="text-purple-600" />
    };
    
    return {
      ...service,
      icon: iconMap[service.icon] || <FaSeedling className="text-green-600" />
    };
  });
  
  // Re-initialize location when URL parameters change
  useEffect(() => {
    setLocation(initializeLocation());
  }, [routeLocation.search]);
  
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
  
  // Handle map layer selection
  const handleLayerChange = (layer) => {
    setActiveMapLayer(layer);
  };
  
  // Handle location selection from search
  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
  };
  
  // Toggle services overlay
  const toggleServicesOverlay = () => {
    setShowServicesOverlay(!showServicesOverlay);
  };
  
  // Display title based on region
  const getDashboardTitle = () => {
    if (isMiddleEastRegion(location)) {
      return 'MENA Agricultural Weather Dashboard';
    } else if (isCaliforniaRegion(location)) {
      return 'California Agricultural Weather Dashboard';
    } else {
      return 'Agricultural Weather Dashboard';
    }
  };
  
  return (
    <div className="bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{getDashboardTitle()}</h1>
          <p className="text-xs text-gray-600">
            Monitor weather conditions, pest alerts, and optimize farming operations
          </p>
        </div>
        <div>
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>
      </div>
      
      {/* Current weather stats bar */}
      <CurrentWeatherStats weatherData={currentWeather} />
      
      {/* Main content */}
      <div className="grid grid-cols-4 gap-4">
        {/* Left column - takes 3/4 of the width */}
        <div className="col-span-3 space-y-4">
          {/* Main weather map */}
          <WeatherMapContainer 
            location={location}
            activeMapLayer={activeMapLayer}
            handleLayerChange={handleLayerChange}
            showServicesOverlay={showServicesOverlay}
            toggleServicesOverlay={toggleServicesOverlay}
            availableServices={availableServices}
          />
          
          {/* Tariff Widget - New addition below the map */}
          <TariffWidget location={location} crops={cropData.map(crop => crop.name.toLowerCase())} />
        </div>
        
        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Pest alerts panel */}
          <PestAlertsPanel alerts={pestAlerts} />
          
          {/* Services Widget */}
          <ServicesWidget />
          
          {/* 7-day forecast */}
          <WeatherForecastPanel forecastData={forecastData} />
          
          {/* Irrigation Status */}
          <IrrigationStatusPanel soilMoisturePercent={65} daysUntilIrrigation={2} />
          
          {/* Crop Calendar */}
          <CropCalendarPanel crops={cropData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;