/**
 * Region detection and location-aware data utilities
 */

// Check if location is in Middle East/North Africa region
export const isMiddleEastRegion = (location) => {
  // Rough bounding box for MENA region
  return (
    // Arabia, UAE, Saudi Arabia, Egypt, Morocco, etc.
    (location.lat >= 10 && location.lat <= 40 &&
    location.lng >= 20 && location.lng <= 60) ||
    // Check for common city names
    location.name?.includes('Dubai') ||
    location.name?.includes('Riyadh') ||
    location.name?.includes('Cairo') ||
    location.name?.includes('Medina') ||
    location.name?.includes('Abu Dhabi')
  );
};

// Check if location is in California
export const isCaliforniaRegion = (location) => {
  // California bounding box
  return (
    (location.lat >= 32.5 && location.lat <= 42 &&
    location.lng >= -124.5 && location.lng <= -114.5) ||
    // Check for common city names
    location.name?.includes('San Francisco') ||
    location.name?.includes('Los Angeles') ||
    location.name?.includes('Sacramento') ||
    location.name?.includes('San Diego') ||
    location.name?.includes('Fresno') ||
    location.name?.includes('California')
  );
};

// Check if location is in Southeast Asia
export const isSoutheastAsiaRegion = (location) => {
  // Southeast Asia bounding box (Thailand, Vietnam, Indonesia, Philippines, Myanmar)
  return (
    (location.lat >= -10 && location.lat <= 28 &&
    location.lng >= 92 && location.lng <= 140) ||
    // Check for common city names
    location.name?.includes('Bangkok') ||
    location.name?.includes('Hanoi') ||
    location.name?.includes('Jakarta') ||
    location.name?.includes('Manila') ||
    location.name?.includes('Yangon') ||
    location.name?.includes('Vietnam') ||
    location.name?.includes('Thailand') ||
    location.name?.includes('Indonesia') ||
    location.name?.includes('Philippines') ||
    location.name?.includes('Myanmar')
  );
};

// Get default locations for regions
export const getDefaultLocationForRegion = (regionCode) => {
  const defaultLocations = {
    'MENA': {
      name: 'Dubai, UAE',
      lat: 25.276987,
      lng: 55.296249
    },
    'california': {
      name: 'Fresno, California',
      lat: 36.7468,
      lng: -119.7726
    },
    'asia': {
      name: 'Bangkok, Thailand',
      lat: 13.7563,
      lng: 100.5018
    },
    'default': {
      name: 'San Francisco',
      lat: 37.7749,
      lng: -122.4194
    }
  };

  return defaultLocations[regionCode] || defaultLocations.default;
};

// Get region code for a location
export const getRegionForLocation = (location) => {
  if (isMiddleEastRegion(location)) return 'MENA';
  if (isCaliforniaRegion(location)) return 'california'; 
  if (isSoutheastAsiaRegion(location)) return 'asia';
  return 'default';
};

// Get pest data based on location
export const getPestDataByRegion = (location) => {
  if (isMiddleEastRegion(location)) {
    return [
      {
        level: 'High',
        pest: 'Red Palm Weevil',
        description: 'High risk for date palm infestations. Inspect palms for signs of trunk damage and fermented odor.'
      },
      {
        level: 'Medium',
        pest: 'Dubas Bug',
        description: 'Moderate risk for date palms. Check for honeydew secretions on fronds and white dusty residue.'
      },
      {
        level: 'Low',
        pest: 'Date Palm Scale',
        description: 'Current conditions less favorable for date palm scale. Monitor for white crust on fronds.'
      }
    ];
  } else if (isCaliforniaRegion(location)) {
    return [
      {
        level: 'Medium',
        pest: 'Navel Orangeworm',
        description: 'Conditions favorable for pest activity in almond orchards.'
      },
      {
        level: 'Low',
        pest: 'Peach Twig Borer',
        description: 'Current conditions unfavorable for significant pest pressure.'
      }
    ];
  } else if (isSoutheastAsiaRegion(location)) {
    return [
      {
        level: 'High',
        pest: 'Rice Stem Borer',
        description: 'High risk period for rice stem borer infestation. Check for white heads and dead hearts in rice paddies.'
      },
      {
        level: 'Medium',
        pest: 'Brown Planthopper',
        description: 'Moderate risk for rice crops. Monitor for hopperburn symptoms and honeydew secretions.'
      },
      {
        level: 'Medium',
        pest: 'Rice Blast',
        description: 'Current weather conditions support fungal development. Watch for leaf lesions, especially in susceptible varieties.'
      }
    ];
  }

  // Default data
  return [
    {
      level: 'Medium',
      pest: 'Generic Pest',
      description: 'Set your location for region-specific pest alerts.'
    }
  ];
};

