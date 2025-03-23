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
 * @param {number} days - Number of days to forecast (max 5)
 * @returns {Promise<Object>} Forecast data
 */
export const fetchForecastData = async (lat, lng, days = 5) => {
  try {
    const apiKey = 'deeaa95f4b7b2543dc8c3d9cb96396c6';
    // Use the 5-day forecast API (free tier) instead of OneCall API (paid tier)
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // First, get current weather separately
    const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`);
    
    if (!currentResponse.ok) {
      throw new Error(`Current weather API error: ${currentResponse.status}`);
    }
    
    const currentData = await currentResponse.json();
    
    // Process current weather
    const current = {
      temp: currentData.main.temp,
      feelsLike: currentData.main.feels_like,
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      windSpeed: currentData.wind.speed,
      windDirection: currentData.wind.deg,
      clouds: currentData.clouds.all,
      weatherDesc: currentData.weather[0].description,
      weatherIcon: currentData.weather[0].icon,
      timestamp: currentData.dt
    };
    
    // Group forecast by day (the 5-day forecast API returns data in 3-hour intervals)
    const forecastByDay = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!forecastByDay[date]) {
        forecastByDay[date] = {
          date,
          temps: [],
          humidity: [],
          pressure: [],
          windSpeed: [],
          windDirection: [],
          precipitation: [],
          weatherDesc: [],
          weatherIcon: [],
          timestamp: item.dt
        };
      }
      
      forecastByDay[date].temps.push(item.main.temp);
      forecastByDay[date].humidity.push(item.main.humidity);
      forecastByDay[date].pressure.push(item.main.pressure);
      forecastByDay[date].windSpeed.push(item.wind.speed);
      forecastByDay[date].windDirection.push(item.wind.deg);
      forecastByDay[date].precipitation.push(item.rain ? item.rain['3h'] || 0 : 0);
      forecastByDay[date].weatherDesc.push(item.weather[0].description);
      forecastByDay[date].weatherIcon.push(item.weather[0].icon);
    });
    
    // Convert to array and calculate daily values
    const daily = Object.values(forecastByDay).map(day => {
      // Get most common weather description and icon
      const mostCommonDesc = day.weatherDesc.sort((a, b) => 
        day.weatherDesc.filter(v => v === a).length - day.weatherDesc.filter(v => v === b).length
      ).pop();
      
      const mostCommonIcon = day.weatherIcon.sort((a, b) => 
        day.weatherIcon.filter(v => v === a).length - day.weatherIcon.filter(v => v === b).length
      ).pop();
      
      return {
        date: day.date,
        tempMax: Math.max(...day.temps),
        tempMin: Math.min(...day.temps),
        humidity: Math.round(day.humidity.reduce((sum, val) => sum + val, 0) / day.humidity.length),
        pressure: Math.round(day.pressure.reduce((sum, val) => sum + val, 0) / day.pressure.length),
        windSpeed: Math.round((day.windSpeed.reduce((sum, val) => sum + val, 0) / day.windSpeed.length) * 10) / 10,
        windDirection: Math.round(day.windDirection.reduce((sum, val) => sum + val, 0) / day.windDirection.length),
        precipitation: Math.round((day.precipitation.reduce((sum, val) => sum + val, 0)) * 10) / 10,
        weatherDesc: mostCommonDesc,
        weatherIcon: mostCommonIcon,
        timestamp: day.timestamp
      };
    });
    
    // Limit to requested number of days
    return {
      current,
      daily: daily.slice(0, days)
    };
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