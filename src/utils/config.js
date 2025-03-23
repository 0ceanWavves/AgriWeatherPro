// Configuration variables for AgriWeather Pro

// OpenWeatherMap API key
export const OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || 'deeaa95f4b7b2543dc8c3d9cb96396c6';

// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Feature flags
export const USE_REAL_MAPS = import.meta.env.VITE_USE_REAL_MAPS === 'true';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:4202';

// API base URLs
export const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
export const GEOCODING_API_BASE = 'https://api.openweathermap.org/geo/1.0';
export const HISTORICAL_WEATHER_API = 'https://archive-api.open-meteo.com/v1/archive';
export const WEATHER_TILE_API = 'https://tile.openweathermap.org/map';

// Units configuration
export const DEFAULT_UNITS = 'metric'; // or 'imperial'
