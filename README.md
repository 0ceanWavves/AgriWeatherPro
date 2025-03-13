# AgriWeather Pro

Advanced weather analytics platform helping farmers optimize crop yields through AI-powered climate trend analysis and predictions.

## Overview

AgriWeather Pro is a comprehensive weather analytics application specifically designed for agricultural needs. The platform provides accurate weather forecasts, interactive maps, crop yield predictions, and climate trend analysis to help farmers make data-driven decisions.

## Features

- **Weather Forecasting**: Detailed weather forecasts with agricultural relevance
- **Interactive Weather Maps**: Visual representations of temperature, precipitation, wind speed, and more
- **Crop Yield Predictions**: AI-powered yield forecasts for major crops
- **Climate Analytics**: Historical climate data analysis and future trend predictions
- **Agricultural Dashboard**: Comprehensive overview of weather data and agricultural insights

## Tech Stack

- **Frontend**: React.js with Create React App
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Maps**: Leaflet.js with react-leaflet
- **API Requests**: Axios
- **Weather Data**: OpenWeatherMap API, Open-Meteo API

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

### Environment Variables

The following environment variables are required:

- `REACT_APP_OPENWEATHERMAP_API_KEY`: API key for OpenWeatherMap services

These are already configured in the .env file.

### Running the Application

Start the development server:

```
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

Create a production build:

```
npm run build
```

## Project Structure

- `/src`: Source code
  - `/api`: API service functions
  - `/components`: Reusable React components
  - `/pages`: Page components
  - `/utils`: Utility functions
  - `/assets`: Static assets

## APIs Used

- **OpenWeatherMap API**: For weather forecasts and map layers
- **Open-Meteo API**: For historical weather data

## Deployment

The application can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Weather data provided by OpenWeatherMap and Open-Meteo
- Icons from React Icons
- Maps powered by Leaflet.js