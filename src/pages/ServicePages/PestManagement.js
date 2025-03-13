import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pest icon
const pestIcon = new L.Icon({
  iconUrl: '/images/pest-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const PestManagement = () => {
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006 });
  const [weatherData, setWeatherData] = useState(null);
  const [pestRisks, setPestRisks] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('corn');
  const [loading, setLoading] = useState(true);

  // Common crops and their associated pests
  const cropPests = {
    corn: [
      { name: 'Corn Earworm', riskFactors: ['High humidity', 'Temperatures above 80°F'], management: 'Monitor with pheromone traps, apply Bt-based insecticides when detected' },
      { name: 'European Corn Borer', riskFactors: ['Warm nights', 'High humidity'], management: 'Crop rotation, Bt corn varieties, targeted insecticide application' },
      { name: 'Corn Rootworm', riskFactors: ['Continuous corn planting', 'Dry soil conditions'], management: 'Crop rotation, soil insecticides at planting, rootworm resistant varieties' }
    ],
    wheat: [
      { name: 'Hessian Fly', riskFactors: ['Early planting', 'Warm fall weather'], management: 'Delayed planting after fly-free date, resistant varieties' },
      { name: 'Wheat Stem Sawfly', riskFactors: ['Dry conditions', 'Previous infestation'], management: 'Solid-stem wheat varieties, early harvest when possible' },
      { name: 'Aphids', riskFactors: ['Mild winters', 'Cool spring'], management: 'Natural predator conservation, targeted insecticide application' }
    ],
    soybean: [
      { name: 'Soybean Aphid', riskFactors: ['Mild winters', 'Early season stress'], management: 'Scout fields regularly, apply insecticides at threshold levels' },
      { name: 'Bean Leaf Beetle', riskFactors: ['Early planting', 'Mild winters'], management: 'Delayed planting, seed treatments, foliar insecticides when necessary' },
      { name: 'Soybean Cyst Nematode', riskFactors: ['Sandy soils', 'Previous infestation'], management: 'Resistant varieties, crop rotation, soil testing' }
    ],
    cotton: [
      { name: 'Cotton Bollworm', riskFactors: ['High temperatures', 'Previous crop residue'], management: 'Bt cotton varieties, targeted spraying, destroy crop residues' },
      { name: 'Boll Weevil', riskFactors: ['Mild winters', 'Nearby infested fields'], management: 'Pheromone traps, early stalk destruction, preventative spraying' },
      { name: 'Spider Mites', riskFactors: ['Hot, dry conditions', 'Dusty field edges'], management: 'Conserve natural enemies, avoid drought stress, miticides when necessary' }
    ],
    rice: [
      { name: 'Rice Water Weevil', riskFactors: ['Early flooding', 'Nearby infested fields'], management: 'Delayed flooding, seed treatments, drain fields when larvae detected' },
      { name: 'Rice Stink Bug', riskFactors: ['Heading stage', 'Nearby grassy areas'], management: 'Scout during heading, treat when thresholds reached, manage field borders' },
      { name: 'Fall Armyworm', riskFactors: ['Late planting', 'Drought stress'], management: 'Early planting, maintain optimal water levels, targeted insecticide application' }
    ]
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API key and endpoint
        const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely,alerts&units=imperial&appid=${apiKey}`
        );
        setWeatherData(response.data);
        
        // Calculate pest risks based on weather conditions
        calculatePestRisks(response.data, selectedCrop);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, selectedCrop]);

  const calculatePestRisks = (weather, crop) => {
    if (!weather || !cropPests[crop]) return;

    const currentTemp = weather.current.temp;
    const humidity = weather.current.humidity;
    const windSpeed = weather.current.wind_speed;
    const rainfall = weather.daily.slice(0, 7).reduce((sum, day) => sum + (day.rain ? day.rain : 0), 0);
    
    // Calculate risk levels for each pest based on current conditions
    const risks = cropPests[crop].map(pest => {
      let riskLevel = 'Low';
      let riskScore = 0;
      
      // Temperature factor
      if (currentTemp > 80) riskScore += 3;
      else if (currentTemp > 70) riskScore += 2;
      else if (currentTemp > 60) riskScore += 1;
      
      // Humidity factor
      if (humidity > 80) riskScore += 3;
      else if (humidity > 60) riskScore += 2;
      else if (humidity > 40) riskScore += 1;
      
      // Rainfall factor
      if (rainfall < 0.5) riskScore += 2; // Dry conditions often favor certain pests
      else if (rainfall > 3) riskScore += 2; // Heavy rain can favor fungal diseases
      
      // Determine risk level based on score
      if (riskScore >= 6) riskLevel = 'High';
      else if (riskScore >= 4) riskLevel = 'Medium';
      
      // Generate random coordinates near the user's location for visualization
      const randomLat = location.lat + (Math.random() - 0.5) * 0.05;
      const randomLng = location.lng + (Math.random() - 0.5) * 0.05;
      
      return {
        ...pest,
        riskLevel,
        riskScore,
        location: { lat: randomLat, lng: randomLng }
      };
    });
    
    setPestRisks(risks);
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-6">
            <h1 className="text-3xl font-bold text-white">Pest Management</h1>
            <p className="text-green-100 mt-2">
              Monitor and manage pest risks based on real-time weather conditions and forecasts
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Crop Selection */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-4">Select Your Crop</h2>
                <div className="space-y-2">
                  {Object.keys(cropPests).map(crop => (
                    <button
                      key={crop}
                      className={`w-full py-2 px-4 rounded-md transition-colors ${
                        selectedCrop === crop 
                          ? 'bg-green-600 text-white' 
                          : 'bg-white text-green-800 border border-green-300 hover:bg-green-100'
                      }`}
                      onClick={() => setSelectedCrop(crop)}
                    >
                      {crop.charAt(0).toUpperCase() + crop.slice(1)}
                    </button>
                  ))}
                </div>
                
                {weatherData && (
                  <div className="mt-6 bg-white rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-green-800">Current Weather</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Temperature: {Math.round(weatherData.current.temp)}°F</p>
                      <p>Humidity: {weatherData.current.humidity}%</p>
                      <p>Wind: {Math.round(weatherData.current.wind_speed)} mph</p>
                      <p>Conditions: {weatherData.current.weather[0].description}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Middle Column - Map */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-green-800 p-4 border-b border-gray-200">
                  Pest Risk Map
                </h2>
                <div className="h-96">
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
                      
                      {/* User location marker */}
                      <Marker position={[location.lat, location.lng]}>
                        <Popup>
                          Your location
                        </Popup>
                      </Marker>
                      
                      {/* Pest risk markers */}
                      {pestRisks.map((pest, index) => (
                        <Marker 
                          key={index}
                          position={[pest.location.lat, pest.location.lng]}
                          icon={pestIcon}
                        >
                          <Popup>
                            <div className="text-sm">
                              <h3 className="font-bold">{pest.name}</h3>
                              <p className={`font-semibold ${
                                pest.riskLevel === 'High' ? 'text-red-600' : 
                                pest.riskLevel === 'Medium' ? 'text-yellow-600' : 
                                'text-green-600'
                              }`}>
                                Risk Level: {pest.riskLevel}
                              </p>
                              <p className="mt-1">Management: {pest.management}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                        <p className="mt-2 text-green-800">Loading pest data...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Pest Risk Table */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <h2 className="text-xl font-semibold text-green-800 p-4 border-b border-gray-200">
                Pest Risk Assessment for {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Pest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Risk Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Risk Factors
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Management Recommendations
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pestRisks.map((pest, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pest.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pest.riskLevel === 'High' ? 'bg-red-100 text-red-800' : 
                            pest.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {pest.riskLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <ul className="list-disc list-inside">
                            {pest.riskFactors.map((factor, i) => (
                              <li key={i}>{factor}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {pest.management}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Organic Pest Management Section */}
            <div className="mt-8 bg-green-50 rounded-lg border border-green-200 p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Organic Pest Management Strategies
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Beneficial Insects</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Introduce ladybugs, lacewings, and predatory mites to naturally control pest populations without chemicals.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Crop Rotation</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Disrupt pest life cycles by rotating crops annually. This prevents pest populations from becoming established.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Companion Planting</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Plant pest-repelling herbs and flowers alongside crops to naturally deter common agricultural pests.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Physical Barriers</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Use row covers, netting, and other physical barriers to prevent pests from reaching your crops.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Biological Controls</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Apply Bacillus thuringiensis (Bt), nematodes, and other biological agents that target specific pests.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Trap Crops</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Plant sacrificial crops that attract pests away from your main crop, then treat or remove the trap crops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestManagement; 