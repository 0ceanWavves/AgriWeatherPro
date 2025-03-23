import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const WeatherForecastPanel = ({ forecastData }) => {
  // Get condition icon
  const getConditionIcon = (condition) => {
    switch(condition) {
      case 'sunny': return '☀️';
      case 'partly-cloudy': return '⛅';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      default: return '☀️';
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-3 py-1.5 border-b">
        <h2 className="font-semibold text-gray-700 text-sm flex items-center">
          <FaCalendarAlt className="mr-1.5 text-green-600 h-3 w-3" /> 7-Day Forecast
        </h2>
      </div>
      <div className="p-0">
        {forecastData.map((day, index) => (
          <div key={index} className="flex justify-between items-center px-3 py-1.5 border-b last:border-b-0 text-xs">
            <div className="font-medium">{day.day}</div>
            <div className="flex items-center">
              <span className="mr-1">{day.temp}°F</span>
              <span>{getConditionIcon(day.condition)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecastPanel;