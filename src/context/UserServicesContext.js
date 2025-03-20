import React, { createContext, useContext, useState, useEffect } from 'react';

// Default services configuration
const defaultServices = {
  'default': [
    { 
      id: 'weather-forecasting',
      name: 'Weather Forecasting', 
      route: '/services/weather-forecasting',
      icon: 'FaCloudSun',
      description: 'Accurate weather predictions for your farm'
    },
    { 
      id: 'irrigation-planning',
      name: 'Irrigation Planning', 
      route: '/services/irrigation-planning',
      icon: 'FaWater',
      description: 'Optimize water usage for your crops'
    }
  ],
  'california-farmer': [
    { 
      id: 'irrigation-planning',
      name: 'Irrigation Planning', 
      route: '/services/irrigation-planning',
      icon: 'FaWater',
      description: 'Optimize water usage for your crops'
    },
    { 
      id: 'california-pest',
      name: 'California Pest Management', 
      route: '/services/california-pest',
      icon: 'FaBug',
      description: 'California-specific pest monitoring and management'
    },
    { 
      id: 'crop-yield-prediction',
      name: 'Crop Yield Prediction', 
      route: '/services/crop-yield-prediction',
      icon: 'FaChartLine',
      description: 'Forecast your harvest potential'
    }
  ],
  'mena-farmer': [
    { 
      id: 'irrigation-planning',
      name: 'Irrigation Planning', 
      route: '/services/irrigation-planning',
      icon: 'FaWater',
      description: 'Optimize water usage for your crops'
    },
    { 
      id: 'mena-pest',
      name: 'MENA Pest Management', 
      route: '/services/mena-pest',
      icon: 'FaBug',
      description: 'Middle East/North Africa pest monitoring'
    },
    { 
      id: 'climate-analysis',
      name: 'Climate Analysis', 
      route: '/services/climate-analysis',
      icon: 'FaTemperatureHigh',
      description: 'Long-term climate trends and impacts'
    }
  ],
  'premium': [
    { 
      id: 'irrigation-planning',
      name: 'Irrigation Planning', 
      route: '/services/irrigation-planning',
      icon: 'FaWater',
      description: 'Optimize water usage for your crops'
    },
    { 
      id: 'crop-yield-prediction',
      name: 'Crop Yield Prediction', 
      route: '/services/crop-yield-prediction',
      icon: 'FaChartLine',
      description: 'Forecast your harvest potential'
    },
    { 
      id: 'climate-analysis',
      name: 'Climate Analysis', 
      route: '/services/climate-analysis',
      icon: 'FaTemperatureHigh',
      description: 'Long-term climate trends and impacts'
    },
    { 
      id: 'agricultural-insights',
      name: 'Agricultural Insights', 
      route: '/services/agricultural-insights',
      icon: 'FaLeaf',
      description: 'Expert farming recommendations'
    },
    { 
      id: 'pest-management',
      name: 'Pest Management', 
      route: '/services/pest-management',
      icon: 'FaBug',
      description: 'Identify and manage pest threats'
    }
  ]
};

// Create the context
const UserServicesContext = createContext();

// Context provider component
export const UserServicesProvider = ({ children }) => {
  const [userType, setUserType] = useState('default');
  const [availableServices, setAvailableServices] = useState(defaultServices['default']);
  
  // Get services based on user type
  useEffect(() => {
    // In a real app, this would come from an API or user profile
    setAvailableServices(defaultServices[userType] || defaultServices['default']);
  }, [userType]);
  
  // For testing/demo purposes
  const changeUserType = (type) => {
    if (defaultServices[type]) {
      setUserType(type);
    } else {
      console.error(`User type "${type}" not found`);
    }
  };
  
  return (
    <UserServicesContext.Provider value={{ 
      userType, 
      availableServices, 
      changeUserType,
      allUserTypes: Object.keys(defaultServices)
    }}>
      {children}
    </UserServicesContext.Provider>
  );
};

// Custom hook for using the context
export const useUserServices = () => {
  const context = useContext(UserServicesContext);
  if (!context) {
    throw new Error('useUserServices must be used within a UserServicesProvider');
  }
  return context;
};
