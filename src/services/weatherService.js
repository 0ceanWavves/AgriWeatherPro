/**
 * Weather service functions
 * This file contains functions for interacting with weather APIs
 */

/**
 * Fetch real weather data from the OpenWeatherMap API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} - Weather data
 */
export const fetchRealWeatherData = async (lat, lng) => {
  try {
    const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6'; // Should be in .env file in production
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      clouds: data.clouds.all,
      precipitation: data.rain ? data.rain['1h'] || 0 : 0,
      weatherDesc: data.weather[0].description,
      weatherIcon: data.weather[0].icon,
      timezone: data.timezone,
      location: data.name,
      country: data.sys.country,
      timestamp: data.dt
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    // Return mock data as fallback in case of API failure
    return {
      temp: 22,
      feelsLike: 24,
      humidity: 65,
      pressure: 1013,
      windSpeed: 3.5,
      windDirection: 180,
      clouds: 40,
      precipitation: 0,
      weatherDesc: 'Partly cloudy',
      weatherIcon: '02d',
      timezone: 0,
      location: 'Default City',
      country: 'US',
      timestamp: Math.floor(Date.now() / 1000)
    };
  }
};

/**
 * Fetch weather forecast data
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} days - Number of days to forecast (1-7)
 * @returns {Promise<Object>} - Forecast data
 */
export const fetchWeatherForecast = async (lat, lng, days = 5) => {
  try {
    const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6'; // Should be in .env file in production
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,current&units=metric&appid=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and return daily forecasts
    return {
      daily: data.daily.slice(0, days).map(day => ({
        date: new Date(day.dt * 1000).toISOString().split('T')[0],
        sunrise: day.sunrise,
        sunset: day.sunset,
        tempMin: day.temp.min,
        tempMax: day.temp.max,
        pressure: day.pressure,
        humidity: day.humidity,
        windSpeed: day.wind_speed,
        windDirection: day.wind_deg,
        weatherDesc: day.weather[0].description,
        weatherIcon: day.weather[0].icon,
        precipitation: day.rain || 0,
        uvi: day.uvi
      })),
      hourly: data.hourly.slice(0, 24).map(hour => ({
        time: new Date(hour.dt * 1000).toISOString(),
        temp: hour.temp,
        feelsLike: hour.feels_like,
        pressure: hour.pressure,
        humidity: hour.humidity,
        windSpeed: hour.wind_speed,
        weatherDesc: hour.weather[0].description,
        weatherIcon: hour.weather[0].icon,
        precipitation: hour.rain ? hour.rain['1h'] || 0 : 0
      }))
    };
  } catch (error) {
    console.error('Failed to fetch weather forecast:', error);
    throw error;
  }
};

/**
 * Fetch historical weather data
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} - Historical weather data
 */
export const fetchHistoricalWeather = async (lat, lng, startDate, endDate) => {
  // Note: OpenWeatherMap historical data requires a paid plan
  // This is a simplified mock implementation
  
  try {
    // Convert dates to timestamps
    const start = new Date(startDate).getTime() / 1000;
    const end = new Date(endDate).getTime() / 1000;
    const days = Math.ceil((end - start) / (24 * 3600));
    
    // Create mock historical data
    const historical = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(start * 1000);
      date.setDate(date.getDate() + i);
      
      historical.push({
        date: date.toISOString().split('T')[0],
        tempMax: 20 + Math.random() * 10,
        tempMin: 10 + Math.random() * 5,
        humidity: 50 + Math.random() * 30,
        precipitation: Math.random() > 0.7 ? Math.random() * 10 : 0,
        windSpeed: 2 + Math.random() * 8
      });
    }
    
    return {
      location: `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
      startDate,
      endDate,
      days,
      historical
    };
  } catch (error) {
    console.error('Failed to fetch historical weather:', error);
    throw error;
  }
};