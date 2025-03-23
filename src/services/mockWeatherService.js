// Mock weather service providing realistic data 
// Used as fallback when OpenWeatherMap API calls fail

/**
 * Generate mock weather data with realistic values
 * @param {number} lat - Latitude 
 * @param {number} lng - Longitude
 * @param {string} units - 'imperial' or 'metric'
 * @returns {Object} Mock weather data matching OpenWeatherMap API structure
 */
export const getMockWeatherData = (lat, lng, units = 'imperial') => {
  // Base temperature varies by latitude (colder near poles, warmer near equator)
  const baseTemp = units === 'imperial' 
    ? (80 - Math.abs(lat) * 0.8) // Fahrenheit
    : (27 - Math.abs(lat) * 0.4); // Celsius
  
  // Southeast Asia region gets tropical conditions if detected
  const isSoutheastAsia = (lat > -10 && lat < 25 && lng > 95 && lng < 140);
  
  // Current weather with realistic data
  const currentWeather = {
    temp: baseTemp + (Math.random() * 10 - 5),
    feels_like: baseTemp + (Math.random() * 12 - 6),
    pressure: 1010 + Math.floor(Math.random() * 20 - 10),
    humidity: isSoutheastAsia ? 75 + Math.floor(Math.random() * 15) : 60 + Math.floor(Math.random() * 30),
    dew_point: baseTemp - 5 + (Math.random() * 8 - 4),
    uvi: 5 + Math.random() * 6,
    clouds: Math.floor(Math.random() * 100),
    visibility: 10000,
    wind_speed: 3 + Math.random() * 12,
    wind_deg: Math.floor(Math.random() * 360),
    weather: [
      {
        id: 800 + Math.floor(Math.random() * 4),
        main: getRandomWeatherType(isSoutheastAsia),
        description: "Mock weather data (API key issue)",
        icon: "10d"
      }
    ]
  };
  
  // Generate 7 days of daily forecasts
  const dailyForecasts = Array(7).fill(0).map((_, i) => {
    const dayTemp = baseTemp + (Math.random() * 8 - 4) + (i % 2 === 0 ? 2 : -2);
    const precipitation = isSoutheastAsia ? 
      (Math.random() < 0.7 ? Math.random() * 20 : 0) : // Higher chance of rain in SE Asia
      (Math.random() < 0.4 ? Math.random() * 10 : 0);  // Lower chance elsewhere
    
    return {
      dt: Math.floor(Date.now() / 1000) + (i * 86400),
      sunrise: Math.floor(Date.now() / 1000) + (i * 86400) + 21600,
      sunset: Math.floor(Date.now() / 1000) + (i * 86400) + 64800,
      temp: {
        day: dayTemp,
        min: dayTemp - 10 + (Math.random() * 5),
        max: dayTemp + 5 + (Math.random() * 5),
        night: dayTemp - 8 + (Math.random() * 4),
        eve: dayTemp - 2 + (Math.random() * 4),
        morn: dayTemp - 5 + (Math.random() * 4)
      },
      feels_like: {
        day: dayTemp + 2,
        night: dayTemp - 10,
        eve: dayTemp - 4,
        morn: dayTemp - 8
      },
      pressure: 1010 + Math.floor(Math.random() * 20 - 10),
      humidity: isSoutheastAsia ? 75 + Math.floor(Math.random() * 15) : 60 + Math.floor(Math.random() * 30),
      dew_point: dayTemp - 5,
      wind_speed: 2 + Math.random() * 15,
      wind_deg: Math.floor(Math.random() * 360),
      weather: [
        {
          id: 800 + Math.floor(Math.random() * 4),
          main: getRandomWeatherType(isSoutheastAsia),
          description: "Mock forecast data",
          icon: "10d"
        }
      ],
      clouds: Math.floor(Math.random() * 100),
      pop: Math.random(),
      rain: precipitation > 0 ? precipitation : undefined,
      uvi: 5 + Math.random() * 6
    };
  });

  // Complete weather data structure
  return {
    lat,
    lon: lng,
    timezone: "Auto:Mock",
    timezone_offset: 0,
    current: currentWeather,
    daily: dailyForecasts,
    hourly: Array(24).fill(0).map((_, i) => ({
      ...currentWeather,
      dt: Math.floor(Date.now() / 1000) + (i * 3600),
      temp: currentWeather.temp + (Math.random() * 6 - 3),
    }))
  };
};

/**
 * Get a random weather type with bias toward realistic conditions
 * @param {boolean} isTropical - Whether the location is in a tropical region
 * @returns {string} Weather type
 */
function getRandomWeatherType(isTropical = false) {
  const weatherTypes = ["Clear", "Clouds", "Rain", "Thunderstorm", "Drizzle", "Mist"];
  
  // Probability weights (chance of each weather type)
  let weights;
  
  if (isTropical) {
    // Tropical regions have more rain and thunderstorms
    weights = [0.2, 0.3, 0.3, 0.15, 0.03, 0.02];
  } else {
    // Non-tropical regions have more clear and cloudy days
    weights = [0.4, 0.35, 0.1, 0.05, 0.05, 0.05];
  }
  
  // Use weighted random selection
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < weatherTypes.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return weatherTypes[i];
    }
  }
  
  return "Clouds"; // Default fallback
}

export default getMockWeatherData;