# User Guide

This guide provides instructions on how to use AgriWeather Pro to optimize your farming operations through weather analytics and predictions.

## Table of Contents

- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Managing Locations](#managing-locations)
- [Weather Forecasts](#weather-forecasts)
- [Crop Predictions](#crop-predictions)
- [Irrigation Planning](#irrigation-planning)
- [Weather Alerts](#weather-alerts)
- [Reports](#reports)
- [Account Settings](#account-settings)
- [Premium Features](#premium-features)

## Getting Started

### Creating an Account

1. Navigate to the AgriWeather Pro login page
2. Click on "Sign Up"
3. Enter your email address and create a password
4. Verify your email by clicking the link sent to your inbox
5. Complete your profile information:
   - Full name
   - Farm/Organization name
   - Primary farming type
   - Contact details

### Initial Setup

After creating your account, you'll need to:

1. Add your farm location(s)
2. Set your measurement preferences (metric/imperial)
3. Configure which crops you're growing
4. Set up your alert preferences

## Dashboard Overview

![Dashboard Overview](./images/dashboard.png)

The dashboard is your central hub for weather information and analytics. It includes:

1. **Navigation Bar**: Access all main features
2. **Weather Summary**: Current conditions at your primary location
3. **Alerts Panel**: Any active weather alerts
4. **Forecast Cards**: Short and medium-term forecasts
5. **Crop Status**: Overview of crop conditions
6. **Quick Actions**: Common tasks and shortcuts

You can customize the dashboard layout in Settings > Dashboard Preferences.

## Managing Locations

### Adding a New Location

1. Go to "Locations" in the main menu
2. Click "Add New Location"
3. Enter location details:
   - Name (e.g., "North Field")
   - Address or coordinates
   - Field size (hectares/acres)
   - Location type (field, farm, etc.)
4. Optional: Upload field boundaries
5. Click "Save Location"

### Setting a Primary Location

1. Go to "Locations"
2. Find the location you want as primary
3. Click the "Set as Primary" button
4. Confirm your choice

Your primary location will be used for dashboard weather data and default views.

## Weather Forecasts

### Viewing Forecasts

1. Select "Forecasts" from the main menu
2. Choose a location from the dropdown
3. Select the forecast timeframe:
   - Today
   - Next 7 Days
   - 14-Day Outlook
   - 30-Day Trend

### Reading Forecast Data

The forecast includes:
- Temperature (high/low/average)
- Precipitation (amount and probability)
- Wind (speed and direction)
- Humidity
- UV Index
- Soil moisture predictions

#### Weather Maps

1. Click on "Weather Maps" in the forecast view
2. Select the data layer you want to view:
   - Temperature
   - Precipitation
   - Wind
   - Pressure
   - Cloud Cover
3. Use the timeline slider to view predictions for different times

For irrigation-specific map layers, see the [Irrigation Planning](#irrigation-planning) section.

#### Weather Maps

1. Click on "Weather Maps" in the forecast view
2. The interactive map will display your selected location with current weather data
3. Select different weather layers using the buttons on the left side of the map:
   - **Temperature**: View temperature distribution across the region
   - **Precipitation**: Monitor rainfall and precipitation patterns
   - **Wind Speed**: Check wind conditions and patterns
   - **Cloud Cover**: See cloud distribution and density
   - **Pressure**: View atmospheric pressure patterns
4. Click on any layer button to:
   - Activate that layer on the map
   - View detailed information about that weather parameter
   - See current readings and forecasts for your location
   - Access relevant alerts and triggers
5. Use the location search bar at the top to change locations
6. Toggle between Celsius and Fahrenheit using the button at the bottom
7. View the color scale legend to interpret the map colors

For irrigation-specific map layers, see the [Irrigation Planning](#irrigation-planning) section.

## Crop Predictions

### Setting Up Crop Monitoring

1. Go to "Crops" in the main menu
2. Click "Add Crop"
3. Enter crop details:
   - Crop type
   - Variety
   - Planting date
   - Field location
   - Expected harvest date
4. Click "Save"

### Viewing Predictions

The crop prediction page shows:
- Expected yield based on current conditions
- Risk factors (drought, frost, etc.)
- Growth stage indicators
- Weather impacts on crop development
- Historical comparison

### Understanding Risk Assessments

The Risk Assessment section provides critical information about potential threats to your crops:

1. **Risk Factors**: Each potential risk (Heat Stress, Drought, Excess Moisture, Pests) is displayed with:
   - Risk Level (Low, Medium, High) determined by current conditions
   - Impact Score (1-10) showing potential severity
   - Recommended actions based on risk level

2. **Data Sources**: Risk assessments integrate multiple reliable data sources:
   - NOAA weather services (hourly updates)
   - USDA historical records (quarterly updates)
   - Climate research databases (monthly updates)
   - Pest & disease monitoring networks (daily updates)

3. **Reading the Assessment**:
   - Color-coded indicators (green/yellow/red) show risk severity
   - Each risk includes specific monitoring recommendations
   - Impact scores help prioritize which risks need immediate attention

4. **Methodology Documentation**:
   - For complete details on how risks are calculated, visit the Methodology page
   - Access this page by clicking "Learn more about our risk assessment methodology" at the bottom of the Risk Assessment section
   - The Methodology page explains data sources, machine learning models, and validation processes

### Adjusting Farming Activities

Based on predictions, you'll receive recommendations for:
- Basic irrigation guidance
- Pest and disease risk management
- Optimal harvest timing
- Resource allocation

For advanced irrigation management, see the [Irrigation Planning](#irrigation-planning) section.

## Weather Alerts

### Configuring Alerts

1. Go to "Alerts" in the main menu
2. Click "Add Alert"
3. Select alert type:
   - Frost Warning
   - Drought Conditions
   - Heavy Rain
   - High Winds
   - Pest Pressure
4. Set threshold values
5. Choose notification methods (app, email, SMS)
6. Select which locations this alert applies to
7. Click "Save Alert"

### Managing Active Alerts

From the Alerts dashboard, you can:
- View all active alerts
- Dismiss alerts you've addressed
- Edit alert settings
- View historical alerts

## Reports

### Generating Reports

1. Go to "Reports" in the main menu
2. Click "Create Report"
3. Select report type:
   - Weather Summary
   - Crop Condition
   - Yield Prediction
   - Resource Planning
4. Choose date range and locations
5. Click "Generate Report"

### Saving and Sharing Reports

Once generated, you can:
- Save report to your account
- Export as PDF or Excel
- Share via email
- Schedule regular report generation

## Irrigation Planning

The Irrigation Planning feature helps optimize water usage based on weather conditions, soil moisture, and crop requirements.

### Accessing Irrigation Planning

1. From the main menu, select "Services" > "Irrigation Planning"
2. Alternatively, navigate to `/services/irrigation-planning` in your browser

### Irrigation Map

1. The default view shows the Irrigation Map with multiple data layers:
   - Temperature
   - Precipitation
   - Wind speed
   - Clouds
   - Soil Moisture (Premium)
   - Irrigation Needs (Premium)
   - Crop Growth (Premium)
2. Select different layers by clicking the layer buttons
3. View location-specific irrigation data in the details panel
4. Use the timeline to see predicted irrigation needs

### Using Additional Irrigation Features

The Irrigation Planning page has several tabs:

1. **Irrigation Map**: Interactive map with irrigation-specific weather and soil data
2. **Schedule** (Premium): Create automated irrigation schedules based on weather forecasts
3. **Analytics** (Premium): Track water usage, efficiency metrics, and cost savings
4. **Crop Settings** (Premium): Configure crop types, growth stages, and water requirements

### Interpreting Irrigation Data

The map interface provides key irrigation metrics:
- Current soil moisture levels
- Precipitation forecast
- Water needs based on crop type and growth stage
- Irrigation efficiency recommendations

Premium users receive additional metrics:
- Optimal irrigation scheduling
- Water usage analytics
- Crop-specific water requirements
- Efficiency improvements

## Account Settings

### Updating Your Profile

1. Click your profile icon in the top right
2. Select "Profile Settings"
3. Update your information
4. Click "Save Changes"

### Measurement Preferences

1. Go to "Settings" > "Preferences"
2. Select your preferred units for:
   - Temperature (°C/°F)
   - Precipitation (mm/inches)
   - Wind Speed (km/h, m/s, mph)
   - Pressure (hPa, inHg)
3. Click "Save Preferences"

### Notification Settings

1. Go to "Settings" > "Notifications"
2. Configure which notifications you want to receive
3. Set delivery methods (app, email, SMS)
4. Set quiet hours if desired
5. Click "Save Notification Settings"

## Premium Features

AgriWeather Pro offers a premium subscription that unlocks advanced features to optimize your farming operations.

### Premium Subscription Benefits

- **Advanced Irrigation Planning**:
  - Soil moisture analysis
  - Irrigation scheduling
  - Water usage analytics
  - Crop-specific water requirements
  
- **Enhanced Weather Analytics**:
  - High-resolution forecasts
  - Extended forecast range
  - Custom weather metrics
  
- **Advanced Crop Management**:
  - Detailed growth stage tracking
  - Precise yield predictions
  - Crop-specific pest risk analysis
  
- **Priority Support**:
  - Faster response times
  - Dedicated support channels
  - Custom feature requests

### Accessing Premium Features

Premium features are marked with a lock icon throughout the application. When you attempt to access a premium feature:

1. A premium overlay will appear
2. Click "Upgrade to Premium" to view subscription options
3. Select your preferred subscription plan
4. Complete the payment process
5. Premium features will be unlocked immediately

### Managing Your Subscription

1. Go to "Settings" > "Subscription"
2. View your current subscription status
3. Change plans or billing information
4. Cancel or renew your subscription

## Further Assistance

If you need additional help:
- Check our [FAQ](./faq.md)
- Contact support at Sales@synthed.xyz
- Join our community forum at forum.agriweatherpro.com
