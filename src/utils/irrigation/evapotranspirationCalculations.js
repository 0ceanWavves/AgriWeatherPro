/**
 * Advanced evapotranspiration (ET) calculations based on the FAO Penman-Monteith method
 * References:
 * - FAO Irrigation and Drainage Paper No. 56
 * - Allen, R.G., Pereira, L.S., Raes, D., Smith, M., 1998. Crop evapotranspiration - Guidelines for computing crop water requirements
 */

// Constants
const STEFAN_BOLTZMANN = 4.903e-9; // Stefan-Boltzmann constant MJ K-4 m-2 day-1
const SOLAR_CONSTANT = 0.0820; // Solar constant MJ m-2 min-1
const PSYCHROMETRIC_CONSTANT = 0.665e-3; // Psychrometric constant kPa °C-1

/**
 * Calculate reference evapotranspiration (ETo) using the FAO Penman-Monteith equation
 * 
 * @param {number} tMin - Minimum daily temperature (°C)
 * @param {number} tMax - Maximum daily temperature (°C)
 * @param {number} rh - Relative humidity (%)
 * @param {number} windSpeed - Wind speed at 2m height (m/s)
 * @param {number} solarRadiation - Solar radiation (MJ/m²/day)
 * @param {number} elevation - Site elevation above sea level (m)
 * @param {number} latitude - Site latitude (decimal degrees)
 * @param {number} dayOfYear - Day of year (1-365)
 * @returns {number} Reference evapotranspiration (mm/day)
 */
export const calculateETo = (
  tMin,
  tMax,
  rh,
  windSpeed,
  solarRadiation,
  elevation,
  latitude,
  dayOfYear
) => {
  // Mean temperature
  const tMean = (tMax + tMin) / 2;
  
  // Convert latitude from decimal degrees to radians
  const latitudeRad = (Math.PI / 180) * latitude;
  
  // Atmospheric pressure (kPa)
  const atmosphericPressure = 101.3 * Math.pow((293 - 0.0065 * elevation) / 293, 5.26);
  
  // Psychrometric constant (kPa/°C)
  const psychrometricConstant = 0.000665 * atmosphericPressure;
  
  // Saturation vapor pressure (kPa)
  const esTMax = 0.6108 * Math.exp(17.27 * tMax / (tMax + 237.3));
  const esTMin = 0.6108 * Math.exp(17.27 * tMin / (tMin + 237.3));
  const es = (esTMax + esTMin) / 2;
  
  // Actual vapor pressure (kPa)
  const ea = (rh / 100) * es;
  
  // Slope of saturation vapor pressure curve (kPa/°C)
  const delta = 4098 * (0.6108 * Math.exp(17.27 * tMean / (tMean + 237.3))) / Math.pow(tMean + 237.3, 2);
  
  // Extraterrestrial radiation (Ra)
  // Solar declination (radians)
  const solarDeclination = 0.409 * Math.sin(2 * Math.PI * dayOfYear / 365 - 1.39);
  
  // Sunset hour angle (radians)
  const sunsetHourAngle = Math.acos(-Math.tan(latitudeRad) * Math.tan(solarDeclination));
  
  // Inverse relative distance Earth-Sun
  const dr = 1 + 0.033 * Math.cos(2 * Math.PI * dayOfYear / 365);
  
  // Extraterrestrial radiation (MJ/m²/day)
  const ra = 24 * 60 / Math.PI * SOLAR_CONSTANT * dr * (
    sunsetHourAngle * Math.sin(latitudeRad) * Math.sin(solarDeclination) +
    Math.cos(latitudeRad) * Math.cos(solarDeclination) * Math.sin(sunsetHourAngle)
  );
  
  // Clear sky solar radiation (MJ/m²/day)
  const rso = (0.75 + 2e-5 * elevation) * ra;
  
  // Net shortwave radiation (MJ/m²/day)
  const rns = 0.77 * solarRadiation;
  
  // Net longwave radiation (MJ/m²/day)
  const rnl = STEFAN_BOLTZMANN * (
    Math.pow(tMax + 273.16, 4) + Math.pow(tMin + 273.16, 4)
  ) / 2 * (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * solarRadiation / rso - 0.35);
  
  // Net radiation (MJ/m²/day)
  const rn = rns - rnl;
  
  // Soil heat flux (assumed negligible for daily calculations)
  const g = 0;
  
  // Reference evapotranspiration (mm/day)
  const numerator = 0.408 * delta * (rn - g) + psychrometricConstant * 900 / (tMean + 273) * windSpeed * (es - ea);
  const denominator = delta + psychrometricConstant * (1 + 0.34 * windSpeed);
  
  return numerator / denominator;
};

