import React from 'react';
import { Link } from 'react-router-dom';
import { PremiumFeature, PREMIUM_FEATURES } from '../../utils/premiumFeatures';
import './PremiumWeatherMap.css';

/**
 * Premium weather map component that shows advanced weather visualization
 * Only accessible to users with appropriate subscription level
 */
const PremiumWeatherMap = () => {
  return (
    <div className="weather-map-container">
      <h2 className="weather-map-title">Advanced Weather Visualization</h2>
      
      <PremiumFeature 
        feature={PREMIUM_FEATURES.ADVANCED_WEATHER_MAPS}
        fallback={
          <div className="premium-feature-locked">
            <div className="lock-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
              </svg>
            </div>
            <h3>Premium Feature</h3>
            <p>Advanced weather maps with high-resolution imagery are available with Basic, Professional, and Enterprise subscriptions.</p>
            <Link to="/subscription" className="upgrade-button">Upgrade Now</Link>
          </div>
        }
      >
        {/* This content only shows for users with appropriate subscription level */}
        <div className="premium-weather-map">
          <div className="map-controls">
            <div className="map-layers">
              <h3>Map Layers</h3>
              <div className="layer-options">
                <label>
                  <input type="checkbox" defaultChecked /> Temperature
                </label>
                <label>
                  <input type="checkbox" defaultChecked /> Precipitation
                </label>
                <label>
                  <input type="checkbox" /> Wind Speed
                </label>
                <label>
                  <input type="checkbox" /> Humidity
                </label>
                <label>
                  <input type="checkbox" /> Pressure
                </label>
                <label>
                  <input type="checkbox" /> Cloud Cover
                </label>
              </div>
            </div>
            
            <div className="time-controls">
              <h3>Forecast Time</h3>
              <input type="range" min="0" max="120" defaultValue="0" className="time-slider" />
              <div className="time-labels">
                <span>Now</span>
                <span>+24h</span>
                <span>+48h</span>
                <span>+72h</span>
                <span>+120h</span>
              </div>
            </div>
          </div>
          
          <div className="map-display">
            {/* This would be replaced with an actual interactive map component */}
            <div className="demo-map">
              <div className="map-placeholder">
                <p>High-Resolution Weather Map</p>
                <p className="small-text">This is a placeholder for an interactive premium weather map.</p>
                <p className="small-text">In a real implementation, this would include a full weather visualization.</p>
              </div>
              
              <div className="map-legend">
                <h4>Temperature (°C)</h4>
                <div className="legend-gradient">
                  <div className="color-bar"></div>
                  <div className="legend-labels">
                    <span>-10</span>
                    <span>0</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PremiumFeature>
    </div>
  );
};

export default PremiumWeatherMap; 