import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import { calculateSoilMoistureProfile, calculatePlantAvailableWater } from '../../../utils/irrigation/soilMoistureCalculations';
import { useGlobalLocation } from '../../../context/LocationContext';
import { useWeatherData } from '../../../hooks/useWeatherData';
import './SoilMoistureProfile.css';

const SoilMoistureProfile = ({ soilType = 'loam', cropType = 'corn' }) => {
  const { currentLocation } = useGlobalLocation();
  const { weatherData, isLoading } = useWeatherData(currentLocation?.id);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Soil depths to analyze (in cm)
  const depths = [5, 10, 20, 30, 50, 100];
  
  useEffect(() => {
    if (isLoading || !weatherData) {
      return;
    }
    
    // Extract weather data needed for calculations
    const recentPrecipitation = weatherData.forecast
      ?.slice(0, 7)
      ?.reduce((total, day) => total + (day.precipitation || 0), 0) || 0;
    
    // Simplified ET calculation based on temperature
    const recentTemperatures = weatherData.forecast
      ?.slice(0, 7)
      ?.map(day => (day.tempHigh + day.tempLow) / 2) || [];
    
    const avgTemperature = recentTemperatures.length > 0 
      ? recentTemperatures.reduce((sum, temp) => sum + temp, 0) / recentTemperatures.length
      : 20; // Default if no data
    
    // Simple ET model (this would be much more complex in a real system)
    const estimatedET = avgTemperature * 0.15;
    
    // Calculate soil moisture for each depth
    const newProfileData = depths.map(depth => {
      const moisture = calculateSoilMoistureProfile(
        soilType,
        depth,
        recentPrecipitation,
        0, // Assuming no irrigation yet
        estimatedET
      );
      
      const paw = calculatePlantAvailableWater(soilType, moisture);
      
      return {
        depth,
        moisture,
        paw,
        status: getMoistureStatus(moisture, soilType)
      };
    });
    
    setProfileData(newProfileData);
    setLoading(false);
  }, [weatherData, isLoading, soilType, cropType, currentLocation]);

  // Helper function to determine moisture status
  const getMoistureStatus = (moisture, soilType) => {
    // These thresholds would ideally be based on the specific soil type
    // and crop requirements, but we'll use general thresholds for now
    if (soilType === 'sand') {
      if (moisture < 10) return 'dry';
      if (moisture > 30) return 'wet';
      return 'optimal';
    } else if (soilType === 'clay') {
      if (moisture < 25) return 'dry';
      if (moisture > 45) return 'wet';
      return 'optimal';
    } else {
      // Default for loam and other soil types
      if (moisture < 20) return 'dry';
      if (moisture > 35) return 'wet';
      return 'optimal';
    }
  };

  if (loading || isLoading) {
    return (
      <Card title="Soil Moisture Profile">
        <div className="loading-indicator">Loading soil moisture data...</div>
      </Card>
    );
  }

  return (
    <Card title="Soil Moisture Profile" className="soil-moisture-profile">
      <div className="soil-moisture-header">
        <div className="soil-info">
          <span className="soil-type">
            <strong>Soil Type:</strong> {soilType.charAt(0).toUpperCase() + soilType.slice(1)}
          </span>
          <span className="crop-type">
            <strong>Crop:</strong> {cropType.charAt(0).toUpperCase() + cropType.slice(1)}
          </span>
        </div>
        
        <div className="legend">
          <span className="legend-item dry">Dry</span>
          <span className="legend-item optimal">Optimal</span>
          <span className="legend-item wet">Wet</span>
        </div>
      </div>
      
      <div className="profile-visualization">
        {profileData && profileData.map((layer, index) => (
          <div key={index} className="layer-row">
            <div className="depth-label">{layer.depth} cm</div>
            <div className="moisture-bar-container">
              <div 
                className={`moisture-bar ${layer.status}`}
                style={{ width: `${layer.moisture}%` }}
              >
                {layer.moisture.toFixed(1)}%
              </div>
            </div>
            <div className="paw-value">PAW: {layer.paw.toFixed(0)}%</div>
          </div>
        ))}
      </div>
      
      <div className="profile-analysis">
        <h4>Analysis:</h4>
        <p>
          {profileData && profileData[0]?.status === 'dry' ? 
            "Top soil is dry. Consider irrigation soon to prevent water stress." :
            profileData && profileData[0]?.status === 'wet' ? 
            "Top soil is adequately wet. No immediate irrigation needed." :
            "Soil moisture is at optimal levels across most depths."}
        </p>
        <p>
          <strong>Plant Available Water (PAW)</strong> indicates the percentage of water 
          that plants can access, between wilting point and field capacity.
        </p>
      </div>
    </Card>
  );
};

export default SoilMoistureProfile;
