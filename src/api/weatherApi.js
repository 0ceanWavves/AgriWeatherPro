import axios from 'axios';
import { OPENWEATHERMAP_API_KEY as ENV_API_KEY } from '../utils/config';

// Try to use environment variable, but have a backup strategy for local development
const OPENWEATHERMAP_API_KEY = ENV_API_KEY || 'deeaa95f4b7b2543dc8c3d9cb96396c6';

// Function to generate mock weather data (completely synthetic)
const generateMockWeatherData = (lat, lon, location = "Mock Location") => {
  const now = Math.floor(Date.now() / 1000); // Current unix timestamp
  const sunrise = now - 21600; // 6 hours ago
  const sunset = now + 21600; // 6 hours from now
  
  // Weather conditions
  const weatherConditions = [
    { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    { id: 801, main: "Clouds", description: "few clouds", icon: "02d" },
    { id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" },
    { id: 500, main: "Rain", description: "light rain", icon: "10d" },
    { id: 501, main: "Rain", description: "moderate rain", icon: "10d" }
  ];
  
  // Randomly select a weather condition
  const weatherIndex = Math.floor(Math.random() * weatherConditions.length);
  const weather = weatherConditions[weatherIndex];
  
  // Generate random but reasonable temperature (10°C to 30°C)
  const baseTemp = 15 + Math.random() * 15;
  
  // Create current weather
  const current = {
    dt: now,
    sunrise,
    sunset,
    temp: baseTemp,
    feels_like: baseTemp - 2,
    pressure: 1015,
    humidity: 40 + Math.floor(Math.random() * 40),
    dew_point: 10,
    uvi: 4,
    clouds: 20 + Math.floor(Math.random() * 60),
    visibility: 10000,
    wind_speed: 2 + Math.random() * 8,
    wind_deg: Math.floor(Math.random() * 360),
    weather: [weather]
  };
  
  // Generate hourly forecast (next 48 hours)
  const hourly = Array(48).fill(0).map((_, i) => {
    const hourTemp = baseTemp + Math.sin(i / 8) * 5 + (Math.random() * 2 - 1);
    const hourWeather = {...weatherConditions[Math.floor(Math.random() * weatherConditions.length)]};
    
    return {
      dt: now + i * 3600,
      temp: hourTemp,
      feels_like: hourTemp - 2,
      pressure: 1015,
      humidity: 40 + Math.floor(Math.random() * 40),
      dew_point: 10,
      uvi: i % 24 < 12 ? 4 : 0, // UV index during day only
      clouds: 20 + Math.floor(Math.random() * 60),
      visibility: 10000,
      wind_speed: 2 + Math.random() * 8,
      wind_deg: Math.floor(Math.random() * 360),
      weather: [hourWeather],
      pop: Math.random() * 0.5 // Probability of precipitation
    };
  });
  
  // Generate daily forecast (next 7 days)
  const daily = Array(7).fill(0).map((_, i) => {
    const dayBaseTemp = baseTemp + (Math.random() * 4 - 2);
    const dayWeather = {...weatherConditions[Math.floor(Math.random() * weatherConditions.length)]};
    
    return {
      dt: now + i * 86400,
      sunrise: sunrise + i * 86400,
      sunset: sunset + i * 86400,
      temp: {
        day: dayBaseTemp,
        min: dayBaseTemp - 5,
        max: dayBaseTemp + 5,
        night: dayBaseTemp - 8,
        eve: dayBaseTemp,
        morn: dayBaseTemp - 3
      },
      feels_like: {
        day: dayBaseTemp - 2,
        night: dayBaseTemp - 10,
        eve: dayBaseTemp - 2,
        morn: dayBaseTemp - 5
      },
      pressure: 1015,
      humidity: 40 + Math.floor(Math.random() * 40),
      dew_point: 10,
      wind_speed: 2 + Math.random() * 8,
      wind_deg: Math.floor(Math.random() * 360),
      weather: [dayWeather],
      clouds: 20 + Math.floor(Math.random() * 60),
      pop: Math.random() * 0.5,
      uvi: 4
    };
  });
  
  return {
    lat,
    lon,
    timezone: "UTC",
    timezone_offset: 0,
    current,
    hourly,
    daily,
    locationName: location,
    country: "DEMO" 
  };
};

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
    
    // If API call works but no results, use mock location
    console.warn('Location not found, using mock data');
    return {
      lat: parseFloat(city) || 51.5074,
      lon: parseFloat(city) || -0.1278,
      name: city || "London",
      country: "Demo Mode"
    };
  } catch (error) {
    console.error('Error fetching coordinates, using mock data:', error);
    
    // Return mock data if API fails
    return {
      lat: 51.5074,
      lon: -0.1278,
      name: city || "London",
      country: "Demo Mode"
    };
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
    console.error('Error fetching current weather, using mock data:', error);
    
    // Generate mock current weather
    const mockData = generateMockWeatherData(lat, lon);
    
    // Format to match current weather API structure
    return {
      coord: { lat, lon },
      weather: mockData.current.weather,
      base: "stations",
      main: {
        temp: mockData.current.temp,
        feels_like: mockData.current.feels_like,
        temp_min: mockData.current.temp - 2,
        temp_max: mockData.current.temp + 2,
        pressure: mockData.current.pressure,
        humidity: mockData.current.humidity
      },
      visibility: mockData.current.visibility,
      wind: {
        speed: mockData.current.wind_speed,
        deg: mockData.current.wind_deg
      },
      clouds: {
        all: mockData.current.clouds
      },
      dt: mockData.current.dt,
      sys: {
        type: 1,
        id: 1275,
        country: "Demo",
        sunrise: mockData.current.sunrise,
        sunset: mockData.current.sunset
      },
      timezone: 0,
      id: 1000000,
      name: "Demo City",
      cod: 200
    };
  }
};

