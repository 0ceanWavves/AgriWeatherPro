import React, { useState } from 'react';
import WeatherMap from '../../components/DashboardWidgets/WeatherMap';
import { FaWater, FaTint, FaChartLine, FaCalendarAlt, FaSeedling } from 'react-icons/fa';

const IrrigationPlanning = () => {
  const [selectedLocation, setSelectedLocation] = useState({ 
    lat: 51.505, 
    lng: -0.09, 
    name: 'London' 
  });
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="irrigation-planning-page p-4">
      <div className="page-header mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Irrigation Planning</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Plan efficient irrigation based on weather forecasts, soil conditions, and crop needs
        </p>
      </div>

      <div className="page-tabs mb-4 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('map')}
            className={`inline-flex items-center py-2 px-4 mr-4 
              ${activeTab === 'map' 
                ? 'text-orange-1 border-b-2 border-orange-1 font-medium' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
            type="button"
          >
            <FaWater className="mr-2" />
            <span>Irrigation Map</span>
          </button>
          
          <button
            onClick={() => setActiveTab('schedule')}
            className={`inline-flex items-center py-2 px-4 mr-4 
              ${activeTab === 'schedule' 
                ? 'text-orange-1 border-b-2 border-orange-1 font-medium' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
            type="button"
          >
            <FaCalendarAlt className="mr-2" />
            <span>Schedule</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex items-center py-2 px-4 mr-4 
              ${activeTab === 'analytics' 
                ? 'text-orange-1 border-b-2 border-orange-1 font-medium' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
            type="button"
          >
            <FaChartLine className="mr-2" />
            <span>Analytics</span>
          </button>
          
          <button
            onClick={() => setActiveTab('crops')}
            className={`inline-flex items-center py-2 px-4 
              ${activeTab === 'crops' 
                ? 'text-orange-1 border-b-2 border-orange-1 font-medium' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
            type="button"
          >
            <FaSeedling className="mr-2" />
            <span>Crop Settings</span>
          </button>
        </nav>
      </div>

      <div className="tab-content">
        {activeTab === 'map' && (
          <div className="map-tab">
            <WeatherMap location={selectedLocation} mode="irrigation" />
          </div>
        )}
        
        {activeTab === 'schedule' && (
          <div className="schedule-tab p-8 rounded bg-gray-50 dark:bg-gray-800 text-center">
            <FaCalendarAlt className="text-5xl mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Irrigation Schedule</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This premium feature allows you to create automated irrigation schedules based on weather forecasts
              and soil conditions.
            </p>
            <button 
              type="button"
              className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2"
            >
              Upgrade to Premium
            </button>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="analytics-tab p-8 rounded bg-gray-50 dark:bg-gray-800 text-center">
            <FaChartLine className="text-5xl mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Water Usage Analytics</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Track water usage, efficiency metrics, and cost savings with our premium analytics tools.
            </p>
            <button 
              type="button"
              className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2"
            >
              Upgrade to Premium
            </button>
          </div>
        )}
        
        {activeTab === 'crops' && (
          <div className="crops-tab p-8 rounded bg-gray-50 dark:bg-gray-800 text-center">
            <FaSeedling className="text-5xl mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Crop Water Requirements</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Configure crop types, growth stages, and water requirements for optimal irrigation planning.
            </p>
            <button 
              type="button"
              className="px-4 py-2 bg-orange-1 text-black-1 rounded hover:bg-orange-2"
            >
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IrrigationPlanning;