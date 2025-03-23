import axios from 'axios';
import { useWeatherData } from '../hooks/useWeatherData';

// Degree-day base temperatures for common pests
const PEST_DD_MODELS = {
  'codling-moth': {
    baseTemp: 10, // °C
    biofix: 'apple-bloom-petal-fall',
    emergenceThresholds: {
      firstGen: 250, // DD above base temp
      secondGen: 650,
      thirdGen: 1150
    },
    hostCrops: ['apple', 'pear', 'walnut'],
    scientificName: 'Cydia pomonella',
    threatLevel: 'high'
  },
  'corn-earworm': {
    baseTemp: 12.5,
    biofix: 'first-moth-catch',
    emergenceThresholds: {
      eggHatch: 75,
      larvaeActive: 170,
      pupation: 400
    },
    hostCrops: ['corn', 'cotton', 'tomato', 'soybean'],
    scientificName: 'Helicoverpa zea',
    threatLevel: 'high'
  },
  'potato-leafhopper': {
    baseTemp: 8,
    biofix: 'first-adult-detection',
    emergenceThresholds: {
      nymphDevelopment: 100,
      adultEmergence: 260
    },
    hostCrops: ['potato', 'alfalfa', 'soybean', 'bean'],
    scientificName: 'Empoasca fabae',
    threatLevel: 'medium'
  },
  'soybean-aphid': {
    baseTemp: 8.6,
    biofix: 'first-aphid-detection',
    emergenceThresholds: {
      rapidPopulation: 150,
      peakInfestation: 350
    },
    hostCrops: ['soybean'],
    scientificName: 'Aphis glycines',
    threatLevel: 'medium'
  },
  'western-bean-cutworm': {
    baseTemp: 10,
    biofix: 'may-1',
    emergenceThresholds: {
      flightBegins: 380,
      peakFlight: 500,
      eggHatch: 620
    },
    hostCrops: ['corn', 'dry bean'],
    scientificName: 'Striacosta albicosta',
    threatLevel: 'high'
  }
};

// Weather condition triggers that increase pest risk
const WEATHER_TRIGGERS = {
  'high-humidity': {
    threshold: 80, // % relative humidity
    duration: 48, // hours
    pests: ['powdery-mildew', 'apple-scab', 'late-blight']
  },
  'extended-leaf-wetness': {
    threshold: 10, // hours
    pests: ['apple-scab', 'fire-blight', 'late-blight']
  },
  'warm-nights': {
    threshold: 20, // °C
    duration: 3, // consecutive nights
    pests: ['corn-earworm', 'fall-armyworm']
  },
  'drought-stress': {
    threshold: 10, // days without significant rain
    pests: ['spider-mite', 'aphid']
  },
  'freeze-thaw-cycles': {
    description: 'Multiple freeze-thaw cycles',
    pests: ['winter-grain-mite', 'hessian-fly']
  }
};

/**
 * Calculate accumulated degree days (ADD) from temperature data
 * @param {Array} tempData - Array of daily temperature objects with high and low values
 * @param {Number} baseTemp - Base temperature for the specific pest
 * @param {String} startDate - Start date for calculation (YYYY-MM-DD)
 * @returns {Number} - Accumulated degree days
 */
export const calculateDegreeDays = (tempData, baseTemp, startDate = null) => {
  // Filter data starting from the biofix date if provided
  let relevantData = tempData;
  if (startDate) {
    relevantData = tempData.filter(day => new Date(day.date) >= new Date(startDate));
  }
  
  // Calculate degree days for each day using the average method
  return relevantData.reduce((totalDD, day) => {
    const avgTemp = (day.tempHigh + day.tempLow) / 2;
    const dailyDD = Math.max(0, avgTemp - baseTemp); // No negative degree days
    return totalDD + dailyDD;
  }, 0);
};

/**
 * Analyze weather conditions for pest triggering events
 * @param {Object} weatherData - Weather data object with forecast
 * @returns {Array} - Array of triggered weather events that could affect pest populations
 */
