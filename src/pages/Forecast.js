import React, { useState, useEffect } from 'react';
import WeatherForecast from '../components/WeatherForecast';
import { FaCloudSun, FaChartLine, FaMapMarkedAlt } from 'react-icons/fa';

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Weather Forecast</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Get accurate, detailed weather forecasts specific to your agricultural needs. Plan your field operations, irrigation, and harvesting with confidence.
          </p>
        </div>
        
        <WeatherForecast initialLocation={userLocation} />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-primary/5">
            <div className="flex items-center mb-3">
              <FaCloudSun className="text-xl text-primary mr-2" />
              <h3 className="text-xl font-semibold">Agricultural Forecasts</h3>
            </div>
            <p>
              Our weather forecasts are specifically calibrated for agricultural applications, taking into account factors that matter most to farmers.
            </p>
          </div>
          
          <div className="card bg-primary/5">
            <div className="flex items-center mb-3">
              <FaChartLine className="text-xl text-primary mr-2" />
              <h3 className="text-xl font-semibold">Plan Ahead</h3>
            </div>
            <p>
              With up to 7-day forecasts, you can schedule field operations, irrigation, and harvesting to optimize productivity and minimize weather-related risks.
            </p>
          </div>
          
          <div className="card bg-primary/5">
            <div className="flex items-center mb-3">
              <FaMapMarkedAlt className="text-xl text-primary mr-2" />
              <h3 className="text-xl font-semibold">Localized Predictions</h3>
            </div>
            <p>
              Our forecasts are highly localized, providing accurate predictions for your specific fields, not just the nearest city or region.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;