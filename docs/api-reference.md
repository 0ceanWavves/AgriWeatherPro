# API Reference

AgriWeather Pro provides API endpoints for integrating with other farm management systems and applications. This document outlines the available endpoints, authentication requirements, and usage examples.

## Authentication

All API requests require authentication using a JWT token obtained through Supabase authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Base URL

```
https://gexynwadeancyvnthsbu.supabase.co/rest/v1
```

## Weather Data Endpoints

### Get Current Weather

Retrieves current weather data for a specific location.

**Endpoint:** `/weather/current`

**Method:** GET

**Parameters:**
- `latitude` (required): Location latitude
- `longitude` (required): Location longitude
- `units` (optional): Unit system (metric/imperial, default: metric)

**Example Request:**
```bash
curl -X GET "https://gexynwadeancyvnthsbu.supabase.co/rest/v1/weather/current?latitude=41.878&longitude=-93.097&units=metric" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "apikey: YOUR_ANON_KEY"
```

**Example Response:**
```json
{
  "location": {
    "latitude": 41.878,
    "longitude": -93.097,
    "name": "Marshalltown"
  },
  "current": {
    "temperature": 18.5,
    "feels_like": 17.9,
    "humidity": 65,
    "wind_speed": 12.7,
    "wind_direction": 270,
    "pressure": 1012,
    "condition": "partly_cloudy",
    "icon": "partly_cloudy",
    "uv_index": 4.2,
    "timestamp": "2025-03-11T12:00:00Z"
  }
}
```

### Get Forecast

Retrieves weather forecast for a specific location.

**Endpoint:** `/weather/forecast`

**Method:** GET

**Parameters:**
- `latitude` (required): Location latitude
- `longitude` (required): Location longitude
- `units` (optional): Unit system (metric/imperial, default: metric)
- `days` (optional): Number of days (1-14, default: 7)

**Example Request:**
```bash
curl -X GET "https://gexynwadeancyvnthsbu.supabase.co/rest/v1/weather/forecast?latitude=41.878&longitude=-93.097&days=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "apikey: YOUR_ANON_KEY"
```

**Example Response:**
```json
{
  "location": {
    "latitude": 41.878,
    "longitude": -93.097,
    "name": "Marshalltown"
  },
  "forecast": [
    {
      "date": "2025-03-11",
      "temperature_max": 20.5,
      "temperature_min": 12.3,
      "humidity": 68,
      "precipitation_probability": 20,
      "precipitation_amount": 1.2,
      "wind_speed": 15.3,
      "wind_direction": 265,
      "condition": "partly_cloudy",
      "icon": "partly_cloudy"
    },
    // Additional days...
  ]
}
```

### Get Historical Weather

Retrieves historical weather data for a specific location.

**Endpoint:** `/weather/historical`

**Method:** GET

**Parameters:**
- `latitude` (required): Location latitude
- `longitude` (required): Location longitude
- `start_date` (required): Start date (YYYY-MM-DD)
- `end_date` (required): End date (YYYY-MM-DD)
- `units` (optional): Unit system (metric/imperial, default: metric)

**Example Request:**
```bash
curl -X GET "https://gexynwadeancyvnthsbu.supabase.co/rest/v1/weather/historical?latitude=41.878&longitude=-93.097&start_date=2025-01-01&end_date=2025-01-07" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "apikey: YOUR_ANON_KEY"
```

**Example Response:**
```json
{
  "location": {
    "latitude": 41.878,
    "longitude": -93.097,
    "name": "Marshalltown"
  },
  "historical": [
    {
      "date": "2025-01-01",
      "temperature_max": 2.5,
      "temperature_min": -3.2,
      "humidity": 78,
      "precipitation_amount": 0,
      "wind_speed": 12.1,
      "condition": "clear"
    },
    // Additional days...
  ]
}
```

## Crop Endpoints

### Get Crop Predictions

Retrieves yield predictions for specific crops and locations.

**Endpoint:** `/crop_predictions`

**Method:** GET

**Parameters:**
- `location_id` (required): ID of the location
- `crop_type` (optional): Filter by crop type

**Example Request:**
```bash
curl -X GET "https://gexynwadeancyvnthsbu.supabase.co/rest/v1/crop_predictions?location_id=f47ac10b-58cc-4372-a567-0e02b2c3d479&crop_type=corn" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "apikey: YOUR_ANON_KEY"
```

**Example Response:**
```json
[
  {
    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "user_id": "e165a0f8-2786-49fe-b452-d0dd3c592937",
    "location_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "crop_type": "corn",
    "season": "2025",
    "planting_date": "2025-04-15",
    "harvest_date": "2025-10-10",
    "field_size": 120,
    "current_yield": 180.5,
    "predicted_yield": 185.2,
    "yield_unit": "bu/acre",
    "confidence_level": 0.87,
    "weather_factors": {
      "temperature_anomaly": 1.2,
      "precipitation_percent": -5.4,
      "growing_degree_days": 112
    },
    "risk_factors": {
      "drought": {"risk": "Low", "impact": 2},
      "heat_stress": {"risk": "Medium", "impact": 5},
      "excess_moisture": {"risk": "Low", "impact": 3}
    }
  }
]
```

### Create Crop Prediction

Creates a new crop prediction.

**Endpoint:** `/crop_predictions`

**Method:** POST

**Body Parameters:**
- `location_id` (required): ID of the location
- `crop_type` (required): Type of crop
- `season` (required): Growing season
- `planting_date` (required): Planting date
- `harvest_date` (optional): Expected harvest date
- `field_size` (required): Size of the field
- Other parameters as needed

**Example Request:**
```bash
curl -X POST "https://gexynwadeancyvnthsbu.supabase.co/rest/v1/crop_predictions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "location_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "crop_type": "soybeans",
    "season": "2025",
    "planting_date": "2025-05-01",
    "harvest_date": "2025-10-25",
    "field_size": 85,
    "yield_unit": "bu/acre"
  }'
```

**Example Response:**
```json
{
  "id": "c88e0fd2-9fcb-4f02-a416-e9b0a5c60182",
  "user_id": "e165a0f8-2786-49fe-b452-d0dd3c592937",
  "location_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "crop_type": "soybeans",
  "season": "2025",
  "planting_date": "2025-05-01",
  "harvest_date": "2025-10-25",
  "field_size": 85,
  "current_yield": null,
  "predicted_yield": null,
  "yield_unit": "bu/acre",
  "confidence_level": null,
  "created_at": "2025-03-11T14:00:00Z"
}
```

### Risk Assessment Methodology

Our risk assessment API endpoints employ advanced machine learning models to evaluate multiple factors affecting crop health. The risk calculations are performed through the following process:

1. **Data Collection**: Weather data, historical patterns, and crop-specific factors are gathered
2. **Risk Scoring**: Each risk factor is analyzed independently based on current conditions
3. **Level Determination**: Raw scores are converted to risk levels (Low, Medium, High)
4. **Impact Assessment**: Potential effects on yield and farm operations are calculated
5. **Final Assessment**: Combined analysis with actionable recommendations

**Risk Level Scale**:
- Low: 1-3 (Minor impact, continue regular monitoring)
- Medium: 4-6 (Moderate impact, prepare mitigation strategies)
- High: 7-10 (Significant impact, immediate action recommended)

For complete methodology details, refer to the Risk Assessment Methodology page in the AgriWeather Pro application.

## Location Endpoints

### Get Locations

Retrieves all saved locations for the authenticated user.

**Endpoint:** `/saved_locations`

**Method:** GET

**Example Request:**
```bash
curl -X GET "https://gexynwadeancyvnthsbu.supabase.co/rest/v1/saved_locations" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "apikey: YOUR_ANON_KEY"
```

