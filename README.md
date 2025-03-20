# AgriWeatherPro

A comprehensive agricultural weather application that helps farmers make data-driven decisions by providing real-time weather data, crop yield predictions, and agricultural insights.

## Project Overview

AgriWeatherPro combines weather data with agricultural analytics to provide farmers with actionable insights. The application features:

- **Real-time Weather Data**: Integration with OpenWeatherMap API
- **Interactive Maps**: Visualize weather patterns and field data
- **Crop Yield Predictions**: AI-driven crop yield forecasting
- **User Authentication**: Secure login and profile management
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
AgriWeatherPro/
├── public/               # Static assets and HTML templates
├── src/                  # Source code
│   ├── api/              # API integration modules
│   ├── assets/           # Images, icons, and other assets
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── lib/              # Library code and utilities
│   ├── pages/            # Page components
│   ├── services/         # Service layer for data operations
│   ├── styles/           # Global styles and CSS modules
│   ├── utils/            # Utility functions
│   ├── App.js            # Main application component
│   └── index.jsx         # Application entry point
├── supabase/             # Supabase configuration and functions
├── database/             # Database scripts and migrations
└── docs/                 # Documentation files
```

For a detailed visual representation of the project structure, see [project-structure.md](./project-structure.md).

## Technical Stack

- **Frontend**: React.js with functional components and hooks
- **State Management**: React Context API
- **Styling**: CSS Modules with Tailwind CSS
- **Backend**: Supabase for authentication and database
- **APIs**: OpenWeatherMap for weather data
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- Supabase account
- OpenWeatherMap API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AgriWeatherPro.git
   cd AgriWeatherPro
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Database Setup

1. Run the Supabase setup script:
   ```bash
   npm run setup-db
   # or
   yarn setup-db
   ```

2. Alternatively, you can manually execute the SQL scripts in the `database` directory.

## Deployment

The application is configured for deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Set the build command to `npm run build` or `yarn build`
3. Set the publish directory to `build`
4. Add the environment variables from your `.env.local` file

## Key Features Implementation

### Weather Data Integration

Weather data is fetched from OpenWeatherMap API and processed in `src/services/weatherService.js`. The data is then displayed using various components:

- `WeatherForecast.js`: Displays daily and hourly forecasts
- `WeatherMap.js`: Renders interactive weather maps

### Crop Yield Predictions

Crop yield predictions are implemented using:

- Historical weather data correlation
- Growing degree day calculations
- Soil moisture models

The main implementation is in `src/components/CropYieldDisplay.js`.

### Authentication

User authentication is handled by Supabase Auth and implemented in:

- `src/contexts/AuthContext.js`: Provides authentication state
- `src/pages/Auth/`: Contains authentication-related pages
- `src/components/ProtectedRoute/`: Route protection component

## Code Standards

- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **File Structure**: Related files grouped in directories
- **CSS**: CSS Modules with BEM naming convention

## Known Issues and Future Improvements

- Offline mode functionality needs enhancement
- Mobile responsiveness can be improved for complex data visualizations
- Add more comprehensive error handling for API failures
- Implement caching strategy for weather data

## Contact

For any questions or support, please contact:

- **Developer**: Your Name
- **Email**: your.email@example.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.