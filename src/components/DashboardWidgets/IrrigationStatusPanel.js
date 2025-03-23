import React from 'react';
import { FaWater } from 'react-icons/fa';

const IrrigationStatusPanel = ({ soilMoisturePercent = 65, daysUntilIrrigation = 2 }) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-3 py-1.5 border-b">
        <h2 className="font-semibold text-gray-700 text-sm flex items-center">
          <FaWater className="mr-1.5 text-green-600 h-3 w-3" /> Irrigation Status
        </h2>
      </div>
      <div className="p-2">
        <div className="mb-1">
          <div className="flex justify-between text-xs mb-1">
            <span>Soil Moisture</span>
            <span>{soilMoisturePercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${soilMoisturePercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>Dry</span>
            <span>Optimal</span>
            <span>Wet</span>
          </div>
        </div>
        <div className="text-xs text-gray-700">
          Next irrigation recommended in {daysUntilIrrigation} days.
        </div>
      </div>
    </div>
  );
};

export default IrrigationStatusPanel;