export const analyzeWeatherTriggers = (weatherData) => {
  if (!weatherData || !weatherData.forecast) return [];
  
  const triggers = [];
  const forecast = weatherData.forecast;
  
  // Check for high humidity periods
  const highHumidityPeriods = findConsecutivePeriods(
    forecast,
    day => day.humidity >= WEATHER_TRIGGERS['high-humidity'].threshold,
    WEATHER_TRIGGERS['high-humidity'].duration / 24 // Convert hours to days
  );
  
  if (highHumidityPeriods.length > 0) {
    triggers.push({
      type: 'high-humidity',
      startDate: highHumidityPeriods[0].start,
      endDate: highHumidityPeriods[0].end,
      affectedPests: WEATHER_TRIGGERS['high-humidity'].pests,
      description: `Extended high humidity (>${WEATHER_TRIGGERS['high-humidity'].threshold}%) favorable for disease development`
    });
  }
  
  // Check for warm night sequences
  const warmNights = findConsecutivePeriods(
    forecast,
    day => day.tempLow >= WEATHER_TRIGGERS['warm-nights'].threshold,
    WEATHER_TRIGGERS['warm-nights'].duration
  );
  
  if (warmNights.length > 0) {
    triggers.push({
      type: 'warm-nights',
      startDate: warmNights[0].start,
      endDate: warmNights[0].end,
      affectedPests: WEATHER_TRIGGERS['warm-nights'].pests,
      description: `Consecutive warm nights (>${WEATHER_TRIGGERS['warm-nights'].threshold}°C) accelerating pest development`
    });
  }
  
  // Check for drought stress
  const precipitationEvents = forecast.filter(day => day.precipitation > 3);
  if (precipitationEvents.length === 0 && forecast.length >= WEATHER_TRIGGERS['drought-stress'].threshold) {
    triggers.push({
      type: 'drought-stress',
      startDate: forecast[0].date,
      endDate: forecast[forecast.length - 1].date,
      affectedPests: WEATHER_TRIGGERS['drought-stress'].pests,
      description: `Extended dry period increasing risk of certain pests`
    });
  }
  
  return triggers;
};

/**
 * Helper function to find consecutive periods in weather data
 */
const findConsecutivePeriods = (data, conditionFn, minDuration) => {
  const periods = [];
  let currentPeriod = null;
  
  data.forEach((day, index) => {
    if (conditionFn(day)) {
      if (!currentPeriod) {
        currentPeriod = {
          start: day.date,
          days: 1
        };
      } else {
        currentPeriod.days += 1;
      }
      
      // If we're at the end of the data or the next day doesn't match
      if (index === data.length - 1 || !conditionFn(data[index + 1])) {
        if (currentPeriod.days >= minDuration) {
          currentPeriod.end = day.date;
          periods.push(currentPeriod);
        }
        currentPeriod = null;
      }
    }
  });
  
  return periods;
};

/**
 * Predict pest emergence based on degree day models and weather conditions
 * @param {Object} weatherData - Weather data for the location
 * @param {String} selectedCrop - The currently selected crop
 * @param {Object} degreeData - Pre-calculated degree day data
 * @param {Array} weatherTriggers - Pre-analyzed weather triggers
 * @param {Object} location - Location data including lat/lng
 * @returns {Array} - Array of predicted pest emergence events
 */
