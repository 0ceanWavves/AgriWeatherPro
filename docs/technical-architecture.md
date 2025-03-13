# Technical Architecture

This document outlines the technical architecture of AgriWeather Pro, including its components, technologies, and data flow.

## System Overview

AgriWeather Pro is built as a modern web application with a React frontend and a Supabase backend. The application integrates multiple external weather data sources and employs machine learning algorithms to provide predictive analytics for agricultural purposes.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │◄───►│  Supabase APIs  │◄───►│  Database       │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Weather APIs   │     │  ML Analytics   │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

## Technology Stack

### Frontend
- **React.js**: Core UI library
- **React Router**: For navigation and routing
- **Chart.js/React-Chartjs-2**: For data visualization
- **Leaflet/React-Leaflet**: For interactive maps
- **React Hook Form**: For form handling
- **TailwindCSS**: For styling
- **React Icons**: UI icons
- **React Hot Toast**: For notifications
- **Premium Feature Gating**: For subscription-based feature access

### Backend
- **Supabase**: Backend-as-a-Service platform providing:
  - Authentication and user management
  - PostgreSQL database
  - Real-time data subscriptions
  - Storage for static assets

### External Services
- **OpenWeatherMap API**: For current weather data
- **Various weather data providers**: For comprehensive weather information

## Database Architecture

AgriWeather Pro uses a PostgreSQL database managed by Supabase. The main data models include:

- **User Profiles**: User account information
- **User Preferences**: Application settings and preferences
- **Saved Locations**: Farm and field locations
- **Weather Reports**: Saved historical and forecast reports
- **Crop Predictions**: Crop yield predictions
- **Weather Alerts**: User-configured alert settings
- **Subscription Plans**: Premium subscription information and access levels
- **Irrigation Plans**: Water management plans and scheduling information

For a detailed database schema, refer to the [Database Schema](./database-schema.md) document.

## Authentication Flow

1. User registers or logs in via Supabase Authentication
2. JWT tokens are issued and stored in browser
3. Tokens are used for subsequent API requests
4. Row-level security in Supabase ensures data access control

## Data Flow

1. **Weather Data Acquisition**:
   - Scheduled jobs fetch data from weather APIs
   - Data is processed and stored in the database

2. **User Interaction**:
   - User requests are sent to the React application
   - React components fetch required data from Supabase
   - Data is rendered in the UI

3. **Analytics Processing**:
   - Raw weather data is processed through prediction models
   - Results are stored and made available to users

## Deployment Architecture

AgriWeather Pro is designed to be deployed as:

- Frontend: Static assets on CDN/hosting service
- Backend: Supabase cloud services
- Database: Managed PostgreSQL instance on Supabase

## Security Considerations

- Authentication via Supabase with JWT
- Row-level security policies in the database
- Environment variables for sensitive API keys
- HTTPS for all communication
- Input validation and sanitization

## Performance Optimization

- React component memoization
- Efficient data fetching strategies
- CDN for static assets
- Database query optimization
- Lazy loading of components
