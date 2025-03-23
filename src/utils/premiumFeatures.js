import React from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { checkFeatureAccess } from '../services/subscriptionService';

// Premium features list
export const PREMIUM_FEATURES = {
  // Weather analytics features
  WEATHER_ANALYTICS: {
    HOURLY_FORECAST: 'hourly_forecast',
    EXTENDED_FORECAST: 'extended_forecast',
    ADVANCED_WEATHER_MAPS: 'advanced_weather_maps',
    HISTORICAL_DATA: 'historical_data',
    WEATHER_ALERTS_PLUS: 'weather_alerts_plus',
    SEVERE_WEATHER_WARNINGS: 'severe_weather_warnings',
    RADAR_ANIMATIONS: 'radar_animations',
  },
  
  // Irrigation planning features
  IRRIGATION: {
    BASIC_IRRIGATION_PLANNING: 'basic_irrigation_planning',
    ADVANCED_IRRIGATION_PLANNING: 'advanced_irrigation_planning',
    WATER_CONSERVATION_TOOLS: 'water_conservation_tools',
    SOIL_MOISTURE_ANALYSIS: 'soil_moisture_analysis',
    IRRIGATION_AUTOMATION: 'irrigation_automation',
  },
  
  // Crop management features
  CROP_MANAGEMENT: {
    CROP_CALENDARS: 'crop_calendars',
    DISEASE_RISK_MODELS: 'disease_risk_models',
    CROP_GROWTH_MODELS: 'crop_growth_models',
    PEST_MANAGEMENT: 'pest_management',
    YIELD_PREDICTION: 'yield_prediction',
  },
  
  // General features
  GENERAL: {
    API_ACCESS: 'api_access',
    DATA_EXPORT: 'data_export',
    CUSTOM_ALERTS: 'custom_alerts',
    PRIORITY_SUPPORT: 'priority_support',
    MULTI_FARM_MANAGEMENT: 'multi_farm_management',
  }
};

// Map features to subscription tiers
export const FEATURE_TIER_MAP = {
  // Free tier features
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.HOURLY_FORECAST]: ['free', 'basic', 'professional', 'enterprise'],
  
  // Basic tier features
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.EXTENDED_FORECAST]: ['basic', 'professional', 'enterprise'],
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.WEATHER_ALERTS_PLUS]: ['basic', 'professional', 'enterprise'],
  [PREMIUM_FEATURES.GENERAL.CUSTOM_ALERTS]: ['basic', 'professional', 'enterprise'],
  
  // Professional tier features
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.ADVANCED_WEATHER_MAPS]: ['professional', 'enterprise'],
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.HISTORICAL_DATA]: ['professional', 'enterprise'],
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.SEVERE_WEATHER_WARNINGS]: ['professional', 'enterprise'],
  [PREMIUM_FEATURES.IRRIGATION.BASIC_IRRIGATION_PLANNING]: ['professional', 'enterprise'],
  [PREMIUM_FEATURES.IRRIGATION.WATER_CONSERVATION_TOOLS]: ['professional', 'enterprise'],
  [PREMIUM_FEATURES.CROP_MANAGEMENT.CROP_CALENDARS]: ['professional', 'enterprise'],
  [PREMIUM_FEATURES.GENERAL.DATA_EXPORT]: ['professional', 'enterprise'],
  
  // Enterprise tier features
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.RADAR_ANIMATIONS]: ['enterprise'],
  [PREMIUM_FEATURES.IRRIGATION.ADVANCED_IRRIGATION_PLANNING]: ['enterprise'],
  [PREMIUM_FEATURES.IRRIGATION.SOIL_MOISTURE_ANALYSIS]: ['enterprise'],
  [PREMIUM_FEATURES.IRRIGATION.IRRIGATION_AUTOMATION]: ['enterprise'],
  [PREMIUM_FEATURES.CROP_MANAGEMENT.DISEASE_RISK_MODELS]: ['enterprise'],
  [PREMIUM_FEATURES.CROP_MANAGEMENT.CROP_GROWTH_MODELS]: ['enterprise'],
  [PREMIUM_FEATURES.CROP_MANAGEMENT.PEST_MANAGEMENT]: ['enterprise'],
  [PREMIUM_FEATURES.CROP_MANAGEMENT.YIELD_PREDICTION]: ['enterprise'],
  [PREMIUM_FEATURES.GENERAL.API_ACCESS]: ['enterprise'],
  [PREMIUM_FEATURES.GENERAL.PRIORITY_SUPPORT]: ['enterprise'],
  [PREMIUM_FEATURES.GENERAL.MULTI_FARM_MANAGEMENT]: ['enterprise'],
};

// Human-readable feature names for display
export const FEATURE_DISPLAY_NAMES = {
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.HOURLY_FORECAST]: 'Hourly Weather Forecast',
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.EXTENDED_FORECAST]: 'Extended 10-Day Forecast',
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.ADVANCED_WEATHER_MAPS]: 'Advanced Weather Maps',
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.HISTORICAL_DATA]: 'Historical Weather Data',
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.WEATHER_ALERTS_PLUS]: 'Enhanced Weather Alerts',
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.SEVERE_WEATHER_WARNINGS]: 'Severe Weather Warnings',
  [PREMIUM_FEATURES.WEATHER_ANALYTICS.RADAR_ANIMATIONS]: 'Radar Animations & Modeling',
  
  [PREMIUM_FEATURES.IRRIGATION.BASIC_IRRIGATION_PLANNING]: 'Basic Irrigation Planning',
  [PREMIUM_FEATURES.IRRIGATION.ADVANCED_IRRIGATION_PLANNING]: 'Advanced Irrigation Planning',
  [PREMIUM_FEATURES.IRRIGATION.WATER_CONSERVATION_TOOLS]: 'Water Conservation Tools',
  [PREMIUM_FEATURES.IRRIGATION.SOIL_MOISTURE_ANALYSIS]: 'Soil Moisture Analysis',
  [PREMIUM_FEATURES.IRRIGATION.IRRIGATION_AUTOMATION]: 'Irrigation Automation Recommendations',
  
  [PREMIUM_FEATURES.CROP_MANAGEMENT.CROP_CALENDARS]: 'Crop Calendars',
  [PREMIUM_FEATURES.CROP_MANAGEMENT.DISEASE_RISK_MODELS]: 'Disease Risk Models',
  [PREMIUM_FEATURES.CROP_MANAGEMENT.CROP_GROWTH_MODELS]: 'Crop Growth Models',
  [PREMIUM_FEATURES.CROP_MANAGEMENT.PEST_MANAGEMENT]: 'Pest Management Forecasts',
  [PREMIUM_FEATURES.CROP_MANAGEMENT.YIELD_PREDICTION]: 'Yield Prediction Tools',
  
  [PREMIUM_FEATURES.GENERAL.API_ACCESS]: 'API Access',
  [PREMIUM_FEATURES.GENERAL.DATA_EXPORT]: 'Data Export (CSV, PDF)',
  [PREMIUM_FEATURES.GENERAL.CUSTOM_ALERTS]: 'Custom Weather Alerts',
  [PREMIUM_FEATURES.GENERAL.PRIORITY_SUPPORT]: 'Priority Support',
  [PREMIUM_FEATURES.GENERAL.MULTI_FARM_MANAGEMENT]: 'Multi-Farm Management',
};

/**
 * Hook to check if user has access to premium features
 */
export const usePremiumFeatures = () => {
  const { subscription, getSubscriptionTier } = useUserProfile();
  
  /**
   * Check if user has access to a specific feature via server-side call
   * @param {string} featureKey - The feature key to check
   * @returns {Promise<boolean>} - Whether the user has access
   */
  const checkFeatureAccess = async (featureKey) => {
    try {
      const result = await checkFeatureAccess(featureKey);
      return result.success ? result.hasAccess : false;
    } catch (error) {
      console.error(`Error checking access to feature ${featureKey}:`, error);
      return false;
    }
  };
  
  /**
   * Estimate if user has access to a feature based on subscription tier
   * This is synchronous and doesn't require an API call
   * @param {string} featureKey - The feature key to check
   * @returns {boolean} - Whether the user likely has access
   */
  const hasFeatureAccess = (featureKey) => {
    // Get user's subscription tier
    const tier = getSubscriptionTier();
    
    // Check if feature exists in the tier map
    if (!FEATURE_TIER_MAP[featureKey]) {
      console.warn(`Feature ${featureKey} not found in tier mapping`);
      return false;
    }
    
    // Check if user's tier has access to this feature
    return FEATURE_TIER_MAP[featureKey].includes(tier);
  };
  
  /**
   * Get all features available to the current user
   * @returns {Array<string>} - Array of feature keys
   */
  const getUserFeatures = () => {
    const tier = getSubscriptionTier();
    
    return Object.keys(FEATURE_TIER_MAP).filter(featureKey => 
      FEATURE_TIER_MAP[featureKey].includes(tier)
    );
  };
  
  return {
    checkFeatureAccess,
    hasFeatureAccess,
    getUserFeatures,
    subscription
  };
};

/**
 * Component that conditionally renders content based on premium feature access
 * @param {Object} props - Component props
 * @param {string} props.featureKey - The feature key to check
 * @param {React.ReactNode} props.children - Content to render if user has access
 * @param {React.ReactNode} props.fallback - Content to render if user doesn't have access
 */
export const PremiumFeature = ({ featureKey, children, fallback }) => {
  const { hasFeatureAccess } = usePremiumFeatures();
  const hasAccess = hasFeatureAccess(featureKey);
  
  return hasAccess ? children : (fallback || null);
}; 