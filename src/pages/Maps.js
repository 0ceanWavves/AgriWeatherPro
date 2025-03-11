import React from 'react';
import WeatherMap from '../components/WeatherMap';

const Maps = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Weather Maps</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Interactive weather maps providing visual insights into current conditions, precipitation patterns, temperature gradients, and more. Perfect for planning field operations and monitoring weather patterns.
          </p>
        </div>
        
        <WeatherMap />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-primary/5">
            <h3 className="text-xl font-semibold mb-4">Map Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Interactive layers for temperature, precipitation, wind speed, and more</li>
              <li>Real-time updates for current conditions</li>
              <li>Customizable view options for different agricultural needs</li>
              <li>Zoom capabilities for regional or local views</li>
              <li>Mobile-friendly design for on-the-go access</li>
            </ul>
          </div>
          
          <div className="card bg-primary/5">
            <h3 className="text-xl font-semibold mb-4">Agricultural Applications</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Plan irrigation schedules based on precipitation forecasts</li>
              <li>Monitor temperature patterns to predict frost risk</li>
              <li>Track wind conditions for optimal spraying times</li>
              <li>Assess regional weather patterns for long-term planning</li>
              <li>Monitor soil moisture conditions through precipitation history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;