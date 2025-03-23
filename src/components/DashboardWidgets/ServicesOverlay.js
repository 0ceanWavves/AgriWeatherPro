import React from 'react';
import { Link } from 'react-router-dom';
import { FaLayerGroup } from 'react-icons/fa';

const ServicesOverlay = ({ isVisible, onClose, locationName, services }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 overflow-y-auto services-overlay">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90%] overflow-y-auto">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center">
            <FaLayerGroup className="mr-2 text-accent" /> Services for {locationName}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            The following agricultural services are available for this location based on current weather patterns, crop types, and historical data.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 services-grid">
            {services.map(service => (
              <div key={service.id} className="border rounded-md overflow-hidden hover:shadow-md transition-shadow service-card">
                <div className="flex items-center bg-gray-50 p-3">
                  <span className="mr-2">{service.icon}</span>
                  <h4 className="font-medium">{service.name}</h4>
                  <span className={`ml-auto px-2 py-0.5 text-xs rounded-full service-relevance-tag ${
                    service.relevance === 'High' ? 'bg-green-100 text-green-800' :
                    service.relevance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {service.relevance} Relevance
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <Link
                    to={service.url}
                    className="block w-full bg-primary text-white text-center py-1.5 rounded-md hover:bg-primary-dark transition-colors text-sm"
                  >
                    Access {service.name}
                  </Link>
                  
                  {service.subServices && service.subServices.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-gray-500 mb-1">Specialized Services:</p>
                      {service.subServices.map((subService, idx) => (
                        <Link
                          key={idx}
                          to={subService.url}
                          className="block w-full bg-white border border-primary text-primary text-center py-1 rounded-md hover:bg-primary/5 transition-colors text-xs mt-1"
                        >
                          {subService.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Link
              to="/services"
              className="inline-block bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors"
            >
              View All Agricultural Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesOverlay;