import React from 'react';
import { FaTools, FaLayerGroup } from 'react-icons/fa';

const ServicesQuickAccess = ({ toggleServicesOverlay }) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-3 py-1.5 border-b">
        <h2 className="font-semibold text-gray-700 text-sm flex items-center">
          <FaTools className="mr-1.5 text-green-600 h-3 w-3" /> Available Services
        </h2>
      </div>
      <div className="p-2">
        <button 
          onClick={toggleServicesOverlay}
          className="w-full bg-accent text-white p-2 rounded-md text-sm mb-2 flex items-center justify-center"
        >
          <FaLayerGroup className="mr-2" /> View All Services
        </button>
        <div className="text-xs text-gray-600">
          Access specialized agricultural services based on current location and conditions.
        </div>
      </div>
    </div>
  );
};

export default ServicesQuickAccess;