/**
 * Calculate crop evapotranspiration (ETc) by applying crop coefficient
 * 
 * @param {number} eto - Reference evapotranspiration (mm/day)
 * @param {number} kc - Crop coefficient
 * @returns {number} Crop evapotranspiration (mm/day)
 */
export const calculateETc = (eto, kc) => {
  return eto * kc;
};

/**
 * Get crop coefficient (Kc) based on crop type and growth stage
 * 
 * @param {string} cropType - Type of crop
 * @param {string} growthStage - Growth stage (initial, development, mid, late)
 * @returns {number} Crop coefficient
 */
export const getCropCoefficient = (cropType, growthStage) => {
  // Crop coefficient values from FAO-56
  const cropCoefficients = {
    corn: {
      initial: 0.3,
      development: 0.7,
      mid: 1.15,
      late: 0.7
    },
    wheat: {
      initial: 0.3,
      development: 0.7,
      mid: 1.15,
      late: 0.3
    },
    soybean: {
      initial: 0.4,
      development: 0.7,
      mid: 1.15,
      late: 0.5
    },
    cotton: {
      initial: 0.35,
      development: 0.7,
      mid: 1.2,
      late: 0.6
    },
    potatoes: {
      initial: 0.5,
      development: 0.8,
      mid: 1.15,
      late: 0.75
    },
    tomatoes: {
      initial: 0.6,
      development: 0.85,
      mid: 1.15,
      late: 0.8
    },
    rice: {
      initial: 1.05,
      development: 1.1,
      mid: 1.2,
      late: 0.9
    },
    alfalfa: {
      initial: 0.4,
      development: 0.8,
      mid: 0.95,
      late: 0.9
    },
    citrus: {
      initial: 0.7,
      development: 0.65,
      mid: 0.65,
      late: 0.7
    },
    grapes: {
      initial: 0.3,
      development: 0.5,
      mid: 0.7,
      late: 0.45
    },
    almonds: {
      initial: 0.4,
      development: 0.9,
      mid: 1.15,
      late: 0.7
    },
    lettuce: {
      initial: 0.7,
      development: 0.8,
      mid: 1.0,
      late: 0.95
    },
    strawberries: {
      initial: 0.4,
      development: 0.7,
      mid: 0.85,
      late: 0.75
    }
  };
  
  // Return the appropriate coefficient or a default if crop not found
  return cropCoefficients[cropType]?.[growthStage] || 0.8;
};

/**
 * Adjust crop coefficient for climate conditions
 * 
 * @param {number} kc - Standard crop coefficient
 * @param {number} rh - Minimum daily relative humidity (%)
 * @param {number} windSpeed - Average daily wind speed at 2m (m/s)
 * @param {number} cropHeight - Crop height (m)
 * @returns {number} Adjusted crop coefficient
 */
export const adjustKcForClimate = (kc, rh, windSpeed, cropHeight) => {
  // Only adjust mid and late season Kc values that are > 0.45
  if (kc <= 0.45) return kc;
  
  // Adjust Kc for humidity and wind conditions
  const rhAdj = rh < 45 ? (45 - rh) / 100 : 0;
  const windAdj = windSpeed > 2 ? 0.04 * (windSpeed - 2) : 0;
  
  // Height adjustment factor
  const heightFactor = Math.min(0.3, cropHeight / 3);
  
  // Calculate adjusted Kc
  const kcAdjusted = kc + (0.04 * (windAdj - rhAdj) * Math.pow(cropHeight / 3, 0.3));
  
  return Math.max(0.3, kcAdjusted); // Ensure Kc never goes below 0.3
};

/**
 * Calculate ET based on simplified models when weather data is limited
 * 
 * @param {number} tMean - Mean daily temperature (°C)
 * @param {number} latitude - Site latitude (decimal degrees)
 * @param {number} dayOfYear - Day of year (1-365)
 * @param {number} kc - Crop coefficient
 * @returns {number} Estimated crop ET (mm/day)
 */
