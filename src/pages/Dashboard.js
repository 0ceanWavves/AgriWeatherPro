import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { WeatherMap, AlertsPanel } from '../components/DashboardWidgets';
import Sidebar from '../components/Sidebar/Sidebar';
import CropYieldDisplay from '../components/CropYieldDisplay';
import WeatherForecast from '../components/WeatherForecast';
import ProfileSettings from '../components/ProfileSettings';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('maps');
  const { loading, user } = useAuth();
  
  // Enable dark mode when Dashboard mounts
  useEffect(() => {
    document.body.classList.add('dark-mode');

    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('dark-mode');
    };
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
  
  // Sample location data
  const london = { lat: 51.505, lng: -0.09, name: 'London' };
  
  // Render the appropriate content based on the active view
  const renderContent = () => {
    switch(activeView) {
      case 'forecast':
        return <WeatherForecast />;
      case 'crops':
        return <CropYieldDisplay />;
      case 'maps':
      case 'home':
        return <WeatherMap location={london} />;
      case 'reports':
        return (
          <div className="reports-panel p-5">
            <h2 className="text-xl font-semibold mb-4">Weather Reports</h2>
            <p>Detailed reports and analytics will be displayed here.</p>
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
            <h2 className="text-xl font-semibold mb-4">Support Centre</h2>
            <p>Help resources and support contact information will be displayed here.</p>
          </div>
        );
      case 'tariff':
        return (
          <div className="tariff-panel p-5">
            <h2 className="text-xl font-semibold mb-4">Tariff</h2>
            <p>Pricing and tariff information will be displayed here.</p>
          </div>
        );
      case 'about':
        return (
          <div className="about-panel p-5">
            <h2 className="text-xl font-semibold mb-4">About Us</h2>
            <p>Information about AgriWeather Pro and its team will be displayed here.</p>
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
      
      <div className="dashboard-alerts">
        <AlertsPanel />
      </div>
    </div>
  );
};

export default Dashboard;