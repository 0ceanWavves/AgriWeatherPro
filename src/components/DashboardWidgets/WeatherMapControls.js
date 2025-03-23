import React from 'react';
import { FaTools } from 'react-icons/fa';

const WeatherMapControls = ({ 
  locationName, 
  activeLayer, 
  onLayerChange, 
  showServicesOverlay, 
  toggleServicesOverlay 
}) => {
  return (
    <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 border-b">
      <h2 className="font-semibold text-gray-700 text-sm">Weather Map • {locationName}</h2>
      <div className="flex space-x-1">
        <button 
          className={`px-2 py-0.5 text-xs rounded ${activeLayer === 'Temperature' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => onLayerChange('Temperature')}
        >
          Temperature
        </button>
        <button 
          className={`px-2 py-0.5 text-xs rounded ${activeLayer === 'Precipitation' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => onLayerChange('Precipitation')}
        >
          Precipitation
        </button>
        <button 
          className={`px-2 py-0.5 text-xs rounded ${activeLayer === 'Wind' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => onLayerChange('Wind')}
        >
          Wind Speed
        </button>
        <button 
          className={`px-2 py-0.5 text-xs rounded ${activeLayer === 'Clouds' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => onLayerChange('Clouds')}
        >
          Clouds
        </button>
        <button 
          className={`px-2 py-0.5 text-xs rounded ${activeLayer === 'Pressure' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => onLayerChange('Pressure')}
        >
          Pressure
        </button>
        <button 
          className={`px-2 py-0.5 text-xs rounded ml-2 ${showServicesOverlay ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={toggleServicesOverlay}
        >
          <FaTools className="inline mr-1" /> Services
        </button>
      </div>
    </div>
  );
};

export default WeatherMapControls;