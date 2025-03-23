import React, { useState, useEffect } from 'react';
import { useWeatherData } from '../../hooks/useWeatherData';
import { useGlobalLocation } from '../../context/LocationContext';
import { predictPestEmergence, calculateDegreeDays, analyzeWeatherTriggers } from '../../services/predictivePestService';
import { FaBug, FaTemperatureHigh, FaCalendarAlt, FaExclamationTriangle, FaLeaf, FaChartLine } from 'react-icons/fa';
import PestActionPlan from './PestActionPlan';

const PredictivePestAnalysis = ({ crops = ['corn', 'soybean', 'wheat'] }) => {
  const { weatherData, isLoading: weatherLoading } = useWeatherData();
  const { currentLocation } = useGlobalLocation();
  const [predictions, setPredictions] = useState([]);
  const [degreeDayData, setDegreeDayData] = useState({});
  const [weatherTriggers, setWeatherTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('predictions');
  const [cropInfo, setCropInfo] = useState({ type: crops[0] });
  
  useEffect(() => {
    const calculatePredictions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Skip calculations if no weather data
        if (!weatherData) {
          setLoading(false);
          setError("Weather data not available. Unable to generate predictions.");
          return;
        }
        
        // Set crop info
        setCropInfo({
          type: crops[0],
          growthStage: 'mid-season', // This would ideally come from actual crop data
          organicStatus: false,      // This would ideally be a user setting
        });
        
        // Calculate degree days from weather data
        const degreeData = calculateDegreeDays(weatherData);
        setDegreeDayData(degreeData);
        
        // Analyze weather triggers from weather data
        const triggers = analyzeWeatherTriggers(weatherData);
        setWeatherTriggers(triggers);
        
        // Predict pest emergence using degree days and weather triggers
        const pestPredictions = predictPestEmergence(
          weatherData, 
          crops[0],
          degreeData,
          triggers,
          currentLocation
        );
        
        setPredictions(pestPredictions);
        setLoading(false);
      } catch (err) {
        console.error('Error generating pest predictions:', err);
        setError('Failed to generate pest predictions. Please try again later.');
        setLoading(false);
      }
    };
    
    // Recalculate when weather data, crop, or location changes
    calculatePredictions();
    
    // Set up an interval to refresh the predictions every 3 hours
    const refreshInterval = setInterval(calculatePredictions, 3 * 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [weatherData, crops, currentLocation]);
  
  if (loading || weatherLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-green-800">Predictive Pest Analysis</h2>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            PREMIUM FEATURE
          </div>
        </div>
        <div className="p-8 text-center text-gray-500">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-green-600 rounded-full mb-3"></div>
          <p>Analyzing weather patterns and calculating degree days...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-green-800">Predictive Pest Analysis</h2>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            PREMIUM FEATURE
          </div>
        </div>
        <div className="p-4 text-center text-red-600">
          <FaExclamationTriangle className="inline-block mr-2" />
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold text-green-800">Predictive Pest Analysis</h2>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          PREMIUM FEATURE
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            selectedTab === 'predictions' 
              ? 'border-b-2 border-green-500 text-green-700' 
              : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('predictions')}
        >
          <FaBug className="inline mr-1" /> Pest Predictions
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            selectedTab === 'action' 
              ? 'border-b-2 border-green-500 text-green-700' 
              : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('action')}
        >
          <FaChartLine className="inline mr-1" /> Action Plan
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            selectedTab === 'degreedays' 
              ? 'border-b-2 border-green-500 text-green-700' 
              : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('degreedays')}
        >
          <FaTemperatureHigh className="inline mr-1" /> Degree Day Analysis
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            selectedTab === 'triggers' 
              ? 'border-b-2 border-green-500 text-green-700' 
              : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('triggers')}
        >
          <FaChartLine className="inline mr-1" /> Weather Triggers
        </button>
      </div>
      
      <div className="p-4">
        {/* Location Info */}
        <div className="mb-4 text-sm text-gray-600">
          <p>
            <span className="font-medium">Location:</span> {currentLocation?.name || 'Unknown'}
            <span className="mx-2">|</span>
            <span className="font-medium">Crops:</span> {crops.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
          </p>
        </div>
        
        {/* Tab Content */}
        {selectedTab === 'predictions' && (
          <div className="predictions-tab">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Predictive model using degree-day calculations and weather patterns to forecast pest emergence before it happens.
              </p>
            </div>
            
            {predictions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pest threats predicted for your crops in the near future.
              </div>
            ) : (
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-3 ${
                      prediction.riskLevel === 'High' ? 'border-red-300 bg-red-50' :
                      prediction.riskLevel === 'Medium' ? 'border-yellow-300 bg-yellow-50' :
                      'border-green-300 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-bold ${
                          prediction.riskLevel === 'High' ? 'text-red-700' :
                          prediction.riskLevel === 'Medium' ? 'text-yellow-700' :
                          'text-green-700'
                        }`}>
                          {prediction.pestName}
                        </h3>
                        <p className="text-xs text-gray-600 italic">{prediction.scientificName}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        prediction.riskLevel === 'High' ? 'bg-red-200 text-red-800' :
                        prediction.riskLevel === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {prediction.riskLevel} Risk
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p><span className="font-medium">Next Event:</span> {prediction.nextEvent}</p>
                        {prediction.daysToEvent !== null && (
                          <p>
                            <span className="font-medium">Expected:</span> 
                            <span className="ml-1">
                              <FaCalendarAlt className="inline mr-1 text-xs" />
                              {prediction.predictedDate} 
                              <span className="ml-1 text-xs text-gray-600">
                                ({prediction.daysToEvent} days)
                              </span>
                            </span>
                          </p>
                        )}
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Affected Crops:</span> 
                          <span className="ml-1">
                            <FaLeaf className="inline mr-1 text-xs text-green-600" />
                            {prediction.affectedCrops.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
                          </span>
                        </p>
                        <p><span className="font-medium">Degree Days:</span> {prediction.currentDD}°</p>
                      </div>
                    </div>
                    
                    {prediction.notes && (
                      <div className="mt-2 text-sm bg-white bg-opacity-50 p-2 rounded">
                        <FaExclamationTriangle className="inline mr-1 text-yellow-600" />
                        {prediction.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {selectedTab === 'action' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Pest Management Action Plan
            </h3>
            <PestActionPlan predictions={predictions} cropInfo={cropInfo} />
          </div>
        )}
        
        {selectedTab === 'degreedays' && (
          <div className="degree-days-tab">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Accumulated degree days for each pest model based on your local weather data.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 text-left">Pest</th>
                    <th className="py-2 px-3 text-left">Base Temp</th>
                    <th className="py-2 px-3 text-left">Current DD</th>
                    <th className="py-2 px-3 text-left">Next Threshold</th>
                    <th className="py-2 px-3 text-left">Days to Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {predictions.map((pest, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-2 px-3 font-medium">{pest.pestName}</td>
                      <td className="py-2 px-3">{pest.baseTemp ? `${pest.baseTemp}°C` : '-'}</td>
                      <td className="py-2 px-3">{pest.currentDD}°</td>
                      <td className="py-2 px-3">{pest.nextEvent}</td>
                      <td className="py-2 px-3">{pest.daysToEvent !== null ? `${pest.daysToEvent} days` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {selectedTab === 'triggers' && (
          <div className="triggers-tab">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Weather conditions that could trigger changes in pest development or behavior.
              </p>
            </div>
            
            {predictions.some(p => p.weatherTriggers && p.weatherTriggers.length > 0) ? (
              <div className="space-y-4">
                {predictions
                  .filter(p => p.weatherTriggers && p.weatherTriggers.length > 0)
                  .map((prediction, index) => (
                    <div key={index} className="border border-blue-300 bg-blue-50 rounded-lg p-3">
                      <h3 className="font-bold text-blue-800">{prediction.pestName} Triggers</h3>
                      
                      {prediction.weatherTriggers?.map((trigger, i) => (
                        <div key={i} className="mt-2 bg-white bg-opacity-70 p-2 rounded text-sm">
                          <div className="font-medium text-blue-700">{trigger.type.replace('-', ' ').toUpperCase()}</div>
                          <p className="text-gray-700">{trigger.description}</p>
                          {trigger.startDate && trigger.endDate && (
                            <p className="text-xs text-gray-600">
                              Period: {trigger.startDate} to {trigger.endDate}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No significant weather triggers detected for pest development.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictivePestAnalysis; 