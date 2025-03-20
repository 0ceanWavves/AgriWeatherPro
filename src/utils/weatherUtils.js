// Weather utils for AgriWeather Pro

/**
 * Fetch weather data based on coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Weather data
 */
export const fetchWeatherData = async (lat, lng) => {
  try {
    const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
    
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
      weatherDesc: data.weather[0].description,
      weatherIcon: data.weather[0].icon,
      precipitation: data.rain ? data.rain['1h'] || 0 : 0
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // Return dummy data on error
    return {
      temp: 22,
      feelsLike: 24,
      humidity: 60,
      pressure: 1013,
      windSpeed: 5,
      windDirection: 180,
      clouds: 30,
      weatherDesc: 'Partly cloudy',
      weatherIcon: '02d',
      precipitation: 0
    };
  }
};