// Get crop data based on location
export const getCropDataByRegion = (location) => {
  if (isMiddleEastRegion(location)) {
    return [
      { name: 'Date Palms', status: 'Growing', color: 'yellow' },
      { name: 'Citrus', status: 'Fruiting', color: 'green' },
      { name: 'Olives', status: 'Growing', color: 'yellow' },
      { name: 'Pomegranates', status: 'Flowering', color: 'blue' }
    ];
  } else if (isCaliforniaRegion(location)) {
    return [
      { name: 'Almonds', status: 'Harvest', color: 'green' },
      { name: 'Grapes', status: 'Growing', color: 'yellow' },
      { name: 'Tomatoes', status: 'Growing', color: 'yellow' },
      { name: 'Lettuce', status: 'Planting', color: 'blue' }
    ];
  } else if (isSoutheastAsiaRegion(location)) {
    return [
      { name: 'Rice (Wet Season)', status: 'Growing', color: 'yellow' },
      { name: 'Rice (Dry Season)', status: 'Harvest', color: 'green' },
      { name: 'Cassava', status: 'Growing', color: 'yellow' },
      { name: 'Vegetables', status: 'Planting', color: 'blue' }
    ];
  }

  // Default crops
  return [
    { name: 'Wheat', status: 'Growing', color: 'yellow' },
    { name: 'Corn', status: 'Harvest', color: 'green' },
    { name: 'Soybeans', status: 'Growing', color: 'yellow' },
    { name: 'Rice', status: 'Planting', color: 'blue' }
  ];
};

// Get services data based on location
export const getServicesDataByRegion = (location) => {
  const baseServices = [
    {
      id: 'irrigation',
      name: 'Irrigation Planning',
      icon: 'water',
      url: '/services/irrigation-planning',
      description: 'Smart irrigation scheduling based on weather',
      relevance: 'Medium'
    },
    {
      id: 'yield-prediction',
      name: 'Crop Yield Prediction',
      icon: 'seedling',
      url: '/crop-yields',
      description: 'AI-powered yield forecasting',
      relevance: 'Medium'
    },
    {
      id: 'climate-analysis',
      name: 'Climate Analysis',
      icon: 'chart-line',
      url: '/climate-analysis',
      description: 'Long-term climate trend analysis',
      relevance: 'Low'
    }
  ];

  if (isMiddleEastRegion(location)) {
    return [
      {
        id: 'pest-management',
        name: 'Date Palm Pest Management',
        icon: 'bug',
        url: '/services/mena-pest',
        description: 'Specialized pest monitoring and management for date palms',
        relevance: 'High',
        subServices: []
      },
      ...baseServices
    ];
  } else if (isCaliforniaRegion(location)) {
    return [
      {
        id: 'pest-management',
        name: 'California Pest Management',
        icon: 'bug',
        url: '/services/california-pest',
        description: 'Pest monitoring and management for California crops',
        relevance: 'High',
        subServices: [
          { name: 'California Pest Database', url: '/services/california-pest' }
        ]
      },
      ...baseServices
    ];
  } else if (isSoutheastAsiaRegion(location)) {
    return [
      {
        id: 'pest-management',
        name: 'Rice Pest Management',
        icon: 'bug',
        url: '/services/asia-pest',
        description: 'Specialized pest monitoring for rice in Southeast Asia',
        relevance: 'High',
        subServices: []
      },
      {
        id: 'flood-monitoring',
        name: 'Flood Monitoring',
        icon: 'water',
        url: '/services/flood-monitoring',
        description: 'Monsoon season flood risk assessment for rice paddies',
        relevance: 'High'
      },
      ...baseServices
    ];
  }

  // Default services
  return [
    {
      id: 'pest-management',
      name: 'Pest Management',
      icon: 'bug',
      url: '/services/pest-management',
      description: 'General pest monitoring and management services',
      relevance: 'Medium',
      subServices: []
    },
    ...baseServices
  ];
};