import React, { createContext, useContext, useState, useEffect } from 'react';

// Define map layer types for different services
const serviceMapLayers = {
  // Default weather layers
  'weather-forecasting': [
    { name: 'Temperature', id: 'temp_new' },
    { name: 'Precipitation', id: 'precipitation_new' },
    { name: 'Wind Speed', id: 'wind_new' },
    { name: 'Clouds', id: 'clouds_new' },
    { name: 'Pressure', id: 'pressure_new' }
  ],
  
  // California pest layers
  'california-pest': [
    { name: 'Almond Pests', id: 'almond_pests' },
    { name: 'Grape Pests', id: 'grape_pests' },
    { name: 'Tomato Pests', id: 'tomato_pests' },
    { name: 'Lettuce Pests', id: 'lettuce_pests' },
    { name: 'Strawberry Pests', id: 'strawberry_pests' }
  ],
  
  // MENA region pest layers
  'mena-pest': [
    { name: 'Date Palm Pests', id: 'date_palm_pests' },
    { name: 'Red Palm Weevil', id: 'red_palm_weevil' },
    { name: 'Dubas Bug', id: 'dubas_bug' },
    { name: 'Date Palm Scale', id: 'date_palm_scale' },
    { name: 'Spider Mites', id: 'spider_mites' }
  ],
  
  // Irrigation planning layers
  'irrigation-planning': [
    { name: 'Soil Moisture', id: 'soil_moisture' },
    { name: 'Irrigation Needs', id: 'irrigation_needs' },
    { name: 'Precipitation Forecast', id: 'precipitation_forecast' },
    { name: 'Evapotranspiration', id: 'evapotranspiration' }
  ],
  
  // Climate analysis layers
  'climate-analysis': [
    { name: 'Temperature Trends', id: 'temperature_trends' },
    { name: 'Precipitation Trends', id: 'precipitation_trends' },
    { name: 'Drought Index', id: 'drought_index' },
    { name: 'Climate Zones', id: 'climate_zones' }
  ],
  
  // Crop yield prediction layers
  'crop-yield-prediction': [
    { name: 'Yield Potential', id: 'yield_potential' },
    { name: 'Crop Health', id: 'crop_health' },
    { name: 'Growth Stage', id: 'growth_stage' },
    { name: 'Historical Yield', id: 'historical_yield' }
  ]
};

// Create the context
const ServiceMapContext = createContext();

// Context provider component
export const ServiceMapProvider = ({ children }) => {
  const [selectedService, setSelectedService] = useState('weather-forecasting');
  const [activeLayers, setActiveLayers] = useState(serviceMapLayers['weather-forecasting']);
  const [selectedLayer, setSelectedLayer] = useState(serviceMapLayers['weather-forecasting'][0]?.id || null);
  
  // Update available layers when service changes
  useEffect(() => {
    if (serviceMapLayers[selectedService]) {
      setActiveLayers(serviceMapLayers[selectedService]);
      // Set first layer as default when changing services
      setSelectedLayer(serviceMapLayers[selectedService][0]?.id || null);
    } else {
      console.warn(`No map layers found for service: ${selectedService}`);
      // Default to weather layers if service not found
      setActiveLayers(serviceMapLayers['weather-forecasting']);
      setSelectedLayer(serviceMapLayers['weather-forecasting'][0]?.id || null);
    }
  }, [selectedService]);
  
  // Function to select a service
  const selectService = (serviceId) => {
    if (serviceMapLayers[serviceId] || serviceId === null) {
      setSelectedService(serviceId);
    } else {
      console.warn(`Invalid service ID: ${serviceId}`);
    }
  };
  
  // Function to select a specific layer
  const selectLayer = (layerId) => {
    if (activeLayers.some(layer => layer.id === layerId)) {
      setSelectedLayer(layerId);
    } else {
      console.warn(`Layer ${layerId} not available in current service`);
    }
  };
  
  return (
    <ServiceMapContext.Provider value={{ 
      selectedService,
      activeLayers,
      selectedLayer,
      selectService,
      selectLayer,
      allServiceLayers: serviceMapLayers
    }}>
      {children}
    </ServiceMapContext.Provider>
  );
};

// Custom hook for using the context
export const useServiceMap = () => {
  const context = useContext(ServiceMapContext);
  if (!context) {
    throw new Error('useServiceMap must be used within a ServiceMapProvider');
  }
  return context;
};
