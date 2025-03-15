/**
 * Utility functions for simulating agricultural data
 * These functions provide mock data for development and testing
 */

/**
 * Fetch simulated crop growth data based on location and weather conditions
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} weatherData - Current weather data
 * @param {string} cropType - Type of crop (optional)
 * @returns {Promise<Object>} - Simulated crop data
 */
export const fetchSimulatedCropData = async (lat, lng, weatherData, cropType = 'corn') => {
  // This is a simulation function - in a real app, this would call an API
  // or use a growth model to calculate actual values
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Base growth factors for different crops
  const growthFactors = {
    corn: { tempOptimal: 25, tempMin: 10, tempMax: 35, waterOptimal: 25, waterMin: 10, sunOptimal: 80 },
    wheat: { tempOptimal: 20, tempMin: 5, tempMax: 30, waterOptimal: 18, waterMin: 8, sunOptimal: 75 },
    soybeans: { tempOptimal: 28, tempMin: 15, tempMax: 38, waterOptimal: 22, waterMin: 12, sunOptimal: 85 },
    rice: { tempOptimal: 30, tempMin: 18, tempMax: 40, waterOptimal: 30, waterMin: 20, sunOptimal: 70 }
  };
  
  // Get factors for selected crop or default to corn
  const factors = growthFactors[cropType] || growthFactors.corn;
  
  // Calculate simulated growth percentage based on temperature
  const tempFactor = calculateGrowthFactor(
    weatherData.temp, 
    factors.tempMin, 
    factors.tempOptimal, 
    factors.tempMax
  );
  
  // Calculate water factor based on precipitation and humidity
  const precipitationMm = weatherData.precipitation || 0;
  const waterFactor = calculateGrowthFactor(
    precipitationMm,
    factors.waterMin,
    factors.waterOptimal,
    factors.waterOptimal * 2
  );
  
  // Calculate sun factor based on cloud cover (inverse)
  const cloudCover = weatherData.clouds || 0;
  const sunlight = 100 - cloudCover;
  const sunFactor = calculateGrowthFactor(
    sunlight,
    0,
    factors.sunOptimal,
    100
  );
  
  // Combine factors (weighted average)
  const growthPercentage = (tempFactor * 0.4 + waterFactor * 0.4 + sunFactor * 0.2) * 100;
  
  // Simulate growth stage 
  const growthStages = ['germination', 'vegetative', 'flowering', 'yield formation', 'ripening'];
  const stageIndex = Math.min(Math.floor(growthPercentage / 20), 4);
  
  // Calculate a "health index" (0-100) based on how close conditions are to optimal
  const healthIndex = Math.min(85 + (Math.random() * 15), growthPercentage);
  
  // Generate yield estimate (as a percentage of potential)
  const yieldEstimate = Math.min(90 + (Math.random() * 10), growthPercentage);
  
  return {
    cropType,
    growthPercentage: Math.round(growthPercentage),
    growthStage: growthStages[stageIndex],
    healthIndex: Math.round(healthIndex),
    yieldEstimate: Math.round(yieldEstimate),
    temperatureFactor: Math.round(tempFactor * 100),
    waterFactor: Math.round(waterFactor * 100),
    sunlightFactor: Math.round(sunFactor * 100),
    details: {
      gdd: simulateGrowingDegreeDays(lat, lng),
      daysSincePlanting: Math.floor(30 + Math.random() * 50),
      estimatedHarvestDate: simulateHarvestDate(),
      notes: getSimulatedCropNotes(growthPercentage)
    }
  };
};

/**
 * Fetch simulated irrigation needs data
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} weatherData - Current weather data
 * @param {Object} soilData - Soil data (optional)
 * @returns {Promise<Object>} - Simulated irrigation data
 */
