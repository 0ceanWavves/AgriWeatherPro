import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
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
  const [mapMode, setMapMode] = useState('weather');
  const { loading, user } = useAuth ? useAuth() : { loading: false, user: null };
  const [userLocation, setUserLocation] = useState({ lat: 51.505, lng: -0.09, name: 'London' });
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // Expose setActiveView to window for cross-component access
  useEffect(() => {
    window.setDashboardView = setActiveView;
    
    // Cleanup
    return () => {
      delete window.setDashboardView;
    };
  }, []);
  
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
    
    setTimeout(() => {
      console.log('Forcing dashboard refresh');
      const urlPath = window.location.pathname;
      const urlHash = window.location.hash;
      console.log('URL path:', urlPath, 'URL hash:', urlHash);
      
      if (urlPath.includes('/reports') || urlHash === '#reports') {
        console.log('Setting view to reports based on URL');
        setActiveView('reports');
      } else {
        setActiveView('home');
      }
    }, 1000);
  }, [user]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const urlHash = window.location.hash;
      console.log('Hash changed to:', urlHash);
      
      if (urlHash === '#reports') {
        console.log('Setting view to reports based on hash change');
        setActiveView('reports');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Check hash on initial load
    handleHashChange();
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

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
            
            if (error.code === 1) {
              console.log("Location access was denied.");
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser');
      }
    };
    
    requestLocation();
    
  }, []);

  // Force refresh the component when it first mounts
  useEffect(() => {
    if (!user) return;
    
    console.log('Dashboard mounted, user:', user?.id);
    const timer = setTimeout(() => {
      console.log('Forcing dashboard refresh');
      setActiveView(prev => prev === 'maps' ? 'home' : 'maps');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Replace with your actual data fetching logic
        const response = await fetch('/api/your-data-endpoint'); // Example
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err); // Set the error state
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
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
                <div className="relative group">
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
                </div>
                
                <div className="relative group">
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
                </div>
                
                <div className="relative group">
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
          </div>
        );
      case 'reports':
        return (
          <div className="reports-panel p-5">
            <h2>Weather Reports</h2>
            <p>Reports will display here</p>
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