import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import SoilMoistureProfile from './SoilMoisture/SoilMoistureProfile';
import ETCalculator from './Evapotranspiration/ETCalculator';
import { FaInfo, FaTint, FaChartBar, FaSeedling, FaCalendarAlt, FaMap } from 'react-icons/fa';
import { useGlobalLocation } from '../../context/LocationContext';
import { useWeatherData } from '../../hooks/useWeatherData';
import { 
  calculateSoilMoistureProfile, 
  estimateDaysToIrrigation,
  calculateIrrigationRecommendation 
} from '../../utils/irrigation/soilMoistureCalculations';
import './IrrigationDashboard.css';

const IrrigationDashboard = () => {
  const { currentLocation } = useGlobalLocation();
  const { weatherData, isLoading: weatherLoading } = useWeatherData(currentLocation?.id);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedSoilType, setSelectedSoilType] = useState('loam');
  const [selectedCropType, setSelectedCropType] = useState('corn');
  const [selectedGrowthStage, setSelectedGrowthStage] = useState('mid');
  const [irrigationSchedule, setIrrigationSchedule] = useState([]);
  const [fieldStatus, setFieldStatus] = useState({
    soilMoisture: 0,
    daysToIrrigation: 0,
    recommendedAmount: 0,
    lastRainfall: 0,
    lastRainfallDate: '',
    averageTemperature: 0
  });

  // Update field status based on weather data
  useEffect(() => {
    if (weatherData && weatherData.forecast) {
      // Get recent weather data for calculations
      const recentPrecipitation = weatherData.forecast
        .slice(0, 3)
        .reduce((total, day) => total + (day.precipitation || 0), 0);
      
      // Find the most recent rainfall
      const rainfallDays = weatherData.forecast
        .filter(day => day.precipitation > 0.5);
      
      const lastRainDay = rainfallDays.length > 0 ? rainfallDays[0] : null;
      
      // Calculate average temperature
      const avgTemp = weatherData.forecast
        .slice(0, 5)
        .reduce((total, day) => total + ((day.tempHigh + day.tempLow) / 2), 0) / 5;
      
      // Simple ET estimate based on temperature
      const estimatedET = avgTemp * 0.15;
      
      // Get soil moisture at 20cm depth (root zone)
      const soilMoisture = calculateSoilMoistureProfile(
        selectedSoilType, 
        20, 
        recentPrecipitation, 
        0, // No irrigation yet
        estimatedET
      );
      
      // Calculate days until irrigation is needed
      const daysToIrrigation = estimateDaysToIrrigation(
        selectedSoilType,
        soilMoisture,
        estimatedET,
        30, // Root depth for corn
        0.5 // Allow 50% depletion before irrigation
      );
      
      // Calculate recommended irrigation amount
      const recommendedAmount = calculateIrrigationRecommendation(
        selectedSoilType,
        soilMoisture,
        30, // Root depth
        0.9 // Target 90% of field capacity
      );
      
      setFieldStatus({
        soilMoisture: Math.round(soilMoisture),
        daysToIrrigation: Math.round(daysToIrrigation),
        recommendedAmount: Math.round(recommendedAmount),
        lastRainfall: lastRainDay ? lastRainDay.precipitation : 0,
        lastRainfallDate: lastRainDay ? new Date(lastRainDay.date).toLocaleDateString() : 'No recent rainfall',
        averageTemperature: Math.round(avgTemp * 10) / 10
      });
      
      // Generate irrigation schedule for the next 7 days
      generateIrrigationSchedule(soilMoisture, estimatedET);
    }
  }, [weatherData, selectedSoilType, selectedCropType]);

  // Generate irrigation schedule based on soil moisture and weather forecast
  const generateIrrigationSchedule = (currentMoisture, dailyET) => {
    if (!weatherData || !weatherData.forecast) return;
    
    const schedule = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Starting condition
    let simulatedMoisture = currentMoisture;
    const today = new Date();
    
    // Generate schedule for next 7 days
    for (let i = 0; i < 7; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      const dayName = days[forecastDate.getDay()];
      const dateString = forecastDate.toISOString().split('T')[0];
      
      // Get forecast for this day
      const dayForecast = weatherData.forecast[i] || {};
      const precipitation = dayForecast.precipitation || 0;
      
      // Calculate water loss for the day (ET minus precipitation)
      const waterLoss = (dailyET - precipitation);
      
      // Reduce soil moisture based on water loss
      simulatedMoisture -= waterLoss;
      
      // Determine if irrigation is needed (below 50% is threshold)
      const needsIrrigation = simulatedMoisture < 25;
      
      let recommendedAmount = 0;
      let status = 'skip';
      
      if (needsIrrigation) {
        // Calculate how much water to add to reach 80% of field capacity
        recommendedAmount = Math.round((35 - simulatedMoisture));
        status = 'scheduled';
        
        // Update simulated moisture after irrigation
        simulatedMoisture += recommendedAmount;
      }
      
      // If significant rainfall is expected, skip irrigation
      if (precipitation > 5) {
        recommendedAmount = 0;
        status = 'rain expected';
      }
      
      schedule.push({
        day: dayName,
        date: dateString,
        recommended: recommendedAmount,
        duration: (recommendedAmount / 10).toFixed(1) + ' hours',
        status: status,
        precipitation: precipitation
      });
    }
    
    setIrrigationSchedule(schedule);
  };
  
  // Water usage data - calculate based on recommended vs. conventional
  const calculateWaterSavings = () => {
    // Sum up all recommended irrigation amounts
    const recommendedTotal = irrigationSchedule.reduce((sum, day) => sum + day.recommended, 0);
    
    // Estimate conventional irrigation (every other day regardless of conditions)
    const conventionalTotal = 4 * 15; // 4 days x 15mm
    
    const savings = conventionalTotal - recommendedTotal;
    const savingsPercent = Math.round((savings / conventionalTotal) * 100);
    
    return {
      before: conventionalTotal * 100, // Convert to gallons for display
      after: recommendedTotal * 100,
      savings: savings * 100,
      savingsPercent: savingsPercent,
      timePeriod: '7 days'
    };
  };

  const waterUsageData = calculateWaterSavings();

  // Sample data for crop yield impact
  const yieldImpactData = {
    estimated: 8.2,
    baseline: 7.6,
    increase: 7.9,
    waterUseEfficiency: 1.4
  };

  if (weatherLoading) {
    return <div className="loading">Loading irrigation data...</div>;
  }

  return (
    <div className="irrigation-dashboard">
      <div className="irrigation-header">
        <h1>Advanced Irrigation Planning</h1>
        <p className="subtitle">
          Optimize water usage with precision irrigation recommendations based on weather forecasts, 
          soil moisture levels, and crop-specific water requirements.
        </p>
        
        <div className="premium-badge">
          <span className="premium-label">Premium Feature</span>
          <span className="info-tooltip">
            <FaInfo />
            <span className="tooltip-text">Advanced irrigation planning is a premium feature</span>
          </span>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          <FaChartBar /> Overview
        </button>
        <button 
          className={`tab-button ${selectedTab === 'soil' ? 'active' : ''}`}
          onClick={() => setSelectedTab('soil')}
        >
          <FaSeedling /> Soil Moisture
        </button>
        <button 
          className={`tab-button ${selectedTab === 'et' ? 'active' : ''}`}
          onClick={() => setSelectedTab('et')}
        >
          <FaTint /> Evapotranspiration
        </button>
        <button 
          className={`tab-button ${selectedTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setSelectedTab('schedule')}
        >
          <FaCalendarAlt /> Schedule
        </button>
        <button 
          className={`tab-button ${selectedTab === 'map' ? 'active' : ''}`}
          onClick={() => setSelectedTab('map')}
        >
          <FaMap /> Irrigation Map
        </button>
      </div>

      <div className="tab-content">
        {selectedTab === 'overview' && (
          <div className="overview-tab">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Current Field Status">
                <div className="field-status">
                  <div className="status-item">
                    <div className="status-label">Location</div>
                    <div className="status-value">{currentLocation?.name || 'No location selected'}</div>
                  </div>
                  <div className="status-item">
                    <div className="status-label">Current Soil Moisture</div>
                    <div className="status-value">
                      {fieldStatus.soilMoisture}% 
                      <span className="status-info">
                        ({fieldStatus.soilMoisture < 20 ? 'Dry' : 
                           fieldStatus.soilMoisture > 35 ? 'Wet' : 'Optimal'})
                      </span>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-label">Days Until Irrigation Needed</div>
                    <div className="status-value">
                      {fieldStatus.daysToIrrigation === 0 ? 'Irrigation needed now' : 
                       `${fieldStatus.daysToIrrigation} days`}
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-label">Last Rainfall</div>
                    <div className="status-value">
                      {fieldStatus.lastRainfall > 0 ? 
                        `${fieldStatus.lastRainfall}mm on ${fieldStatus.lastRainfallDate}` : 
                        'No recent rainfall'}
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-label">Average Temperature (5-day)</div>
                    <div className="status-value">{fieldStatus.averageTemperature}°C</div>
                  </div>
                </div>
              </Card>
              
              <Card title="Irrigation Recommendation">
                <div className="irrigation-recommendation">
                  <div className="recommendation-value">
                    {fieldStatus.recommendedAmount} mm
                  </div>
                  <div className="recommendation-label">
                    Recommended Irrigation Amount
                  </div>
                  <div className="recommendation-info">
                    {fieldStatus.recommendedAmount === 0 ? 
                      'No irrigation needed at this time. Soil moisture is sufficient.' : 
                      `Apply ${fieldStatus.recommendedAmount}mm of water to reach optimal soil moisture levels.`}
                  </div>
                  <div className="recommendation-timing">
                    Best time to irrigate: 
                    <span className="timing-value">
                      {fieldStatus.daysToIrrigation === 0 ? ' Today' : 
                       fieldStatus.daysToIrrigation === 1 ? ' Tomorrow' : 
                       ` In ${fieldStatus.daysToIrrigation} days`}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="mt-6">
              <Card title="7-Day Irrigation Schedule">
                <div className="schedule-table">
                  <div className="schedule-header">
                    <div className="schedule-cell">Day</div>
                    <div className="schedule-cell">Date</div>
                    <div className="schedule-cell">Forecast</div>
                    <div className="schedule-cell">Amount</div>
                    <div className="schedule-cell">Duration</div>
                    <div className="schedule-cell">Status</div>
                  </div>
                  {irrigationSchedule.map((day, index) => (
                    <div 
                      key={index} 
                      className={`schedule-row ${day.status === 'scheduled' ? 'scheduled' : 
                                              day.status === 'rain expected' ? 'rain' : ''}`}
                    >
                      <div className="schedule-cell">{day.day}</div>
                      <div className="schedule-cell">{new Date(day.date).toLocaleDateString()}</div>
                      <div className="schedule-cell">
                        {day.precipitation > 0 ? 
                          `${day.precipitation}mm rain` : 
                          'No rain'}
                      </div>
                      <div className="schedule-cell">{day.recommended} mm</div>
                      <div className="schedule-cell">{day.duration}</div>
                      <div className="schedule-cell status">
                        <span className={`status-badge ${day.status}`}>
                          {day.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card title="Water Usage Optimization">
                <div className="water-usage">
                  <div className="usage-comparison">
                    <div className="usage-item">
                      <div className="usage-label">Conventional</div>
                      <div className="usage-value">{waterUsageData.before} gal</div>
                    </div>
                    <div className="usage-arrow">→</div>
                    <div className="usage-item optimized">
                      <div className="usage-label">Optimized</div>
                      <div className="usage-value">{waterUsageData.after} gal</div>
                    </div>
                  </div>
                  <div className="usage-savings">
                    <div className="savings-value">
                      {waterUsageData.savingsPercent}%
                    </div>
                    <div className="savings-label">
                      Water Savings
                    </div>
                    <div className="savings-details">
                      {waterUsageData.savings} gallons saved over {waterUsageData.timePeriod}
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card title="Crop Yield Impact">
                <div className="yield-impact">
                  <div className="impact-comparison">
                    <div className="impact-item">
                      <div className="impact-label">Conventional</div>
                      <div className="impact-value">{yieldImpactData.baseline} tons/acre</div>
                    </div>
                    <div className="impact-arrow">→</div>
                    <div className="impact-item optimized">
                      <div className="impact-label">Optimized</div>
                      <div className="impact-value">{yieldImpactData.estimated} tons/acre</div>
                    </div>
                  </div>
                  <div className="impact-details">
                    <div className="detail-item">
                      <div className="detail-label">Yield Increase</div>
                      <div className="detail-value">
                        {Math.round((yieldImpactData.estimated - yieldImpactData.baseline) / 
                                   yieldImpactData.baseline * 100)}%
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Water Use Efficiency</div>
                      <div className="detail-value">
                        {yieldImpactData.waterUseEfficiency} tons/acre-inch
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {selectedTab === 'soil' && (
          <div className="soil-tab">
            <div className="grid grid-cols-1 gap-6">
              <Card title="Soil Type Selection">
                <div className="soil-selector">
                  <label htmlFor="soilType" className="mr-2">Select Soil Type:</label>
                  <select 
                    id="soilType" 
                    value={selectedSoilType}
                    onChange={(e) => setSelectedSoilType(e.target.value)}
                    className="soil-select"
                  >
                    <option value="sand">Sand</option>
                    <option value="loamySand">Loamy Sand</option>
                    <option value="sandyLoam">Sandy Loam</option>
                    <option value="loam">Loam</option>
                    <option value="siltLoam">Silt Loam</option>
                    <option value="clay">Clay</option>
                  </select>
                </div>
              </Card>
              
              <SoilMoistureProfile soilType={selectedSoilType} cropType={selectedCropType} />
              
              <Card title="Soil Moisture Interpretation">
                <div className="interpretation">
                  <h3>What This Means For Your Field</h3>
                  <p>
                    Soil moisture data shows the water content at different depths in your soil profile. 
                    This information helps determine when and how much to irrigate.
                  </p>
                  <ul className="interpretation-list">
                    <li>
                      <strong>Top Soil (0-10cm):</strong> This layer dries out first and shows immediate water needs.
                    </li>
                    <li>
                      <strong>Root Zone (10-30cm):</strong> This is where most crop roots access water. 
                      Maintaining adequate moisture here is critical for plant health.
                    </li>
                    <li>
                      <strong>Deep Profile (30-100cm):</strong> This represents water reserves. 
                      Monitoring changes here helps predict long-term moisture trends.
                    </li>
                  </ul>
                  <div className="methodology-note">
                    <FaInfo className="info-icon" />
                    <span>
                      Our soil moisture model incorporates weather data, soil physics, and crop water use 
                      to simulate moisture conditions throughout your soil profile.
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {selectedTab === 'et' && (
          <div className="et-tab">
            <div className="grid grid-cols-1 gap-6">
              <Card title="Crop & Growth Stage Selection">
                <div className="crop-selector">
                  <div className="selector-group">
                    <label htmlFor="cropType" className="mr-2">Crop Type:</label>
                    <select 
                      id="cropType" 
                      value={selectedCropType}
                      onChange={(e) => setSelectedCropType(e.target.value)}
                      className="crop-select"
                    >
                      <option value="corn">Corn</option>
                      <option value="wheat">Wheat</option>
                      <option value="soybean">Soybean</option>
                      <option value="cotton">Cotton</option>
                      <option value="potatoes">Potatoes</option>
                      <option value="tomatoes">Tomatoes</option>
                      <option value="alfalfa">Alfalfa</option>
                      <option value="almonds">Almonds</option>
                      <option value="grapes">Grapes</option>
                    </select>
                  </div>
                  
                  <div className="selector-group">
                    <label htmlFor="growthStage" className="mr-2">Growth Stage:</label>
                    <select 
                      id="growthStage" 
                      value={selectedGrowthStage}
                      onChange={(e) => setSelectedGrowthStage(e.target.value)}
                      className="stage-select"
                    >
                      <option value="initial">Initial</option>
                      <option value="development">Development</option>
                      <option value="mid">Mid-Season</option>
                      <option value="late">Late Season</option>
                    </select>
                  </div>
                </div>
              </Card>
              
              <ETCalculator cropType={selectedCropType} growthStage={selectedGrowthStage} />
              
              <Card title="Understanding Evapotranspiration">
                <div className="et-explanation">
                  <h3>How ET Affects Irrigation Decisions</h3>
                  <p>
                    Evapotranspiration (ET) represents the combined water loss from soil evaporation and 
                    plant transpiration. It's the most accurate way to determine crop water needs.
                  </p>
                  <div className="et-factors">
                    <div className="factor-item">
                      <h4>Weather Impact</h4>
                      <p>
                        Temperature, solar radiation, wind, and humidity all affect ET rates. 
                        Hot, sunny, windy days increase water loss.
                      </p>
                    </div>
                    <div className="factor-item">
                      <h4>Crop Coefficients</h4>
                      <p>
                        Different crops and growth stages have unique water requirements, 
                        represented by crop coefficients (Kc values).
                      </p>
                    </div>
                    <div className="factor-item">
                      <h4>Practical Application</h4>
                      <p>
                        Irrigation should replace water lost to ET, adjusted for rainfall 
                        and irrigation system efficiency.
                      </p>
                    </div>
                  </div>
                  <div className="methodology-note">
                    <FaInfo className="info-icon" />
                    <span>
                      Our ET calculations use the FAO Penman-Monteith equation, the gold standard 
                      for calculating reference evapotranspiration in agricultural applications.
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {selectedTab === 'schedule' && (
          <div className="schedule-tab">
            <Card title="Your Personalized Irrigation Schedule">
              <div className="schedule-controls">
                <div className="efficiency-section">
                  <label htmlFor="efficiency">Irrigation System Efficiency:</label>
                  <select id="efficiency" className="efficiency-select">
                    <option value="0.95">Drip (95%)</option>
                    <option value="0.85">Micro-sprinkler (85%)</option>
                    <option value="0.75">Sprinkler (75%)</option>
                    <option value="0.6">Furrow (60%)</option>
                    <option value="0.5">Flood (50%)</option>
                  </select>
                </div>
                
                <div className="schedule-actions">
                  <button className="action-button">Optimize Schedule</button>
                  <button className="action-button secondary">Export Schedule</button>
                </div>
              </div>
              
              <div className="detailed-schedule">
                <div className="schedule-table">
                  <div className="schedule-header">
                    <div className="schedule-cell">Day</div>
                    <div className="schedule-cell">Date</div>
                    <div className="schedule-cell">Weather</div>
                    <div className="schedule-cell">ET Rate</div>
                    <div className="schedule-cell">Soil Moisture</div>
                    <div className="schedule-cell">Amount</div>
                    <div className="schedule-cell">Start Time</div>
                    <div className="schedule-cell">Duration</div>
                  </div>
                  {irrigationSchedule.map((day, index) => (
                    <div 
                      key={index} 
                      className={`schedule-row ${day.status === 'scheduled' ? 'scheduled' : 
                                                day.status === 'rain expected' ? 'rain' : ''}`}
                    >
                      <div className="schedule-cell">{day.day}</div>
                      <div className="schedule-cell">{new Date(day.date).toLocaleDateString()}</div>
                      <div className="schedule-cell">
                        {day.precipitation > 0 ? 
                          `${day.precipitation}mm rain` : 
                          'No rain'}
                      </div>
                      <div className="schedule-cell">
                        {(3 + Math.random() * 2).toFixed(1)} mm
                      </div>
                      <div className="schedule-cell">
                        {Math.round(fieldStatus.soilMoisture - (index * 3) + (day.recommended || 0) + (day.precipitation || 0))}%
                      </div>
                      <div className="schedule-cell">{day.recommended} mm</div>
                      <div className="schedule-cell">
                        {day.status === 'scheduled' ? '6:00 AM' : '-'}
                      </div>
                      <div className="schedule-cell">{day.status === 'scheduled' ? day.duration : '-'}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="schedule-notes mt-4">
                <h4>Schedule Notes:</h4>
                <ul className="notes-list">
                  <li>
                    This schedule is optimized based on weather forecasts and may update as conditions change.
                  </li>
                  <li>
                    Irrigation is scheduled during early morning hours to minimize evaporation losses.
                  </li>
                  <li>
                    System assumes a flow rate of 10 gallons per minute for duration calculations.
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        )}
        
        {selectedTab === 'map' && (
          <div className="map-tab">
            <Card title="Irrigation Map" className="map-card">
              <div className="map-container">
                <div className="map-placeholder">
                  <div className="placeholder-content">
                    <FaMap className="placeholder-icon" />
                    <p>Interactive soil moisture and irrigation map view</p>
                    <p className="placeholder-note">
                      This feature displays spatial soil moisture patterns and irrigation recommendations 
                      across your fields.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="map-controls">
                <div className="layer-selector">
                  <span className="control-label">Map Layer:</span>
                  <div className="layer-buttons">
                    <button className="layer-button active">Soil Moisture</button>
                    <button className="layer-button">Irrigation Need</button>
                    <button className="layer-button">Forecast ET</button>
                    <button className="layer-button">Field Capacity</button>
                  </div>
                </div>
                
                <div className="time-selector">
                  <span className="control-label">Time Period:</span>
                  <div className="time-slider">
                    <input type="range" min="0" max="6" value="0" className="slider" />
                    <div className="slider-labels">
                      <span>Today</span>
                      <span>+3 Days</span>
                      <span>+7 Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default IrrigationDashboard;