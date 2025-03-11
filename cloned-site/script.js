async function getWeather() {
  const city = document.getElementById('city').value;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
    const geoData = await geoResponse.json();

    if (!geoData.length) {
      document.getElementById('weather-result').innerHTML = 'City not found.';
      return;
    }

    const { lat, lon } = geoData[0];
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`);

    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    document.getElementById('weather-result').innerHTML = `
      <h2>${city}</h2>
      <p>Temperature: ${weatherData.current.temp}°C</p>
      <p>Weather: ${weatherData.current.weather[0].description}</p>
      <p>Humidity: ${weatherData.current.humidity}%</p>
      <p>Wind Speed: ${weatherData.current.wind_speed} m/s</p>
    `;
  } catch (error) {
    console.error("Weather data fetch failed:", error);
    document.getElementById('weather-result').innerHTML = 'Failed to fetch weather data. Please try again later.';
  }
} 