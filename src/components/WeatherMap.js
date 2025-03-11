import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { getWeatherMapUrl } from '../api/weatherApi';

const WeatherMap = () => {
  const [mapCenter, setMapCenter] = useState([40, -95]); // Default center on US
  const [zoom, setZoom] = useState(4);
  const [userLocation, setUserLocation] = useState(null);
  
  const weatherLayers = [
    { name: 'Temperature', id: 'temp_new' },
    { name: 'Precipitation', id: 'precipitation_new' },
    { name: 'Wind Speed', id: 'wind_new' },
    { name: 'Clouds', id: 'clouds_new' },
    { name: 'Pressure', id: 'pressure_new' }
  ];

  // Try to get user's location on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setZoom(7); // Zoom in when we have user location
        },
        error => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  return (
    <div className="card">
      <h2 className="text-2xl font-heading font-bold mb-6">Weather Map</h2>
      <p className="mb-4">Interactive weather map showing current conditions and forecasts. Toggle different layers to view various weather parameters.</p>
      
      <div style={{ height: '600px', width: '100%' }}>
        <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          {/* Base map layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Weather layers control */}
          <LayersControl position="topright">
            {weatherLayers.map((layer) => (
              <LayersControl.Overlay name={layer.name} key={layer.id}>
                <TileLayer
                  url={getWeatherMapUrl(layer.id)}
                  attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
                />
              </LayersControl.Overlay>
            ))}
          </LayersControl>
          
          {/* User location marker */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                Your current location
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Temperature Layer</h3>
          <p>Shows current temperatures across regions using color gradients.</p>
        </div>
        <div className="p-4 bg-primary/10 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Precipitation Layer</h3>
          <p>Displays current and forecasted precipitation levels and patterns.</p>
        </div>
        <div className="p-4 bg-primary/10 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Wind Layer</h3>
          <p>Visualizes wind speeds and directions to plan field operations.</p>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <p className="font-semibold">Agricultural Tip</p>
        <p>Use the precipitation forecast to plan irrigation schedules and the temperature layer to monitor frost risks for sensitive crops.</p>
      </div>
    </div>
  );
};

export default WeatherMap;