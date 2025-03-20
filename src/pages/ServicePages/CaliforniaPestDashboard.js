import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import californiaPestDatabase from '../../data/californiaPestSummary';
import { supabase } from '../../lib/supabase';

const CaliforniaPestDashboard = () => {
  const [selectedCrop, setSelectedCrop] = useState('almonds');
  const [selectedPest, setSelectedPest] = useState(null);
  const [weatherData, setWeatherData] = useState({
    temperature: 75, // Default temperature in F
    humidity: 60, // Default humidity in %
    precipitation: 0, // Default precipitation in inches
    forecastDays: 5 // Default forecast days
  });
  const [loading, setLoading] = useState(false);
  const [dbPestData, setDbPestData] = useState(null);
  
  // Available California crops from Phase 1
  const californiaCrops = [
    { value: 'almonds', label: 'Almonds' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'tomatoes', label: 'Tomatoes' },
    { value: 'lettuce', label: 'Lettuce' },
    { value: 'strawberries', label: 'Strawberries' }
  ];
  
  // Get pests for selected crop
  const pests = useMemo(() => {
    return californiaPestDatabase[selectedCrop] || [];
  }, [selectedCrop]);
  
  // Select first pest by default when crop changes
  useEffect(() => {
    if (pests.length > 0) {
      setSelectedPest(pests[0]);
    } else {
      setSelectedPest(null);
    }
  }, [pests]);

  // Fetch additional pest data from Supabase when a pest is selected
  useEffect(() => {
    const fetchPestData = async () => {
      if (!selectedPest) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('california_pests')
          .select('*')
          .eq('scientific_name', selectedPest.scientificName)
          .single();
          
        if (error) {
          console.error('Error fetching pest data:', error);
          setDbPestData(null);
        } else if (data) {
          setDbPestData(data);
        }
      } catch (error) {
        console.error('Error fetching pest data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPestData();
  }, [selectedPest]);

  // Calculate risk level based on current weather conditions
  const calculateRiskLevel = (pest) => {
    if (!pest || !pest.weatherThresholds) return 'Unknown';
    
    const { temperature, humidity, precipitation } = weatherData;
    const { temperatureOptimal, humidityOptimal, precipitationRisk } = pest.weatherThresholds;
    
    let riskScore = 0;
    
    // Temperature factor (0-5 scale)
    const tempDifference = Math.abs(temperature - temperatureOptimal);
    if (tempDifference < 5) riskScore += 5;
    else if (tempDifference < 10) riskScore += 4;
    else if (tempDifference < 15) riskScore += 3;
    else if (tempDifference < 20) riskScore += 2;
    else if (tempDifference < 25) riskScore += 1;
    
    // Humidity factor (0-3 scale)
    const humidityDifference = Math.abs(humidity - humidityOptimal);
    if (humidityDifference < 10) riskScore += 3;
    else if (humidityDifference < 20) riskScore += 2;
    else if (humidityDifference < 30) riskScore += 1;
    
    // Precipitation risk (0-2 scale)
    if (precipitationRisk === 'very high' && precipitation > 0.1) riskScore += 2;
    else if (precipitationRisk === 'high' && precipitation > 0.1) riskScore += 1.5;
    else if (precipitationRisk === 'moderate' && precipitation > 0.1) riskScore += 1;
    else if (precipitationRisk === 'low' && precipitation < 0.1) riskScore += 1;
    else if (precipitationRisk === 'very low' && precipitation < 0.05) riskScore += 2;
    
    // Determine risk level based on score
    if (riskScore >= 8) return 'High';
    if (riskScore >= 5) return 'Medium';
    return 'Low';
  };

  // Handle weather input changes
  const handleWeatherChange = (e) => {
    const { name, value } = e.target;
    setWeatherData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-6">
            <h1 className="text-3xl font-bold text-white">California Crop Pest Database</h1>
            <p className="text-green-100 mt-2">
              Phase 1: Monitoring pest risks for California's key crops based on weather conditions
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex mb-6">
              <Link to="/services/pest-management" className="text-blue-600 hover:text-blue-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Global Pest Management
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Crop Selection & Weather Inputs */}
              <div className="lg:col-span-1">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
                  <h2 className="text-xl font-semibold text-green-800 mb-4">Select California Crop</h2>
                  <div className="relative">
                    <select 
                      className="w-full p-2 border border-green-300 rounded-md bg-white text-green-800"
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                    >
                      {californiaCrops.map((crop) => (
                        <option key={crop.value} value={crop.value}>
                          {crop.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                  <h2 className="text-lg font-semibold text-green-800 mb-3">Weather Conditions</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">Temperature (°F)</label>
                      <input
                        type="range"
                        name="temperature"
                        min="40"
                        max="100"
                        value={weatherData.temperature}
                        onChange={handleWeatherChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>40°F</span>
                        <span className="font-medium">{weatherData.temperature}°F</span>
                        <span>100°F</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">Humidity (%)</label>
                      <input
                        type="range"
                        name="humidity"
                        min="10"
                        max="100"
                        value={weatherData.humidity}
                        onChange={handleWeatherChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>10%</span>
                        <span className="font-medium">{weatherData.humidity}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">Precipitation (inches)</label>
                      <input
                        type="range"
                        name="precipitation"
                        min="0"
                        max="2"
                        step="0.05"
                        value={weatherData.precipitation}
                        onChange={handleWeatherChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>0"</span>
                        <span className="font-medium">{weatherData.precipitation}"</span>
                        <span>2"</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h2 className="text-lg font-semibold text-green-800 mb-3">Pest List</h2>
                  <div className="space-y-2">
                    {pests.map((pest, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md cursor-pointer ${
                          selectedPest && selectedPest.commonName === pest.commonName
                            ? 'bg-green-100 border-green-300 border'
                            : 'hover:bg-gray-50 border border-gray-100'
                        }`}
                        onClick={() => setSelectedPest(pest)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900">{pest.commonName}</h3>
                            <p className="text-xs text-gray-500 italic">{pest.scientificName}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            calculateRiskLevel(pest) === 'High' ? 'bg-red-100 text-red-800' :
                            calculateRiskLevel(pest) === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {calculateRiskLevel(pest)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Middle & Right Columns - Pest Details */}
              <div className="lg:col-span-2">
                {selectedPest ? (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 p-4 bg-green-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-bold text-green-800">{selectedPest.commonName}</h2>
                          <p className="text-sm text-gray-600 italic">{selectedPest.scientificName}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          calculateRiskLevel(selectedPest) === 'High' ? 'bg-red-100 text-red-800' :
                          calculateRiskLevel(selectedPest) === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {calculateRiskLevel(selectedPest)} Risk
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {/* Key Information Section */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Key Information</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {selectedPest.keyPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Weather Thresholds Section */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Weather Thresholds</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500">Optimal Temperature</div>
                            <div className="text-xl font-medium text-gray-800">
                              {selectedPest.weatherThresholds.temperatureOptimal}°F
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500">Optimal Humidity</div>
                            <div className="text-xl font-medium text-gray-800">
                              {selectedPest.weatherThresholds.humidityOptimal}%
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500">Precipitation Risk</div>
                            <div className="text-xl font-medium text-gray-800 capitalize">
                              {selectedPest.weatherThresholds.precipitationRisk}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Current Risk Analysis Section */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Current Risk Analysis</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className={`w-3 h-3 rounded-full ${
                              calculateRiskLevel(selectedPest) === 'High' ? 'bg-red-500' :
                              calculateRiskLevel(selectedPest) === 'Medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}></div>
                            <div className="text-lg font-medium text-gray-800">
                              {calculateRiskLevel(selectedPest)} Risk Level
                            </div>
                          </div>
                          
                          <p className="text-gray-700">
                            Based on the current weather conditions (
                            {weatherData.temperature}°F, {weatherData.humidity}% humidity, 
                            {weatherData.precipitation}" precipitation),
                            {' '}
                            {selectedPest.commonName} presents a {calculateRiskLevel(selectedPest).toLowerCase()} risk
                            to {selectedCrop}.
                          </p>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-800 mb-1">Management Priorities</h4>
                              <ul className="list-disc list-inside text-sm text-gray-700">
                                {calculateRiskLevel(selectedPest) === 'High' ? (
                                  <>
                                    <li>Immediate monitoring recommended</li>
                                    <li>Implement preventative controls</li>
                                    <li>Prepare intervention strategies</li>
                                    <li>Monitor daily weather forecasts</li>
                                  </>
                                ) : calculateRiskLevel(selectedPest) === 'Medium' ? (
                                  <>
                                    <li>Regular monitoring advised</li>
                                    <li>Review control options</li>
                                    <li>Prepare for changing conditions</li>
                                    <li>Monitor weekly forecasts</li>
                                  </>
                                ) : (
                                  <>
                                    <li>Routine monitoring sufficient</li>
                                    <li>No immediate action needed</li>
                                    <li>Continue preventative practices</li>
                                    <li>Monitor seasonal trends</li>
                                  </>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 mb-1">Forecast Outlook</h4>
                              <p className="text-sm text-gray-700">
                                Risk levels are projected to remain {calculateRiskLevel(selectedPest).toLowerCase()} for 
                                the next {weatherData.forecastDays} days, based on current weather forecasts.
                                Adjust management plans accordingly.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Data from Supabase (if available) */}
                      {loading && (
                        <div className="text-center py-4">
                          <div className="inline-block animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full"></div>
                          <p className="mt-2 text-sm text-gray-600">Loading additional pest data...</p>
                        </div>
                      )}
                      
                      {dbPestData && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-green-800 mb-2">
                            Detailed Management Strategies
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {dbPestData.ipm_strategies && (
                              <>
                                <h4 className="font-medium text-gray-800 mb-2">IPM Approaches</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  {dbPestData.ipm_strategies.cultural && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-green-700 mb-1">Cultural Controls</h5>
                                      <ul className="list-disc list-inside text-sm text-gray-700">
                                        {dbPestData.ipm_strategies.cultural.map((strategy, index) => (
                                          <li key={index}>{strategy}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {dbPestData.ipm_strategies.biological && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-green-700 mb-1">Biological Controls</h5>
                                      <ul className="list-disc list-inside text-sm text-gray-700">
                                        {dbPestData.ipm_strategies.biological.map((strategy, index) => (
                                          <li key={index}>{strategy}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {dbPestData.ipm_strategies.chemical && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-green-700 mb-1">Chemical Controls</h5>
                                      <ul className="list-disc list-inside text-sm text-gray-700">
                                        {dbPestData.ipm_strategies.chemical.map((strategy, index) => (
                                          <li key={index}>{strategy}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {dbPestData.ipm_strategies.resistant_varieties && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-green-700 mb-1">Resistant Varieties</h5>
                                      <ul className="list-disc list-inside text-sm text-gray-700">
                                        {dbPestData.ipm_strategies.resistant_varieties.map((variety, index) => (
                                          <li key={index}>{variety}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                            
                            {dbPestData.climate_change_impacts && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Climate Change Impacts</h4>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                  {dbPestData.climate_change_impacts.map((impact, index) => (
                                    <li key={index}>{impact}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-8">
                        <div className="text-sm text-gray-500">
                          Data Source: University of California IPM Program
                        </div>
                        <a 
                          href="https://www2.ipm.ucanr.edu/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          View Complete UC IPM Guidelines
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
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

export default CaliforniaPestDashboard;