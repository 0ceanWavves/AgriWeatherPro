import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaChartBar, FaLeaf, FaCloudSun, FaBug, FaTint, FaInfoCircle } from 'react-icons/fa';
import { useServiceMap } from '../context/ServiceMapContext';
import ServicesMenu from './ServicesMenu/ServicesMenu';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectService } = useServiceMap();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Update selected service based on current route
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/services/weather-forecasting')) {
      selectService('weather-forecasting');
    } else if (path.includes('/services/california-pest')) {
      selectService('california-pest');
    } else if (path.includes('/services/mena-pest')) {
      selectService('mena-pest');
    } else if (path.includes('/services/irrigation-planning')) {
      selectService('irrigation-planning');
    } else if (path.includes('/services/crop-yield-prediction')) {
      selectService('crop-yield-prediction');
    } else if (path.includes('/services/climate-analysis')) {
      selectService('climate-analysis');
    } else if (path === '/dashboard') {
      selectService('weather-forecasting'); // Default for dashboard
    }
  }, [location.pathname, selectService]);

  const navigationItems = [
    { path: '/', label: 'Home', icon: <FaHome className="w-5 h-5" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartBar className="w-5 h-5" /> },
    { path: '/forecast', label: 'Forecast', icon: <FaCloudSun className="w-5 h-5" /> },
    { path: '/crop-yields', label: 'Crop Yields', icon: <FaLeaf className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <button 
                className="lg:hidden mr-2 p-2 rounded hover:bg-primary-dark focus:outline-none"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to="/" className="text-xl font-bold">AgriWeather Pro</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="hidden md:block hover:text-primary-light transition-colors">
                Dashboard
              </Link>
              <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center">
                <span className="font-semibold">D</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className={`bg-gray-800 text-white w-64 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:relative h-full z-10`}>
          <nav className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center py-2 px-3 rounded-md ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            
            {/* Services section */}
            <div className="mt-6">
              <div className="text-gray-400 uppercase text-xs font-semibold py-2 px-3">
                SERVICES
              </div>
              
              <Link
                to="/services/pest-management"
                className={`flex items-center py-2 px-3 rounded-md ${
                  isActive('/services/pest-management')
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3"><FaBug className="w-5 h-5" /></span>
                <span>Pest Management</span>
              </Link>
              
              <div className="space-y-1 ml-2">
                <Link
                  to="/services/california-pest"
                  className={`flex items-center py-2 px-3 pl-8 rounded-md text-sm ${
                    isActive('/services/california-pest')
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => selectService('california-pest')}
                >
                  <span>California Pests</span>
                </Link>
                
                <Link
                  to="/services/mena-pest"
                  className={`flex items-center py-2 px-3 pl-8 rounded-md text-sm ${
                    isActive('/services/mena-pest')
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => selectService('mena-pest')}
                >
                  <span>MENA Date Palm Pests</span>
                </Link>
              </div>
              
              <Link
                to="/services/irrigation-planning"
                className={`flex items-center py-2 px-3 rounded-md ${
                  isActive('/services/irrigation-planning')
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => selectService('irrigation-planning')}
              >
                <span className="mr-3"><FaTint className="w-5 h-5" /></span>
                <span>Irrigation Planning</span>
              </Link>
            </div>
            
            <Link
              to="/about"
              className={`flex items-center py-2 px-3 rounded-md ${
                isActive('/about')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3"><FaInfoCircle className="w-5 h-5" /></span>
              <span>About</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;