export const predictPestEmergence = (weatherData, selectedCrop, degreeData, weatherTriggers, location) => {
  if (!weatherData || !weatherData.forecast) return [];
  
  // Identify which pest models to use based on selected crop
  const relevantPests = Object.entries(PEST_DD_MODELS)
    .filter(([pestId, model]) => {
      // If no crop specified, include all pests
      if (!selectedCrop) return true;
      
      // Include pest if it affects the specified crop
      return model.hostCrops.includes(selectedCrop);
    })
    .map(([pestId, model]) => ({
      id: pestId,
      ...model
    }));
  
  // Get current date for calculations
  const currentDate = new Date();
  
  // Calculate accumulated degree days for each base temperature if not provided
  const calculatedDegreeData = degreeData || {
    [10]: { // Default to 10°C/50°F base temperature if no data provided
      past7Days: calculateDegreeDays(
        weatherData.forecast.slice(0, 7),
        10
      ),
      past14Days: calculateDegreeDays(
        weatherData.forecast.slice(0, 14), 
        10
      ),
      seasonToDate: calculateDegreeDays(
        weatherData.forecast,
        10
      )
    }
  };
  
  // Process weather triggers if not provided
  const calculatedTriggers = weatherTriggers || analyzeWeatherTriggers(weatherData);
  
  // Generate predictions for each relevant pest
  const predictions = relevantPests.map(pest => {
    // Get degree data for this pest's base temperature, or closest available
    const baseTemp = pest.baseTemp;
    const pestDegreeData = calculatedDegreeData[baseTemp] || 
                          calculatedDegreeData[Object.keys(calculatedDegreeData)[0]];
    
    // Use season-to-date DD accumulation
    const accumulatedDD = pestDegreeData.seasonToDate;
    
    // Find the next emergence event based on DD
    let nextEvent = null;
    let thresholdDD = 0;
    let daysToEmergence = null;
    
    // Sort thresholds to find the next upcoming event
    const orderedThresholds = Object.entries(pest.emergenceThresholds)
      .sort((a, b) => a[1] - b[1]);
    
    for (const [stage, threshold] of orderedThresholds) {
      if (accumulatedDD < threshold) {
        // This event hasn't happened yet
        nextEvent = formatEventName(stage);
        thresholdDD = threshold;
        
        // Estimate days needed to reach threshold based on recent daily DD accumulation
        const ddNeeded = threshold - accumulatedDD;
        const avgDailyDD = pestDegreeData.past7Days / 7; // Average DD per day
        
        if (avgDailyDD > 0) {
          daysToEmergence = Math.ceil(ddNeeded / avgDailyDD);
        } else {
          daysToEmergence = 30; // Default if can't calculate
        }
        
        break;
      }
    }
    
    // If no next event found, all threshold events have already occurred
    if (!nextEvent) {
      const lastStage = orderedThresholds[orderedThresholds.length - 1];
      nextEvent = `Post-${formatEventName(lastStage[0])}`;
      thresholdDD = lastStage[1];
      daysToEmergence = 0;
    }
    
    // Assess risk level based on days to emergence and weather triggers
    let riskLevel = 'Low';
    
    // Higher risk if emergence is sooner
    if (daysToEmergence <= 3) {
      riskLevel = 'High';
    } else if (daysToEmergence <= 7) {
      riskLevel = 'Medium';
    }
    
    // Identify any weather triggers that affect this pest
    const relevantTriggers = calculatedTriggers
      .filter(trigger => 
        trigger.affectedPests.some(p => p === pest.id || p.includes(pest.id.split('-')[0]))
      )
      .map(trigger => trigger.type);
    
    // Increase risk level if weather triggers present
    if (relevantTriggers.length > 0 && riskLevel === 'Low') {
      riskLevel = 'Medium';
    } else if (relevantTriggers.length > 0 && riskLevel === 'Medium') {
      riskLevel = 'High';
    }
    
    // Format pest name for display
    const pestName = pest.id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      pestName,
      scientificName: pest.scientificName,
      riskLevel,
      nextEvent,
      daysToEmergence,
      accumulatedDD: Math.round(accumulatedDD),
      thresholdDD,
      hostCrops: pest.hostCrops,
      weatherTriggers: relevantTriggers,
      // Add location-based random coordinates for visualization
      location: location ? {
        lat: location.lat + (Math.random() - 0.5) * 0.05,
        lng: location.lng + (Math.random() - 0.5) * 0.05
      } : null
    };
  });
  
  // Sort by risk level and days to emergence
  return predictions.sort((a, b) => {
    const riskOrder = { High: 0, Medium: 1, Low: 2 };
    if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    }
    return a.daysToEmergence - b.daysToEmergence;
  });
};