**Example Response:**
```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "user_id": "e165a0f8-2786-49fe-b452-d0dd3c592937",
    "name": "Main Farm",
    "latitude": 41.878,
    "longitude": -93.097,
    "address": "123 Farm Lane, Iowa",
    "is_primary": true,
    "location_type": "farm",
    "area_size": 250,
    "created_at": "2025-01-15T10:30:00Z"
  },
  {
    "id": "3b37e8b9-5c48-42c9-a5a4-3e46c21a0b31",
    "user_id": "e165a0f8-2786-49fe-b452-d0dd3c592937",
    "name": "North Field",
    "latitude": 41.881,
    "longitude": -93.092,
    "address": "North County Road, Iowa",
    "is_primary": false,
    "location_type": "field",
    "area_size": 75,
    "created_at": "2025-01-15T10:45:00Z"
  }
]
```

### Create Location

Creates a new location.

**Endpoint:** `/saved_locations`

**Method:** POST

**Body Parameters:**
- `name` (required): Location name
- `latitude` (required): Latitude
- `longitude` (required): Longitude
- `address` (optional): Physical address
- `is_primary` (optional): Set as primary location
- `location_type` (optional): Type of location
- `area_size` (optional): Size of area

**Example Request:**
```bash
curl -X POST "https://gexynwadeancyvnthsbu.supabase.co/rest/v1/saved_locations" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "South Field",
    "latitude": 41.872,
    "longitude": -93.099,
    "address": "South County Road, Iowa",
    "is_primary": false,
    "location_type": "field",
    "area_size": 85
  }'
```

**Example Response:**
```json
{
  "id": "9f8a7e6d-5b4c-3d2e-1f0a-9b8c7d6e5f4a",
  "user_id": "e165a0f8-2786-49fe-b452-d0dd3c592937",
  "name": "South Field",
  "latitude": 41.872,
  "longitude": -93.099,
  "address": "South County Road, Iowa",
  "is_primary": false,
  "location_type": "field",
  "area_size": 85,
  "created_at": "2025-03-11T14:15:00Z"
}
```

## Error Handling

API errors are returned with appropriate HTTP status codes and a JSON response containing error details.

**Example Error Response:**
```json
{
  "error": "Not Found",
  "message": "The requested resource was not found",
  "status": 404
}
```

Common error codes:
- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Missing or invalid authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Server-side issue

## Rate Limiting

API requests are subject to rate limiting:
- 60 requests per minute for authenticated users
- 10 requests per minute for anonymous users

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Maximum requests per minute
- `X-RateLimit-Remaining`: Remaining requests for the current minute
- `X-RateLimit-Reset`: Time (in seconds) until the rate limit resets

## Webhooks

AgriWeather Pro can send webhook notifications for various events:

1. Set up webhooks in the developer portal
2. Configure which events trigger notifications
3. Set a secret key for authentication
4. Implement an endpoint to receive the notifications

Available webhook events:
- `weather.alert`: New weather alert
- `crop.prediction.updated`: Updated crop prediction
- `location.created`: New location added

## Further Information

For additional support or information about the API:
- Contact developer support at Sales@synthed.xyz
- Join our developer community at forum.agriweatherpro.com/developers

## Maps API

AgriWeather Pro uses the following map services:

- **Base Maps**: OpenStreetMap
- **Weather Data**: OpenWeatherMap API

### Map Tile URLs

#### Base Map Tiles
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

#### Weather Layer Tiles
Weather layers use the OpenWeatherMap API with the following patterns:

```javascript
// Temperature layer
https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid={API_KEY}

// Precipitation layer
https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid={API_KEY}

// Wind speed layer
https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid={API_KEY}

// Clouds layer
https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid={API_KEY}

// Pressure layer
https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid={API_KEY}
```

### Layer Management

The application manages these layers using Leaflet's tile layer system. The general pattern for adding a weather layer is:

```javascript
const layer = L.tileLayer(tileUrl, {
  attribution: 'Weather data © OpenWeatherMap',
  opacity: 0.7
});

// Add to map
layer.addTo(map);
```

### Map Reference Management

The application uses React useRef to store and manage map and layer references:

```javascript
const mapRef = useRef(null);
const layerRefs = useRef({});

// Storing layer references
layerRefs.current[layerId] = layer;

// Checking if a layer exists on the map
if (mapRef.current.hasLayer(layerRefs.current[layerId])) {
  // Layer exists
}
```