// One Call API for forecast data
export const getWeatherForecast = async (lat, lon) => {
  try {
    // Try to use real API first
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${OPENWEATHERMAP_API_KEY}`
    );
    
    return response.data;
  } catch (error) {
    console.warn('Error fetching weather forecast, using mock data:', error);
    
    // Create comprehensive mock data
    return generateMockWeatherData(lat, lon);
  }
};

// For historical data (using Open-Meteo as it's free and doesn't require API key)
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
    console.error('Error fetching historical weather, using mock data:', error);
    
    // Generate mock historical data
    const days = [];
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
    const dayMs = 86400000; // milliseconds in a day
    
    // Create array of dates between start and end
    for (let time = startTime; time <= endTime; time += dayMs) {
      days.push(new Date(time).toISOString().split('T')[0]);
    }
    
    return {
      latitude: lat,
      longitude: lon,
      generationtime_ms: 1.0,
      utc_offset_seconds: 0,
      timezone: "GMT",
      timezone_abbreviation: "GMT",
      elevation: 10,
      daily_units: {
        time: "iso8601",
        temperature_2m_max: "°C",
        temperature_2m_min: "°C",
        precipitation_sum: "mm",
        rain_sum: "mm",
        precipitation_hours: "h"
      },
      daily: {
        time: days,
        temperature_2m_max: days.map(() => 15 + Math.random() * 10),
        temperature_2m_min: days.map(() => 5 + Math.random() * 10),
        precipitation_sum: days.map(() => Math.random() * 10),
        rain_sum: days.map(() => Math.random() * 8),
        precipitation_hours: days.map(() => Math.random() * 10)
      }
    };
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
    console.error('Error fetching location weather, using fallback data:', error);
    return {
      temp: 15.5,
      feelsLike: 14.2,
      precipitation: 0,
      windSpeed: 3.54,
      windDirection: 180,
      humidity: 65,
      clouds: 40,
      pressure: 1013
    };
  }
};