/**
 * Format event names for display
 */
const formatEventName = (eventKey) => {
  switch(eventKey) {
    case 'firstGen': return 'First Generation Emergence';
    case 'secondGen': return 'Second Generation Emergence';
    case 'thirdGen': return 'Third Generation Emergence';
    case 'eggHatch': return 'Egg Hatch';
    case 'larvaeActive': return 'Larvae Activity';
    case 'pupation': return 'Pupation';
    case 'nymphDevelopment': return 'Nymph Development';
    case 'adultEmergence': return 'Adult Emergence';
    case 'rapidPopulation': return 'Rapid Population Growth';
    case 'peakInfestation': return 'Peak Infestation';
    case 'flightBegins': return 'Flight Activity Begins';
    case 'peakFlight': return 'Peak Flight Activity';
    default: return eventKey.replace(/([A-Z])/g, ' $1').trim();
  }
};

// Additional pest management plan generation feature

/**
 * Generates a pest management action plan based on predicted pest emergences
 * @param {Array} predictions - The pest predictions from predictPestEmergence
 * @param {Object} cropInfo - Information about the crop (type, growth stage, etc.)
 * @returns {Object} Structured action plan with strategies, timeline, and implementation steps
 */
export const generateActionPlan = (predictions, cropInfo) => {
  if (!predictions || predictions.length === 0) {
    return {
      summary: "No pest threats detected at this time. Continue monitoring regularly.",
      actions: [],
      timeline: "No immediate action needed."
    };
  }

  // Sort predictions by risk level (High, Medium, Low)
  const sortedPredictions = [...predictions].sort((a, b) => {
    const riskOrder = { High: 0, Medium: 1, Low: 2 };
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
  });

  // Group actions by time frame
  const immediateActions = [];
  const shortTermActions = [];
  const longTermActions = [];
  
  // Process each prediction into appropriate actions
  sortedPredictions.forEach(prediction => {
    const { pestName, riskLevel, daysToEmergence, scientificName } = prediction;
    
    // Only process pests that affect the current crop
    if (!prediction.hostCrops.includes(cropInfo.type)) {
      return;
    }

    // Generate pest-specific action recommendations based on risk level and timing
    if (daysToEmergence <= 3) {
      // Immediate actions (0-3 days)
      if (riskLevel === 'High') {
        immediateActions.push({
          pest: pestName,
          action: `Monitor ${pestName} daily. Consider preventative treatment within 48 hours.`,
          details: getPestSpecificControlMethods(pestName, cropInfo),
          priority: "Critical"
        });
      } else {
        immediateActions.push({
          pest: pestName,
          action: `Increase monitoring frequency for ${pestName}.`,
          details: getPestSpecificControlMethods(pestName, cropInfo),
          priority: riskLevel === 'Medium' ? "High" : "Medium"
        });
      }
    } else if (daysToEmergence <= 7) {
      // Short-term actions (4-7 days)
      shortTermActions.push({
        pest: pestName,
        action: `Prepare for ${pestName} emergence within the week.`,
        details: getPestSpecificControlMethods(pestName, cropInfo),
        priority: riskLevel === 'High' ? "High" : (riskLevel === 'Medium' ? "Medium" : "Low")
      });
    } else {
      // Long-term planning (>7 days)
      longTermActions.push({
        pest: pestName,
        action: `Plan ahead for potential ${pestName} pressure in ${daysToEmergence} days.`,
        details: getPestSpecificControlMethods(pestName, cropInfo),
        priority: "Planning"
      });
    }
  });

  // Generate a summary based on the highest priority actions
  let summary = "No critical pest issues detected.";
  if (immediateActions.length > 0) {
    const criticalPests = immediateActions
      .filter(a => a.priority === "Critical")
      .map(a => a.pest)
      .join(", ");
    
    if (criticalPests) {
      summary = `Critical: Immediate action needed for ${criticalPests}.`;
    } else {
      summary = `Increased monitoring recommended for ${immediateActions.map(a => a.pest).join(", ")}.`;
    }
  } else if (shortTermActions.length > 0) {
    summary = `Prepare for potential pest pressure within the week.`;
  }

  // Compile the overall action plan
  return {
    summary,
    cropInfo,
    actions: {
      immediate: immediateActions,
      shortTerm: shortTermActions,
      longTerm: longTermActions
    },
    timeline: generateTimeline(immediateActions, shortTermActions, longTermActions),
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Generates a timeline visualization data for the action plan
 * @param {Array} immediateActions - Actions needed immediately
 * @param {Array} shortTermActions - Actions needed in the short term
 * @param {Array} longTermActions - Actions needed in the long term
 * @returns {Array} Timeline data for visualization
 */
const generateTimeline = (immediateActions, shortTermActions, longTermActions) => {
  const today = new Date();
  const timeline = [];

  // Add immediate actions to timeline (0-3 days)
  immediateActions.forEach((action, index) => {
    const actionDate = new Date(today);
    actionDate.setDate(today.getDate() + (index % 3)); // Spread over the next 3 days
    
    timeline.push({
      date: actionDate.toISOString().split('T')[0],
      pest: action.pest,
      action: action.action,
      priority: action.priority,
      type: 'immediate'
    });
  });

  // Add short-term actions (4-7 days)
  shortTermActions.forEach((action, index) => {
    const actionDate = new Date(today);
    actionDate.setDate(today.getDate() + 4 + (index % 4)); // Days 4-7
    
    timeline.push({
      date: actionDate.toISOString().split('T')[0],
      pest: action.pest,
      action: action.action,
      priority: action.priority,
      type: 'shortTerm'
    });
  });

  // Add long-term actions (>7 days)
  longTermActions.forEach((action, index) => {
    const actionDate = new Date(today);
    const daysToAdd = action.action.includes('days') 
      ? parseInt(action.action.match(/in (\d+) days/)[1])
      : 10 + (index * 2); // Default to spreading out if specific days not mentioned
    
    actionDate.setDate(today.getDate() + daysToAdd);
    
    timeline.push({
      date: actionDate.toISOString().split('T')[0],
      pest: action.pest,
      action: action.action,
      priority: action.priority,
      type: 'longTerm'
    });
  });

  // Sort timeline by date
  return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Returns pest-specific control methods based on the pest and crop
 * @param {string} pestName - Name of the pest
 * @param {Object} cropInfo - Information about the crop
 * @returns {Object} Control strategies categorized by type
 */
const getPestSpecificControlMethods = (pestName, cropInfo) => {
  // Base control methods that apply to most pests
  const baseControlMethods = {
    cultural: [
      "Practice proper field sanitation",
      "Remove crop debris after harvest",
      "Implement crop rotation where possible"
    ],
    biological: [
      "Consider introducing beneficial insects",
      "Explore microbial controls appropriate for this pest"
    ],
    chemical: [
      "Apply targeted pesticides only if pest pressure exceeds economic thresholds",
      "Follow all label instructions and safety precautions",
      "Rotate chemical classes to prevent resistance development"
    ],
    monitoring: [
      "Use appropriate traps to monitor populations",
      "Inspect plants regularly for signs of infestation",
      "Keep records of pest observations"
    ]
  };
  
  // Pest-specific control recommendations
  const pestSpecificControls = {
    "Codling Moth": {
      cultural: [
        "Remove abandoned trees near orchards",
        "Thin fruits to eliminate clustered fruits where larvae can move between them"
      ],
      biological: [
        "Release Trichogramma wasps as egg parasitoids",
        "Apply granulosis virus preparations specifically for codling moth"
      ],
      chemical: [
        "Time insecticide applications based on degree-day models and pheromone trap catches",
        "Consider mating disruption using pheromones in larger orchards"
      ],
      monitoring: [
        "Use pheromone traps to monitor adult flights",
        "Check fruit for entry holes surrounded by frass (insect excrement)"
      ]
    },
    "Corn Earworm": {
      cultural: [
        "Plant early-maturing varieties when possible",
        "Till soil in fall to destroy overwintering pupae"
      ],
      biological: [
        "Release Trichogramma wasps to parasitize eggs",
        "Consider Bacillus thuringiensis (Bt) applications"
      ],
      chemical: [
        "Apply treatments during silking stage for best control",
        "Target the ear zone specifically with applications"
      ],
      monitoring: [
        "Use pheromone traps to detect adult moth activity",
        "Check corn silks for small larvae and eggs"
      ]
    },
    "Potato Leafhopper": {
      cultural: [
        "Use trap crops around field edges",
        "Consider row covers early in the season"
      ],
      biological: [
        "Preserve natural enemies including parasitic wasps and predatory bugs"
      ],
      chemical: [
        "Apply insecticides when nymphs first appear",
        "Consider systemic insecticides for longer protection"
      ],
      monitoring: [
        "Use yellow sticky traps to monitor adult populations",
        "Check undersides of leaves for nymphs",
        "Look for characteristic 'hopperburn' leaf symptoms"
      ]
    },
    "Soybean Aphid": {
      cultural: [
        "Plant resistant varieties if available",
        "Minimize nitrogen applications which can increase aphid reproduction"
      ],
      biological: [
        "Preserve lady beetles, lacewings, and parasitic wasps",
        "Avoid broad-spectrum insecticides that kill beneficial insects"
      ],
      chemical: [
        "Apply insecticides only when populations exceed 250 aphids per plant",
        "Ensure good coverage of undersides of leaves"
      ],
      monitoring: [
        "Begin scouting fields at V3-V4 growth stage",
        "Check top trifoliate leaves and stems for colonies",
        "Sample multiple areas of fields for accurate assessments"
      ]
    },
    "Western Bean Cutworm": {
      cultural: [
        "Time planting to avoid peak egg-laying periods if possible",
        "Fall tillage to destroy overwintering larvae"
      ],
      biological: [
        "Preserve natural enemies including ground beetles and birds"
      ],
      chemical: [
        "Apply treatments when 5-8% of plants have egg masses or small larvae",
        "Time applications for egg hatch but before larvae enter ears or pods"
      ],
      monitoring: [
        "Use pheromone traps to detect adult activity",
        "Check upper surfaces of upper leaves for egg masses",
        "Look for small larvae feeding on tassel tissue before moving to ears"
      ]
    }
  };
  
  // Get specific controls for this pest, or use base controls if no specific ones exist
  const specificControls = pestSpecificControls[pestName] || {};
  
  // Merge base controls with pest-specific controls
  const mergedControls = {
    cultural: [...(specificControls.cultural || []), ...baseControlMethods.cultural],
    biological: [...(specificControls.biological || []), ...baseControlMethods.biological],
    chemical: [...(specificControls.chemical || []), ...baseControlMethods.chemical],
    monitoring: [...(specificControls.monitoring || []), ...baseControlMethods.monitoring]
  };
  
  // Add crop-specific adjustments if needed
  if (cropInfo.type === "organic") {
    // Remove chemical controls for organic crops
    mergedControls.chemical = [
      "Note: Chemical controls are not compatible with organic production",
      "Consider approved OMRI-listed products if absolutely necessary"
    ];
    
    // Add more organic-specific controls
    mergedControls.cultural.push(
      "Increase biodiversity in and around fields",
      "Use companion planting strategies"
    );
    mergedControls.biological.push(
      "Apply compost teas to increase beneficial microorganisms",
      "Consider plant-derived repellents like neem oil or pyrethrum"
    );
  }
  
  return mergedControls;
}; 