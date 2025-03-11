import React from 'react';
import WeatherForecast from '../components/WeatherForecast';
import { FaCloudSun, FaChartLine, FaMapMarkedAlt } from 'react-icons/fa';

const Forecast = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Weather Forecast</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Get accurate, detailed weather forecasts specific to your agricultural needs. Plan your field operations, irrigation, and harvesting with confidence.
          </p>
        </div>
        
        <WeatherForecast />
        
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