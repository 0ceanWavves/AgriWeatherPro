// Environment variables for APIs with fallbacks
export const OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || process.env.REACT_APP_OPENWEATHERMAP_API_KEY || '';
export const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY || process.env.REACT_APP_PERPLEXITY_API_KEY || '';
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY || '';