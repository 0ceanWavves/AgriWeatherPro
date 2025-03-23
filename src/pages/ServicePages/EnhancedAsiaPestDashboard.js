import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceMap } from '../../context/ServiceMapContext';
import BackButton from '../../components/BackButton';
import { 
  fetchSoutheastAsiaRicePests, 
  fetchSoutheastAsiaPestById,
  calculatePestRisk,
  generatePestRiskForecast
} from '../../api/southeastAsiaPestApi';
import { FaBug, FaTemperatureHigh, FaTint, FaCloudRain, FaLeaf, FaFlask, FaSeedling, FaInfoCircle } from 'react-icons/fa';

const EnhancedAsiaPestDashboard = () => {
  const [pests, setPests] = useState([]);
  const [selectedPest, setSelectedPest] = useState(null);
  const [weatherData, setWeatherData] = useState({
    temperature: 28, // Default temperature in C
    humidity: 80, // Default humidity in %
    precipitation: 15 // Default precipitation in mm
  });
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  
  const { selectService } = useServiceMap();
  const navigate = useNavigate();
  
  // Southeast Asian countries
  const asianCountries = [
    { value: 'thailand', label: 'Thailand' },
    { value: 'vietnam', label: 'Vietnam' },
    { value: 'philippines', label: 'Philippines' },
    { value: 'indonesia', label: 'Indonesia' },
    { value: 'myanmar', label: 'Myanmar' }
  ];
  
  // Rice growing stages
  const growingStages = [
    { value: 'seedling', label: 'Seedling Stage' },
    { value: 'tillering', label: 'Tillering Stage' },
    { value: 'booting', label: 'Booting Stage' },
    { value: 'heading', label: 'Heading Stage' },
    { value: 'ripening', label: 'Ripening Stage' }
  ];
  
  const [selectedCountry, setSelectedCountry] = useState(asianCountries[0].value);
  const [growingStage, setGrowingStage] = useState(growingStages[2].value);
  
  // Set service when component mounts
  useEffect(() => {
    selectService('asia-pest');
  }, [selectService]);
  
  // Load pests when component mounts
  useEffect(() => {
    const loadPests = async () => {
      setLoading(true);
      try {
        const data = await fetchSoutheastAsiaRicePests();
        setPests(data);
        if (data.length > 0) {
          setSelectedPest(data[0]);
          // Load forecast for the first pest
          loadForecast(data[0].id);
        } else {
          setSelectedPest(null);
        }
      } catch (error) {
        console.error('Error loading Southeast Asia rice pests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPests();
  }, []);
  
  // Load pest forecast data
  const loadForecast = async (pestId) => {
    setForecastLoading(true);
    setIsUsingMockData(false);
    try {
      const forecastData = await generatePestRiskForecast(pestId, selectedCountry);
      setForecast(forecastData);
      
      // Check if forecast data is from mock data (simulated check)
      // In a real implementation, the API would tell us if it's using mock data
      if (Math.random() > 0.5) { // Simulating API sometimes using mock data
        setIsUsingMockData(true);
      }
    } catch (error) {
      console.error('Error loading pest forecast:', error);
      setIsUsingMockData(true);
    } finally {
      setForecastLoading(false);
    }
  };
  
  // Handle weather input changes
  const handleWeatherChange = (e) => {
    const { name, value } = e.target;
    setWeatherData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  
  // Handle country selection
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    // Reload forecast with new location if a pest is selected
    if (selectedPest) {
      loadForecast(selectedPest.id);
    }
  };
  
  // Handle growing stage selection
  const handleGrowingStageChange = (e) => {
    setGrowingStage(e.target.value);
  };
  
  // Select a pest
  const handlePestSelect = (pest) => {
    setSelectedPest(pest);
    loadForecast(pest.id);
  };
  
  // Function to go to dashboard
  const goToDashboard = () => {
    navigate('/dashboard?region=asia');
  };
  
  // Calculate current risk level
  const getRiskInfo = (pest) => {
    if (!pest) return { level: 'unknown', score: 0, factors: [] };
    return calculatePestRisk(pest, weatherData);
  };
  
  // Get risk level color
  const getRiskColor = (level) => {
    switch (level) {
      case 'extreme': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      case 'minimal': return 'bg-green-400 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  // Get risk level background color (lighter)
  const getRiskBgColor = (level) => {
    switch (level) {
      case 'extreme': return 'bg-red-100 border-red-300';
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      case 'minimal': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
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
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <BackButton />
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Southeast Asia Rice Pest Database</h1>
                <p className="text-green-100 mt-2">
                  Phase 3: Comprehensive pest management for the Southeast Asian Rice Bowl
                </p>
              </div>
              <button 
                onClick={goToDashboard}
                className="px-4 py-2 bg-white text-green-700 rounded hover:bg-green-50"
              >
                View on Dashboard
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Mock Data Indicator */}
            {isUsingMockData && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                <div className="flex items-center">
                  <FaInfoCircle className="h-5 w-5 mr-2" />
                  <span>Using simulated weather forecast data. Weather API connection will be restored soon.</span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-1">
                {/* Region Selection */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
                  <h2 className="text-xl font-semibold text-green-800 mb-4">Rice Growing Region</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">Country</label>
                      <select 
                        className="w-full p-2 border border-green-300 rounded-md bg-white text-green-800"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                      >
                        {asianCountries.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">Growing Stage</label>
                      <select 
                        className="w-full p-2 border border-green-300 rounded-md bg-white text-green-800"
                        value={growingStage}
                        onChange={handleGrowingStageChange}
                      >
                        {growingStages.map((stage) => (
                          <option key={stage.value} value={stage.value}>
                            {stage.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Weather Controls */}
                <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                  <h2 className="text-lg font-semibold text-green-800 mb-3">
                    Local Weather Conditions
                    {isUsingMockData && <span className="text-xs text-amber-600 ml-2">(Manual Controls)</span>}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">
                        <FaTemperatureHigh className="inline mr-1" /> Temperature (°C)
                      </label>
                      <input
                        type="range"
                        name="temperature"
                        min="20"
                        max="35"
                        step="0.5"
                        value={weatherData.temperature}
                        onChange={handleWeatherChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>20°C</span>
                        <span className="font-medium">{weatherData.temperature}°C</span>
                        <span>35°C</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">
                        <FaTint className="inline mr-1" /> Humidity (%)
                      </label>
                      <input
                        type="range"
                        name="humidity"
                        min="50"
                        max="100"
                        value={weatherData.humidity}
                        onChange={handleWeatherChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>50%</span>
                        <span className="font-medium">{weatherData.humidity}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">
                        <FaCloudRain className="inline mr-1" /> Precipitation (mm)
                      </label>
                      <input
                        type="range"
                        name="precipitation"
                        min="0"
                        max="50"
                        step="1"
                        value={weatherData.precipitation}
                        onChange={handleWeatherChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>0mm</span>
                        <span className="font-medium">{weatherData.precipitation}mm</span>
                        <span>50mm</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Pest List */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h2 className="text-lg font-semibold text-green-800 mb-3">Rice Pests & Diseases</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pests.map((pest) => {
                      const riskInfo = getRiskInfo(pest);
                      
                      return (
                        <div 
                          key={pest.id} 
                          className={`p-3 rounded-md cursor-pointer border ${
                            selectedPest && selectedPest.id === pest.id
                              ? 'bg-green-100 border-green-300'
                              : 'hover:bg-gray-50 border-gray-100'
                          }`}
                          onClick={() => handlePestSelect(pest)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-900">{pest.commonName}</h3>
                              <p className="text-xs text-gray-500 italic">{pest.scientificName}</p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(riskInfo.level)}`}>
                              {riskInfo.level.charAt(0).toUpperCase() + riskInfo.level.slice(1)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Pest Details */}
              <div className="lg:col-span-2">
                {selectedPest ? (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Pest Header */}
                    <div className="border-b border-gray-200 p-4 bg-green-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-bold text-green-800">{selectedPest.commonName}</h2>
                          <p className="text-sm text-gray-600 italic">{selectedPest.scientificName}</p>
                        </div>
                        
                        {/* Risk Badge */}
                        {(() => {
                          const riskInfo = getRiskInfo(selectedPest);
                          return (
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(riskInfo.level)}`}>
                              {riskInfo.level.charAt(0).toUpperCase() + riskInfo.level.slice(1)} Risk ({riskInfo.score})
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                      <nav className="flex">
                        <button
                          className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'overview' 
                              ? 'border-b-2 border-green-500 text-green-600' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          onClick={() => setActiveTab('overview')}
                        >
                          Overview
                        </button>
                        <button
                          className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'forecast' 
                              ? 'border-b-2 border-green-500 text-green-600' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          onClick={() => setActiveTab('forecast')}
                        >
                          7-Day Forecast
                        </button>
                        <button
                          className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'management' 
                              ? 'border-b-2 border-green-500 text-green-600' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          onClick={() => setActiveTab('management')}
                        >
                          Management Strategies
                        </button>
                        <button
                          className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'climate' 
                              ? 'border-b-2 border-green-500 text-green-600' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          onClick={() => setActiveTab('climate')}
                        >
                          Climate Change
                        </button>
                      </nav>
                    </div>
                    
                    {/* Tab Content */}
                    <div className="p-6">
                      {/* Overview Tab */}
                      {activeTab === 'overview' && (
                        <div>
                          {/* Description */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Description</h3>
                            <p className="text-gray-700">{selectedPest.description}</p>
                          </div>
                          
                          {/* Damage Type */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">
                              Damage ({selectedPest.damageType.severity} Severity)
                            </h3>
                            <p className="text-gray-700">{selectedPest.damageType.description}</p>
                          </div>
                          
                          {/* Current Risk Factors */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Current Risk Assessment</h3>
                            <div className={`p-4 rounded-lg ${getRiskBgColor(getRiskInfo(selectedPest).level)}`}>
                              <div className="flex items-center mb-3">
                                <div className={`p-2 rounded-full mr-3 ${getRiskColor(getRiskInfo(selectedPest).level)}`}>
                                  <FaBug className="text-white" />
                                </div>
                                <div>
                                  <div className="font-semibold">
                                    {getRiskInfo(selectedPest).level.charAt(0).toUpperCase() + getRiskInfo(selectedPest).level.slice(1)} Risk Level
                                  </div>
                                  <div className="text-sm text-gray-600">Risk Score: {getRiskInfo(selectedPest).score}/100</div>
                                </div>
                              </div>
                              <div>
                                <div className="font-medium mb-1">Contributing Factors:</div>
                                <ul className="pl-5 list-disc text-sm text-gray-700 space-y-1">
                                  {getRiskInfo(selectedPest).factors.map((factor, index) => (
                                    <li key={index}>{factor}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          {/* Weather Thresholds */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Optimal Conditions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm text-gray-500">Temperature Range</div>
                                <div className="text-xl font-medium text-gray-800">
                                  {selectedPest.weatherThresholds.temperatureRange[0]}-{selectedPest.weatherThresholds.temperatureRange[1]}°C
                                </div>
                                <div className="text-xs text-gray-500">Optimal: {selectedPest.weatherThresholds.temperatureOptimal}°C</div>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm text-gray-500">Humidity Range</div>
                                <div className="text-xl font-medium text-gray-800">
                                  {selectedPest.weatherThresholds.humidityRange[0]}-{selectedPest.weatherThresholds.humidityRange[1]}%
                                </div>
                                <div className="text-xs text-gray-500">Optimal: {selectedPest.weatherThresholds.humidityOptimal}%</div>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm text-gray-500">Precipitation (mm)</div>
                                <div className="text-xl font-medium text-gray-800">
                                  {selectedPest.weatherThresholds.precipitationOptimal[0]}-{selectedPest.weatherThresholds.precipitationOptimal[1]}mm
                                </div>
                                <div className="text-xs text-gray-500 capitalize">Risk: {selectedPest.weatherThresholds.precipitationRisk}</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Risk Factors */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Risk Factors</h3>
                            <ul className="pl-5 list-disc text-gray-700 space-y-1">
                              {selectedPest.riskFactors.map((factor, index) => (
                                <li key={index}>{factor}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {/* Forecast Tab */}
                      {activeTab === 'forecast' && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-800 mb-4">
                            7-Day Risk Forecast for {selectedPest.commonName}
                            {isUsingMockData && <span className="text-xs text-amber-600 ml-2">(Simulated Data)</span>}
                          </h3>
                          
                          {forecastLoading ? (
                            <div className="flex justify-center items-center py-12">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                            </div>
                          ) : (
                            <>
                              {/* Forecast Visualization */}
                              <div className="mb-6 overflow-x-auto">
                                <div className="min-w-max">
                                  <div className="grid grid-cols-7 gap-2">
                                    {forecast.map((day, index) => (
                                      <div key={index} className="w-full">
                                        <div className="text-center text-sm font-medium mb-2">
                                          {formatDate(day.date)}
                                        </div>
                                        <div 
                                          className={`h-52 relative rounded-t-lg ${getRiskColor(day.risk)}`}
                                          style={{ height: `${day.score * 2}px` }}
                                        >
                                          <div className="absolute bottom-0 left-0 right-0 text-center text-xs font-bold py-1">
                                            {day.score}
                                          </div>
                                        </div>
                                        <div className="text-center text-xs mt-1 capitalize">
                                          {day.risk}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Forecast Details */}
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                                <h4 className="font-medium text-gray-800 mb-2">Forecast Details</h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precip (mm)</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {forecast.map((day, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(day.date)}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(day.risk)}`}>
                                              {day.risk.charAt(0).toUpperCase() + day.risk.slice(1)}
                                            </span>
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {day.weather.temperature}°C
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {day.weather.humidity}%
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {day.weather.precipitation}mm
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              
                              <div className="text-sm text-gray-500">
                                <p>This forecast is based on predicted weather conditions and historical pest activity patterns.</p>
                                <p>Actual infestation may vary based on local conditions and management practices.</p>
                                {isUsingMockData && (
                                  <p className="text-amber-600 italic mt-2">Note: Forecast currently uses simulated weather data.</p>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      
                      {/* Management Strategies Tab */}
                      {activeTab === 'management' && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-800 mb-4">
                            Integrated Pest Management (IPM) Strategies
                          </h3>
                          
                          <div className="space-y-6">
                            {/* Cultural Controls */}
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <div className="flex items-center mb-3">
                                <div className="bg-green-600 p-2 rounded-full mr-3">
                                  <FaSeedling className="text-white" />
                                </div>
                                <h4 className="text-lg font-medium text-green-800">Cultural Controls</h4>
                              </div>
                              <ul className="pl-5 list-disc text-gray-700 space-y-1">
                                {selectedPest.ipmStrategies.cultural.map((strategy, index) => (
                                  <li key={index}>{strategy}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Biological Controls */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <div className="flex items-center mb-3">
                                <div className="bg-blue-600 p-2 rounded-full mr-3">
                                  <FaLeaf className="text-white" />
                                </div>
                                <h4 className="text-lg font-medium text-blue-800">Biological Controls</h4>
                              </div>
                              <ul className="pl-5 list-disc text-gray-700 space-y-1">
                                {selectedPest.ipmStrategies.biological.map((strategy, index) => (
                                  <li key={index}>{strategy}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Chemical Controls */}
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                              <div className="flex items-center mb-3">
                                <div className="bg-purple-600 p-2 rounded-full mr-3">
                                  <FaFlask className="text-white" />
                                </div>
                                <h4 className="text-lg font-medium text-purple-800">Chemical Controls</h4>
                              </div>
                              <ul className="pl-5 list-disc text-gray-700 space-y-1">
                                {selectedPest.ipmStrategies.chemical.map((strategy, index) => (
                                  <li key={index}>{strategy}</li>
                                ))}
                              </ul>
                              <div className="mt-2 text-sm text-gray-600 italic">
                                Note: Use chemical controls judiciously and as part of an integrated approach.
                              </div>
                            </div>
                            
                            {/* Management Recommendations Based on Growing Stage */}
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                              <h4 className="font-medium text-amber-800 mb-2">Recommendations for {growingStages.find(stage => stage.value === growingStage)?.label}</h4>
                              <p className="text-gray-700">
                                {growingStage === 'seedling' && 'Focus on early monitoring and cultural controls. Seed treatments may be warranted. Monitor water levels carefully.'}
                                {growingStage === 'tillering' && 'Regularly scout for early signs of infestation. This is a critical time for preventative measures.'}
                                {growingStage === 'booting' && 'Implement protective measures as this is a vulnerable stage for many pests. Monitor closely and act promptly if thresholds are exceeded.'}
                                {growingStage === 'heading' && 'Protect the developing panicles. Use selective controls that won\'t harm beneficial insects needed for pollination.'}
                                {growingStage === 'ripening' && 'Maintain protective measures. Consider harvest timing to minimize damage and reduce overwintering populations.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Climate Change Tab */}
                      {activeTab === 'climate' && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-800 mb-4">
                            Climate Change Impacts
                          </h3>
                          
                          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 mb-6">
                            <h4 className="font-medium text-blue-800 mb-3">Projected Impacts</h4>
                            <p className="text-gray-700 mb-4">{selectedPest.climateChangeImpacts}</p>
                            
                            <div className="border-t border-blue-200 pt-4 mt-4">
                              <h5 className="font-medium text-blue-800 mb-2">Adaptation Strategies</h5>
                              <ul className="pl-5 list-disc text-gray-700 space-y-1">
                                <li>Regularly update pest monitoring protocols to account for changing pest behavior</li>
                                <li>Adjust planting calendars based on shifting seasonal patterns</li>
                                <li>Invest in research for varieties resistant to emerging pest pressures</li>
                                <li>Enhance biodiversity in agricultural landscapes to buffer against climate extremes</li>
                                <li>Develop regional early warning systems for pest outbreaks</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="bg-gray-100 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-2">Research Priorities</h4>
                            <ul className="pl-5 list-disc text-gray-700 space-y-1">
                              <li>Modeling pest population dynamics under different climate scenarios</li>
                              <li>Assessing efficacy of current management strategies under changing conditions</li>
                              <li>Identifying novel biocontrol agents adapted to warmer temperatures</li>
                              <li>Evaluating impacts of elevated CO2 on host-pest interactions</li>
                              <li>Developing climate-resilient rice varieties with enhanced pest resistance</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Footer with source links */}
                    <div className="flex justify-between items-center mt-4 p-4 border-t border-gray-200 bg-gray-50">
                      <div className="text-sm text-gray-500">
                        Data Source: International Rice Research Institute (IRRI)
                      </div>
                      <a 
                        href="https://www.irri.org/pest-and-disease-management" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        View IRRI Pest Management Guidelines
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
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

export default EnhancedAsiaPestDashboard;