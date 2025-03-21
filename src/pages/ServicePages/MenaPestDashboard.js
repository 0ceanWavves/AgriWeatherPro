import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceMap } from '../../context/ServiceMapContext';
import BackButton from '../../components/BackButton';
import { fetchMENAPests } from '../../api/pestApi';

const MenaPestDashboard = () => {
  const [pests, setPests] = useState([]);
  const [selectedPest, setSelectedPest] = useState(null);
  const [weatherData, setWeatherData] = useState({
    temperature: 32, // Default temperature in C for MENA region
    humidity: 45, // Default humidity in %
    precipitation: 0, // Default precipitation in mm
    forecastDays: 5 // Default forecast days
  });
  const [loading, setLoading] = useState(true);
  
  const { selectService } = useServiceMap();
  const navigate = useNavigate();
  
  // Set service when component mounts and fetch pests
  useEffect(() => {
    selectService('mena-pest');
    
    const loadPests = async () => {
      setLoading(true);
      try {
        const data = await fetchMENAPests();
        setPests(data);
        if (data.length > 0) {
          setSelectedPest(data[0]);
        }
      } catch (error) {
        console.error('Error loading MENA pests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPests();
  }, [selectService]);

  const calculateRiskLevel = (pest) => {
    if (!pest || !pest.weatherThresholds) return 'Unknown';
    
    const { temperature, humidity, precipitation } = weatherData;
    const { temperatureOptimal, humidityOptimal, precipitationRisk } = pest.weatherThresholds;
    
    let riskScore = 0;
    
    // Temperature factor
    const tempDifference = Math.abs(temperature - temperatureOptimal);
    if (tempDifference < 3) riskScore += 5;
    else if (tempDifference < 5) riskScore += 4;
    else if (tempDifference < 8) riskScore += 3;
    else if (tempDifference < 12) riskScore += 2;
    else if (tempDifference < 15) riskScore += 1;
    
    // Humidity factor
    const humidityDifference = Math.abs(humidity - humidityOptimal);
    if (humidityDifference < 10) riskScore += 3;
    else if (humidityDifference < 20) riskScore += 2;
    else if (humidityDifference < 30) riskScore += 1;
    
    // Precipitation risk
    if (precipitationRisk === 'very high' && precipitation > 5) riskScore += 2;
    else if (precipitationRisk === 'high' && precipitation > 5) riskScore += 1.5;
    else if (precipitationRisk === 'moderate' && precipitation > 2) riskScore += 1;
    else if (precipitationRisk === 'low' && precipitation < 2) riskScore += 1;
    else if (precipitationRisk === 'very low' && precipitation < 1) riskScore += 2;
    
    // Determine risk level
    if (riskScore >= 8) return 'High';
    if (riskScore >= 5) return 'Medium';
    return 'Low';
  };

  const handleWeatherChange = (e) => {
    const { name, value } = e.target;
    setWeatherData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  // Function to go to dashboard with current service selected
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  // Helper function to render strategy list
  const renderStrategyList = (strategies, title) => {
    if (!strategies || strategies.length === 0) return null;
    return (
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-amber-800 mb-1">{title}</h4>
        <ul className="list-disc list-inside text-sm text-gray-700 pl-1">
          {strategies.map((strategy, i) => (
            <li key={i}>{strategy}</li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4">
        <BackButton />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <BackButton />
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-amber-700 to-amber-600 p-4 md:p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-white">MENA Date Palm Pest Database</h1>
                <p className="text-amber-100 mt-2 text-sm md:text-base">
                  Monitor and manage date palm pest risks in the Middle East and North Africa region
                </p>
              </div>
              <button 
                onClick={goToDashboard}
                className="px-4 py-2 bg-white text-amber-700 rounded hover:bg-amber-50"
              >
                View on Dashboard
              </button>
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left Column */}
              <div className="lg:col-span-1">
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-4">
                  <h2 className="text-lg font-semibold text-amber-800 mb-3">Date Palm Pests</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {pests.map((pest, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md cursor-pointer ${
                          selectedPest && selectedPest.commonName === pest.commonName
                            ? 'bg-amber-100 border-amber-300 border'
                            : 'hover:bg-gray-50 border border-gray-100'
                        }`}
                        onClick={() => setSelectedPest(pest)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">{pest.commonName}</h3>
                            <p className="text-xs text-gray-500 italic">{pest.scientificName}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            calculateRiskLevel(pest) === 'High' ? 'bg-red-100 text-red-800' :
                            calculateRiskLevel(pest) === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {calculateRiskLevel(pest)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-amber-200 mb-4">
                  <h2 className="text-base font-semibold text-amber-800 mb-3">Weather Conditions</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-amber-700 mb-1">Temperature (°C)</label>
                      <input
                        type="range"
                        name="temperature"
                        min="20"
                        max="45"
                        value={weatherData.temperature}
                        onChange={handleWeatherChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>20°C</span>
                        <span className="font-medium">{weatherData.temperature}°C</span>
                        <span>45°C</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-amber-700 mb-1">Humidity (%)</label>
                      <input
                        type="range"
                        name="humidity"
                        min="10"
                        max="90"
                        value={weatherData.humidity}
                        onChange={handleWeatherChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>10%</span>
                        <span className="font-medium">{weatherData.humidity}%</span>
                        <span>90%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-amber-700 mb-1">Precipitation (mm)</label>
                      <input
                        type="range"
                        name="precipitation"
                        min="0"
                        max="20"
                        step="0.5"
                        value={weatherData.precipitation}
                        onChange={handleWeatherChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>0mm</span>
                        <span className="font-medium">{weatherData.precipitation}mm</span>
                        <span>20mm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Columns - Pest Details */}
              <div className="lg:col-span-2">
                {selectedPest ? (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 p-4 bg-amber-50 flex justify-between items-start flex-wrap">
                      <div>
                        <h2 className="text-xl font-bold text-amber-800">{selectedPest.commonName}</h2>
                        <p className="text-sm text-gray-600 italic">{selectedPest.scientificName}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        calculateRiskLevel(selectedPest) === 'High' ? 'bg-red-100 text-red-800' :
                        calculateRiskLevel(selectedPest) === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {calculateRiskLevel(selectedPest)} Risk
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {/* Description */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-amber-800 text-base mb-2">Description</h3>
                        <p className="text-sm text-gray-700">{selectedPest.description}</p>
                      </div>
                      
                      {/* Damage Description */}
                      {selectedPest.damageType && (
                        <div className="mb-6">
                          <h3 className="font-semibold text-amber-800 text-base mb-2">
                            Damage ({selectedPest.damageType.severity} Severity)
                          </h3>
                          <p className="text-sm text-gray-700">{selectedPest.damageType.description}</p>
                        </div>
                      )}
                      
                      {/* Weather Thresholds */}
                      {selectedPest.weatherThresholds && (
                        <div className="mb-6">
                          <h3 className="font-semibold text-amber-800 text-base mb-2">Optimal Conditions</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gray-50 p-2 rounded text-center">
                              <div className="text-xs text-gray-500">Temperature</div>
                              <div className="font-medium">{selectedPest.weatherThresholds.temperatureOptimal}°C</div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded text-center">
                              <div className="text-xs text-gray-500">Humidity</div>
                              <div className="font-medium">{selectedPest.weatherThresholds.humidityOptimal}%</div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded text-center">
                              <div className="text-xs text-gray-500">Rain Sensitivity</div>
                              <div className="font-medium capitalize">{selectedPest.weatherThresholds.precipitationRisk}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Risk Assessment */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-amber-800 text-base mb-2">Risk Assessment</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm mb-2">
                            Based on current weather conditions ({weatherData.temperature}°C, {weatherData.humidity}% humidity, 
                            {weatherData.precipitation}mm precipitation), this pest presents a {calculateRiskLevel(selectedPest).toLowerCase()} risk
                            to date palm orchards.
                          </p>
                          
                          <div className="mt-2">
                            <h4 className="font-medium text-sm mb-1">Recommended Actions:</h4>
                            <ul className="list-disc list-inside text-sm">
                              {calculateRiskLevel(selectedPest) === 'High' ? (
                                <>
                                  <li>Immediate monitoring recommended</li>
                                  <li>Implement preventative controls</li>
                                  <li>Prepare intervention strategies</li>
                                </>
                              ) : calculateRiskLevel(selectedPest) === 'Medium' ? (
                                <>
                                  <li>Regular monitoring advised</li>
                                  <li>Review control options</li>
                                  <li>Prepare for changing conditions</li>
                                </>
                              ) : (
                                <>
                                  <li>Routine monitoring sufficient</li>
                                  <li>No immediate action needed</li>
                                  <li>Continue preventative practices</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Management Strategies */}
                      {selectedPest.ipmStrategies && (
                        <div className="mb-4">
                          <h3 className="font-semibold text-amber-800 text-base mb-2">Management Strategies</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(selectedPest.ipmStrategies).map(([key, strategies]) => (
                              <div key={key} className="bg-gray-50 p-3 rounded">
                                {renderStrategyList(strategies, key.charAt(0).toUpperCase() + key.slice(1) + " Controls")}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Footer with references */}
                      <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                        Source: FAO Date Palm Protection Guidelines
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500">Select a pest to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenaPestDashboard;