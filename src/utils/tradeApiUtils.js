/**
 * Trade.gov API Utilities
 * Provides functions for fetching and processing trade event data
 */

// API key should ideally be stored in environment variables
const API_KEY = 'd870e253241b4df98dd3fe3356554376';
const BASE_URL = 'https://api.trade.gov/v1';

/**
 * Fetch trade events from the API
 * @param {Object} params - Query parameters for the API
 * @returns {Promise<Object>} - Trade events data
 */
export const fetchTradeEvents = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params
    });
    
    const response = await fetch(`${BASE_URL}/trade_events/search?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`Trade API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch trade events:', error);
    throw error;
  }
};

/**
 * Fetch trade events count by country
 * @returns {Promise<Object>} - Trade events count data
 */
export const fetchTradeEventsCount = async () => {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY
    });
    
    const response = await fetch(`${BASE_URL}/trade_events/count?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`Trade API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch trade events count:', error);
    throw error;
  }
};

/**
 * Fetch tariff rates for specific countries and agricultural products
 * @param {string} countryCode - ISO country code
 * @param {string} productCode - Harmonized System (HS) code for the product
 * @returns {Promise<Object>} - Tariff data
 */
export const fetchTariffRates = async (countryCode, productCode) => {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      country: countryCode,
      hs_code: productCode
    });
    
    const response = await fetch(`${BASE_URL}/tariff_rates/search?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`Tariff API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch tariff rates:', error);
    throw error;
  }
};

/**
 * Converts trade events data to GeoJSON format for mapping
 * @param {Array} events - Trade events data
 * @returns {Object} - GeoJSON feature collection
 */
export const convertTradeEventsToGeoJSON = (events) => {
  if (!events || !events.results) return null;
  
  const features = events.results
    .filter(event => event.venues && event.venues[0] && event.venues[0].latitude && event.venues[0].longitude)
    .map(event => {
      const venue = event.venues[0];
      
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(venue.longitude), parseFloat(venue.latitude)]
        },
        properties: {
          id: event.id,
          name: event.name,
          description: event.description || '',
          startDate: event.start_date,
          endDate: event.end_date,
          cost: event.cost,
          registrationLink: event.registration_link,
          website: event.website_link,
          industry: event.industries ? event.industries.map(i => i.name).join(', ') : '',
          venue: venue.name,
          city: venue.city,
          country: venue.country,
          state: venue.state,
          eventType: event.event_type
        }
      };
    });
    
  return {
    type: 'FeatureCollection',
    features
  };
}; 