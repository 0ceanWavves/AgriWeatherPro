import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useServiceMap } from '../../context/ServiceMapContext';
import { getWeatherMapUrl } from '../../api/weatherApi';

const ServiceAwareMap = ({ selectedLayer }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const layersRef = useRef({});
  const legendRef = useRef(null);
  
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default to California
  const [zoom, setZoom] = useState(6);
  const [userLocation, setUserLocation] = useState(null);
  const [locationInfo, setLocationInfo] = useState({
    city: 'San Francisco',
    region: 'California',
    temperature: '72°F',
    conditions: 'Clear'
  });
  
  const { 
    selectedService, 
    activeLayers, 
    selectLayer 
  } = useServiceMap();
  
  // Convert from UI layer name to API layer ID
  const getLayerId = (layerName) => {
    const layerMap = {
      'Temperature': 'temp_new',
      'Precipitation': 'precipitation_new',
      'Wind': 'wind_new',
      'Clouds': 'clouds_new',
      'Pressure': 'pressure_new'
    };
    return layerMap[layerName] || 'temp_new';
  };

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      // Create map instance with compact attribution
      mapRef.current = L.map(mapContainerRef.current, {
        center: mapCenter,
        zoom: zoom,
        zoomControl: true,
        attributionControl: false
      });
      
      // Add custom attribution in a more compact form
      L.control.attribution({
        prefix: false,
        position: 'bottomright'
      }).addAttribution('© <a href="https://www.openstreetmap.org/copyright">OSM</a> | AgriWeather Pro').addTo(mapRef.current);
      
      // Add base tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: false
      }).addTo(mapRef.current);
      
      // Add zoom control in top-left instead of default top-right
      L.control.zoom({
        position: 'topleft'
      }).addTo(mapRef.current);
      
      // Add location info box
      const LocationInfoControl = L.Control.extend({
        options: {
          position: 'bottomleft'
        },
        
        onAdd: function() {
          const div = L.DomUtil.create('div', 'location-info');
          div.innerHTML = `
            <div class="bg-white px-3 py-2 rounded shadow-md border border-gray-200 text-xs">
              <div class="font-semibold">${locationInfo.city}, ${locationInfo.region}</div>
              <div class="mt-1">${locationInfo.temperature} - ${locationInfo.conditions}</div>
            </div>
          `;
          return div;
        }
      });
      
      new LocationInfoControl().addTo(mapRef.current);
      
      // Try to get user location
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            setMapCenter([latitude, longitude]);
            mapRef.current.setView([latitude, longitude], 7);
            
            // Reverse geocode the location (simulated)
            setLocationInfo({
              ...locationInfo,
              city: "Current Location",
              region: "Based on GPS"
            });
          },
          error => {
            console.error("Error getting user location:", error);
          }
        );
      }
      
      // Add click event to show location info
      mapRef.current.on('click', function(e) {
        const { lat, lng } = e.latlng;
        // In a real app, you would reverse geocode here
        setLocationInfo({
          city: `Lat: ${lat.toFixed(2)}`,
          region: `Lng: ${lng.toFixed(2)}`,
          temperature: '72°F',
          conditions: 'Sunny'
        });
      });
    }
    
    // Cleanup when component unmounts
    return () => {
      if (mapRef.current) {
        // Remove all layers
        Object.values(layersRef.current).forEach(layer => {
          if (layer && mapRef.current.hasLayer(layer)) {
            mapRef.current.removeLayer(layer);
          }
        });
        
        // Remove the map
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map center when it changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, zoom);
    }
  }, [mapCenter, zoom]);

  // Update map layers when selectedService or selectedLayer changes
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Remove all current layers
    Object.values(layersRef.current).forEach(layer => {
      if (layer && mapRef.current.hasLayer(layer)) {
        mapRef.current.removeLayer(layer);
      }
    });
    
    // Reset layers reference
    layersRef.current = {};
    
    // Convert UI layer name to API layer ID
    const layerId = getLayerId(selectedLayer);
    
    // If there's a selected service, prioritize its own layering system
    if (selectedService && selectedService !== 'weather-forecasting') {
      // Handle different types of layers based on service
      if (selectedService === 'california-pest' || selectedService === 'mena-pest') {
        // For pest services, we'll add custom markers
        const pestLocations = getPestLocationsForLayer(selectedService === 'california-pest' ? 'almond_pests' : 'date_palm_pests');
        
        const markersGroup = L.layerGroup();
        
        pestLocations.forEach(pest => {
          const marker = L.marker([pest.lat, pest.lng], {
            icon: L.divIcon({
              html: `<div class="pest-marker ${pest.riskLevel.toLowerCase()}-risk">
                      <span style="font-size: 24px;">🐞</span>
                    </div>`,
              className: 'bg-transparent',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })
          });
          
          marker.bindPopup(`
            <div class="pest-popup">
              <h3>${pest.name}</h3>
              <p class="scientific-name">${pest.scientificName}</p>
              <p class="risk-level ${pest.riskLevel.toLowerCase()}-risk">Risk Level: ${pest.riskLevel}</p>
              <p>${pest.description}</p>
            </div>
          `);
          
          markersGroup.addLayer(marker);
        });
        
        markersGroup.addTo(mapRef.current);
        layersRef.current[selectedService] = markersGroup;
        
        // Add pest risk legend
        addLegend('pest-risk');
      }
      else if (selectedService === 'irrigation-planning') {
        // Add the weather layer as a base layer for irrigation
        const weatherLayer = L.tileLayer(getWeatherMapUrl('temp_new'), {
          opacity: 0.4,
          attribution: false
        });
        
        weatherLayer.addTo(mapRef.current);
        layersRef.current['weather-base'] = weatherLayer;
        
        // Add soil moisture overlay (simulated with a semi-transparent TileLayer)
        // In a real app, this would be real data
        const soilMoistureLayer = L.tileLayer.wms('https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi', {
          layers: 'nexrad-n0r',
          format: 'image/png',
          transparent: true,
          opacity: 0.6,
          attribution: false
        });
        
        soilMoistureLayer.addTo(mapRef.current);
        layersRef.current['soil-moisture'] = soilMoistureLayer;
        
        // Add irrigation legend
        addLegend('irrigation');
      }
    } else {
      // Weather forecasting - use standard weather layers
      const layer = L.tileLayer(getWeatherMapUrl(layerId), {
        attribution: false
      });
      
      layer.addTo(mapRef.current);
      layersRef.current[layerId] = layer;
      
      // Add weather legend
      if (layerId === 'temp_new') {
        addLegend('temperature');
      } else if (layerId === 'precipitation_new') {
        addLegend('precipitation');
      } else if (layerId === 'wind_new') {
        addLegend('wind');
      } else if (layerId === 'clouds_new') {
        addLegend('clouds');
      } else if (layerId === 'pressure_new') {
        addLegend('pressure');
      }
    }
    
    // Update context
    if (selectedLayer) {
      selectLayer(layerId);
    }
  }, [selectedService, selectedLayer]);

  // Add a legend to the map
  const addLegend = (legendType) => {
    // Remove existing legend if any
    if (legendRef.current && mapRef.current.hasLayer(legendRef.current)) {
      mapRef.current.removeControl(legendRef.current);
      legendRef.current = null;
    }
    
    // Create legend content based on type
    let legendHTML = '';
    
    switch (legendType) {
      case 'temperature':
        legendHTML = `
          <div class="legend-title">Temperature (°F)</div>
          <div class="gradient" style="background: linear-gradient(to right, #0000FF, #00FF00, #FFFF00, #FF0000);"></div>
          <div class="legend-labels">
            <span>Cold</span>
            <span>Hot</span>
          </div>
        `;
        break;
      
      case 'precipitation':
        legendHTML = `
          <div class="legend-title">Precipitation (inches)</div>
          <div class="gradient" style="background: linear-gradient(to right, #FFFFFF, #A0A0FF, #0000FF);"></div>
          <div class="legend-labels">
            <span>None</span>
            <span>Heavy</span>
          </div>
        `;
        break;
      
      case 'wind':
        legendHTML = `
          <div class="legend-title">Wind Speed (mph)</div>
          <div class="gradient" style="background: linear-gradient(to right, #FFFFFF, #FFFFCC, #F1C232, #FF0000);"></div>
          <div class="legend-labels">
            <span>Calm</span>
            <span>Strong</span>
          </div>
        `;
        break;
      
      case 'clouds':
        legendHTML = `
          <div class="legend-title">Cloud Cover (%)</div>
          <div class="gradient" style="background: linear-gradient(to right, #FFFFFF, #E6E6E6, #CCCCCC, #999999);"></div>
          <div class="legend-labels">
            <span>Clear</span>
            <span>Overcast</span>
          </div>
        `;
        break;
        
      case 'pressure':
        legendHTML = `
          <div class="legend-title">Pressure (hPa)</div>
          <div class="gradient" style="background: linear-gradient(to right, #9900CC, #FFFFFF, #FF6600);"></div>
          <div class="legend-labels">
            <span>Low</span>
            <span>High</span>
          </div>
        `;
        break;
      
      case 'pest-risk':
        legendHTML = `
          <div class="legend-title">Pest Risk Levels</div>
          <div class="legend-item"><span class="color-box" style="background-color: #dc2626;"></span> High Risk</div>
          <div class="legend-item"><span class="color-box" style="background-color: #d97706;"></span> Medium Risk</div>
          <div class="legend-item"><span class="color-box" style="background-color: #059669;"></span> Low Risk</div>
        `;
        break;
      
      case 'irrigation':
        legendHTML = `
          <div class="legend-title">Soil Moisture</div>
          <div class="gradient" style="background: linear-gradient(to right, #F44336, #FFEB3B, #4CAF50);"></div>
          <div class="legend-labels">
            <span>Dry</span>
            <span>Optimal</span>
            <span>Wet</span>
          </div>
        `;
        break;
      
      default:
        return; // No legend for other types
    }
    
    // Create legend control
    const LegendControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      
      onAdd: function () {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = legendHTML;
        div.style.padding = '6px 8px';
        div.style.background = 'rgba(255, 255, 255, 0.8)';
        div.style.borderRadius = '4px';
        div.style.boxShadow = '0 0 4px rgba(0, 0, 0, 0.2)';
        div.style.fontSize = '11px';
        div.style.lineHeight = '1.2';
        div.style.width = '120px';
        
        const style = document.createElement('style');
        style.textContent = `
          .legend-title { font-weight: 600; margin-bottom: 4px; }
          .gradient { height: 10px; width: 100%; margin-bottom: 4px; border-radius: 2px; }
          .legend-labels { display: flex; justify-content: space-between; font-size: 10px; }
          .legend-item { display: flex; align-items: center; margin-bottom: 3px; }
          .color-box { display: inline-block; width: 12px; height: 12px; margin-right: 5px; border-radius: 2px; }
        `;
        div.appendChild(style);
        
        return div;
      }
    });
    
    // Add legend to map
    legendRef.current = new LegendControl();
    legendRef.current.addTo(mapRef.current);
  };

  // Mock function to get pest locations - would be replaced with API call
  const getPestLocationsForLayer = (layerId) => {
    // Demo data
    if (layerId === 'almond_pests') {
      return [
        { lat: 36.7783, lng: -119.4179, name: "Navel Orangeworm", scientificName: "Amyelois transitella", riskLevel: "High", description: "Major pest of almonds in California." },
        { lat: 37.2, lng: -120.1, name: "Peach Twig Borer", scientificName: "Anarsia lineatella", riskLevel: "Medium", description: "Attacks new shoots and developing nuts." }
      ];
    } else if (layerId === 'date_palm_pests') {
      return [
        { lat: 24.4539, lng: 54.3773, name: "Red Palm Weevil", scientificName: "Rhynchophorus ferrugineus", riskLevel: "High", description: "Major threat to date palm production." },
        { lat: 25.2, lng: 55.3, name: "Dubas Bug", scientificName: "Ommatissus lybicus", riskLevel: "Medium", description: "Causes significant damage to date palm fronds." }
      ];
    }
    
    // Default return some mock data
    return [
      { lat: mapCenter[0] + 0.5, lng: mapCenter[1] + 0.5, name: "Sample Pest", scientificName: "Pestus demonstratus", riskLevel: "Medium", description: "Example pest for demonstration." }
    ];
  };

  return (
    <div className="h-full w-full relative">
      {/* Map container */}
      <div className="h-full w-full" ref={mapContainerRef}></div>
    </div>
  );
};

export default ServiceAwareMap;