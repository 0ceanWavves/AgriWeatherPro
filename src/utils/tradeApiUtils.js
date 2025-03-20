// Trade API utils for AgriWeather Pro

/**
 * Fetch trade events based on filter criteria
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Trade events data
 */
export const fetchTradeEvents = async (filters = {}) => {
  // In a real implementation, this would call an actual API
  // For now, return simulated data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Sample trade events data
  const events = [
    {
      id: 'event1',
      name: 'International Agriculture Expo',
      startDate: '2025-05-15',
      endDate: '2025-05-18',
      city: 'Chicago',
      country: 'United States',
      coordinates: [41.8781, -87.6298],
      industry: 'Agriculture',
      website: 'https://example.com/ag-expo',
      registrationLink: 'https://example.com/ag-expo/register'
    },
    {
      id: 'event2',
      name: 'European Farming Technology Conference',
      startDate: '2025-06-10',
      endDate: '2025-06-12',
      city: 'Berlin',
      country: 'Germany',
      coordinates: [52.5200, 13.4050],
      industry: 'Agricultural Technology',
      website: 'https://example.com/farming-tech',
      registrationLink: 'https://example.com/farming-tech/register'
    },
    {
      id: 'event3',
      name: 'Asia Pacific Agricultural Trade Summit',
      startDate: '2025-09-20',
      endDate: '2025-09-23',
      city: 'Singapore',
      country: 'Singapore',
      coordinates: [1.3521, 103.8198],
      industry: 'Agricultural Trade',
      website: 'https://example.com/ap-ag-trade',
      registrationLink: 'https://example.com/ap-ag-trade/register'
    },
    {
      id: 'event4',
      name: 'Sustainable Farming Expo',
      startDate: '2025-07-05',
      endDate: '2025-07-08',
      city: 'Amsterdam',
      country: 'Netherlands',
      coordinates: [52.3676, 4.9041],
      industry: 'Sustainable Agriculture',
      website: 'https://example.com/sustainable-farming',
      registrationLink: 'https://example.com/sustainable-farming/register'
    },
    {
      id: 'event5',
      name: 'Global Agribusiness Forum',
      startDate: '2025-08-12',
      endDate: '2025-08-15',
      city: 'São Paulo',
      country: 'Brazil',
      coordinates: [-23.5505, -46.6333],
      industry: 'Agribusiness',
      website: 'https://example.com/agribusiness-forum',
      registrationLink: 'https://example.com/agribusiness-forum/register'
    }
  ];
  
  // Filter events if needed (simplified implementation)
  let filteredEvents = [...events];
  
  // Apply industry filter if provided
  if (filters.industries) {
    const industriesArray = filters.industries.split(',');
    filteredEvents = filteredEvents.filter(event => 
      industriesArray.some(industry => 
        event.industry.toLowerCase().includes(industry.toLowerCase())
      )
    );
  }
  
  return {
    success: true,
    results: filteredEvents,
    count: filteredEvents.length
  };
};

/**
 * Get count of trade events
 * @returns {Promise<Object>} Count of trade events
 */
export const fetchTradeEventsCount = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    success: true,
    count: 5
  };
};

/**
 * Fetch tariff rates for a specific country and product
 * @param {string} countryCode - ISO country code
 * @param {string} hsCode - Harmonized System code for product
 * @returns {Promise<Object>} Tariff data
 */
export const fetchTariffRates = async (countryCode, hsCode) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Sample tariff data
  const tariffRates = {
    'BR': {
      '1001': { rate: 10.0 }, // Wheat
      '1005': { rate: 8.0 },  // Corn/Maize
      '1006': { rate: 12.0 }, // Rice
      '1201': { rate: 6.0 },  // Soybeans
      '0805': { rate: 15.0 }  // Citrus fruits
    },
    'US': {
      '1001': { rate: 2.5 },
      '1005': { rate: 0.0 },
      '1006': { rate: 5.0 },
      '1201': { rate: 0.0 },
      '0805': { rate: 4.5 }
    },
    'EU': {
      '1001': { rate: 12.0 },
      '1005': { rate: 5.0 },
      '1006': { rate: 7.5 },
      '1201': { rate: 4.0 },
      '0805': { rate: 16.0 }
    }
  };
  
  // Get rates for the specified country or default to empty
  const countryRates = tariffRates[countryCode] || {};
  
  // Get rate for the specified HS code
  const rate = countryRates[hsCode] ? countryRates[hsCode].rate : null;
  
  return {
    success: true,
    results: rate ? [
      {
        country_code: countryCode,
        hs_code: hsCode,
        tariff_rate: rate,
        currency: 'USD',
        last_updated: '2025-01-15'
      }
    ] : []
  };
};

/**
 * Convert trade events to GeoJSON format for map display
 * @param {Object} eventsData - Trade events data
 * @returns {Object} GeoJSON object
 */
export const convertTradeEventsToGeoJSON = (eventsData) => {
  if (!eventsData || !eventsData.results || !Array.isArray(eventsData.results)) {
    return {
      type: 'FeatureCollection',
      features: []
    };
  }
  
  const features = eventsData.results.map(event => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [event.coordinates[1], event.coordinates[0]] // GeoJSON uses [lng, lat]
    },
    properties: {
      id: event.id,
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      city: event.city,
      country: event.country,
      industry: event.industry,
      website: event.website,
      registrationLink: event.registrationLink
    }
  }));
  
  return {
    type: 'FeatureCollection',
    features
  };
};
