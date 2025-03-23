/**
 * Service for fetching agricultural tariff data
 * Uses Trade.gov API
 */

// Mock data for development/demo purposes
const mockTariffData = {
  corn: {
    opportunities: [
      {
        crop: 'CORN',
        emoji: '🌽',
        country: 'Korea',
        agreement: 'Korea FTA',
        rate: '0%',
        trend: '-5%',
        direction: 'down'
      },
      {
        crop: 'CORN',
        emoji: '🌽',
        country: 'Canada',
        agreement: 'USMCA',
        rate: '0%',
        trend: '0%',
        direction: 'stable'
      }
    ],
    insights: [
      'Korean corn imports increased 12% this quarter',
      'Favorable shipping conditions to Panama',
      'EU corn tariffs remain stable despite negotiations'
    ]
  },
  wheat: {
    opportunities: [
      {
        crop: 'WHEAT',
        emoji: '🌾',
        country: 'Colombia',
        agreement: 'Colombia FTA',
        rate: '3.2%',
        trend: '+2%',
        direction: 'up'
      },
      {
        crop: 'WHEAT',
        emoji: '🌾',
        country: 'Japan',
        agreement: 'Japan-US Agreement',
        rate: '1.8%',
        trend: '-2%',
        direction: 'down'
      }
    ],
    insights: [
      'Colombia wheat tariff increases next month',
      'Australian wheat competition affecting US exports',
      'Middle East wheat demand projected to increase in Q3'
    ]
  },
  peanuts: {
    opportunities: [
      {
        crop: 'PEANUTS',
        emoji: '🥜',
        country: 'Panama',
        agreement: 'Panama FTA',
        rate: '8.5%',
        trend: '-10%',
        direction: 'down'
      }
    ],
    insights: [
      'Panama increasing peanut imports due to local crop failure',
      'EU maintains strict aflatoxin testing on peanut imports',
      'Chinese peanut demand decreased by 7% this quarter'
    ]
  }
};

/**
 * Fetch tariff data from Trade.gov API
 * 
 * @param {string} crop - Crop type (e.g., 'corn', 'wheat')
 * @param {string} country - Country code (e.g., 'kr', 'co')
 * @returns {Promise<Object>} - Tariff data
 */
export const getTariffData = async (crop = 'all', country = 'all') => {
  // In actual implementation, this would call the Trade.gov API
  // Example API call:
  // const apiKey = process.env.REACT_APP_TRADE_GOV_API_KEY;
  // const response = await fetch(`https://api.trade.gov/v1/tariff_rates?api_key=${apiKey}&q=${crop}&countries=${country}`);
  // const data = await response.json();
  // return data;
  
  // For demo purposes, return mock data after a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      if (crop !== 'all' && crop in mockTariffData) {
        resolve(mockTariffData[crop]);
      } else {
        // If 'all' or unknown crop, return a merged version of all data
        const allOpportunities = Object.values(mockTariffData).flatMap(data => data.opportunities);
        const allInsights = Object.values(mockTariffData).flatMap(data => data.insights).slice(0, 5);
        
        resolve({
          opportunities: allOpportunities,
          insights: allInsights
        });
      }
    }, 500); // Simulate API delay
  });
};

/**
 * Get historical tariff data for a specific crop and country
 * 
 * @param {string} crop - Crop type
 * @param {string} country - Country code
 * @returns {Promise<Array>} - Historical tariff data
 */
export const getHistoricalTariffData = async (crop, country) => {
  // This would be an actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { date: '2023-01', rate: '7.5%' },
        { date: '2023-07', rate: '6.8%' },
        { date: '2024-01', rate: '5.5%' },
        { date: '2024-07', rate: '4.8%' },
        { date: '2025-01', rate: '3.2%' }
      ]);
    }, 500);
  });
};

/**
 * Get export planning recommendations based on crop and harvest date
 * 
 * @param {string} crop - Crop type
 * @param {string} harvestDate - Expected harvest date
 * @returns {Promise<Array>} - Export market recommendations
 */
export const getExportRecommendations = async (crop, harvestDate) => {
  // This would be an actual API call in production that considers:
  // - Current tariff rates
  // - Seasonal demand in different markets
  // - Weather conditions affecting shipping
  // - Market prices in different countries
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          rank: 1,
          country: 'KOREA',
          rating: 5,
          tariff: '0%',
          benefits: [
            'High demand period (Sep-Nov)',
            'Favorable weather for shipping',
            'Est. price premium: +$0.42/bushel'
          ]
        },
        {
          rank: 2,
          country: 'CANADA',
          rating: 4,
          tariff: '0%',
          benefits: [
            'Current supply shortage',
            'Close proximity (lower shipping costs)',
            'Est. price premium: +$0.28/bushel'
          ]
        }
      ]);
    }, 700);
  });
};