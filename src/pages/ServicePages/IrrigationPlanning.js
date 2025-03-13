import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
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

// Custom water drop icon using Font Awesome
const waterIcon = L.divIcon({
  html: '<i class="fa fa-tint" style="font-size: 24px; color: #3b82f6;"></i>',
  className: 'bg-transparent',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const IrrigationPlanning = () => {
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006 });
  const [weatherData, setWeatherData] = useState(null);
  const [irrigationPlan, setIrrigationPlan] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('corn');
  const [fieldSize, setFieldSize] = useState(10); // acres
  const [soilType, setSoilType] = useState('loam');
  const [irrigationSystem, setIrrigationSystem] = useState('drip');
  const [loading, setLoading] = useState(true);

  // Crop water requirements (inches per week) based on growth stage
  const cropWaterNeeds = {
    corn: {
      seedling: 0.8,
      vegetative: 1.2,
      reproductive: 1.5,
      maturation: 1.0
    },
    soybean: {
      seedling: 0.7,
      vegetative: 1.0,
      reproductive: 1.3,
      maturation: 0.8
    },
    wheat: {
      seedling: 0.6,
      vegetative: 0.9,
      reproductive: 1.1,
      maturation: 0.7
    },
    cotton: {
      seedling: 0.7,
      vegetative: 1.1,
      reproductive: 1.4,
      maturation: 0.9
    },
    alfalfa: {
      seedling: 0.9,
      vegetative: 1.3,
      reproductive: 1.6,
      maturation: 1.2
    }
  };

  // Soil water holding capacity (inches per foot)
  const soilWaterCapacity = {
    sand: 0.7,
    loamySand: 1.1,
    sandyLoam: 1.4,
    loam: 1.8,
    siltLoam: 2.0,
    clay: 1.6
  };

  // Irrigation system efficiency (percentage)
  const systemEfficiency = {
    drip: 0.90,
    microsprinkler: 0.85,
    sprinkler: 0.75,
    furrow: 0.65,
    flood: 0.50
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
        
        // Calculate irrigation plan based on weather and crop data
        calculateIrrigationPlan(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, selectedCrop, fieldSize, soilType, irrigationSystem]);

  const calculateIrrigationPlan = (weather) => {
    if (!weather || !cropWaterNeeds[selectedCrop]) return;

    // Get current month to determine growth stage (simplified approach)
    const currentMonth = new Date().getMonth();
    let growthStage;
    
    // Simplified growth stage determination based on month
    // This would be more sophisticated in a real app with planting date input
    if (currentMonth >= 3 && currentMonth < 5) { // April-May
      growthStage = 'seedling';
    } else if (currentMonth >= 5 && currentMonth < 7) { // June-July
      growthStage = 'vegetative';
    } else if (currentMonth >= 7 && currentMonth < 9) { // August-September
      growthStage = 'reproductive';
    } else {
      growthStage = 'maturation';
    }

    // Get crop water need for current growth stage
    const weeklyWaterNeed = cropWaterNeeds[selectedCrop][growthStage];
    
    // Calculate expected rainfall for the next 7 days (convert from mm to inches)
    const expectedRainfall = weather.daily.slice(0, 7).reduce((sum, day) => {
      return sum + (day.rain ? day.rain / 25.4 : 0);
    }, 0);
    
    // Calculate evapotranspiration (simplified model based on temperature and humidity)
    // In a real app, this would use the Penman-Monteith equation or similar
    const avgTemp = weather.daily.slice(0, 7).reduce((sum, day) => sum + day.temp.day, 0) / 7;
    const avgHumidity = weather.daily.slice(0, 7).reduce((sum, day) => sum + day.humidity, 0) / 7;
    
    // Simple ET calculation (this is a simplified model)
    const dailyET = (avgTemp - 32) * 5/9 * 0.03 * (1 - (avgHumidity / 100) * 0.6);
    const weeklyET = dailyET * 7;
    
    // Calculate water deficit
    const waterDeficit = Math.max(0, weeklyWaterNeed - expectedRainfall);
    
    // Calculate irrigation amount needed (accounting for system efficiency)
    const irrigationNeeded = waterDeficit / systemEfficiency[irrigationSystem];
    
    // Calculate total water volume needed
    const totalWaterVolume = irrigationNeeded * fieldSize * 27154; // gallons (1 acre-inch = 27,154 gallons)
    
    // Determine optimal irrigation schedule
    const daysWithRain = weather.daily.slice(0, 7).map((day, index) => ({
      day: index,
      date: new Date(day.dt * 1000).toLocaleDateString(),
      rain: day.rain ? day.rain / 25.4 : 0,
      temp: day.temp.day,
      humidity: day.humidity
    }));
    
    // Find days with least rainfall for irrigation
    const sortedDays = [...daysWithRain].sort((a, b) => a.rain - b.rain);
    
    // Create irrigation schedule
    // For simplicity, we'll irrigate on the 2-3 driest days
    const irrigationDays = sortedDays.slice(0, irrigationNeeded > 1 ? 3 : 2);
    
    // Calculate amount per irrigation day
    const amountPerDay = totalWaterVolume / irrigationDays.length;
    
    // Create irrigation schedule
    const schedule = irrigationDays.map(day => ({
      date: day.date,
      amount: (amountPerDay / 27154 / fieldSize).toFixed(2), // Convert back to inches
      gallons: Math.round(amountPerDay)
    }));
    
    // Set irrigation plan
    setIrrigationPlan({
      cropType: selectedCrop,
      growthStage,
      fieldSize,
      soilType,
      irrigationSystem,
      weeklyWaterNeed,
      expectedRainfall: expectedRainfall.toFixed(2),
      waterDeficit: waterDeficit.toFixed(2),
      irrigationNeeded: irrigationNeeded.toFixed(2),
      totalWaterVolume: Math.round(totalWaterVolume),
      schedule,
      efficiency: (systemEfficiency[irrigationSystem] * 100).toFixed(0) + '%',
      waterSavings: ((1 - systemEfficiency[irrigationSystem]) * totalWaterVolume).toFixed(0)
    });
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-green-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-6">
            <h1 className="text-3xl font-bold text-white">Irrigation Planning</h1>
            <p className="text-blue-100 mt-2">
              Optimize your water usage with weather-based irrigation scheduling
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Field Settings */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Field Settings</h2>
                
                {/* Crop Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-800 mb-1">Crop Type</label>
                  <select 
                    className="w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                  >
                    {Object.keys(cropWaterNeeds).map(crop => (
                      <option key={crop} value={crop}>
                        {crop.charAt(0).toUpperCase() + crop.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Field Size */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-800 mb-1">Field Size (acres)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="1000"
                    className="w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={fieldSize}
                    onChange={(e) => setFieldSize(Number(e.target.value))}
                  />
                </div>
                
                {/* Soil Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-800 mb-1">Soil Type</label>
                  <select 
                    className="w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                  >
                    {Object.keys(soilWaterCapacity).map(soil => (
                      <option key={soil} value={soil}>
                        {soil.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Irrigation System */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-800 mb-1">Irrigation System</label>
                  <select 
                    className="w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={irrigationSystem}
                    onChange={(e) => setIrrigationSystem(e.target.value)}
                  >
                    {Object.keys(systemEfficiency).map(system => (
                      <option key={system} value={system}>
                        {system.charAt(0).toUpperCase() + system.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {weatherData && (
                  <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
                    <h3 className="font-semibold text-blue-800">Current Weather</h3>
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
                <h2 className="text-xl font-semibold text-blue-800 p-4 border-b border-gray-200">
                  Field Location & Precipitation Forecast
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
                      
                      {/* Field location marker */}
                      <Marker position={[location.lat, location.lng]}>
                        <Popup>
                          Your field location
                        </Popup>
                      </Marker>
                      
                      {/* Field area visualization (simplified as a circle) */}
                      <Circle 
                        center={[location.lat, location.lng]}
                        radius={Math.sqrt(fieldSize * 4047) / Math.PI} // Approximate radius based on field size in square meters
                        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                      />
                      
                      {/* Rainfall visualization for next 7 days */}
                      {weatherData && weatherData.daily.slice(0, 7).map((day, index) => {
                        const rainAmount = day.rain ? day.rain : 0;
                        const offsetLat = location.lat + (index - 3) * 0.01;
                        const offsetLng = location.lng + 0.01;
                        
                        return (
                          <Marker 
                            key={index}
                            position={[offsetLat, offsetLng]}
                            icon={waterIcon}
                          >
                            <Popup>
                              <div className="text-sm">
                                <h3 className="font-bold">{new Date(day.dt * 1000).toLocaleDateString()}</h3>
                                <p>Precipitation: {rainAmount.toFixed(2)} mm</p>
                                <p>Temperature: {Math.round(day.temp.day)}°F</p>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                        <p className="mt-2 text-blue-800">Loading weather data...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Irrigation Plan */}
            {irrigationPlan && (
              <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <h2 className="text-xl font-semibold text-blue-800 p-4 border-b border-gray-200">
                  Your Irrigation Plan
                </h2>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-sm font-semibold text-blue-800">Weekly Water Need</h3>
                      <p className="text-2xl font-bold text-blue-600">{irrigationPlan.weeklyWaterNeed} in</p>
                      <p className="text-xs text-gray-500">Based on {selectedCrop} in {irrigationPlan.growthStage} stage</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-sm font-semibold text-blue-800">Expected Rainfall</h3>
                      <p className="text-2xl font-bold text-blue-600">{irrigationPlan.expectedRainfall} in</p>
                      <p className="text-xs text-gray-500">Forecast for next 7 days</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-sm font-semibold text-blue-800">Water Deficit</h3>
                      <p className="text-2xl font-bold text-blue-600">{irrigationPlan.waterDeficit} in</p>
                      <p className="text-xs text-gray-500">Additional water needed</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-sm font-semibold text-blue-800">System Efficiency</h3>
                      <p className="text-2xl font-bold text-blue-600">{irrigationPlan.efficiency}</p>
                      <p className="text-xs text-gray-500">{irrigationSystem} irrigation</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Irrigation Schedule</h3>
                    
                    {irrigationPlan.waterDeficit > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-blue-200">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Amount (inches)</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Volume (gallons)</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-blue-100">
                            {irrigationPlan.schedule.map((day, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.amount}"</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.gallons.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-green-100 text-green-800 p-4 rounded-md">
                        <p className="font-medium">No irrigation needed this week!</p>
                        <p className="text-sm mt-1">Expected rainfall is sufficient for your crop's water needs.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">Water Usage Summary</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Total Field Size:</span>
                          <span className="font-medium">{irrigationPlan.fieldSize} acres</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Total Water Volume:</span>
                          <span className="font-medium">{irrigationPlan.totalWaterVolume.toLocaleString()} gallons</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Water Application Rate:</span>
                          <span className="font-medium">{irrigationPlan.irrigationNeeded} inches</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Soil Type:</span>
                          <span className="font-medium">{irrigationPlan.soilType}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Water Conservation</h3>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Using {irrigationSystem} irrigation saves approximately:</p>
                        <p className="text-2xl font-bold text-green-600">{irrigationPlan.waterSavings.toLocaleString()} gallons</p>
                        <p className="text-xs text-gray-500">Compared to flood irrigation</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-green-700">Conservation Tips:</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          <li>Irrigate during early morning or evening to reduce evaporation</li>
                          <li>Consider soil moisture sensors for precision irrigation</li>
                          <li>Maintain your irrigation system to prevent leaks and clogs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Sustainable Irrigation Practices */}
            <div className="mt-8 bg-green-50 rounded-lg border border-green-200 p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Sustainable Irrigation Practices
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Deficit Irrigation</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Apply less water than the crop's full requirement during drought-tolerant growth stages to conserve water while maintaining yields.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Precision Irrigation</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Use soil moisture sensors and weather data to apply water only when and where it's needed, reducing waste and improving efficiency.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Rainwater Harvesting</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Collect and store rainwater from roofs and other surfaces to supplement irrigation during dry periods.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Mulching</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Apply organic mulch around plants to reduce evaporation, suppress weeds, and improve soil moisture retention.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Cover Cropping</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Plant cover crops during off-seasons to improve soil structure, increase organic matter, and enhance water infiltration and retention.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Irrigation Scheduling</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Time irrigation based on weather forecasts, crop water needs, and soil moisture levels to maximize efficiency.
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

export default IrrigationPlanning; 