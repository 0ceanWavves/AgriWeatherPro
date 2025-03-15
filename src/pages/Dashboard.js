import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { WeatherMap, AlertsPanel } from '../components/DashboardWidgets';
import Sidebar from '../components/Sidebar/Sidebar';
import CropYieldDisplay from '../components/CropYieldDisplay';
import WeatherForecast from '../components/WeatherForecast';
import ProfileSettings from '../components/ProfileSettings';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaChartLine, 
  FaWater, 
  FaBug, 
  FaGlobe, 
  FaLightbulb, 
  FaCloudSun 
} from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('maps');
  const [mapMode, setMapMode] = useState('weather'); // Add state for map mode
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState({ lat: 51.505, lng: -0.09, name: 'London' });
  
  // Enable dark mode when Dashboard mounts
  useEffect(() => {
    document.body.classList.add('dark-mode');

    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, []);

  // Log the user ID for debugging
  useEffect(() => {
    console.log('Dashboard mounted, user:', user?.id || 'No user ID available');
    // Force a dashboard refresh after mount to ensure all widgets load properly
    setTimeout(() => {
      console.log('Forcing dashboard refresh');
      setActiveView('home');
    }, 1000);
  }, [user]);

  // Request user location when the component mounts
  useEffect(() => {
    console.log("Requesting user location...");
    
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            console.log("Geolocation successful:", position.coords);
            try {
              // Reverse geocoding to get location name
              const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=deeaa95f4b7b2543dc8c3d9cb96396c6`
              );
              const data = await response.json();
              
              if (data && data.length > 0) {
                console.log("Location data:", data[0]);
                setUserLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  name: data[0].name || 'Your Location'
                });
              } else {
                setUserLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  name: 'Your Location'
                });
              }
            } catch (error) {
              console.error('Error getting location name:', error);
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                name: 'Your Location'
              });
            }
          },
          (error) => {
            console.error('Error getting user location:', error);
            // Keep default London location
            
            // Show a notification to the user about location access
            if (error.code === 1) {
              alert("Location access was denied. Please enable location access in your browser settings for better weather information.");
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 30000, // Increase from 10000 to 30000 ms
            maximumAge: 0
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser');
      }
    };
    
    // Request location immediately
    requestLocation();
    
  }, []);

  // Force refresh the component when it first mounts
  useEffect(() => {
    if (!user) return; // Early return but inside the hook
    
    console.log('Dashboard mounted, user:', user?.id);
    const timer = setTimeout(() => {
      console.log('Forcing dashboard refresh');
      setActiveView(prev => prev === 'maps' ? 'home' : 'maps');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  // Render the appropriate content based on the active view
  const renderContent = () => {
    switch(activeView) {
      case 'forecast':
        return <WeatherForecast />;
      case 'crops':
        return <CropYieldDisplay />;
      case 'maps':
      case 'home':
        return (
          <div className="relative w-full h-full">
            <WeatherMap location={userLocation} mode={mapMode} />
            
            {/* Map Mode Selector */}
            <div className="absolute top-4 right-4 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center min-w-[100px] ${
                    mapMode === 'weather' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    console.log("Setting map mode to weather");
                    setMapMode('weather');
                  }}
                >
                  <FaCloudSun className="inline mr-2" size={16} />
                  <span className="whitespace-nowrap">Weather</span>
                </button>
                <button 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center min-w-[100px] ${
                    mapMode === 'irrigation' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    console.log("Setting map mode to irrigation");
                    setMapMode('irrigation');
                  }}
                >
                  <FaWater className="inline mr-2" size={16} />
                  <span className="whitespace-nowrap">Irrigation</span>
                </button>
                <button 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center min-w-[100px] ${
                    mapMode === 'trade' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    console.log("Setting map mode to trade");
                    setMapMode('trade');
                  }}
                >
                  <FaGlobe className="inline mr-2" size={16} />
                  <span className="whitespace-nowrap">Trade</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="reports-panel p-5">
            <div className="page-header mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Weather Data Hub</h1>
                <p className="text-gray-800 dark:text-white font-medium">
                  Powered by OpenWeather API
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-orange-1 text-black-1 rounded hover:bg-orange-2 text-sm font-medium">Refresh Data</button>
                <select className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm">
                  <option>English Units</option>
                  <option>Metric Units</option>
                </select>
              </div>
            </div>
            
            {/* OpenWeather API Options */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Current Weather */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:ring-2 hover:ring-orange-1 transition-all cursor-pointer">
                <div className="p-5 flex items-center">
                  <svg className="w-10 h-10 text-orange-1 mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Current Weather</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Real-time conditions with temperature, humidity, pressure, wind data
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 5-Day Forecast */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:ring-2 hover:ring-orange-1 transition-all cursor-pointer">
                <div className="p-5 flex items-center">
                  <svg className="w-10 h-10 text-orange-1 mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">5-Day Forecast</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      5-day / 3-hour forecast with daily summaries and trends
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Historical Data */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:ring-2 hover:ring-orange-1 transition-all cursor-pointer">
                <div className="p-5 flex items-center">
                  <svg className="w-10 h-10 text-orange-1 mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Historical Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Weather history for past 5 days with hourly resolution
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Weather Maps */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:ring-2 hover:ring-orange-1 transition-all cursor-pointer">
                <div className="p-5 flex items-center">
                  <svg className="w-10 h-10 text-orange-1 mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Weather Maps</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Interactive maps with precipitation, pressure, temperature layers
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Air Pollution */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:ring-2 hover:ring-orange-1 transition-all cursor-pointer">
                <div className="p-5 flex items-center">
                  <svg className="w-10 h-10 text-orange-1 mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Air Pollution</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Air quality data including CO, NO, NO₂, O₃, SO₂, PM2.5, PM10
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Geocoding API */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:ring-2 hover:ring-orange-1 transition-all cursor-pointer">
                <div className="p-5 flex items-center">
                  <svg className="w-10 h-10 text-orange-1 mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Location Search</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Convert location names to coordinates and vice versa
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Current Weather Display */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Current Weather Conditions</h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-3">
                  <span>London, UK</span>
                  <span>•</span>
                  <span>Last updated: 5 min ago</span>
                  <button className="p-1 text-orange-1 hover:text-orange-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Main Weather */}
                <div className="p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-20 h-20 text-orange-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-800 dark:text-white mb-1">72°F</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">Clear Sky</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Feels like: 70°F</p>
                </div>
                
                {/* Details */}
                <div className="p-6 grid grid-cols-2 gap-y-4 md:border-r border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                    <p className="text-xl font-medium text-gray-800 dark:text-white">45%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
                    <p className="text-xl font-medium text-gray-800 dark:text-white">8 mph</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
                    <p className="text-xl font-medium text-gray-800 dark:text-white">1013 hPa</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visibility</p>
                    <p className="text-xl font-medium text-gray-800 dark:text-white">10 km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">UV Index</p>
                    <p className="text-xl font-medium text-gray-800 dark:text-white">3 (Moderate)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dew Point</p>
                    <p className="text-xl font-medium text-gray-800 dark:text-white">50°F</p>
                  </div>
                </div>
                
                {/* Sun/Moon */}
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sunrise & Sunset</p>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">06:32 AM</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">07:45 PM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Today's Forecast</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Morning</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">59°F</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Afternoon</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">72°F</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Evening</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">64°F</p>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setActiveView('forecast')}
                    className="mt-6 w-full px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2 text-sm font-medium"
                  >
                    View Full Forecast
                  </button>
                </div>
              </div>
            </div>
            
            {/* Weather Forecast */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">5-Day Forecast</h2>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4">
                  {/* Day forecasts */}
                  {[...Array(5)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = date.getDate();
                    
                    return (
                      <div key={i} className="w-full md:w-1/5 bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                        <p className="font-medium text-gray-800 dark:text-white">{day}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Mar {dayNum}</p>
                        
                        <div className="mb-3">
                          {i === 0 ? (
                            <svg className="w-10 h-10 mx-auto text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                          ) : i === 1 || i === 4 ? (
                            <svg className="w-10 h-10 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                            </svg>
                          ) : (
                            <svg className="w-10 h-10 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H12V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                              <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-white">
                          <span>{67 + i * 2}°</span>
                          <span className="text-gray-500 dark:text-gray-400">{54 + i}°</span>
                        </div>
                        
                        <div className="mt-2 text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            {i === 0 ? 'Clear' : i === 1 || i === 4 ? 'Partly Cloudy' : 'Rain'}
                          </span>
                        </div>
                        
                        <div className="mt-2 text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            {i === 0 ? '0%' : i === 1 || i === 4 ? '20%' : '70%'} precip
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <button className="text-orange-1 hover:text-orange-2 font-medium text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    View Hourly Forecast
                  </button>
                  
                  <button className="text-orange-1 hover:text-orange-2 font-medium text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Forecast Data
                  </button>
                </div>
              </div>
            </div>
            
            {/* Additional Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weather Map */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Weather Maps</h2>
                </div>
                <div className="p-0">
                  <div className="relative aspect-video bg-gray-700">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-16 h-16 text-orange-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6">
                      <h3 className="text-xl font-semibold mb-2">Interactive Weather Maps</h3>
                      <p className="text-center mb-4">View precipitation, temperature, wind, pressure, and cloud layers</p>
                      <button
                        onClick={() => setActiveView('maps')}
                        className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2 text-sm font-medium"
                      >
                        Open Weather Map
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-2">Available Map Layers</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 text-center">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">Precipitation</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 text-center">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">Temperature</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 text-center">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">Wind Speed</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 text-center">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">Pressure</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 text-center">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">Clouds</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded border border-orange-1 dark:border-orange-1 text-center">
                        <p className="text-sm font-medium text-orange-1">+ More</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Air Pollution Data */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Air Quality Index</h2>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900 border-4 border-green-500">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-green-700 dark:text-green-300">32</span>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">Good</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Carbon Monoxide (CO)</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">223.67 μg/m³</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nitrogen Dioxide (NO₂)</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">5.19 μg/m³</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ozone (O₃)</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">93.46 μg/m³</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sulfur Dioxide (SO₂)</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">1.67 μg/m³</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PM2.5</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">8.63 μg/m³</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PM10</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">10.32 μg/m³</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-2">Agricultural Impact</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Current air quality is good for crop health. No adverse effects on plant growth or pollination expected.
                    </p>
                    <div className="flex justify-between">
                      <button className="text-orange-1 hover:text-orange-2 text-sm font-medium">View Historical Data</button>
                      <button className="text-orange-1 hover:text-orange-2 text-sm font-medium">Set Alert</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* API Credits */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-5">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Powered by <span className="font-medium text-orange-1">OpenWeather API</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Using One Call API 3.0, Geocoding API, and Air Pollution API
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    API Documentation
                  </button>
                  <button className="px-4 py-2 text-sm bg-orange-1 text-black-1 rounded hover:bg-orange-2">
                    Manage API Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="alerts-panel-full p-5">
            <h2 className="text-xl font-semibold mb-4">Weather Alerts</h2>
            <p>Comprehensive weather alerts and warnings will be displayed here.</p>
          </div>
        );
      case 'settings':
        return <ProfileSettings />;
      case 'support':
        return (
          <div className="support-panel p-5">
            <div className="page-header mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Support Centre</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Get help with your AgriWeather Pro account and services
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* FAQ Section */}
              <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Frequently Asked Questions</h2>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {/* FAQ Item 1 */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button className="w-full px-4 py-3 text-left bg-gray-100 dark:bg-gray-700 font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        How accurate are the weather forecasts?
                      </button>
                      <div className="px-4 py-3">
                        <p className="text-gray-600 dark:text-gray-300">
                          Our weather forecasts are sourced from multiple meteorological services and have an accuracy rate of over 90% for 48-hour forecasts. The longer the forecast period, the more the accuracy may decrease. We use advanced algorithms to provide the most accurate predictions possible.
                        </p>
                      </div>
                    </div>
                    
                    {/* FAQ Item 2 */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button className="w-full px-4 py-3 text-left bg-gray-100 dark:bg-gray-700 font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        How do I set up weather alerts for my farm?
                      </button>
                      <div className="px-4 py-3">
                        <p className="text-gray-600 dark:text-gray-300">
                          You can set up weather alerts in the "Triggers" section of your dashboard. Select the weather conditions you want to be notified about, set thresholds, and choose how you want to receive notifications (SMS, email, or app notifications).
                        </p>
                      </div>
                    </div>
                    
                    {/* FAQ Item 3 */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button className="w-full px-4 py-3 text-left bg-gray-100 dark:bg-gray-700 font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Can I upgrade or downgrade my subscription plan?
                      </button>
                      <div className="px-4 py-3">
                        <p className="text-gray-600 dark:text-gray-300">
                          Yes, you can change your subscription plan at any time from the "Tariff" section. When upgrading, you'll have immediate access to the new features. When downgrading, your current plan will remain active until the end of your billing cycle.
                        </p>
                      </div>
                    </div>
                    
                    {/* FAQ Item 4 */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button className="w-full px-4 py-3 text-left bg-gray-100 dark:bg-gray-700 font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        How are crop yield predictions calculated?
                      </button>
                      <div className="px-4 py-3">
                        <p className="text-gray-600 dark:text-gray-300">
                          Our crop yield predictions use a combination of historical weather data, current forecasts, soil conditions, crop type information, and machine learning algorithms trained on millions of data points from similar farms and conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Support */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Contact Support</h2>
                </div>
                <div className="p-5">
                  <form className="space-y-4">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                        <option>Technical Issue</option>
                        <option>Billing Question</option>
                        <option>Feature Request</option>
                        <option>Account Help</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message
                      </label>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        rows="5"
                        placeholder="Describe your issue or question..."
                      ></textarea>
                    </div>
                    
                    <div className="form-group">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Include system diagnostic information
                        </span>
                      </label>
                    </div>
                    
                    <button 
                      type="button"
                      className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2 text-sm font-medium w-full"
                    >
                      Submit Request
                    </button>
                  </form>
                  
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Other ways to get help:</p>
                    <div className="flex justify-center space-x-4">
                      <button className="text-orange-1 hover:text-orange-2">
                        <span className="sr-only">Email</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </button>
                      <button className="text-orange-1 hover:text-orange-2">
                        <span className="sr-only">Phone</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </button>
                      <button className="text-orange-1 hover:text-orange-2">
                        <span className="sr-only">Chat</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Support Resources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md text-center">
                <svg className="w-12 h-12 mx-auto text-orange-1 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Knowledge Base</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Explore our comprehensive guides, tutorials, and articles
                </p>
                <button className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2 text-sm font-medium">
                  Browse Articles
                </button>
              </div>
              
              <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md text-center">
                <svg className="w-12 h-12 mx-auto text-orange-1 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Video Tutorials</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Watch step-by-step videos to learn how to use our platform
                </p>
                <button className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2 text-sm font-medium">
                  Watch Videos
                </button>
              </div>
              
              <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md text-center">
                <svg className="w-12 h-12 mx-auto text-orange-1 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Community Forum</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Connect with other users to share tips and get help
                </p>
                <button className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2 text-sm font-medium">
                  Join Community
                </button>
              </div>
            </div>
          </div>
        );
      case 'triggers':
        return (
          <div className="triggers-panel p-5">
            <div className="page-header mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Weather Triggers & Alerts</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Set up custom notifications for specific weather conditions relevant to your farm
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Triggers */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Active Triggers</h2>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {/* Trigger Item 1 */}
                    <div className="trigger-item border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          <h3 className="font-medium text-gray-800 dark:text-white">Frost Alert</h3>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                            <FaWater className="w-4 h-4" />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                            <FaBug className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Alert when temperature drops below 0°C
                      </p>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Location: North Field</span>
                        <span>SMS & Email</span>
                      </div>
                    </div>
                    
                    {/* Trigger Item 2 */}
                    <div className="trigger-item border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          <h3 className="font-medium text-gray-800 dark:text-white">Heavy Rain Alert</h3>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                            <FaWater className="w-4 h-4" />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                            <FaBug className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Alert when precipitation exceeds 25mm in 24 hours
                      </p>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Location: All Fields</span>
                        <span>SMS</span>
                      </div>
                    </div>
                    
                    {/* Trigger Item 3 */}
                    <div className="trigger-item border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          <h3 className="font-medium text-gray-800 dark:text-white">Heat Stress Warning</h3>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                            <FaWater className="w-4 h-4" />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                            <FaBug className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Alert when temperature exceeds 32°C for more than 3 hours
                      </p>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Location: Greenhouse</span>
                        <span>Email & App</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Create New Trigger */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Create New Trigger</h2>
                </div>
                <div className="p-5">
                  <form className="space-y-4">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Trigger Name
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" 
                        placeholder="Enter trigger name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Weather Condition
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                        <option>Temperature</option>
                        <option>Precipitation</option>
                        <option>Wind Speed</option>
                        <option>Humidity</option>
                        <option>UV Index</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Threshold
                        </label>
                        <input 
                          type="number" 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" 
                          placeholder="Value"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Condition
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                          <option>Below</option>
                          <option>Above</option>
                          <option>Equal to</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                        <option>All Fields</option>
                        <option>North Field</option>
                        <option>South Field</option>
                        <option>Greenhouse</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notification Method
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="form-checkbox" />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">SMS</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="form-checkbox" />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="form-checkbox" />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">App Notification</span>
                        </label>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2 text-sm font-medium w-full"
                    >
                      Create Trigger
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'tariff':
        return (
          <div className="tariff-panel p-5">
            <div className="page-header mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Agricultural Tariffs Impact Tracker</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor US and global trade tariffs affecting agricultural goods and services
              </p>
            </div>
            
            {/* Tariff Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-5 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current US-China</p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">25%</h3>
                  </div>
                  <span className="text-red-500 text-2xl">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                      <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                    </svg>
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  On soybeans, corn, and wheat
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-5 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">US-EU</p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">15%</h3>
                  </div>
                  <span className="text-orange-500 text-2xl">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  On farm equipment and machinery
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-5 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fertilizer Tariff</p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">10%</h3>
                  </div>
                  <span className="text-yellow-500 text-2xl">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  On imported fertilizers and nutrients
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-5 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price Impact</p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">+18%</h3>
                  </div>
                  <span className="text-green-500 text-2xl">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Average cost increase on affected goods
                </p>
              </div>
            </div>
            
            {/* Current Tariff Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Current US Tariffs on Agricultural Goods</h2>
                </div>
                <div className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Country</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tariff Rate</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Impact</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-50 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Soybeans</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">China</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">25%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">High</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Fertilizers</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Russia</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">15%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500">Medium</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Dairy Products</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">EU</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">12%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500">Medium</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Farm Equipment</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Multiple</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">10%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">Moderate</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Pesticides</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">China</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">18%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500">Medium</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Tariffs on US Agricultural Exports</h2>
                </div>
                <div className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Target Country</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tariff Rate</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Impact</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-50 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Corn</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">China</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">25%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">High</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Pork</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Mexico</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">20%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">High</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Wheat</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">EU</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">8%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">Moderate</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Cotton</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">India</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">15%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500">Medium</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Beef</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">Japan</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">12%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500">Medium</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Impact and Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Projected Price Impact</h2>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fertilizers</span>
                        <span className="text-sm font-medium text-red-500">+23%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Farm Equipment</span>
                        <span className="text-sm font-medium text-orange-500">+15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Seeds</span>
                        <span className="text-sm font-medium text-yellow-500">+10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pesticides</span>
                        <span className="text-sm font-medium text-orange-500">+18%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    
                    <div className="pb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Irrigation Systems</span>
                        <span className="text-sm font-medium text-green-500">+8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Tariff Impact Calculator</h2>
                </div>
                <div className="p-5">
                  <form className="space-y-4">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Agricultural Product
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                        <option>Soybeans</option>
                        <option>Corn</option>
                        <option>Wheat</option>
                        <option>Dairy</option>
                        <option>Beef</option>
                        <option>Pork</option>
                        <option>Fertilizers</option>
                        <option>Farm Equipment</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantity/Value
                      </label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" 
                        placeholder="Enter amount in USD"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Target Market
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                        <option>China</option>
                        <option>European Union</option>
                        <option>Mexico</option>
                        <option>Canada</option>
                        <option>Japan</option>
                        <option>South Korea</option>
                        <option>Brazil</option>
                      </select>
                    </div>
                    
                    <button 
                      type="button"
                      className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2 text-sm font-medium w-full"
                    >
                      Calculate Impact
                    </button>
                  </form>
                  
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Estimated Tariff Cost</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">$0.00</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select products and calculate to see impact</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* News and Updates Section */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Latest Tariff News & Updates</h2>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="text-md font-medium text-gray-800 dark:text-white mb-1">US-China Phase One Deal Review Expected Next Month</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Officials will meet to review agricultural commitments under the Phase One trade deal, potentially affecting current tariff rates on soybeans and corn.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">March 10, 2025</p>
                  </div>
                  
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="text-md font-medium text-gray-800 dark:text-white mb-1">EU Considers New Tariffs on US Agricultural Machinery</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      European Commission proposes 15% tariff on imported US farm equipment in response to ongoing steel and aluminum disputes.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">March 5, 2025</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-gray-800 dark:text-white mb-1">Fertilizer Tariffs May Increase Due to Supply Chain Issues</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Global fertilizer markets facing pressure as countries consider new protective measures amid ongoing supply chain disruptions.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">February 28, 2025</p>
                  </div>
                </div>
                
                <button 
                  className="mt-6 px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2 text-sm font-medium"
                >
                  View All Tariff News
                </button>
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="about-panel p-5">
            <div className="page-header mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">About AgriWeather Pro</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Learn about our mission and the team behind AgriWeather Pro
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Our Mission</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      At AgriWeather Pro, we are dedicated to empowering farmers with precise weather information and 
                      agricultural insights. Our mission is to help optimize farming operations, increase crop yields, 
                      and promote sustainable agricultural practices through advanced weather technology.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We believe that accurate, timely weather data is crucial for modern farming success. By 
                      combining meteorological expertise with cutting-edge technology, we provide tools that help 
                      farmers make informed decisions, reduce risks, and maximize productivity.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our platform is designed by farmers, for farmers, with a deep understanding of the challenges 
                      and opportunities in agriculture. We are committed to continuous improvement and innovation to 
                      address the evolving needs of the farming community.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Our Technology</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      AgriWeather Pro leverages multiple data sources and advanced algorithms to provide highly 
                      accurate weather forecasts tailored specifically for agricultural applications.
                    </p>
                    
                    <div className="space-y-4 mt-6">
                      <div className="border-l-4 border-orange-1 pl-4">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-1">Advanced Weather Modeling</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          We combine data from multiple meteorological sources and use proprietary algorithms to generate 
                          hyperlocal forecasts with exceptional accuracy.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-orange-1 pl-4">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-1">Machine Learning</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Our AI systems continuously learn from historical data, improving prediction accuracy for 
                          crop yields, pest management, and irrigation needs.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-orange-1 pl-4">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-1">Satellite Integration</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          We incorporate satellite imagery and remote sensing data to provide real-time field conditions 
                          and early detection of potential issues.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-orange-1 pl-4">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-1">Mobile-First Design</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Our platform is designed to be accessible anywhere, ensuring farmers can access critical 
                          information whether in the office or in the field.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Company Facts</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-orange-1 rounded-full p-1 w-8 h-8 flex items-center justify-center text-black-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-white">Founded</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">2020</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-orange-1 rounded-full p-1 w-8 h-8 flex items-center justify-center text-black-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-white">Team Size</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">65+ employees globally</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-orange-1 rounded-full p-1 w-8 h-8 flex items-center justify-center text-black-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-white">Headquarters</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Chicago, IL, USA</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-orange-1 rounded-full p-1 w-8 h-8 flex items-center justify-center text-black-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-white">Farmers Served</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">50,000+ globally</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Connect With Us</h2>
                    
                    <div className="space-y-4">
                      <a href="#" className="flex items-center text-gray-800 dark:text-white hover:text-orange-1 dark:hover:text-orange-1">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>info@agriweatherpro.com</span>
                      </a>
                      
                      <a href="#" className="flex items-center text-gray-800 dark:text-white hover:text-orange-1 dark:hover:text-orange-1">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>+1 (800) 123-4567</span>
                      </a>
                      
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3">Follow Us</h3>
                        <div className="flex space-x-4">
                          <a href="#" className="text-gray-600 hover:text-orange-1 dark:text-gray-400 dark:hover:text-orange-1">
                            <span className="sr-only">Twitter</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                          </a>
                          <a href="#" className="text-gray-600 hover:text-orange-1 dark:text-gray-400 dark:hover:text-orange-1">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                          <a href="#" className="text-gray-600 hover:text-orange-1 dark:text-gray-400 dark:hover:text-orange-1">
                            <span className="sr-only">Facebook</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                          </a>
                          <a href="#" className="text-gray-600 hover:text-orange-1 dark:text-gray-400 dark:hover:text-orange-1">
                            <span className="sr-only">Instagram</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="dashboard-welcome p-5">
            <h2 className="text-xl font-semibold mb-4">Welcome to AgriWeather Pro Dashboard</h2>
            <p>Select an option from the sidebar to view detailed weather information.</p>
          </div>
        );
    }
  };

  console.log('Rendering dashboard with activeView:', activeView);
  
  return (
    <div className="dashboard-layout">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="dashboard-main">
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;