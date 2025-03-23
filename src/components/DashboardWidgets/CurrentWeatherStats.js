import React from 'react';

const CurrentWeatherStats = ({ weatherData }) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-2 mb-4 flex justify-between">
      <div className="flex items-center">
        <div className="text-3xl font-bold text-gray-800 mr-3">{weatherData.temp}°F</div>
        <div className="text-xs text-gray-600">
          <div>Feels like</div>
          <div className="font-semibold">{weatherData.feelsLike}°F</div>
        </div>
      </div>
      
      <div className="flex space-x-6">
        <div className="text-xs">
          <div className="text-gray-500">Wind</div>
          <div className="font-semibold">{weatherData.windSpeed} mph</div>
        </div>
        <div className="text-xs">
          <div className="text-gray-500">Humidity</div>
          <div className="font-semibold">{weatherData.humidity}%</div>
        </div>
        <div className="text-xs">
          <div className="text-gray-500">Precipitation</div>
          <div className="font-semibold">{weatherData.precipitation}"</div>
        </div>
        <div className="text-xs">
          <div className="text-gray-500">Pressure</div>
          <div className="font-semibold">{weatherData.pressure} hPa</div>
        </div>
        <div className="text-xs">
          <div className="text-gray-500">Clouds</div>
          <div className="font-semibold">{weatherData.clouds}%</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherStats;