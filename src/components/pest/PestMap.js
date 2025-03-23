import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons for different risk levels
const riskIcons = {
  High: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Medium: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Low: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Component to update map view when location changes
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], 10, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, map]);
  
  return null;
};

/**
 * Component for displaying pest risks on a map
 */
const PestMap = ({ location, filteredPestRisks, loading }) => {
  const [mapReady, setMapReady] = useState(false);
  
  // Set map as ready after mounting to avoid server/client hydration issues
  useEffect(() => {
    setMapReady(true);
  }, []);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 mb-4 h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-gray-500">Loading pest risk data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 mb-4 relative">
      <div className="bg-green-50 px-4 py-2 border-b border-gray-200">
        <h3 className="text-green-800 font-medium">Pest Risk Map</h3>
        <p className="text-xs text-gray-500 mt-1">Displaying {filteredPestRisks.length} pest risks in your area</p>
      </div>
      
      {mapReady && location && (
        <div className="h-64">
          <MapContainer 
            center={[location.lat, location.lng]} 
            zoom={10} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <ChangeView center={location} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Main location marker */}
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                <div className="text-center">
                  <div className="font-medium">{location.name}</div>
                  <div className="text-xs text-gray-500">{location.country}</div>
                </div>
              </Popup>
            </Marker>
            
            {/* Pest risk markers */}
            {filteredPestRisks.map((pest, index) => (
              pest.location && (
                <Marker 
                  key={index} 
                  position={[pest.location.lat, pest.location.lng]}
                  icon={riskIcons[pest.riskLevel]}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-medium">{pest.name}</div>
                      <div className={`text-xs mt-1 ${
                        pest.riskLevel === 'High' ? 'text-red-600' : 
                        pest.riskLevel === 'Medium' ? 'text-orange-600' : 
                        'text-green-600'
                      }`}>
                        {pest.riskLevel} Risk
                      </div>
                      <div className="mt-1 text-gray-600">
                        {pest.riskFactors && pest.riskFactors.length > 0 && (
                          <div className="text-xs">
                            <span className="font-medium">Risk Factors:</span> {pest.riskFactors.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-2 rounded-md shadow-sm border border-gray-200 text-xs">
        <div className="flex items-center mb-1">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
          <span>High Risk</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="h-3 w-3 rounded-full bg-orange-500 mr-1"></div>
          <span>Medium Risk</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
          <span>Low Risk</span>
        </div>
      </div>
    </div>
  );
};

export default PestMap;