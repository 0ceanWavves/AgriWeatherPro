import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaChartLine, 
  FaExchangeAlt, 
  FaDollarSign, 
  FaCommentDots,
  FaInfoCircle, 
  FaCog, 
  FaSignOutAlt,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { getUserProfile, logout } from '../../api/auth';
import './Sidebar.css';

const Sidebar = ({ activeView, setActiveView }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const userData = await getUserProfile();
      setUser(userData);
      setLoading(false);
    };

    fetchUserProfile();
  }, []);
  
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login');
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };
  
  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.profile?.display_name || user.profile?.full_name || user.email?.split('@')[0] || 'User';
  };
  
  // Get user avatar or first letter
  const getUserAvatar = () => {
    if (user?.profile?.avatar_url) {
      return <img alt={getUserDisplayName()} className="rounded-full w-8 h-8" src={user.profile.avatar_url} />;
    } else {
      return <div className="w-8 h-8 rounded-full bg-orange-1 text-black-1 flex items-center justify-center font-bold">
        {getUserDisplayName().charAt(0).toUpperCase()}
      </div>;
    }
  };
  
  return (
    <div className="flex-1 bg-black-2 text-white rounded-xl flex flex-col justify-between gap-4">
      <div className="border-b-black-3 border-b px-5 py-6 flex items-center justify-between gap-2">
        <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
          ) : (
            getUserAvatar()
          )}
        </span>
        <span className="overflow-hidden">
          {loading ? (
            <div className="w-24 h-4 bg-gray-600 rounded animate-pulse"></div>
          ) : (
            getUserDisplayName()
          )}
        </span>
        <span className="flex-1"></span>
        <button 
          type="button" 
          title="Sign out" 
          onClick={handleLogout}
        >
          <FaSignOutAlt className="w-5 h-5 hover:text-orange-2" />
        </button>
      </div>
      
      <div className="weather-data-panel px-4 py-3">
        <h2 className="text-3xl font-bold">-8.8 °C</h2>
        <div className="weather-icon">☁️</div>
        <p className="text-sm mb-3">Feels like: <span>-11.9 °C</span></p>
        
        <div className="weather-metrics space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Precipitation</span>
            <span className="text-sm font-medium">0 mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Wind speed</span>
            <span className="text-sm font-medium">1.54 m/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Wind Direction</span>
            <span className="text-sm font-medium">20 deg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Humidity</span>
            <span className="text-sm font-medium">94 %</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Clouds</span>
            <span className="text-sm font-medium">100 %</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Pressure</span>
            <span className="text-sm font-medium">1017 hPa</span>
          </div>
        </div>
      </div>

      <ul className="flex flex-col justify-start space-y-1 px-1">
        <li className="relative">
          <button 
            type="button"
            className={`relative flex items-center hover:text-orange-1 hover:bg-orange-1/30 rounded-full px-4 py-1 ${activeView === 'home' ? 'text-orange-1 bg-orange-1/30' : 'text-white'}`}
            onClick={() => setActiveView('home')}
          >
            <FaHome className="w-6 h-6" />
            <span className="relative pl-3">Home</span>
          </button>
        </li>
        <li className="relative">
          <button 
            type="button"
            className={`relative flex items-center hover:text-orange-1 hover:bg-orange-1/30 rounded-full px-4 py-1 ${activeView === 'reports' ? 'text-orange-1 bg-orange-1/30' : 'text-white'}`}
            onClick={() => setActiveView('reports')}
          >
            <FaChartLine className="w-6 h-6" />
            <span className="relative pl-3">Reports</span>
          </button>
        </li>
        <li className="relative">
          <button 
            type="button"
            className={`relative flex items-center hover:text-orange-1 hover:bg-orange-1/30 rounded-full px-4 py-1 ${activeView === 'triggers' ? 'text-orange-1 bg-orange-1/30' : 'text-white'}`}
            onClick={() => setActiveView('triggers')}
          >
            <FaExchangeAlt className="w-6 h-6" />
            <span className="relative pl-3">Triggers</span>
          </button>
        </li>
        <li className="relative">
          <button 
            type="button"
            className={`relative flex items-center hover:text-orange-1 hover:bg-orange-1/30 rounded-full px-4 py-1 ${activeView === 'tariff' ? 'text-orange-1 bg-orange-1/30' : 'text-white'}`}
            onClick={() => setActiveView('tariff')}
          >
            <FaDollarSign className="w-6 h-6" />
            <span className="relative pl-3">Tariff</span>
          </button>
        </li>
        <li className="relative">
          <button 
            type="button"
            className={`relative flex items-center hover:text-orange-1 hover:bg-orange-1/30 rounded-full px-4 py-1 ${activeView === 'support' ? 'text-orange-1 bg-orange-1/30' : 'text-white'}`}
            onClick={() => setActiveView('support')}
          >
            <FaCommentDots className="w-6 h-6" />
            <span className="relative pl-3">Support centre</span>
          </button>
        </li>
        <li className="relative">
          <button 
            type="button"
            className={`relative flex items-center hover:text-orange-1 hover:bg-orange-1/30 rounded-full px-4 py-1 ${activeView === 'about' ? 'text-orange-1 bg-orange-1/30' : 'text-white'}`}
            onClick={() => setActiveView('about')}
          >
            <FaInfoCircle className="w-6 h-6" />
            <span className="relative pl-3">About us</span>
          </button>
        </li>
        <li className="relative">
          <button 
            type="button"
            className={`relative flex items-center hover:text-orange-1 hover:bg-orange-1/30 rounded-full px-4 py-1 ${activeView === 'settings' ? 'text-orange-1 bg-orange-1/30' : 'text-white'}`}
            onClick={() => setActiveView('settings')}
          >
            <FaCog className="w-6 h-6" />
            <span className="relative pl-3">Settings</span>
          </button>
        </li>
      </ul>

      <div className="border-t border-black-3"></div>

      <div className="px-1">
        <button 
          type="button"
          className="flex gap-2 rounded-full justify-center whitespace-nowrap items-center py-3 px-6 bg-orange-1 text-black-1 hover:enabled:bg-black-2 hover:enabled:text-white w-full"
        >
          <FaCommentDots className="w-6 h-6" />
          <span className="pl-3">Ask a question</span>
        </button>
      </div>

      <div className="flex-1"></div>

      <div className="px-5 py-6 text-white border-t border-black-3">
        <label className="flex items-center justify-between cursor-pointer">
          <FaMoon className="w-6 h-6" />
          <span>Dark mode</span>
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-orange-2 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-1">
            <input 
              className="sr-only peer" 
              type="checkbox" 
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default Sidebar;