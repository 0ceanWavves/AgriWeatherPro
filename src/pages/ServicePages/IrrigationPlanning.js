import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceMap } from '../../context/ServiceMapContext';
import BackButton from '../../components/BackButton';
import IrrigationDashboard from '../../components/IrrigationPlanning/IrrigationDashboard';
import ServiceAwareMap from '../../components/DashboardWidgets/ServiceAwareMap';
import { FaWater, FaTint, FaChartLine, FaCalendarAlt, FaSeedling, FaInfoCircle } from 'react-icons/fa';

const IrrigationPlanning = () => {
  const [selectedLocation, setSelectedLocation] = useState({ 
    lat: 51.505, 
    lng: -0.09, 
    name: 'London' 
  });
  const [activeTab, setActiveTab] = useState('dashboard');
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

      <div className="page-tabs mb-4 border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center py-2 px-4 mr-4 
              ${activeTab === 'dashboard' 
                ? 'text-green-800 border-b-2 border-green-700 font-medium' 
                : 'text-gray-500 hover:text-gray-700'}`}
            type="button"
          >
            <FaChartLine className="mr-2" />
            <span>Advanced Dashboard</span>
          </button>
          
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
            onClick={() => setActiveTab('info')}
            className={`inline-flex items-center py-2 px-4 
              ${activeTab === 'info' 
                ? 'text-green-800 border-b-2 border-green-700 font-medium' 
                : 'text-gray-500 hover:text-gray-700'}`}
            type="button"
          >
            <FaInfoCircle className="mr-2" />
            <span>About Irrigation Planning</span>
          </button>
        </nav>
      </div>

      <div className="tab-content">
        {activeTab === 'dashboard' && (
          <IrrigationDashboard />
        )}
        
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
        
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start">
              <FaInfoCircle className="text-blue-500 text-xl mt-1 mr-4" />
              <div>
                <h2 className="text-xl font-bold mb-3 text-gray-800">How Advanced Irrigation Planning Works</h2>
                <p className="text-gray-700 mb-4">
                  Our system calculates irrigation needs by combining weather data, crop-specific water requirements, 
                  soil moisture monitoring, and evapotranspiration models to provide precise recommendations.
                </p>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Components</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li className="mb-1"><strong>Evapotranspiration modeling:</strong> Uses the FAO Penman-Monteith equation to calculate crop water needs</li>
                  <li className="mb-1"><strong>Multi-layer soil moisture analysis:</strong> Monitors water content at different soil depths</li>
                  <li className="mb-1"><strong>Weather integration:</strong> Temperature, humidity, wind speed, rainfall, and solar radiation</li>
                  <li className="mb-1"><strong>Crop-specific water needs:</strong> Different crops need different amounts of water during growth stages</li>
                  <li className="mb-1"><strong>System efficiency calculations:</strong> Different irrigation systems deliver water with varying efficiency</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Scientific Basis</h3>
                <p className="text-gray-700 mb-4">
                  Our irrigation system is based on extensive agricultural research and validated soil-water-plant models.
                  It incorporates principles from the following scientific domains:
                </p>
                
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li className="mb-1"><strong>Soil physics:</strong> Van Genuchten equations for soil water retention</li>
                  <li className="mb-1"><strong>Agrometeorology:</strong> Weather impact on crop water demands</li>
                  <li className="mb-1"><strong>Plant physiology:</strong> Growth stage-specific water requirements</li>
                  <li className="mb-1"><strong>Irrigation science:</strong> Efficiency and application methods</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Benefits</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  <li className="mb-1">Reduce water waste by 15-30% compared to conventional scheduling</li>
                  <li className="mb-1">Improve crop health and potentially increase yields by 5-8%</li>
                  <li className="mb-1">Save on water, energy, and labor costs</li>
                  <li className="mb-1">Make data-driven decisions based on scientific calculations</li>
                  <li className="mb-1">Environmental sustainability through optimized water resource management</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IrrigationPlanning;