export const fetchSimulatedIrrigationNeeds = async (lat, lng, weatherData, soilData = null) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Default soil data if not provided
  const soil = soilData || {
    type: 'loam',
    moisture: 45 + (Math.random() * 20),
    fieldCapacity: 30,
    wiltingPoint: 12,
    depth: 30 // cm
  };
  
  // Simulate evapotranspiration based on temperature and wind
  const temperature = weatherData.temp || 20;
  const windSpeed = weatherData.windSpeed || 5;
  const humidity = weatherData.humidity || 60;
  const cloudCover = weatherData.clouds || 30;
  
  // Basic ET calculation (simplified Penman-Monteith)
  const evapotranspiration = (0.0135 * temperature * (1 + 0.01 * windSpeed)) * 
                            (1 - (humidity / 200)) * 
                            (1 - (cloudCover / 300));
  
  // Get recent precipitation
  const precipitation = weatherData.precipitation || 0;
  
  // Calculate soil moisture deficit
  const soilMoistureContent = soil.moisture;
  const fieldCapacity = soil.fieldCapacity;
  const wiltingPoint = soil.wiltingPoint;
  const managementAllowableDepletion = 0.5; // 50% of available water
  
  // Calculate available water
  const availableWater = fieldCapacity - wiltingPoint;
  const readilyAvailableWater = availableWater * managementAllowableDepletion;
  const currentAvailableWater = soilMoistureContent - wiltingPoint;
  
  // Calculate irrigation need
  let irrigationNeeded = false;
  let irrigationAmount = 0;
  
  if (currentAvailableWater < readilyAvailableWater) {
    irrigationNeeded = true;
    irrigationAmount = (fieldCapacity - soilMoistureContent) * (soil.depth / 10); // mm
  }
  
  // Adjust based on precipitation forecast
  if (precipitation > 0) {
    irrigationAmount = Math.max(0, irrigationAmount - precipitation);
    if (irrigationAmount < 2) {
      irrigationNeeded = false;
    }
  }
  
  // Calculate days until irrigation needed
  const dailyWaterUse = evapotranspiration;
  const daysUntilIrrigation = irrigationNeeded ? 0 : 
    Math.floor((currentAvailableWater - readilyAvailableWater) / dailyWaterUse);
  
  return {
    soilMoisture: Math.round(soilMoistureContent),
    fieldCapacity: fieldCapacity,
    wiltingPoint: wiltingPoint,
    evapotranspiration: Math.round(evapotranspiration * 10) / 10,
    waterDeficit: Math.max(0, Math.round((readilyAvailableWater - currentAvailableWater) * 10) / 10),
    irrigationNeeded,
    irrigationAmount: Math.round(irrigationAmount),
    precipitationForecast: precipitation,
    daysUntilIrrigation: daysUntilIrrigation,
    wateringRecommendation: getIrrigationRecommendation(irrigationNeeded, irrigationAmount, daysUntilIrrigation),
    soilType: soil.type,
    waterSavingsPotential: calculateWaterSavingsPotential(irrigationAmount, precipitation)
  };
};

/**
 * Helper function to calculate growth factor based on current value and min/optimal/max values
 */
function calculateGrowthFactor(value, min, optimal, max) {
  if (value < min) {
    return 0;
  } else if (value > max) {
    return 0;
  } else if (value <= optimal) {
    return (value - min) / (optimal - min);
  } else {
    return 1 - (value - optimal) / (max - optimal);
  }
}

/**
 * Simulate growing degree days
 */
function simulateGrowingDegreeDays(lat, lng) {
  // Base GDD on latitude (more north = less GDD)
  const baseGDD = 800 - Math.abs(lat - 40) * 10;
  
  // Add random variation
  return Math.round(baseGDD + (Math.random() * 200 - 100));
}

/**
 * Simulate harvest date
 */
function simulateHarvestDate() {
  const today = new Date();
  const daysToAdd = 30 + Math.floor(Math.random() * 60);
  const harvestDate = new Date(today);
  harvestDate.setDate(today.getDate() + daysToAdd);
  return harvestDate.toISOString().split('T')[0];
}

/**
 * Get simulated crop notes based on growth percentage
 */
function getSimulatedCropNotes(growthPercentage) {
  if (growthPercentage < 20) {
    return "Early growth stage. Monitor soil temperature and moisture for optimal germination.";
  } else if (growthPercentage < 40) {
    return "Vegetative growth progressing. Watch for pest pressure in emerging foliage.";
  } else if (growthPercentage < 60) {
    return "Flowering stage beginning. Critical period for water and nutrient management.";
  } else if (growthPercentage < 80) {
    return "Yield formation in progress. Maintain consistent irrigation for optimal development.";
  } else {
    return "Approaching harvest. Monitor moisture content and weather conditions.";
  }
}

/**
 * Get irrigation recommendation text
 */
function getIrrigationRecommendation(irrigationNeeded, amount, daysUntil) {
  if (irrigationNeeded) {
    return `Apply approximately ${amount}mm of water to reach optimal soil moisture.`;
  } else if (daysUntil <= 2) {
    return `Irrigation will be needed in approximately ${daysUntil} days.`;
  } else {
    return "Soil moisture adequate. No irrigation needed at this time.";
  }
}

/**
 * Calculate water savings potential
 */
function calculateWaterSavingsPotential(irrigationAmount, precipitation) {
  if (precipitation > 0 && irrigationAmount > 0) {
    // Calculate potential savings from optimal timing with rain
    const savingsPercent = Math.min(100, Math.round((precipitation / irrigationAmount) * 100));
    return {
      percentage: savingsPercent,
      volume: Math.round(irrigationAmount * (savingsPercent / 100)),
      recommendation: "Consider delaying irrigation to take advantage of forecast precipitation."
    };
  } else {
    return {
      percentage: 0,
      volume: 0,
      recommendation: "No significant water savings opportunities identified."
    };
  }
} 