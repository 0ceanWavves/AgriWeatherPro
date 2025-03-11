-- AgriWeather Pro Seed Data

-- Create a demo user if none exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN
    INSERT INTO auth.users (id, email, raw_user_meta_data)
    VALUES (
      '11111111-1111-1111-1111-111111111111',
      'demo@agriweatherpro.com',
      '{"full_name": "Demo User", "role": "farmer"}'::jsonb
    );
  END IF;
END $$;

-- Sample location data for the demo user
INSERT INTO saved_locations (user_id, name, latitude, longitude, address, is_primary, location_type, area_size)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Main Farm', 41.878, -93.097, '123 Farm Lane, Iowa', TRUE, 'farm', 250),
  ('11111111-1111-1111-1111-111111111111', 'North Field', 41.881, -93.092, 'North County Road, Iowa', FALSE, 'field', 75),
  ('11111111-1111-1111-1111-111111111111', 'South Field', 41.872, -93.099, 'South County Road, Iowa', FALSE, 'field', 85);

-- Sample crop prediction data
INSERT INTO crop_predictions (user_id, crop_type, season, planting_date, harvest_date, field_size, current_yield, predicted_yield, yield_unit, confidence_level, weather_factors, risk_factors, notes)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'corn', '2025', '2025-04-15', '2025-10-10', 120, 180.5, 185.2, 'bu/acre', 0.87, 
   '{"temperature_anomaly": 1.2, "precipitation_percent": -5.4, "growing_degree_days": 112}'::jsonb,
   '{"drought": {"risk": "Low", "impact": 2}, "heat_stress": {"risk": "Medium", "impact": 5}, "excess_moisture": {"risk": "Low", "impact": 3}}'::jsonb,
   'Extended dry period in June may require additional irrigation'),
   
  ('11111111-1111-1111-1111-111111111111', 'soybeans', '2025', '2025-05-01', '2025-10-25', 85, 52.1, 54.3, 'bu/acre', 0.82, 
   '{"temperature_anomaly": 1.8, "precipitation_percent": 7.3, "growing_degree_days": 98}'::jsonb,
   '{"drought": {"risk": "Medium", "impact": 6}, "heat_stress": {"risk": "Medium", "impact": 4}, "pests": {"risk": "Medium", "impact": 5}}'::jsonb,
   'Consider early pest monitoring given moisture levels');

-- Sample weather alerts
INSERT INTO user_weather_alerts (user_id, alert_type, alert_level, title, description, start_time, end_time, is_read, alert_data)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'frost', 'warning', 'Frost Warning', 'Potential frost conditions expected overnight', NOW() + INTERVAL '1 day', NOW() + INTERVAL '2 days', FALSE, 
   '{"temperature": -2, "probability": 0.85, "affected_crops": ["corn", "soybeans"]}'::jsonb),
   
  ('11111111-1111-1111-1111-111111111111', 'heavy_rain', 'info', 'Heavy Rain Expected', 'Significant rainfall expected over the next 48 hours', NOW() + INTERVAL '3 days', NOW() + INTERVAL '5 days', FALSE, 
   '{"amount": "25-50mm", "intensity": "moderate", "flood_risk": "low"}'::jsonb);
