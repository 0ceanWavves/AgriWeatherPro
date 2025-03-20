import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCloudSun, 
  FaChartLine, 
  FaTemperatureHigh, 
  FaLeaf, 
  FaBug, 
  FaWater 
} from 'react-icons/fa';
import { useServiceMap } from '../../context/ServiceMapContext';

const ServicesMenu = ({ className, onSelectService }) => {
  const { selectService, selectedService } = useServiceMap();
  
  // Define services with their corresponding routes, icons, and IDs
  const services = [
    { 
      id: 'weather-forecasting',
      name: 'Weather Forecasting', 
      route: '/services/weather-forecasting',
      icon: <FaCloudSun className="text-yellow-400" />,
      description: 'Accurate weather predictions for your farm'
    },
    { 
      id: 'crop-yield-prediction',
      name: 'Crop Yield Prediction', 
      route: '/services/crop-yield-prediction',
      icon: <FaChartLine className="text-green-400" />,
      description: 'Forecast your harvest potential'
    },
    { 
      id: 'climate-analysis',
      name: 'Climate Analysis', 
      route: '/services/climate-analysis',
      icon: <FaTemperatureHigh className="text-red-400" />,
      description: 'Long-term climate trends and impacts'
    },
    { 
      id: 'agricultural-insights',
      name: 'Agricultural Insights', 
      route: '/services/agricultural-insights',
      icon: <FaLeaf className="text-green-300" />,
      description: 'Expert farming recommendations'
    },
    { 
      id: 'pest-management',
      name: 'Pest Management', 
      route: '/services/pest-management',
      icon: <FaBug className="text-amber-400" />,
      description: 'Identify and manage pest threats',
      submenu: [
        {
          id: 'california-pest',
          name: 'California Pests',
          route: '/services/california-pest',
          description: 'Pest management for California crops'
        },
        {
          id: 'mena-pest',
          name: 'MENA Date Palm Pests',
          route: '/services/mena-pest',
          description: 'Pest management for date palm cultivation'
        }
      ]
    },
    { 
      id: 'irrigation-planning',
      name: 'Irrigation Planning', 
      route: '/services/irrigation-planning',
      icon: <FaWater className="text-blue-400" />,
      description: 'Optimize water usage for your crops'
    }
  ];

  const handleServiceClick = (serviceId) => {
    // Update selected service in context
    selectService(serviceId);
    
    // Call additional callback if provided
    if (onSelectService && typeof onSelectService === 'function') {
      onSelectService(serviceId);
    }
  };

  return (
    <div className={`services-menu ${className || ''}`}>
      <h3 className="text-lg font-medium mb-4">Agricultural Services</h3>
      <ul className="space-y-1">
        {services.map((service) => (
          <li key={service.id} className="group">
            <Link 
              to={service.route} 
              className={`flex items-start p-2 rounded transition-colors ${
                selectedService === service.id ? 'bg-green-700 text-white' : 'text-gray-200 hover:bg-green-700 hover:text-white'
              }`}
              onClick={() => handleServiceClick(service.id)}
            >
              <div className="mt-0.5 mr-3">
                {service.icon}
              </div>
              <div>
                <span className="font-medium block">
                  {service.name}
                </span>
                <span className="text-xs opacity-80">
                  {service.description}
                </span>
              </div>
            </Link>
            
            {/* Submenu for services with nested options (like pest management) */}
            {service.submenu && service.submenu.length > 0 && (
              <ul className="pl-6 mt-1 space-y-1">
                {service.submenu.map((subitem) => (
                  <li key={subitem.id}>
                    <Link
                      to={subitem.route}
                      className={`block p-2 rounded text-sm transition-colors ${
                        selectedService === subitem.id ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-green-700 hover:text-white'
                      }`}
                      onClick={() => handleServiceClick(subitem.id)}
                    >
                      {subitem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesMenu;