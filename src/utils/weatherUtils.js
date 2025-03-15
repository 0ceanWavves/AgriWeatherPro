/**
 * Utility functions for fetching and processing weather data
 */

/**
 * Fetch weather data from the OpenWeatherMap API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} - Weather data
 */
export const fetchWeatherData = async (lat, lng) => {
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
    throw error;
  }
};

/**
 * Format temperature with proper unit
 * @param {number} temp - Temperature in Celsius
 * @param {boolean} useMetric - Whether to use metric units
 * @returns {string} - Formatted temperature string
 */
export const formatTemperature = (temp, useMetric = true) => {
  if (!temp && temp !== 0) return "N/A";
  
  const tempValue = useMetric ? temp : (temp * 9/5) + 32;
  const unit = useMetric ? "°C" : "°F";
  return `${Math.round(tempValue * 10) / 10}${unit}`;
};

/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} - Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

/**
 * Get weather icon URL from icon code
 * @param {string} iconCode - OpenWeatherMap icon code
 * @param {boolean} large - Whether to use 2x size
 * @returns {string} - Icon URL
 */
export const getWeatherIconUrl = (iconCode, large = true) => {
  return `https://openweathermap.org/img/wn/${iconCode}${large ? '@2x' : ''}.png`;
}; 