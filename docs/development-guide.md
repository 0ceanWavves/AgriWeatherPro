# Development Guide

This guide is for developers who want to contribute to or extend the AgriWeather Pro application. It provides information on the development environment, code organization, and best practices.

## Development Environment Setup

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Git
- Code editor (VSCode recommended)
- Supabase account (for backend development)

### Setting Up the Project

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd agriweather-pro
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env.local` file in the root directory:

   ```
   REACT_APP_OPENWEATHERMAP_API_KEY=your_api_key
   REACT_APP_SUPABASE_URL=https://gexynwadeancyvnthsbu.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   REACT_APP_USE_REAL_MAPS=true
   REACT_APP_USE_MOCK_DATA=false
   ```

4. **Start the Development Server**

   ```bash
   npm start
   ```

   This will run the app in development mode at [http://localhost:3000](http://localhost:3000).

5. **Set Up Supabase MCP Server (for database development)**

   ```bash
   node C:\MCP\supabase-mcp-server\run_mcp.js
   ```

## Project Structure

```
agriweather-pro/
├── public/                 # Static files
├── src/                    # Source code
│   ├── api/                # API integration
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components (buttons, inputs, etc.)
│   │   ├── layout/         # Layout components (header, footer, etc.)
│   │   ├── maps/           # Map-related components
│   │   ├── weather/        # Weather display components
│   │   └── crops/          # Crop-related components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and libraries
│   │   └── supabase.js     # Supabase client
│   ├── pages/              # Page components
│   ├── routes/             # Routing configuration
│   ├── services/           # Business logic and services
│   ├── styles/             # Global styles and themes
│   ├── utils/              # Utility functions
│   ├── App.js              # Root application component
│   └── index.js            # Application entry point
├── database/               # Database scripts and schema
├── docs/                   # Documentation
├── .env.local              # Environment variables (not in repo)
├── .gitignore              # Git ignore file
├── package.json            # NPM package configuration
└── README.md               # Project README
```

## Key Technologies and Libraries

- **React**: UI library
- **React Router**: Navigation
- **Supabase**: Backend as a Service (BaaS)
- **Chart.js/React-Chartjs-2**: Data visualization
- **Leaflet/React-Leaflet**: Interactive maps
- **TailwindCSS**: CSS framework
- **React Hook Form**: Form handling
- **Axios**: HTTP client
- **React Icons**: Icon library
- **React Hot Toast**: Toast notifications

## Code Conventions

### JavaScript/React

- Use functional components with hooks
- Use ES6+ features (arrow functions, destructuring, etc.)
- Follow React best practices for state management
- Prefer named exports over default exports

### Component Structure

```jsx
// src/components/Weather/WeatherCard.js
import React from 'react';
import PropTypes from 'prop-types';
import { formatTemperature } from '../../utils/formatters';
import './WeatherCard.css';

export const WeatherCard = ({ 
  temperature, 
  condition, 
  location, 
  timestamp 
}) => {
  return (
    <div className="weather-card">
      <h3>{location}</h3>
      <p className="temperature">{formatTemperature(temperature)}</p>
      <p className="condition">{condition}</p>
      <p className="timestamp">{timestamp}</p>
    </div>
  );
};

WeatherCard.propTypes = {
  temperature: PropTypes.number.isRequired,
  condition: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired
};
```

### File Naming

- React components: PascalCase (e.g., `WeatherCard.js`)
- Utilities and hooks: camelCase (e.g., `formatWeather.js`, `useWeatherData.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### CSS/Styling

- Use TailwindCSS for styling
- Use component-specific CSS files for complex components
- Follow responsive design principles
- Use CSS variables for theming

## State Management

For state management, we use a combination of:

- React Context for global state
- React's useState and useReducer for local state
- Custom hooks for shared logic

### Example Context

```jsx
// src/context/WeatherContext.js
import React, { createContext, useContext, useReducer } from 'react';

const WeatherContext = createContext();

const initialState = {
  currentWeather: null,
  forecast: [],
  loading: false,
  error: null
};

function weatherReducer(state, action) {
  switch (action.type) {
    case 'FETCH_WEATHER_START':
      return { ...state, loading: true };
    case 'FETCH_WEATHER_SUCCESS':
      return { 
        ...state, 
        currentWeather: action.payload.current,
        forecast: action.payload.forecast,
        loading: false, 
        error: null 
      };
    case 'FETCH_WEATHER_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  
  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
```

## API Integration

### Supabase

We use the Supabase client for database operations and authentication:

```jsx
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Weather API

Weather data is fetched using service functions:

```jsx
// src/services/weatherService.js
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherForLocation = async (latitude, longitude, units = 'metric') => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: API_KEY,
        units: units
      }
    });
    
    return {
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      wind_speed: response.data.wind.speed,
      wind_direction: response.data.wind.deg,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      timestamp: new Date(response.data.dt * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Additional weather service functions...
```

## Database Operations

For database operations, we use Supabase's client:

```jsx
// src/services/locationService.js
import { supabase } from '../lib/supabase';

export const getUserLocations = async () => {
  try {
    const { data, error } = await supabase
      .from('saved_locations')
      .select('*')
      .order('is_primary', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user locations:', error);
    throw error;
  }
};

export const addLocation = async (locationData) => {
  try {
    const { data, error } = await supabase
      .from('saved_locations')
      .insert([locationData])
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
};

// Additional location service functions...
```

## Testing

We use Jest and React Testing Library for testing:

```jsx
// src/components/Weather/WeatherCard.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { WeatherCard } from './WeatherCard';

describe('WeatherCard', () => {
  const mockProps = {
    temperature: 25,
    condition: 'Sunny',
    location: 'Test Farm',
    timestamp: '2025-03-11T12:00:00Z'
  };

  test('renders location name', () => {
    render(<WeatherCard {...mockProps} />);
    expect(screen.getByText('Test Farm')).toBeInTheDocument();
  });

  test('renders temperature correctly', () => {
    render(<WeatherCard {...mockProps} />);
    expect(screen.getByText('25°C')).toBeInTheDocument();
  });

  // Additional tests...
});
```

To run tests:

```bash
npm test
```

## Database Development

### Schema Changes

When making schema changes:

1. Update the `schema.sql` file in the `database` directory
2. Run the database initialization script to apply changes
3. Update any affected API functions or components

### Row-Level Security

All tables have Row-Level Security (RLS) policies to ensure data security. When creating new tables, ensure appropriate RLS policies are defined.

Example RLS policy:

```sql
-- Enable RLS on a table
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create a policy for SELECT
CREATE POLICY "Users can view own data"
  ON table_name
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create a policy for INSERT
CREATE POLICY "Users can insert own data"
  ON table_name
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Build and Deployment

### Development Build

```bash
npm start
```

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build` directory.

### Deployment

See the [Deployment Guide](./deployment-guide.md) for detailed deployment instructions.

## Contributing

### Pull Request Process

1. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```

3. Push your branch:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Create a Pull Request to the `develop` branch
5. Ensure all tests pass
6. Ask for code review from team members
7. Once approved, merge the PR

### Code Review Guidelines

- Review code for readability, maintainability, and performance
- Ensure proper error handling
- Check for potential security issues
- Verify that component props are properly validated
- Check for responsive design issues
- Ensure code follows project conventions and styles

## Troubleshooting Common Development Issues

### React Development Server Issues

If the development server isn't starting properly:

1. Check that all dependencies are installed
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: 
   ```bash
   rm -rf node_modules
   npm install
   ```

### Supabase Connection Issues

If you're having trouble connecting to Supabase:

1. Verify your environment variables
2. Check network connectivity
3. Ensure the Supabase project is active
4. Check browser console for CORS errors

### Database Initialization Errors

If database initialization fails:

1. Check that the MCP server is running
2. Verify the SQL syntax in schema files
3. Check permissions for the Supabase account

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Supabase Documentation](https://supabase.io/docs)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [OpenWeatherMap API Documentation](https://openweathermap.org/api)

For further assistance, contact the development team at Sales@synthed.xyz.

## Key Components

### WeatherMap Component

The `WeatherMap` component (`src/components/DashboardWidgets/WeatherMap.js`) provides interactive maps for displaying weather data. This component uses Leaflet directly instead of React-Leaflet for better control and performance.

#### Core Principles

1. **Direct Leaflet Integration**:
   - Uses the Leaflet library directly without React-Leaflet
   - Provides better control over map lifecycle and performance

2. **Map Reference Management**:
   - Uses `useRef` to store and manage the map instance
   - All map operations are performed through `mapRef.current`
   - Prevents memory leaks by properly cleaning up

3. **Layer Management**:
   - Weather layers (temperature, precipitation, etc.) are managed as Leaflet tile layers
   - Uses a `layerRefs` object to track and manage all layer instances
   - Only displays the active layer at any time

#### Component Usage

```jsx
<WeatherMap 
  location={{ lat: 51.505, lng: -0.09, name: 'London' }}
  mode="weather"
/>
```

#### Implementation Details

1. **Initialization**:
   ```javascript
   // Initialize the map when the component mounts
   useEffect(() => {
     if (mapRef.current || isLoading) return;
     
     try {
       // Create the map with the specified options
       const map = L.map(mapId.current, {
         center: [locationLat, locationLng],
         zoom: 8,
         zoomControl: true,
         attributionControl: true,
       });
       
       // Store the map reference
       mapRef.current = map;
       
       // Add the base layer (OpenStreetMap)
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
       }).addTo(map);
       
       // Initialize layer references and add marker
       // ...
     } catch (error) {
       console.error("Error initializing weather map:", error);
     }
   }, [dependencies]);
   ```

2. **Layer Management**:
   ```javascript
   // Handle layer change
   const handleLayerChange = (layerId) => {
     if (!mapRef.current) return;
     
     try {
       // Set the active layer
       setActiveLayer(layerId);
       
       // Remove all existing weather layers
       Object.keys(layerRefs.current).forEach(id => {
         if (layerRefs.current[id] && mapRef.current.hasLayer(layerRefs.current[id])) {
           mapRef.current.removeLayer(layerRefs.current[id]);
         }
       });
       
       // Add the selected layer or create if it doesn't exist
       // ...
     } catch (error) {
       console.error("Error changing weather layer:", error);
     }
   };
   ```

3. **Cleanup**:
   ```javascript
   // Cleanup when component unmounts
   useEffect(() => {
     return () => {
       if (mapRef.current) {
         // Remove all layers
         Object.values(layerRefs.current || {}).forEach(layer => {
           if (layer && mapRef.current.hasLayer(layer)) {
             mapRef.current.removeLayer(layer);
           }
         });
         
         // Remove marker
         if (window.marker && mapRef.current.hasLayer(window.marker)) {
           mapRef.current.removeLayer(window.marker);
           window.marker = null;
         }
         
         // Remove the map
         mapRef.current.remove();
         mapRef.current = null;
       }
     };
   }, []);
   ```

#### Best Practices

1. **Always clean up resources** when the component unmounts
2. **Manage all references** through React refs for better lifecycle control
3. **Handle errors robustly** in all map operations
4. **Avoid storing map instance in global variables** like `window.weatherMap`
5. **Check if map is initialized** before performing operations
