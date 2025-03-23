import React from 'react';

const WeatherMapLegend = () => {
  return (
    <div className="flex justify-between px-3 py-1 bg-gray-50 border-t text-xs text-gray-500">
      <div>Current weather conditions and forecasts.</div>
      <div className="flex items-center">
        <div className="temperature-key flex items-center mr-4">
          <span className="text-xs mr-1">Temperature (°F):</span>
          <div className="w-24 h-2 rounded" style={{ background: 'linear-gradient(to right, #0000FF, #00FF00, #FFFF00, #FF0000)' }}></div>
          <span className="text-xs ml-1">Cold → Hot</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherMapLegend;