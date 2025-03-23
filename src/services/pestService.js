import axios from 'axios';

// Base URL for pest data API
const PEST_API_BASE_URL = process.env.PEST_API_URL || 'https://api.pestmonitor.org/v1';
const API_KEY = process.env.PEST_API_KEY;

/**
 * Fetches current pest alerts for a specific location
 * 
 * @param {Object} location - Location object with lat and lon properties
 * @param {Array} crops - Array of crop types to get alerts for
 * @returns {Promise<Array>} - Array of pest alerts
 */
export const getPestAlerts = async (location, crops = []) => {
  try {
    // For development/testing - return mock data if no API key
    if (!API_KEY) {
      return getMockPestAlerts(location, crops);
    }
    
    const response = await axios.get(`${PEST_API_BASE_URL}/alerts`, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        crops: crops.join(','),
        radius: 50, // km
        api_key: API_KEY
      }
    });
    
    return response.data.alerts.map(alert => ({
      level: alert.risk_level,
      pest: alert.pest_name,
      description: alert.description,
      scientificName: alert.scientific_name,
      severity: alert.risk_level // Map API risk_level to our severity property
    }));
  } catch (error) {
    console.error('Error fetching pest alerts:', error);
    // Fallback to mock data on error
    return getMockPestAlerts(location, crops);
  }
};

/**
 * Fetches detailed information about a specific pest
 * 
 * @param {string} pestId - ID of the pest to fetch details for
 * @returns {Promise<Object>} - Detailed pest information
 */
export const getPestDetails = async (pestId) => {
  try {
    if (!API_KEY) {
      return getMockPestDetails(pestId);
    }
    
    const response = await axios.get(`${PEST_API_BASE_URL}/pests/${pestId}`, {
      params: {
        api_key: API_KEY
      }
    });
    
    return {
      id: response.data.id,
      name: response.data.common_name,
      scientificName: response.data.scientific_name,
      description: response.data.description,
      symptoms: response.data.symptoms,
      management: response.data.management_strategies,
      image: response.data.image_url,
      severity: response.data.current_risk_level
    };
  } catch (error) {
    console.error('Error fetching pest details:', error);
    return getMockPestDetails(pestId);
  }
};

/**
 * Get regional pest database information
 * 
 * @param {string} region - Region identifier (e.g., 'california', 'mena')
 * @returns {Promise<Array>} - Array of regional pests
 */
export const getRegionalPestDatabase = async (region) => {
  try {
    if (!API_KEY) {
      return getMockRegionalPests(region);
    }
    
    const response = await axios.get(`${PEST_API_BASE_URL}/regions/${region}/pests`, {
      params: {
        api_key: API_KEY
      }
    });
    
    return response.data.pests.map(pest => ({
      id: pest.id,
      name: pest.common_name,
      scientificName: pest.scientific_name,
      description: pest.description
    }));
  } catch (error) {
    console.error(`Error fetching ${region} pest database:`, error);
    return getMockRegionalPests(region);
  }
};

// Mock data functions for development/testing without API
const getMockPestAlerts = (location, crops) => {
  return [
    {
      level: 'High',
      pest: 'Apple Maggot',
      description: 'Current weather conditions are favorable for apple maggot activity in orchards.',
      scientificName: 'Rhagoletis pomonella'
    },
    {
      level: 'Medium',
      pest: 'Powdery Mildew',
      description: 'Moderate risk of powdery mildew in wheat fields due to recent humidity levels.',
      scientificName: 'Blumeria graminis'
    },
    {
      level: 'Low',
      pest: 'Corn Earworm',
      description: 'Low pressure expected for corn earworm in the coming week based on temperature trends.',
      scientificName: 'Helicoverpa zea'
    }
  ];
};

const getMockPestDetails = (pestId) => {
  const pests = {
    'apple-maggot': {
      id: 'apple-maggot',
      name: 'Apple Maggot',
      scientificName: 'Rhagoletis pomonella',
      description: 'A serious pest of apples that can cause significant crop damage if not controlled.',
      symptoms: 'Dimpling on fruit surface, tunneling through fruit flesh, premature fruit drop.',
      management: 'Use sticky traps, apply appropriate insecticides at emergence, maintain orchard sanitation.',
      image: 'https://example.com/images/apple-maggot.jpg',
      severity: 'High'
    },
    'powdery-mildew': {
      id: 'powdery-mildew',
      name: 'Powdery Mildew',
      scientificName: 'Blumeria graminis',
      description: 'A fungal disease affecting grains and grasses that appears as white powder on leaves.',
      symptoms: 'White powdery spots on leaves and stems, yellowing of infected tissue, reduced yield.',
      management: 'Apply fungicides preventatively, plant resistant varieties, ensure proper field ventilation.',
      image: 'https://example.com/images/powdery-mildew.jpg',
      severity: 'Medium'
    }
  };
  
  return pests[pestId] || pests['apple-maggot'];
};

const getMockRegionalPests = (region) => {
  const databases = {
    'california': [
      {
        id: 'ca-citrus-psyllid',
        name: 'Asian Citrus Psyllid',
        scientificName: 'Diaphorina citri',
        description: 'Vector for citrus greening disease, a major threat to California citrus industry.'
      },
      {
        id: 'ca-vine-mealybug',
        name: 'Vine Mealybug',
        scientificName: 'Planococcus ficus',
        description: 'Serious pest of grape vineyards throughout California wine regions.'
      }
    ],
    'mena': [
      {
        id: 'mena-red-palm-weevil',
        name: 'Red Palm Weevil',
        scientificName: 'Rhynchophorus ferrugineus',
        description: 'Devastating pest of date palms throughout the Middle East and North Africa.'
      },
      {
        id: 'mena-dubas-bug',
        name: 'Dubas Bug',
        scientificName: 'Ommatissus lybicus',
        description: 'Major pest affecting date palm productivity in the MENA region.'
      }
    ]
  };
  
  return databases[region] || [];
}; 