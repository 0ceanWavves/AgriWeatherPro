import React from 'react';
import { FaSeedling } from 'react-icons/fa';

const CropCalendarPanel = ({ crops = [] }) => {
  // Default crops if none provided
  const defaultCrops = [
    { name: 'Almonds', status: 'Harvest', color: 'green' },
    { name: 'Grapes', status: 'Growing', color: 'yellow' },
    { name: 'Tomatoes', status: 'Growing', color: 'yellow' },
    { name: 'Lettuce', status: 'Planting', color: 'blue' }
  ];

  const cropsToDisplay = crops.length > 0 ? crops : defaultCrops;

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-3 py-1.5 border-b">
        <h2 className="font-semibold text-gray-700 text-sm flex items-center">
          <FaSeedling className="mr-1.5 text-green-600 h-3 w-3" /> Crop Calendar
        </h2>
      </div>
      <div className="p-0">
        {cropsToDisplay.map((crop, index) => (
          <div 
            key={index} 
            className={`flex justify-between items-center px-3 py-1.5 text-xs ${
              index < cropsToDisplay.length - 1 ? 'border-b' : ''
            }`}
          >
            <span className="font-medium">{crop.name}</span>
            <span className={`px-1.5 py-0.5 bg-${crop.color}-100 text-${crop.color}-800 rounded-full text-[10px]`}>
              {crop.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropCalendarPanel;