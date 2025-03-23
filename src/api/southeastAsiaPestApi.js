// Enhanced API module for Southeast Asian Rice Pests
import { southeastAsiaPests } from '../data/regions/southeastAsiaPests';
import { supabase } from '../lib/supabase';
import { getMockWeatherData } from '../services/mockWeatherService';
import axios from 'axios';

// Fetch all Southeast Asian rice pests from the database or fallback to local data
export const fetchSoutheastAsiaRicePests = async () => {
  try {
    // Try to fetch from Supabase first
    const { data, error } = await supabase
      .from('southeast_asia_pests')
      .select('*')
      .eq('crop_type', 'rice');
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    // If we have data from the database, return it
    if (data && data.length > 0) {
      return data.map(pest => transformDatabasePest(pest));
    }
    
    // Fallback to local data if database is empty
    console.log("Using local Southeast Asia pest data");
    return southeastAsiaPests;
  } catch (error) {
    console.error("Error fetching Southeast Asian rice pests:", error);
    // Fallback to local data on error
    return southeastAsiaPests;
  }
};

// Fetch a specific pest by ID
export const fetchSoutheastAsiaPestById = async (pestId) => {
  try {
    // Try to fetch from Supabase first
    const { data, error } = await supabase
      .from('southeast_asia_pests')
      .select('*')
      .eq('id', pestId)
      .single();
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    // If we found the pest in the database
    if (data) {
      return transformDatabasePest(data);
    }
    
    // Fallback to local data
    const localPest = southeastAsiaPests.find(pest => pest.id === pestId);
    if (!localPest) {
      throw new Error(`Pest with ID ${pestId} not found`);
    }
    
    return localPest;
  } catch (error) {
    console.error(`Error fetching pest with ID ${pestId}:`, error);
    
    // Fallback to local data
    const localPest = southeastAsiaPests.find(pest => pest.id === pestId);
    if (!localPest) {
      throw new Error(`Pest with ID ${pestId} not found`);
    }
    
    return localPest;
  }
};

// Calculate pest risk based on current weather conditions
export const calculatePestRisk = (pest, weatherData) => {
  if (!pest || !pest.weatherThresholds || !weatherData) {
    return { level: 'unknown', score: 0, factors: [] };
  }
  
  const { temperature, humidity, precipitation } = weatherData;
  const { temperatureRange, humidityRange, precipitationOptimal } = pest.weatherThresholds;
  
  let riskScore = 0;
  const riskFactors = [];
  
  // Temperature risk (0-40 points)
  if (temperature >= temperatureRange[0] && temperature <= temperatureRange[1]) {
    // Temperature is in optimal range
    const optimalTemp = pest.weatherThresholds.temperatureOptimal;
    const distFromOptimal = Math.abs(temperature - optimalTemp);
    const tempRange = temperatureRange[1] - temperatureRange[0];
    
    // Score highest when closest to optimal temperature
    const tempScore = 40 - (distFromOptimal / tempRange) * 40;
    riskScore += tempScore;
    
    if (tempScore > 30) {
      riskFactors.push(`Temperature (${temperature}°C) is highly favorable`);
    } else if (tempScore > 20) {
      riskFactors.push(`Temperature (${temperature}°C) is favorable`);
    } else {
      riskFactors.push(`Temperature (${temperature}°C) is within range but not optimal`);
    }
  }
  
  // Humidity risk (0-35 points)
  if (humidity >= humidityRange[0] && humidity <= humidityRange[1]) {
    // Humidity is in optimal range
    const optimalHumidity = pest.weatherThresholds.humidityOptimal;
    const distFromOptimal = Math.abs(humidity - optimalHumidity);
    const humidityRangeWidth = humidityRange[1] - humidityRange[0];
    
    // Score highest when closest to optimal humidity
    const humidityScore = 35 - (distFromOptimal / humidityRangeWidth) * 35;
    riskScore += humidityScore;
    
    if (humidityScore > 25) {
      riskFactors.push(`Humidity (${humidity}%) is highly favorable`);
    } else if (humidityScore > 15) {
      riskFactors.push(`Humidity (${humidity}%) is favorable`);
    } else {
      riskFactors.push(`Humidity (${humidity}%) is within range but not optimal`);
    }
  }
  
  // Precipitation risk (0-25 points)
  if (precipitation >= precipitationOptimal[0] && precipitation <= precipitationOptimal[1]) {
    // Precipitation is in optimal range
    const precipRange = precipitationOptimal[1] - precipitationOptimal[0];
    const midPoint = (precipitationOptimal[0] + precipitationOptimal[1]) / 2;
    const distFromMid = Math.abs(precipitation - midPoint);
    
    // Score highest when in the middle of the optimal range
    const precipScore = 25 - (distFromMid / (precipRange/2)) * 25;
    riskScore += precipScore;
    
    if (precipScore > 20) {
      riskFactors.push(`Precipitation (${precipitation}mm) is highly favorable`);
    } else if (precipScore > 10) {
      riskFactors.push(`Precipitation (${precipitation}mm) is favorable`);
    } else {
      riskFactors.push(`Precipitation (${precipitation}mm) is within range but not optimal`);
    }
  }
  
  // Determine risk level
  let riskLevel;
  if (riskScore >= 75) {
    riskLevel = 'extreme';
  } else if (riskScore >= 60) {
    riskLevel = 'high';
  } else if (riskScore >= 40) {
    riskLevel = 'medium';
  } else if (riskScore >= 20) {
    riskLevel = 'low';
  } else {
    riskLevel = 'minimal';
  }
  
  return {
    level: riskLevel,
    score: Math.round(riskScore),
    factors: riskFactors
  };
};

