import React from 'react';
import ServiceAwareMap from './ServiceAwareMap';
import WeatherMapControls from './WeatherMapControls';
import WeatherMapLegend from './WeatherMapLegend';
import ServicesOverlay from './ServicesOverlay';

const WeatherMapContainer = ({ 
  location, 
  activeMapLayer, 
  handleLayerChange, 
  showServicesOverlay,
  toggleServicesOverlay,
  availableServices
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden relative">
      <WeatherMapControls 
        locationName={location.name}
        activeLayer={activeMapLayer}
        onLayerChange={handleLayerChange}
        showServicesOverlay={showServicesOverlay}
        toggleServicesOverlay={toggleServicesOverlay}
      />
      
      <div className="h-[600px] relative">
        <ServiceAwareMap selectedLayer={activeMapLayer} location={location} />
        
        <ServicesOverlay 
          isVisible={showServicesOverlay}
          onClose={toggleServicesOverlay}
          locationName={location.name}
          services={availableServices}
        />
      </div>
      
      <WeatherMapLegend />
    </div>
  );
};

export default WeatherMapContainer;