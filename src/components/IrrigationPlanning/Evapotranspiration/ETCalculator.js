import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import { 
  calculateETo, 
  calculateETc, 
  getCropCoefficient,
  calculateSimplifiedET 
} from '../../../utils/irrigation/evapotranspirationCalculations';
import { useGlobalLocation } from '../../../context/LocationContext';
import { useWeatherData } from '../../../hooks/useWeatherData';
import './ETCalculator.css';

const ETCalculator = ({ cropType = 'corn', growthStage = 'mid' }) => {
  const { currentLocation } = useGlobalLocation();
  const { weatherData, isLoading } = useWeatherData(currentLocation?.id);
  const [etData, setEtData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calculate day of year
  const getDayOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  useEffect(() => {
    if (isLoading || !weatherData || !currentLocation) {
      return;
    }

    try {
      setLoading(true);
      
      // Extract required weather data
      const today = weatherData.forecast?.[0] || {};
      const tMin = today.tempLow || 15;
      const tMax = today.tempHigh || 25;
      const tMean = (tMin + tMax) / 2;
      const rh = today.humidity || 50;
      const windSpeed = (today.windSpeed || 3) / 3.6; // Convert km/h to m/s
      
      // Estimate solar radiation if not available
      // In a real application, this would come from actual weather data
      const currentDate = new Date();
      const dayOfYear = getDayOfYear(currentDate);
      
      // Use location coordinates
      const latitude = currentLocation.latitude || 0;
      const longitude = currentLocation.longitude || 0;
      
      // Estimate elevation (in a real app, this would come from location data)
      const elevation = 250; // default elevation in meters
      
      // Estimate solar radiation (simplified)
      const solarRadiation = estimateSolarRadiation(latitude, dayOfYear, tMin, tMax);
      
      // Calculate ETo using Penman-Monteith method
      const eto = calculateETo(
        tMin,
        tMax,
        rh,
        windSpeed,
        solarRadiation,
        elevation,
        latitude,
        dayOfYear
      );
      
      // Get crop coefficient
      const kc = getCropCoefficient(cropType, growthStage);
      
      // Calculate crop ET
      const etc = calculateETc(eto, kc);
      
      // Also calculate using simplified method for comparison
      const simplifiedEt = calculateSimplifiedET(tMean, latitude, dayOfYear, kc);
      
      // Set ET data
      setEtData({
        date: currentDate.toLocaleDateString(),
        eto,
        kc,
        etc,
        simplifiedEt,
        weather: {
          tMin, tMax, tMean, rh, windSpeed, solarRadiation
        },
        location: {
          latitude, longitude, elevation
        },
        // Project ET for the next 5 days (simplified)
        forecast: weatherData.forecast.slice(0, 5).map((day, i) => {
          const forecastTMin = day.tempLow || tMin;
          const forecastTMax = day.tempHigh || tMax;
          const forecastRh = day.humidity || rh;
          const forecastWindSpeed = (day.windSpeed || windSpeed * 3.6) / 3.6;
          const forecastSolarRad = estimateSolarRadiation(latitude, dayOfYear + i + 1, forecastTMin, forecastTMax);
          
          const forecastEto = calculateETo(
            forecastTMin,
            forecastTMax,
            forecastRh,
            forecastWindSpeed,
            forecastSolarRad,
            elevation,
            latitude,
            dayOfYear + i + 1
          );
          
          return {
            date: new Date(currentDate.getTime() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            eto: forecastEto,
            etc: forecastEto * kc
          };
        })
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error calculating ET:', error);
      setLoading(false);
    }
  }, [weatherData, isLoading, cropType, growthStage, currentLocation]);

  // Helper function to estimate solar radiation
  const estimateSolarRadiation = (latitude, dayOfYear, tMin, tMax) => {
    // Calculate extraterrestrial radiation (Ra)
    const latitudeRad = (Math.PI / 180) * latitude;
    const solarDeclination = 0.409 * Math.sin(2 * Math.PI * dayOfYear / 365 - 1.39);
    const sunsetHourAngle = Math.acos(-Math.tan(latitudeRad) * Math.tan(solarDeclination));
    const dr = 1 + 0.033 * Math.cos(2 * Math.PI * dayOfYear / 365);
    
    const ra = 24 * 60 / Math.PI * 0.0820 * dr * (
      sunsetHourAngle * Math.sin(latitudeRad) * Math.sin(solarDeclination) +
      Math.cos(latitudeRad) * Math.cos(solarDeclination) * Math.sin(sunsetHourAngle)
    );
    
    // Hargreaves-Samani relation for estimating solar radiation
    // Rs = 0.16 * Ra * sqrt(Tmax - Tmin)
    return 0.16 * ra * Math.sqrt(tMax - tMin);
  };

  if (loading || isLoading) {
    return (
      <Card title="Evapotranspiration Calculator">
        <div className="loading-indicator">Calculating evapotranspiration...</div>
      </Card>
    );
  }

  return (
    <Card title="Evapotranspiration Calculator" className="et-calculator">
      <div className="et-header">
        <div className="crop-info">
          <span className="crop-type">
            <strong>Crop:</strong> {cropType.charAt(0).toUpperCase() + cropType.slice(1)}
          </span>
          <span className="growth-stage">
            <strong>Growth Stage:</strong> {growthStage.charAt(0).toUpperCase() + growthStage.slice(1)}
          </span>
          <span className="crop-coefficient">
            <strong>Kc:</strong> {etData?.kc.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="et-current">
        <div className="et-value-container">
          <div className="et-label">Reference ET<sub>o</sub></div>
          <div className="et-value">{etData?.eto.toFixed(2)}</div>
          <div className="et-unit">mm/day</div>
        </div>
        
        <div className="et-arrow">→</div>
        
        <div className="et-value-container primary">
          <div className="et-label">Crop ET<sub>c</sub></div>
          <div className="et-value">{etData?.etc.toFixed(2)}</div>
          <div className="et-unit">mm/day</div>
        </div>
      </div>
      
      <div className="et-weather-factors">
        <h4>Current Weather Factors:</h4>
        <div className="factors-grid">
          <div className="factor">
            <span className="factor-label">Temperature:</span>
            <span className="factor-value">{etData?.weather.tMin.toFixed(1)}°C to {etData?.weather.tMax.toFixed(1)}°C</span>
          </div>
          <div className="factor">
            <span className="factor-label">Humidity:</span>
            <span className="factor-value">{etData?.weather.rh}%</span>
          </div>
          <div className="factor">
            <span className="factor-label">Wind Speed:</span>
            <span className="factor-value">{(etData?.weather.windSpeed * 3.6).toFixed(1)} km/h</span>
          </div>
          <div className="factor">
            <span className="factor-label">Solar Radiation:</span>
            <span className="factor-value">{etData?.weather.solarRadiation.toFixed(1)} MJ/m²/day</span>
          </div>
        </div>
      </div>
      
      <div className="et-forecast">
        <h4>5-Day ET Forecast:</h4>
        <div className="forecast-table">
          <div className="forecast-row header">
            <div className="forecast-cell">Date</div>
            <div className="forecast-cell">ET<sub>o</sub> (mm)</div>
            <div className="forecast-cell">ET<sub>c</sub> (mm)</div>
          </div>
          {etData?.forecast.map((day, index) => (
            <div className="forecast-row" key={index}>
              <div className="forecast-cell">{day.date}</div>
              <div className="forecast-cell">{day.eto.toFixed(2)}</div>
              <div className="forecast-cell">{day.etc.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="et-explanation">
        <p>
          <strong>ET<sub>o</sub></strong> is the reference evapotranspiration representing water use by a well-watered grass reference crop.
        </p>
        <p>
          <strong>ET<sub>c</sub></strong> is the crop evapotranspiration representing actual water use by your {cropType} crop.
        </p>
        <p>
          <strong>Kc</strong> is the crop coefficient that adjusts reference ET to your specific crop and its growth stage.
        </p>
      </div>
    </Card>
  );
};

export default ETCalculator;
