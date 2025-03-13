-- AgriWeather Pro Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if auth schema exists, if not create it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
    CREATE SCHEMA auth;
  END IF;
END $$;

-- Check if auth.users table exists, if not create a simplified version
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users') THEN
    CREATE TABLE auth.users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT UNIQUE,
      raw_user_meta_data JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
  END IF;
END $$;

-- Drop existing tables if needed for clean setup
DROP TABLE IF EXISTS user_weather_alerts;
DROP TABLE IF EXISTS crop_predictions;
DROP TABLE IF EXISTS saved_locations;
DROP TABLE IF EXISTS weather_reports;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS user_profiles;

-- User Profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  organization TEXT,
  farming_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- User Preferences table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  theme TEXT DEFAULT 'light',
  temperature_unit TEXT DEFAULT 'celsius', -- celsius or fahrenheit
  wind_speed_unit TEXT DEFAULT 'ms', -- ms (meters/second), mph, kmh
  precipitation_unit TEXT DEFAULT 'mm', -- mm or in
  pressure_unit TEXT DEFAULT 'hPa', -- hPa, inHg, mmHg
  default_view TEXT DEFAULT 'forecast', -- forecast, maps, crops, dashboard
  dashboard_layout JSONB, -- Store dashboard widget layout
  notification_enabled BOOLEAN DEFAULT TRUE,
  daily_forecast_email BOOLEAN DEFAULT FALSE,
  severe_weather_alerts BOOLEAN DEFAULT TRUE,
  crop_condition_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Saved Locations table
CREATE TABLE saved_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  address TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  location_type TEXT, -- farm, field, home, etc.
  area_size NUMERIC, -- in hectares
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Weather Reports table (saved reports)
CREATE TABLE weather_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL, -- forecast, historical, agricultural
  location_id UUID,
  location_name TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  date_range JSONB, -- start_date, end_date
  report_data JSONB NOT NULL, -- weather data, can be large
  report_settings JSONB, -- parameters used for the report
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES saved_locations(id) ON DELETE SET NULL
);

-- Crop Predictions table
CREATE TABLE crop_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  location_id UUID,
  crop_type TEXT NOT NULL, -- corn, soybeans, wheat, etc.
  season TEXT NOT NULL, -- growing season (year or year range)
  planting_date DATE,
  harvest_date DATE,
  field_size NUMERIC, -- in hectares
  current_yield NUMERIC,
  predicted_yield NUMERIC,
  yield_unit TEXT NOT NULL, -- bu/acre, tons/hectare, etc.
  confidence_level NUMERIC, -- 0-1 prediction confidence
  weather_factors JSONB, -- weather factors affecting prediction
  risk_factors JSONB, -- risk assessment
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES saved_locations(id) ON DELETE CASCADE
);

-- User Weather Alerts table
CREATE TABLE user_weather_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  location_id UUID,
  alert_type TEXT NOT NULL, -- severe_weather, frost, drought, excessive_rain, etc.
  alert_level TEXT NOT NULL, -- info, warning, severe, critical
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  alert_data JSONB, -- detailed alert information
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES saved_locations(id) ON DELETE CASCADE
);

-- Add Row Level Security (RLS) policies

-- User Profiles policy
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any profile"
  ON user_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- User Preferences policy
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Saved Locations policy
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own locations"
  ON saved_locations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own locations"
  ON saved_locations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own locations"
  ON saved_locations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own locations"
  ON saved_locations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Weather Reports policy
ALTER TABLE weather_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON weather_reports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON weather_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON weather_reports
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON weather_reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- Crop Predictions policy
ALTER TABLE crop_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own crop predictions"
  ON crop_predictions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crop predictions"
  ON crop_predictions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own crop predictions"
  ON crop_predictions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own crop predictions"
  ON crop_predictions
  FOR DELETE
  USING (auth.uid() = user_id);

-- User Weather Alerts policy
ALTER TABLE user_weather_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON user_weather_alerts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON user_weather_alerts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON user_weather_alerts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new row into user_profiles
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Insert default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for performance
CREATE INDEX idx_saved_locations_user_id ON saved_locations(user_id);
CREATE INDEX idx_weather_reports_user_id ON weather_reports(user_id);
CREATE INDEX idx_crop_predictions_user_id ON crop_predictions(user_id);
CREATE INDEX idx_user_weather_alerts_user_id ON user_weather_alerts(user_id);
CREATE INDEX idx_saved_locations_coordinates ON saved_locations(latitude, longitude);
