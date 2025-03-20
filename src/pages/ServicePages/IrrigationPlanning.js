import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceMap } from '../../context/ServiceMapContext';
import BackButton from '../../components/BackButton';
import ServiceAwareMap from '../../components/DashboardWidgets/ServiceAwareMap';
import { FaWater, FaTint, FaChartLine, FaCalendarAlt, FaSeedling, FaInfoCircle } from 'react-icons/fa';
import ScheduleTab from '../../components/IrrigationPlanning/ScheduleTab';
import AnalyticsTab from '../../components/IrrigationPlanning/AnalyticsTab';
import CropSettingsTab from '../../components/IrrigationPlanning/CropSettingsTab';

const IrrigationPlanning = () => {
  const [selectedLocation, setSelectedLocation] = useState({ 
    lat: 51.505, 
    lng: -0.09, 
    name: 'London' 
  });
  const [activeTab, setActiveTab] = useState('map');
  const { selectService } = useServiceMap();
  const navigate = useNavigate();
  
  // Set irrigation service when component mounts
  useEffect(() => {
    selectService('irrigation-planning');
  }, [selectService]);
  
  // Function to go to dashboard with current service selected
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="irrigation-planning-page">
      <BackButton />
      
      <div className="page-header mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Irrigation Planning</h1>
          <button 
            onClick={goToDashboard}
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            View on Dashboard
          </button>
        </div>
        <p className="text-gray-600">
          Plan efficient irrigation based on weather forecasts, soil conditions, and crop needs
        </p>
      </div>

      {/* Information Card - Only show if not on map tab to save space */}
      {activeTab !== 'map' && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 text-xl mt-1 mr-4" />
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-800">How Irrigation Planning Works</h2>
              <p className="text-gray-700 mb-4">
                Our system calculates irrigation needs by combining weather data, crop-specific water requirements, 
                soil conditions, and irrigation system efficiency to provide precise recommendations.
              </p>
              
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Components</h3>
              <ul className="list-disc pl-5 mb-4 text-gray-700">
                <li className="mb-1"><strong>Weather data:</strong> Temperature, humidity, wind speed, rainfall, and solar radiation</li>
                <li className="mb-1"><strong>Crop water needs:</strong> Different crops need different amounts of water during growth stages</li>
                <li className="mb-1"><strong>Soil conditions:</strong> Soil type affects how water is retained for plants</li>
                <li className="mb-1"><strong>System efficiency:</strong> Different irrigation systems deliver water with varying efficiency</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Benefits</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li className="mb-1">Reduce water waste by applying only what crops need</li>
                <li className="mb-1">Improve crop health by preventing both under and over-watering</li>
                <li className="mb-1">Save on water and energy costs</li>
                <li className="mb-1">Make data-driven decisions based on scientific calculations</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="page-tabs mb-4 border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('map')}
            className={`inline-flex items-center py-2 px-4 mr-4 
              ${activeTab === 'map' 
                ? 'text-green-800 border-b-2 border-green-700 font-medium' 
                : 'text-gray-500 hover:text-gray-700'}`}
            type="button"
          >
            <FaWater className="mr-2" />
            <span>Irrigation Map</span>
          </button>
          
          <button
            onClick={() => setActiveTab('schedule')}
            className={`inline-flex items-center py-2 px-4 mr-4 
              ${activeTab === 'schedule' 
                ? 'text-green-800 border-b-2 border-green-700 font-medium' 
                : 'text-gray-500 hover:text-gray-700'}`}
            type="button"
          >
            <FaCalendarAlt className="mr-2" />
            <span>Schedule</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex items-center py-2 px-4 mr-4 
              ${activeTab === 'analytics' 
                ? 'text-green-800 border-b-2 border-green-700 font-medium' 
                : 'text-gray-500 hover:text-gray-700'}`}
            type="button"
          >
            <FaChartLine className="mr-2" />
            <span>Analytics</span>
          </button>
          
          <button
            onClick={() => setActiveTab('crops')}
            className={`inline-flex items-center py-2 px-4 
              ${activeTab === 'crops' 
                ? 'text-green-800 border-b-2 border-green-700 font-medium' 
                : 'text-gray-500 hover:text-gray-700'}`}
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
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Irrigation Map</h3>
              <p className="text-gray-700">
                This map visualizes soil moisture levels and irrigation needs across your fields.
                Select different layers to view patterns that affect irrigation requirements.
              </p>
            </div>
            <div className="map-container" style={{ height: '600px' }}>
              <ServiceAwareMap />
            </div>
          </div>
        )}
        
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'crops' && <CropSettingsTab />}
      </div>
    </div>
  );
};

export default IrrigationPlanning;