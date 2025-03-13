# Getting Started with AgriWeather Pro

This guide will help you set up AgriWeather Pro on your local development environment.

## Prerequisites

Before installing AgriWeather Pro, ensure you have the following prerequisites:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Supabase account
- OpenWeatherMap API key

## Installation Steps

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd agriweather-pro
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory with the following variables:

   ```
   REACT_APP_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
   REACT_APP_SUPABASE_URL=https://gexynwadeancyvnthsbu.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_USE_REAL_MAPS=true
   REACT_APP_USE_MOCK_DATA=false
   ```

4. **Database Setup**

   To initialize the database:

   a. Ensure the Supabase MCP server is running:
   ```bash
   node path/to/supabase-mcp-server/run_mcp.js
   ```

   b. Run the database initialization script:
   ```bash
   cd database
   node init-database.js
   ```

5. **Start the Development Server**

   ```bash
   npm start
   ```

   This will start the development server at [http://localhost:3000](http://localhost:3000).

## Verification

After starting the application, you should:

1. See the login/signup screen
2. Be able to create a new account or log in
3. Access the dashboard with weather information
4. Be able to add farm locations

If you encounter any issues during setup, refer to the [Troubleshooting](./troubleshooting.md) guide.

## Next Steps

Once you have AgriWeather Pro running, check out the [User Guide](./user-guide.md) to learn how to:

- Set up your farm profile
- Add and manage field locations
- Configure crop-specific settings
- Set up weather alerts
- Generate reports and forecasts
