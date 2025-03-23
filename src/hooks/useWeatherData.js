import { useState, useEffect } from 'react';
import { getWeatherForecast } from '../api/weatherApi';
import { useGlobalLocation } from '../contexts/locationContext';

/**
 * Custom hook to fetch and manage weather data for a specific location
 * 
 * @param {string} locationId - Optional location ID (if not provided, uses currentLocation)
 * @returns {Object} Weather data and loading state
 */
export const useWeatherData = (locationId) => {
  const { currentLocation, getUserLocation } = useGlobalLocation();
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Determine which location to use
    const location = locationId 
      ? getUserLocation(locationId) 
      : currentLocation;
    
    if (!location) {
      setIsLoading(false);
      return;
    }

    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get forecast data using coordinates
        const forecast = await getWeatherForecast(location.latitude, location.longitude);
        
        // Process and format the data for easier consumption
        const processedData = {
          locationName: location.name,
          region: location.region || '',
          country: location.country || '',
          current: forecast.current,
          forecast: forecast.daily.map(day => ({
            date: new Date(day.dt * 1000).toISOString().split('T')[0],
            tempHigh: day.temp.max,
            tempLow: day.temp.min,
            humidity: day.humidity,
            windSpeed: day.wind_speed,
            precipitation: day.rain || 0,
            weatherMain: day.weather[0].main,
            weatherDescription: day.weather[0].description,
            weatherIcon: day.weather[0].icon,
            pop: day.pop || 0 // Probability of precipitation
          })),
          hourly: forecast.hourly
        };
        
        setWeatherData(processedData);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err);
        
        // Use mock data in case of API failure
        setWeatherData(getMockWeatherData(location));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [locationId, currentLocation, getUserLocation]);

  // Function to generate mock weather data when API fails
  const getMockWeatherData = (location) => {
    const today = new Date();
    const mockForecast = [];
    
    // Generate 7 days of mock forecast data
    for (let i = 0; i < 7; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      
      // Randomize temperatures based on season
      const month = forecastDate.getMonth();
      const isSummer = month >= 5 && month <= 8;
      const baseTemp = isSummer ? 25 : 15;
      const variance = 5;
      
      const tempHigh = baseTemp + (Math.random() * variance);
      const tempLow = baseTemp - (Math.random() * variance);
      
      // Randomly determine precipitation (more likely in colder months)
      const precipProbability = isSummer ? 0.2 : 0.4;
      const hasPrecipitation = Math.random() < precipProbability;
      const precipitation = hasPrecipitation ? Math.random() * 10 : 0;
      
      mockForecast.push({
        date: forecastDate.toISOString().split('T')[0],
        tempHigh,
        tempLow,
        humidity: 50 + Math.floor(Math.random() * 30),
        windSpeed: 2 + Math.random() * 8,
        precipitation,
        weatherMain: hasPrecipitation ? 'Rain' : 'Clear',
        weatherDescription: hasPrecipitation ? 'Light rain' : 'Clear sky',
        weatherIcon: hasPrecipitation ? '10d' : '01d',
        pop: hasPrecipitation ? 0.7 : 0.1
      });
    }
    
    return {
      locationName: location.name || 'Unknown Location',
      region: location.region || '',
      country: location.country || '',
      current: {
        dt: Math.floor(Date.now() / 1000),
        temp: mockForecast[0].tempHigh,
        feels_like: mockForecast[0].tempHigh - 2,
        humidity: mockForecast[0].humidity,
        wind_speed: mockForecast[0].windSpeed,
        weather: [{
          main: mockForecast[0].weatherMain,
          description: mockForecast[0].weatherDescription,
          icon: mockForecast[0].weatherIcon
        }]
      },
      forecast: mockForecast,
      hourly: [] // We don't mock hourly data for simplicity
    };
  };

  return { weatherData, isLoading, error, refetch: () => { /* This function can be implemented if needed */ } };
};

export default useWeatherData;
