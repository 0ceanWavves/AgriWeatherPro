import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { usePremiumFeatures, PREMIUM_FEATURES } from '../../utils/premiumFeatures';
import './PremiumFeatures.css';

/**
 * PremiumFeatures component displays premium features available to the user
 * based on their subscription tier
 */
const PremiumFeatures = () => {
  const { profile, subscription } = useUserProfile();
  const { getUserFeatures, hasFeatureAccess } = usePremiumFeatures();
  
  // Get all features available to the user
  const availableFeatures = getUserFeatures();
  
  // Group features by category
  const weatherFeatures = Object.values(PREMIUM_FEATURES)
    .filter(feature => feature.startsWith('weather_') && availableFeatures.includes(feature));
    
  const irrigationFeatures = Object.values(PREMIUM_FEATURES)
    .filter(feature => feature.startsWith('irrigation_') && availableFeatures.includes(feature));
    
  const cropFeatures = Object.values(PREMIUM_FEATURES)
    .filter(feature => feature.startsWith('crop_') && availableFeatures.includes(feature));
    
  const generalFeatures = Object.values(PREMIUM_FEATURES)
    .filter(feature => 
      !feature.startsWith('weather_') && 
      !feature.startsWith('irrigation_') && 
      !feature.startsWith('crop_') && 
      availableFeatures.includes(feature)
    );
  
  // Generate human-readable feature names
  const getFeatureName = (feature) => {
    return feature
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="premium-features-container">
      <div className="subscription-header">
        <div className="subscription-info">
          <h2>Your Subscription</h2>
          <div className="current-plan">
            <span className="plan-label">Current Plan:</span>
            <span className={`plan-badge ${subscription?.plan_name?.toLowerCase() || 'free'}`}>
              {subscription?.plan_name || 'Free'}
            </span>
          </div>
          
          {subscription?.current_period_end && (
            <div className="renewal-info">
              Next billing date: {new Date(subscription.current_period_end).toLocaleDateString()}
            </div>
          )}
        </div>
        
        <div className="subscription-actions">
          {(!subscription || subscription?.plan_name === 'Free') ? (
            <Link to="/subscription" className="btn upgrade-btn">Upgrade Plan</Link>
          ) : (
            <>
              <Link to="/subscription" className="btn change-plan-btn">Change Plan</Link>
              <Link to="/account/billing" className="btn manage-btn">Manage Billing</Link>
            </>
          )}
        </div>
      </div>
      
      <div className="features-section">
        <h3>Your Premium Features</h3>
        
        {(weatherFeatures.length === 0 && 
          irrigationFeatures.length === 0 && 
          cropFeatures.length === 0 && 
          generalFeatures.length === 0) ? (
          <div className="no-premium-features">
            <p>You don't have access to any premium features yet.</p>
            <p>Upgrade your subscription to unlock additional features.</p>
            <Link to="/subscription" className="btn upgrade-btn">View Plans</Link>
          </div>
        ) : (
          <div className="features-grid">
            {weatherFeatures.length > 0 && (
              <div className="feature-category">
                <h4>Weather Analytics</h4>
                <ul className="feature-list">
                  {weatherFeatures.map((feature) => (
                    <li key={feature} className="feature-item">
                      <span className="feature-icon weather-icon">⛅</span>
                      <span className="feature-name">{getFeatureName(feature.replace('weather_', ''))}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {irrigationFeatures.length > 0 && (
              <div className="feature-category">
                <h4>Irrigation Planning</h4>
                <ul className="feature-list">
                  {irrigationFeatures.map((feature) => (
                    <li key={feature} className="feature-item">
                      <span className="feature-icon irrigation-icon">💧</span>
                      <span className="feature-name">{getFeatureName(feature.replace('irrigation_', ''))}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {cropFeatures.length > 0 && (
              <div className="feature-category">
                <h4>Crop Management</h4>
                <ul className="feature-list">
                  {cropFeatures.map((feature) => (
                    <li key={feature} className="feature-item">
                      <span className="feature-icon crop-icon">🌱</span>
                      <span className="feature-name">{getFeatureName(feature.replace('crop_', ''))}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {generalFeatures.length > 0 && (
              <div className="feature-category">
                <h4>General Features</h4>
                <ul className="feature-list">
                  {generalFeatures.map((feature) => (
                    <li key={feature} className="feature-item">
                      <span className="feature-icon general-icon">✓</span>
                      <span className="feature-name">{getFeatureName(feature)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="all-plans-section">
        <h3>All Available Plans</h3>
        <div className="plans-overview">
          <div className={`plan-card ${subscription?.plan_name === 'Free' ? 'current-plan' : ''}`}>
            <div className="plan-header">
              <h4>Free</h4>
              <div className="plan-price">$0<span>/month</span></div>
            </div>
            <ul className="plan-features">
              <li>Basic weather forecasts</li>
              <li>Limited location saving</li>
              <li>Standard weather alerts</li>
            </ul>
            {subscription?.plan_name !== 'Free' && (
              <Link to="/subscription?plan=free" className="btn downgrade-btn">Downgrade</Link>
            )}
          </div>
          
          <div className={`plan-card ${subscription?.plan_name === 'Basic' ? 'current-plan' : ''}`}>
            <div className="plan-header">
              <h4>Basic</h4>
              <div className="plan-price">$4.99<span>/month</span></div>
            </div>
            <ul className="plan-features">
              <li>Advanced weather forecasts</li>
              <li>10 saved locations</li>
              <li>Custom weather alerts</li>
              <li>Basic irrigation planning</li>
            </ul>
            {subscription?.plan_name !== 'Basic' && (
              <Link to="/subscription?plan=basic" className="btn upgrade-btn">Select</Link>
            )}
          </div>
          
          <div className={`plan-card ${subscription?.plan_name === 'Professional' ? 'current-plan' : ''}`}>
            <div className="plan-header">
              <h4>Professional</h4>
              <div className="plan-price">$9.99<span>/month</span></div>
            </div>
            <ul className="plan-features">
              <li>High-resolution weather maps</li>
              <li>Unlimited saved locations</li>
              <li>Advanced irrigation planning</li>
              <li>Crop prediction tools</li>
              <li>Historical weather data</li>
            </ul>
            {subscription?.plan_name !== 'Professional' && (
              <Link to="/subscription?plan=professional" className="btn upgrade-btn">Select</Link>
            )}
          </div>
          
          <div className={`plan-card ${subscription?.plan_name === 'Enterprise' ? 'current-plan' : ''}`}>
            <div className="plan-header">
              <h4>Enterprise</h4>
              <div className="plan-price">$24.99<span>/month</span></div>
            </div>
            <ul className="plan-features">
              <li>All Professional features</li>
              <li>API access</li>
              <li>Advanced analytics</li>
              <li>Custom reporting</li>
              <li>Priority support</li>
            </ul>
            {subscription?.plan_name !== 'Enterprise' && (
              <Link to="/subscription?plan=enterprise" className="btn upgrade-btn">Select</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures; 