export const calculateSimplifiedET = (tMean, latitude, dayOfYear, kc) => {
  // Hargreaves equation for simplified ETo calculation
  // ETo = 0.0023 * (Tmean + 17.8) * (Tmax - Tmin)^0.5 * Ra
  
  // Estimate temperature range based on mean temperature and season
  const tempRange = estimateTempRange(tMean, dayOfYear, latitude);
  
  // Calculate extraterrestrial radiation (Ra)
  const latitudeRad = (Math.PI / 180) * latitude;
  const solarDeclination = 0.409 * Math.sin(2 * Math.PI * dayOfYear / 365 - 1.39);
  const sunsetHourAngle = Math.acos(-Math.tan(latitudeRad) * Math.tan(solarDeclination));
  const dr = 1 + 0.033 * Math.cos(2 * Math.PI * dayOfYear / 365);
  
  const ra = 24 * 60 / Math.PI * SOLAR_CONSTANT * dr * (
    sunsetHourAngle * Math.sin(latitudeRad) * Math.sin(solarDeclination) +
    Math.cos(latitudeRad) * Math.cos(solarDeclination) * Math.sin(sunsetHourAngle)
  );
  
  // Hargreaves simplified equation
  const eto = 0.0023 * (tMean + 17.8) * Math.sqrt(tempRange) * ra * 0.408;
  
  // Apply crop coefficient
  return eto * kc;
};

/**
 * Estimate temperature range based on mean temperature, day of year, and latitude
 * 
 * @param {number} tMean - Mean daily temperature (°C)
 * @param {number} dayOfYear - Day of year (1-365)
 * @param {number} latitude - Site latitude (decimal degrees)
 * @returns {number} Estimated temperature range (°C)
 */
const estimateTempRange = (tMean, dayOfYear, latitude) => {
  // Typical temperature ranges vary by climate
  // This is a highly simplified estimation
  
  // Adjust for season (larger ranges in dry seasons)
  const isNorthernHemisphere = latitude > 0;
  const isSummerHalf = (isNorthernHemisphere && (dayOfYear > 80 && dayOfYear < 265)) ||
                     (!isNorthernHemisphere && (dayOfYear < 80 || dayOfYear > 265));
  
  // Base range on latitude (tropical vs. temperate)
  let baseRange;
  if (Math.abs(latitude) < 15) {
    // Tropical: smaller ranges
    baseRange = 8;
  } else if (Math.abs(latitude) < 37) {
    // Subtropical
    baseRange = 10;
  } else {
    // Temperate: larger ranges
    baseRange = 12;
  }
  
  // Adjust for seasonal effects
  if (isSummerHalf) {
    return baseRange - 2; // Summer generally has smaller diurnal ranges
  } else {
    return baseRange + 2; // Winter generally has larger diurnal ranges
  }
};

/**
 * Calculate daily irrigation needs based on ETc and soil moisture
 * 
 * @param {number} etc - Crop evapotranspiration (mm/day)
 * @param {number} soilMoisture - Current soil moisture (%)
 * @param {string} soilType - Soil type
 * @param {number} rootDepth - Crop root depth (m)
 * @param {number} allowedDepletion - Allowed depletion before irrigation (0-1)
 * @param {number} efficiency - Irrigation system efficiency (0-1)
 * @returns {number} Irrigation requirement (mm)
 */
export const calculateIrrigationNeeds = (
  etc,
  soilMoisture,
  soilType,
  rootDepth,
  allowedDepletion = 0.5,
  efficiency = 0.8
) => {
  // Soil properties (simplified)
  const soilProps = {
    sand: { fieldCapacity: 15, wiltingPoint: 5 },
    loamySand: { fieldCapacity: 19, wiltingPoint: 7 },
    sandyLoam: { fieldCapacity: 25, wiltingPoint: 11 },
    loam: { fieldCapacity: 31, wiltingPoint: 15 },
    siltLoam: { fieldCapacity: 33, wiltingPoint: 13 },
    clay: { fieldCapacity: 39, wiltingPoint: 21 }
  };
  
  // Get soil properties or default to loam
  const { fieldCapacity, wiltingPoint } = soilProps[soilType] || soilProps.loam;
  
  // Available water content (mm water per m soil)
  const awc = (fieldCapacity - wiltingPoint) * 10; // Convert % to mm/m
  
  // Total available water in root zone (mm)
  const taw = awc * rootDepth;
  
  // Readily available water (mm)
  const raw = taw * allowedDepletion;
  
  // Current water content in root zone (mm)
  const currentWater = (soilMoisture - wiltingPoint) / 100 * rootDepth * 1000;
  
  // Water deficit (mm)
  const waterDeficit = Math.max(0, raw - currentWater);
  
  // Calculate irrigation requirement adjusted for efficiency
  const irrigationNeeded = waterDeficit / efficiency;
  
  // Adjust based on daily ET rate
  const etAdjustedIrrigation = Math.max(irrigationNeeded, etc);
  
  return etAdjustedIrrigation;
};
