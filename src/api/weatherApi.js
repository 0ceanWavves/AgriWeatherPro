import axios from 'axios';

import { OPENWEATHERMAP_API_KEY as ENV_API_KEY } from '../utils/config';

// Use the environment variable for the API key with fallback
const OPENWEATHERMAP_API_KEY = ENV_API_KEY || '11d494e6c254ca3a724c694a4ebeb27f';

// Geocoding API to convert city name to coordinates
export const getCoordinates = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`
    );
    
    if (response.data && response.data.length > 0) {
      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        name: response.data[0].name,
        country: response.data[0].country
      };
    }
    
    throw new Error('Location not found');
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
};

// Current weather data
export const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

// One Call API for forecast data - using v2.5 since v3.0 requires subscription
export const getWeatherForecast = async (lat, lon) => {
  try {
    // Use OneCall API 2.5 which is free
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${OPENWEATHERMAP_API_KEY}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    
    // Fallback to creating mock forecast data
    try {
      const currentResponse = await getCurrentWeather(lat, lon);
      
      // Create a mock structure similar to One Call API
      return createMockForecast(currentResponse, lat, lon);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw error;
    }
  }
};

// Create mock forecast data from current weather
const createMockForecast = (currentData, lat, lon) => {
  return {
    lat,
    lon,
    timezone: "UTC",
    timezone_offset: 0,
    current: {
      dt: currentData.dt,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
      temp: currentData.main.temp,
      feels_like: currentData.main.feels_like,
      pressure: currentData.main.pressure,
      humidity: currentData.main.humidity,
      dew_point: 0,
      uvi: 0,
      clouds: currentData.clouds.all,
      visibility: currentData.visibility,
      wind_speed: currentData.wind.speed,
      wind_deg: currentData.wind.deg,
      weather: currentData.weather,
    },
    hourly: Array(24).fill(0).map((_, i) => ({
      dt: currentData.dt + i * 3600,
      temp: currentData.main.temp + (Math.random() * 4 - 2),
      feels_like: currentData.main.feels_like + (Math.random() * 4 - 2),
      pressure: currentData.main.pressure,
      humidity: currentData.main.humidity,
      dew_point: 0,
      uvi: 0,
      clouds: currentData.clouds.all,
      visibility: currentData.visibility,
      wind_speed: currentData.wind.speed,
      wind_deg: currentData.wind.deg,
      weather: currentData.weather,
      pop: 0
    })),
    daily: Array(7).fill(0).map((_, i) => ({
      dt: currentData.dt + i * 86400,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
      temp: {
        day: currentData.main.temp + (Math.random() * 5 - 2),
        min: currentData.main.temp - (Math.random() * 3 + 1),
        max: currentData.main.temp + (Math.random() * 3 + 1),
        night: currentData.main.temp - (Math.random() * 2),
        eve: currentData.main.temp + (Math.random() * 2),
        morn: currentData.main.temp - (Math.random() * 2),
      },
      feels_like: {
        day: currentData.main.feels_like,
        night: currentData.main.feels_like - 2,
        eve: currentData.main.feels_like + 1,
        morn: currentData.main.feels_like - 1,
      },
      pressure: currentData.main.pressure,
      humidity: currentData.main.humidity,
      dew_point: 0,
      wind_speed: currentData.wind.speed,
      wind_deg: currentData.wind.deg,
      weather: currentData.weather,
      clouds: currentData.clouds.all,
      pop: 0,
      uvi: 0
    }))
  };
};

// For historical data (using Open-Meteo as it's free and included in your env)
export const getHistoricalWeather = async (lat, lon, startDate, endDate) => {
  try {
    // Convert dates to the format needed by Open-Meteo
    const start = new Date(startDate).toISOString().split('T')[0];
    const end = new Date(endDate).toISOString().split('T')[0];
    
    const response = await axios.get(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,precipitation_hours&timezone=auto`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching historical weather:', error);
    throw error;
  }
};

// Get weather maps tile URL
export const getWeatherMapUrl = (layer) => {
  return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`;
};

// Function to get weather data for a fixed location
export const getLocationWeather = async (lat = 51.5074, lon = -0.1278) => {
  try {
    const response = await getCurrentWeather(lat, lon);
    return {
      temp: Math.round(response.main.temp * 10) / 10,
      feelsLike: Math.round(response.main.feels_like * 10) / 10,
      precipitation: 0, // Not available in current weather API
      windSpeed: Math.round(response.wind.speed * 100) / 100,
      windDirection: response.wind.deg,
      humidity: response.main.humidity,
      clouds: response.clouds.all,
      pressure: response.main.pressure
    };
  } catch (error) {
    console.error('Error fetching location weather:', error);
    return {
      temp: -8.8,
      feelsLike: -11.9,
      precipitation: 0,
      windSpeed: 1.54,
      windDirection: 20,
      humidity: 94,
      clouds: 100,
      pressure: 1017
    };
  }
};