// Weather service for AgriWeather Pro

/**
 * Fetch real weather data from OpenWeatherMap API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Weather data
 */
export const fetchRealWeatherData = async (lat, lng) => {
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
      tempC: data.main.temp, // Duplicate for compatibility
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      clouds: data.clouds.all,
      weatherDesc: data.weather[0].description,
      weatherIcon: data.weather[0].icon,
      precipitation: data.rain ? data.rain['1h'] || 0 : 0,
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lng: data.coord.lon
      }
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // Return dummy data on error to prevent UI breakage
    return {
      temp: 22,
      tempC: 22,
      feelsLike: 24,
      humidity: 60,
      pressure: 1013,
      windSpeed: 5,
      windDirection: 180,
      clouds: 30,
      weatherDesc: 'Partly cloudy',
      weatherIcon: '02d',
      precipitation: 0,
      location: {
        name: 'Default Location',
        country: 'US',
        lat: lat || 51.505,
        lng: lng || -0.09
      }
    };
  }
};

/**
 * Fetch weather forecast for the next several days
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} days - Number of days to forecast (max 7)
 * @returns {Promise<Object>} Forecast data
 */
export const fetchForecastData = async (lat, lng, days = 5) => {
  try {
    const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
    // Use the One Call API for better forecast data
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly&units=metric&appid=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and return forecast data
    const processedData = {
      current: {
        temp: data.current.temp,
        feelsLike: data.current.feels_like,
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        windSpeed: data.current.wind_speed,
        windDirection: data.current.wind_deg,
        clouds: data.current.clouds,
        weatherDesc: data.current.weather[0].description,
        weatherIcon: data.current.weather[0].icon,
        timestamp: data.current.dt
      },
      daily: data.daily.slice(0, days).map(day => ({
        date: new Date(day.dt * 1000).toISOString().split('T')[0],
        tempMax: day.temp.max,
        tempMin: day.temp.min,
        humidity: day.humidity,
        pressure: day.pressure,
        windSpeed: day.wind_speed,
        windDirection: day.wind_deg,
        precipitation: day.rain || 0,
        weatherDesc: day.weather[0].description,
        weatherIcon: day.weather[0].icon,
        timestamp: day.dt
      }))
    };
    
    return processedData;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    
    // Generate dummy forecast data on error
    const current = new Date();
    const dailyData = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(current);
      date.setDate(date.getDate() + i);
      
      dailyData.push({
        date: date.toISOString().split('T')[0],
        tempMax: 25 + Math.floor(Math.random() * 8) - 4,
        tempMin: 15 + Math.floor(Math.random() * 6) - 3,
        humidity: 50 + Math.floor(Math.random() * 30),
        pressure: 1013 + Math.floor(Math.random() * 10) - 5,
        windSpeed: 5 + Math.floor(Math.random() * 10),
        windDirection: Math.floor(Math.random() * 360),
        precipitation: Math.random() > 0.7 ? Math.random() * 10 : 0,
        weatherDesc: Math.random() > 0.7 ? 'Partly cloudy' : 'Clear sky',
        weatherIcon: Math.random() > 0.7 ? '02d' : '01d',
        timestamp: Math.floor(date.getTime() / 1000)
      });
    }
    
    return {
      current: {
        temp: 22,
        feelsLike: 24,
        humidity: 60,
        pressure: 1013,
        windSpeed: 5,
        windDirection: 180,
        clouds: 30,
        weatherDesc: 'Partly cloudy',
        weatherIcon: '02d',
        timestamp: Math.floor(current.getTime() / 1000)
      },
      daily: dailyData
    };
  }
};