// Generate a 7-day forecast for pest risk based on weather forecast
export const generatePestRiskForecast = async (pestId, locationId) => {
  try {
    // Fetch the pest data
    const pest = await fetchSoutheastAsiaPestById(pestId);
    
    // Try to get real forecast data first
    let forecast;
    try {
      forecast = await fetchRealWeatherForecast(locationId);
    } catch (error) {
      console.log("Using mock forecast data due to API error:", error);
      // Fall back to mock data if real API fails
      forecast = await fetchMockWeatherForecast(locationId);
    }
    
    // Calculate risk for each day
    const riskForecast = forecast.map(day => {
      const risk = calculatePestRisk(pest, day.weather);
      return {
        date: day.date,
        risk: risk.level,
        score: risk.score,
        factors: risk.factors,
        weather: day.weather
      };
    });
    
    return riskForecast;
  } catch (error) {
    console.error("Error generating pest risk forecast:", error);
    throw error;
  }
};

// Try to get real forecast data from OpenWeatherMap
const fetchRealWeatherForecast = async (locationId) => {
  // Parse locationId to get coordinates
  // For simplicity, we assume locationId is in the format 'lat,lng'
  let lat, lng;
  
  if (typeof locationId === 'string' && locationId.includes(',')) {
    [lat, lng] = locationId.split(',').map(Number);
  } else {
    // Default coordinates for Southeast Asia (Bangkok)
    lat = 13.7563;
    lng = 100.5018;
  }
  
  // Call OpenWeatherMap API with the existing API key (which will be replaced later)
  const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,alerts&units=metric&appid=${apiKey}`
  );
  
  // Transform data to the format we need
  const forecast = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    const dailyData = response.data.daily[i];
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      weather: {
        temperature: dailyData.temp.day, 
        humidity: dailyData.humidity,
        precipitation: dailyData.rain ? dailyData.rain : 0
      }
    });
  }
  
  return forecast;
};

// Generate mock weather forecast when real API fails
const fetchMockWeatherForecast = async (locationId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Parse locationId or use default coordinates
  let lat, lng;
  
  if (typeof locationId === 'string' && locationId.includes(',')) {
    [lat, lng] = locationId.split(',').map(Number);
  } else if (typeof locationId === 'object' && locationId.lat && locationId.lng) {
    lat = locationId.lat;
    lng = locationId.lng;
  } else {
    // Default coordinates for Southeast Asia (Thailand)
    lat = 13.7563;
    lng = 100.5018;
  }
  
  // Generate realistic forecast data for a rice-growing region in Southeast Asia
  const forecast = [];
  const today = new Date();
  
  // Get full mock weather data
  const mockData = getMockWeatherData(lat, lng, 'metric');
  
  // Extract daily data
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    const dailyData = mockData.daily[i];
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      weather: {
        temperature: dailyData.temp.day,
        humidity: dailyData.humidity,
        precipitation: dailyData.rain || 0
      }
    });
  }
  
  return forecast;
};

// Transform database pest object to match local format
const transformDatabasePest = (dbPest) => {
  // Handle database format conversion here
  // This implementation depends on your database schema
  return {
    id: dbPest.id,
    commonName: dbPest.common_name,
    scientificName: dbPest.scientific_name,
    description: dbPest.description,
    damageType: {
      severity: dbPest.damage_severity,
      description: dbPest.damage_description
    },
    weatherThresholds: dbPest.weather_thresholds || {
      temperatureOptimal: 28,
      temperatureRange: [24, 32],
      humidityOptimal: 80,
      humidityRange: [70, 90],
      precipitationRisk: "medium",
      precipitationOptimal: [5, 30]
    },
    riskFactors: dbPest.risk_factors || [],
    ipmStrategies: dbPest.ipm_strategies || {
      cultural: [],
      biological: [],
      chemical: []
    },
    climateChangeImpacts: dbPest.climate_change_impacts || ""
  };
};

export default {
  fetchSoutheastAsiaRicePests,
  fetchSoutheastAsiaPestById,
  calculatePestRisk,
  generatePestRiskForecast
};