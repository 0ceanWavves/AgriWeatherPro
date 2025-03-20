import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCloudSun, 
  FaChartLine, 
  FaTemperatureHigh, 
  FaLeaf, 
  FaBug, 
  FaWater,
  FaCog
} from 'react-icons/fa';
import { useUserServices } from '../../context/UserServicesContext';

// Map of icon names to actual icon components
const iconMap = {
  FaCloudSun,
  FaChartLine,
  FaTemperatureHigh,
  FaLeaf,
  FaBug,
  FaWater,
  FaCog
};

const ServicesPanel = () => {
  const navigate = useNavigate();
  const { availableServices, userType, changeUserType, allUserTypes } = useUserServices();

  // Handle service card click
  const handleServiceClick = (route) => {
    navigate(route);
  };

  // Render the icon for a service
  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || FaCog;
    return <IconComponent size={24} />;
  };

  return (
    <div className="services-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Services</h2>
        
        {/* User type selector for demo purposes */}
        <div className="flex items-center">
          <label htmlFor="userType" className="mr-2 text-sm text-gray-600 dark:text-gray-300">
            User Profile:
          </label>
          <select
            id="userType"
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
            value={userType}
            onChange={(e) => changeUserType(e.target.value)}
          >
            {allUserTypes.map(type => (
              <option key={type} value={type}>
                {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableServices.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleServiceClick(service.route)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4 mt-1 w-10 h-10 flex items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300">
                {renderIcon(service.icon)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  {service.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPanel;
