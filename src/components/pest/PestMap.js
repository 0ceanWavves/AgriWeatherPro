import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Map center updater component
function MapCenterUpdater({ center }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Custom pest icon using Font Awesome with risk level colors
const createPestIcon = (riskLevel) => {
  const color = riskLevel === 'High' ? '#dc2626' : riskLevel === 'Medium' ? '#d97706' : '#059669';
  return L.divIcon({
    html: `<i class="fa fa-bug" style="font-size: 24px; color: ${color};"></i>`,
    className: 'bg-transparent',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const PestMap = ({ location, filteredPestRisks, loading }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 md:mb-6">
      <h2 className="text-base md:text-xl font-semibold text-green-800 p-3 md:p-4 border-b border-gray-200 flex justify-between items-center flex-wrap">
        <span className="mr-2">
          Pest Risk Map: {location.name}, {location.country}
        </span>
        <span className="text-xs md:text-sm font-normal text-gray-500">
          {filteredPestRisks.length} {filteredPestRisks.length === 1 ? 'pest' : 'pests'} displayed
        </span>
      </h2>
      <div className="h-80 md:h-96">
        {!loading ? (
          <MapContainer 
            center={[location.lat, location.lng]} 
            zoom={12} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Update map center when location changes */}
            <MapCenterUpdater center={[location.lat, location.lng]} />
            
            {/* User location marker */}
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                {location.name}, {location.country}
              </Popup>
            </Marker>
            
            {/* Pest risk markers */}
            {filteredPestRisks.map((pest, index) => (
              <Marker 
                key={index}
                position={[pest.location.lat, pest.location.lng]}
                icon={createPestIcon(pest.riskLevel)}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-bold">{pest.name}</h3>
                    <p className="text-xs italic text-gray-600">{pest.scientificName}</p>
                    <p className={`font-semibold ${
                      pest.riskLevel === 'High' ? 'text-red-600' : 
                      pest.riskLevel === 'Medium' ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      Risk Level: {pest.riskLevel}
                    </p>
                    <div className="mt-1">
                      <p className="font-semibold text-xs">Risk Factors:</p>
                      <ul className="text-xs list-disc list-inside">
                        {pest.riskFactors.slice(0, 2).map((factor, i) => (
                          <li key={i}>{factor}</li>
                        ))}
                        {pest.riskFactors.length > 2 && <li>+ {pest.riskFactors.length - 2} more</li>}
                      </ul>
                    </div>
                    <p className="mt-1 text-xs">
                      <span className="font-semibold">Management:</span> {pest.management.split(',')[0]}...
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
              <p className="mt-2 text-green-800">Loading pest data for {location.name}...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PestMap;