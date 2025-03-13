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

const ServicesMenu = ({ className, onSelectService }) => {
  // Define services with their corresponding routes and icons
  const services = [
    { 
      name: 'Weather Forecasting', 
      route: '/services/weather-forecasting',
      icon: <FaCloudSun className="text-yellow-400" />,
      description: 'Accurate weather predictions for your farm'
    },
    { 
      name: 'Crop Yield Prediction', 
      route: '/services/crop-yield-prediction',
      icon: <FaChartLine className="text-green-400" />,
      description: 'Forecast your harvest potential'
    },
    { 
      name: 'Climate Analysis', 
      route: '/services/climate-analysis',
      icon: <FaTemperatureHigh className="text-red-400" />,
      description: 'Long-term climate trends and impacts'
    },
    { 
      name: 'Agricultural Insights', 
      route: '/services/agricultural-insights',
      icon: <FaLeaf className="text-green-300" />,
      description: 'Expert farming recommendations'
    },
    { 
      name: 'Pest Management', 
      route: '/services/pest-management',
      icon: <FaBug className="text-amber-400" />,
      description: 'Identify and manage pest threats'
    },
    { 
      name: 'Irrigation Planning', 
      route: '/services/irrigation-planning',
      icon: <FaWater className="text-blue-400" />,
      description: 'Optimize water usage for your crops'
    }
  ];

  const handleServiceClick = () => {
    if (onSelectService && typeof onSelectService === 'function') {
      onSelectService();
    }
  };

  return (
    <div className={`services-menu ${className || ''}`}>
      <h3 className="text-green-200 font-semibold mb-3 border-b border-green-700 pb-2">Agricultural Services</h3>
      <ul className="space-y-2">
        {services.map((service, index) => (
          <li key={index} className="group">
            <Link 
              to={service.route} 
              className="flex items-start p-2 rounded-md hover:bg-green-800 transition-colors"
              onClick={handleServiceClick}
            >
              <div className="mt-0.5 mr-3">
                {service.icon}
              </div>
              <div>
                <span className="text-white group-hover:text-green-200 transition-colors font-medium block">
                  {service.name}
                </span>
                <span className="text-green-300 text-xs">
                  {service.description}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesMenu;