import React, { useState, useEffect } from 'react';
import WeatherForecast from '../components/WeatherForecast';
import { FaCloudSun, FaChartLine, FaMapMarkedAlt } from 'react-icons/fa';
import '../styles/weather-forecast.css';

const Forecast = () => {
  const [userLocation, setUserLocation] = useState(null);

  // Request user location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding to get location name
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=deeaa95f4b7b2543dc8c3d9cb96396c6`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
              setUserLocation({
                name: data[0].name,
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                country: data[0].country
              });
            }
          } catch (error) {
            console.error('Error getting location name:', error);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  return (
    <div className="forecast-page">
      <div className="container mx-auto px-4 py-6">
        <WeatherForecast initialLocation={userLocation} />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="feature-card bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6 border-t-4 border-green-600 transform transition-transform hover:scale-105">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 flex items-center justify-center bg-green-600 text-white rounded-full mr-4">
                <FaCloudSun className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-800">Agricultural Forecasts</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our weather forecasts are specifically calibrated for agricultural applications, taking into account factors that matter most to farmers.
            </p>
          </div>
          
          <div className="feature-card bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6 border-t-4 border-blue-600 transform transition-transform hover:scale-105">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full mr-4">
                <FaChartLine className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800">Plan Ahead</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              With up to 7-day forecasts, you can schedule field operations, irrigation, and harvesting to optimize productivity and minimize weather-related risks.
            </p>
          </div>
          
          <div className="feature-card bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6 border-t-4 border-green-600 transform transition-transform hover:scale-105">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 flex items-center justify-center bg-green-600 text-white rounded-full mr-4">
                <FaMapMarkedAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-800">Localized Predictions</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our forecasts are highly localized, providing accurate predictions for your specific fields, not just the nearest city or region.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;