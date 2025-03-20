// Simulation utils for crop and irrigation data

/**
 * Generate simulated irrigation needs data based on weather and location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} weatherData - Current weather data
 * @returns {Promise<Object>} Irrigation data
 */
export const fetchSimulatedIrrigationNeeds = async (lat, lng, weatherData) => {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Soil moisture is inversely proportional to temperature and directly related to precipitation
  const tempFactor = Math.max(0, 30 - weatherData.temp) / 30; // Higher temp = lower soil moisture
  const precipFactor = Math.min(1, (weatherData.precipitation || 0) / 10); // More rain = higher soil moisture
  const randomFactor = 0.8 + (Math.random() * 0.4); // Random factor between 0.8 and 1.2
  
  // Calculate soil moisture between 10% and 35%
  const soilMoisture = Math.round((tempFactor * 20 + precipFactor * 15) * randomFactor);
  
  // Determine if irrigation is needed (below 20% soil moisture)
  const irrigationNeeded = soilMoisture < 20;
  
  // Calculate water deficit based on soil moisture
  const waterDeficit = irrigationNeeded ? Math.round((20 - soilMoisture) * 2) : 0;
  
  // Calculate evapotranspiration rate based on temperature and wind
  const evapotranspiration = (0.2 + (weatherData.temp / 50) + (weatherData.windSpeed / 50)).toFixed(1);
  
  return {
    soilMoisture,
    fieldCapacity: 30,
    wiltingPoint: 12,
    waterDeficit,
    evapotranspiration: parseFloat(evapotranspiration),
    irrigationNeeded,
    irrigationAmount: waterDeficit,
    daysUntilIrrigation: irrigationNeeded ? 0 : Math.floor(Math.random() * 3) + 1,
    wateringRecommendation: irrigationNeeded 
      ? `Apply ${waterDeficit}mm of water` 
      : `Check again in ${Math.floor(Math.random() * 3) + 1} days`,
    soilType: 'Loam'
  };
};

/**
 * Generate simulated crop data based on weather and location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} weatherData - Current weather data
 * @returns {Promise<Object>} Crop data
 */
export const fetchSimulatedCropData = async (lat, lng, weatherData) => {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Set crop type based on latitude
  const cropTypes = ['corn', 'wheat', 'soybean', 'rice'];
  const cropTypeIndex = Math.abs(Math.floor(lat)) % cropTypes.length;
  const cropType = cropTypes[cropTypeIndex];
  
  // Generate random days since planting (30-90 days)
  const daysSincePlanting = Math.floor(Math.random() * 60) + 30;
  
  // Calculate growth percentage (0-100%)
  const growthPercentage = Math.min(100, Math.round((daysSincePlanting / 120) * 100));
  
  // Determine growth stage based on percentage
  let growthStage = 'Seedling';
  if (growthPercentage > 75) {
    growthStage = 'Maturation';
  } else if (growthPercentage > 50) {
    growthStage = 'Flowering';
  } else if (growthPercentage > 25) {
    growthStage = 'Vegetative';
  }
  
  // Calculate health index based on weather conditions (0-100)
  // Optimal conditions: temp 20-30°C, adequate soil moisture, low wind
  const tempOptimal = weatherData.temp >= 20 && weatherData.temp <= 30;
  const moistureOptimal = weatherData.soilMoisture >= 20 && weatherData.soilMoisture <= 30;
  const windOptimal = weatherData.windSpeed < 10;
  
  let healthIndex = 50; // Base health
  
  if (tempOptimal) healthIndex += 15;
  if (moistureOptimal) healthIndex += 15;
  if (windOptimal) healthIndex += 10;
  
  // Add randomness
  healthIndex += Math.floor(Math.random() * 20) - 10;
  
  // Ensure health index is between 0-100
  healthIndex = Math.max(0, Math.min(100, healthIndex));
  
  // Determine yield estimate based on health index
  const yieldEstimate = Math.max(40, healthIndex);
  
  // Generate random harvest date (30-60 days in the future)
  const today = new Date();
  const daysToHarvest = Math.floor(Math.random() * 30) + 30;
  const harvestDate = new Date();
  harvestDate.setDate(today.getDate() + daysToHarvest);
  
  // Generate crop notes based on conditions
  let notes = 'Crop is developing normally.';
  
  if (healthIndex < 60) {
    notes = 'Crop shows signs of stress. Monitor closely.';
  } else if (healthIndex > 80) {
    notes = 'Crop is thriving with excellent development.';
  }
  
  if (!tempOptimal && weatherData.temp > 30) {
    notes += ' Heat stress observed.';
  } else if (!tempOptimal && weatherData.temp < 20) {
    notes += ' Growth may be slowed due to cool temperatures.';
  }
  
  if (!moistureOptimal && weatherData.soilMoisture < 20) {
    notes += ' Water stress detected.';
  } else if (!moistureOptimal && weatherData.soilMoisture > 30) {
    notes += ' Excess moisture may lead to disease.';
  }
  
  return {
    cropType,
    growthPercentage,
    growthStage,
    healthIndex,
    yieldEstimate,
    details: {
      daysSincePlanting,
      estimatedHarvestDate: harvestDate.toISOString().split('T')[0],
      notes
    }
  };
};
