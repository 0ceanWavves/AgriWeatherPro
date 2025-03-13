# Database Schema

This document outlines the database schema for AgriWeather Pro, detailing tables, relationships, and column specifications.

## Overview

AgriWeather Pro uses a PostgreSQL database hosted on Supabase. The schema is designed to support:
- User profiles and authentication
- Field and farm location management
- Weather data storage and analysis
- Crop predictions and analytics
- Alert systems for weather events

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│  user_profiles  │◄─────►│user_preferences │       │saved_locations  │
│                 │       │                 │       │                 │
└────────┬────────┘       └─────────────────┘       └────────┬────────┘
         │                                                    │
         │                                                    │
         ▼                                                    ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│ weather_reports │◄─────►│crop_predictions │◄─────►│user_weather_    │
│                 │       │                 │       │    alerts       │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

## Tables

### auth.users
This is a built-in Supabase table that handles user authentication.

### user_profiles
Stores extended information about users.

| Column         | Type        | Description                       |
|----------------|-------------|-----------------------------------|
| id             | UUID        | Primary key, references auth.users |
| full_name      | TEXT        | User's full name                  |
| display_name   | TEXT        | User's display name               |
| avatar_url     | TEXT        | URL to user's profile image       |
| bio            | TEXT        | User biography                    |
| organization   | TEXT        | User's organization               |
| farming_type   | TEXT        | Type of farming practiced         |
| created_at     | TIMESTAMPTZ | Creation timestamp                |
| updated_at     | TIMESTAMPTZ | Last update timestamp             |

### user_preferences
Stores user-specific application settings.

| Column                | Type        | Description                      |
|-----------------------|-------------|----------------------------------|
| id                    | UUID        | Primary key                      |
| user_id               | UUID        | References auth.users            |
| theme                 | TEXT        | UI theme preference              |
| temperature_unit      | TEXT        | Celsius or Fahrenheit            |
| wind_speed_unit       | TEXT        | Unit for wind speed              |
| precipitation_unit    | TEXT        | Unit for precipitation           |
| pressure_unit         | TEXT        | Unit for atmospheric pressure    |
| default_view          | TEXT        | Default dashboard view           |
| dashboard_layout      | JSONB       | Custom dashboard configuration   |
| notification_enabled  | BOOLEAN     | Enable/disable notifications     |
| daily_forecast_email  | BOOLEAN     | Enable/disable daily emails      |
| severe_weather_alerts | BOOLEAN     | Enable/disable severe alerts     |
| crop_condition_alerts | BOOLEAN     | Enable/disable crop alerts       |
| created_at            | TIMESTAMPTZ | Creation timestamp               |
| updated_at            | TIMESTAMPTZ | Last update timestamp            |

### saved_locations
Stores farm and field locations.

| Column         | Type        | Description                      |
|----------------|-------------|----------------------------------|
| id             | UUID        | Primary key                      |
| user_id        | UUID        | References auth.users            |
| name           | TEXT        | Location name                    |
| latitude       | NUMERIC     | Geographical latitude            |
| longitude      | NUMERIC     | Geographical longitude           |
| address        | TEXT        | Physical address                 |
| is_primary     | BOOLEAN     | Whether this is primary location |
| location_type  | TEXT        | Farm, field, home, etc.          |
| area_size      | NUMERIC     | Size in hectares                 |
| created_at     | TIMESTAMPTZ | Creation timestamp               |
| updated_at     | TIMESTAMPTZ | Last update timestamp            |

### weather_reports
Stores saved weather reports and forecasts.

| Column          | Type        | Description                      |
|-----------------|-------------|----------------------------------|
| id              | UUID        | Primary key                      |
| user_id         | UUID        | References auth.users            |
| title           | TEXT        | Report title                     |
| description     | TEXT        | Report description               |
| report_type     | TEXT        | Forecast, historical, etc.       |
| location_id     | UUID        | References saved_locations       |
| location_name   | TEXT        | Name of location                 |
| latitude        | NUMERIC     | Geographical latitude            |
| longitude       | NUMERIC     | Geographical longitude           |
| date_range      | JSONB       | Start and end dates              |
| report_data     | JSONB       | Weather data                     |
| report_settings | JSONB       | Report configuration             |
| created_at      | TIMESTAMPTZ | Creation timestamp               |
| updated_at      | TIMESTAMPTZ | Last update timestamp            |

### crop_predictions
Stores crop yield predictions and analyses.

| Column           | Type        | Description                      |
|------------------|-------------|----------------------------------|
| id               | UUID        | Primary key                      |
| user_id          | UUID        | References auth.users            |
| location_id      | UUID        | References saved_locations       |
| crop_type        | TEXT        | Type of crop                     |
| season           | TEXT        | Growing season                   |
| planting_date    | DATE        | Date of planting                 |
| harvest_date     | DATE        | Predicted harvest date           |
| field_size       | NUMERIC     | Size in hectares                 |
| current_yield    | NUMERIC     | Current yield                    |
| predicted_yield  | NUMERIC     | Predicted yield                  |
| yield_unit       | TEXT        | Unit for yield measurement       |
| confidence_level | NUMERIC     | Prediction confidence (0-1)      |
| weather_factors  | JSONB       | Weather factors affecting yield  |
| risk_factors     | JSONB       | Risk assessment factors          |
| notes            | TEXT        | Additional notes                 |
| created_at       | TIMESTAMPTZ | Creation timestamp               |
| updated_at       | TIMESTAMPTZ | Last update timestamp            |

### user_weather_alerts
Stores weather alert configurations and notifications.

| Column         | Type        | Description                      |
|----------------|-------------|----------------------------------|
| id             | UUID        | Primary key                      |
| user_id        | UUID        | References auth.users            |
| location_id    | UUID        | References saved_locations       |
| alert_type     | TEXT        | Type of weather alert            |
| alert_level    | TEXT        | Severity level                   |
| title          | TEXT        | Alert title                      |
| description    | TEXT        | Alert description                |
| start_time     | TIMESTAMPTZ | Alert start time                 |
| end_time       | TIMESTAMPTZ | Alert end time                   |
| is_read        | BOOLEAN     | Whether the alert was read       |
| is_dismissed   | BOOLEAN     | Whether the alert was dismissed  |
| alert_data     | JSONB       | Additional alert data            |
| created_at     | TIMESTAMPTZ | Creation timestamp               |
| updated_at     | TIMESTAMPTZ | Last update timestamp            |

## Database Triggers

### handle_new_user
Trigger that runs when a new user is created in auth.users. It:
- Creates a user profile
- Sets up default preferences

## Row-Level Security Policies

All tables have row-level security enabled with policies to ensure:
- Users can only access their own data
- Users can view/modify only their own profiles and settings
- Appropriate insert/update/delete permissions
