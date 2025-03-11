import React from 'react';
import { Link } from 'react-router-dom';

const ServicesMenu = ({ className, onSelectService }) => {
  // Define services with their corresponding routes
  const services = [
    { name: 'Weather Forecasting', route: '/services/weather-forecasting' },
    { name: 'Crop Yield Prediction', route: '/services/crop-yield-prediction' },
    { name: 'Climate Analysis', route: '/services/climate-analysis' },
    { name: 'Agricultural Insights', route: '/services/agricultural-insights' },
    { name: 'Pest Management', route: '/services/pest-management' },
    { name: 'Irrigation Planning', route: '/services/irrigation-planning' }
  ];

  const handleServiceClick = () => {
    if (onSelectService && typeof onSelectService === 'function') {
      onSelectService();
    }
  };

  return (
    <div className={`services-menu ${className || ''}`}>
      <h3 className="text-white font-semibold mb-3">Services</h3>
      <ul className="space-y-2">
        {services.map((service, index) => (
          <li key={index}>
            <Link 
              to={service.route} 
              className="text-white hover:text-accent transition-colors"
              onClick={handleServiceClick}
            >
              {service.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesMenu;