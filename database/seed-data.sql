-- AgriWeather Pro Seed Data

-- Sample location data (will be linked to test users after they're created)
INSERT INTO saved_locations (user_id, name, latitude, longitude, address, is_primary, location_type, area_size)
VALUES 
  -- These will be updated with actual user IDs later
  ('00000000-0000-0000-0000-000000000000', 'Main Farm', 41.878, -93.097, '123 Farm Lane, Iowa', TRUE, 'farm', 250),
  ('00000000-0000-0000-0000-000000000000', 'North Field', 41.881, -93.092, 'North County Road, Iowa', FALSE, 'field', 75),
  ('00000000-0000-0000-0000-000000000000', 'South Field', 41.872, -93.099, 'South County Road, Iowa', FALSE, 'field', 85);

-- Sample crop prediction data
INSERT INTO crop_predictions (user_id, crop_type, season, planting_date, harvest_date, field_size, current_yield, predicted_yield, yield_unit, confidence_level, weather_factors, risk_factors, notes)
VALUES 
  -- These will be updated with actual user IDs later
  ('00000000-0000-0000-0000-000000000000', 'corn', '2025', '2025-04-15', '2025-10-10', 120, 180.5, 185.2, 'bu/acre', 0.87, 
   '{"temperature_anomaly": 1.2, "precipitation_percent": -5.4, "growing_degree_days": 112}',
   '{"drought": {"risk": "Low", "impact": 2}, "heat_stress": {"risk": "Medium", "impact": 5}, "excess_moisture": {"risk": "Low", "impact": 3}}',
   'Extended dry period in June may require additional irrigation'),
   
  ('00000000-0000-0000-0000-000000000000', 'soybeans', '2025', '2025-05-01', '2025-10-25', 85, 52.1, 54.3, 'bu/acre', 0.82, 
   '{"temperature_anomaly": 1.8, "precipitation_percent": 7.3, "growing_degree_days": 98}',
   '{"drought": {"risk": "Medium", "impact": 6}, "heat_stress": {"risk": "Medium", "impact": 4}, "pests": {"risk": "Medium", "impact": 5}}',
   'Consider early pest monitoring given moisture levels');

-- Sample weather alerts
INSERT INTO user_weather_alerts (user_id, alert_type, alert_level, title, description, start_time, end_time, is_read, alert_data)
VALUES 
  -- These will be updated with actual user IDs later
  ('00000000-0000-0000-0000-000000000000', 'frost', 'warning', 'Frost Warning', 'Potential frost conditions expected overnight', NOW() + INTERVAL '1 day', NOW() + INTERVAL '2 days', FALSE, 
   '{"temperature": -2, "probability": 0.85, "affected_crops": ["corn", "soybeans"]}'),
   
  ('00000000-0000-0000-0000-000000000000', 'heavy_rain', 'info', 'Heavy Rain Expected', 'Significant rainfall expected over the next 48 hours', NOW() + INTERVAL '3 days', NOW() + INTERVAL '5 days', FALSE, 
   '{"amount": "25-50mm", "intensity": "moderate", "flood_risk": "low"}');

-- Create a function to update sample data with real user IDs
CREATE OR REPLACE FUNCTION update_sample_data_with_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Update sample locations
  UPDATE saved_locations
  SET user_id = NEW.id
  WHERE user_id = '00000000-0000-0000-0000-000000000000'
  LIMIT 3;
  
  -- Update sample crop predictions
  UPDATE crop_predictions
  SET user_id = NEW.id
  WHERE user_id = '00000000-0000-0000-0000-000000000000'
  LIMIT 2;
  
  -- Update sample alerts
  UPDATE user_weather_alerts
  SET user_id = NEW.id
  WHERE user_id = '00000000-0000-0000-0000-000000000000'
  LIMIT 2;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This trigger will run after the first user is created and will be dropped afterward
CREATE TRIGGER update_sample_data_on_first_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION update_sample_data_with_user();

-- Create a function to drop the sample data update trigger after it's used once
CREATE OR REPLACE FUNCTION drop_sample_data_trigger()
RETURNS TRIGGER AS $$
BEGIN
  DROP TRIGGER IF EXISTS update_sample_data_on_first_user ON auth.users;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This trigger will drop the update_sample_data_on_first_user trigger after it runs
CREATE TRIGGER drop_sample_trigger_after_use
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION drop_sample_data_trigger();
