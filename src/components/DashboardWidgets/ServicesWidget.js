import React from 'react';
import { Link } from 'react-router-dom';
import { FaBug, FaWater, FaLeaf, FaCloudSun } from 'react-icons/fa';

const ServicesWidget = () => {
  // Popular/featured services to display
  const featuredServices = [
    {
      id: 'pest-management',
      icon: <FaBug className="text-xl text-green-600" />,
      title: 'Pest Management',
      description: 'Monitor and manage pest risks based on current conditions.',
      path: '/services/pest-management',
      color: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'irrigation-planning',
      icon: <FaWater className="text-xl text-blue-600" />,
      title: 'Irrigation Planning',
      description: 'Optimize water usage with data-driven scheduling.',
      path: '/services/irrigation-planning',
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'crop-yields',
      icon: <FaLeaf className="text-xl text-yellow-600" />,
      title: 'Crop Yields',
      description: 'Predict yields based on weather and field conditions.',
      path: '/crop-yields',
      color: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      hoverColor: 'hover:bg-yellow-100'
    },
    {
      id: 'forecast',
      icon: <FaCloudSun className="text-xl text-purple-600" />,
      title: 'Weather Forecast',
      description: 'View detailed field-level weather forecasts.',
      path: '/forecast',
      color: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Available Services</h2>
      </div>
      
      <div className="space-y-3 mb-3">
        {featuredServices.map(service => (
          <Link 
            key={service.id}
            to={service.path}
            className={`block p-3 rounded-lg border ${service.borderColor} bg-gradient-to-r ${service.color} ${service.hoverColor} transition-colors`}
          >
            <div className="flex items-center">
              <div className="mr-3">
                {service.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{service.title}</h3>
                <p className="text-xs text-gray-600">{service.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <Link 
        to="/all-services"
        className="block w-full bg-primary text-white text-center py-2 px-4 rounded font-medium hover:bg-primary/90 transition-colors"
      >
        View All Services
      </Link>
      
      <div className="mt-3 text-center text-xs text-gray-500">
        Access specialized agricultural services based on current location and conditions
      </div>
    </div>
  );
};

export default ServicesWidget;