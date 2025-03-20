/**
 * California Crop Pest Database - Phase 1 (Summary Version)
 * This file contains key bullet points for each pest to be expanded later.
 */

// ALMOND PESTS
const almondPestBullets = [
  {
    commonName: "Navel Orangeworm",
    scientificName: "Amyelois transitella",
    keyPoints: [
      "Primary threat to almonds in California",
      "Temp >85°F accelerates development",
      "Needs winter sanitation (remove mummy nuts)",
      "Climate change adding 1-2 generations by 2050",
      "Mating disruption and properly timed sprays are key controls"
    ],
    weatherThresholds: {
      temperatureOptimal: 85, // °F
      temperatureUnit: "F",
      humidityOptimal: 30, // % - prefers drier conditions
      precipitationRisk: "low" // prefers dry conditions
    }
  },
  {
    commonName: "Peach Twig Borer",
    scientificName: "Anarsia lineatella",
    keyPoints: [
      "Spring temps >60°F trigger activity",
      "Larvae bore into shoots and nuts",
      "Dormant oil sprays effective for control",
      "Warming winters reducing dormant spray efficacy",
      "3-4 generations per season in California"
    ],
    weatherThresholds: {
      temperatureOptimal: 75, // °F
      temperatureUnit: "F", 
      humidityOptimal: 60, // %
      precipitationRisk: "moderate"
    }
  },
  {
    commonName: "San Jose Scale",
    scientificName: "Quadraspidiotus perniciosus",
    keyPoints: [
      "Crawler emergence at >51°F",
      "Sap feeding weakens trees and reduces vigor",
      "Density monitoring via sampling is critical",
      "Warming trends extending seasonal activity",
      "Natural enemies include Aphytis parasitic wasps"
    ],
    weatherThresholds: {
      temperatureOptimal: 75, // °F
      temperatureUnit: "F",
      humidityOptimal: 65, // %
      precipitationRisk: "moderate"
    }
  },
  {
    commonName: "Spider Mites",
    scientificName: "Tetranychus spp.",
    keyPoints: [
      "Hot (>85°F), dry conditions critical for outbreaks",
      "Water stress management essential",
      "Increasing drought frequency exacerbating problems",
      "Dust control on orchard floors helps prevention",
      "Predatory mites provide biological control"
    ],
    weatherThresholds: {
      temperatureOptimal: 90, // °F
      temperatureUnit: "F",
      humidityOptimal: 30, // % - prefers dry
      precipitationRisk: "very low" // prefers dry
    }
  },
  {
    commonName: "Bacterial Spot",
    scientificName: "Xanthomonas arboricola pv. pruni",
    keyPoints: [
      "Spring rainfall with 70-85°F optimal for infection",
      "Copper treatments before rain events",
      "Changing rainfall patterns altering pressure",
      "Extended wet periods (>3 days) high risk",
      "Limited resistant varieties available"
    ],
    weatherThresholds: {
      temperatureOptimal: 77, // °F
      temperatureUnit: "F",
      humidityOptimal: 80, // %
      precipitationRisk: "high" // needs rain
    }
  }
];

// GRAPE PESTS
const grapePestBullets = [
  {
    commonName: "Powdery Mildew",
    scientificName: "Erysiphe necator",
    keyPoints: [
      "70-85°F with >70% humidity ideal for development",
      "UV risk models for timing treatments",
      "Canopy management crucial for prevention",
      "Extended growing seasons increasing infection periods",
      "Sulfur applications most common control"
    ],
    weatherThresholds: {
      temperatureOptimal: 77, // °F
      temperatureUnit: "F",
      humidityOptimal: 85, // %
      precipitationRisk: "low" // doesn't require rainfall
    }
  },
  {
    commonName: "Pierce's Disease/GWSS",
    scientificName: "Xylella fastidiosa / Homalodisca vitripennis",
    keyPoints: [
      "Vector survives mild winters",
      "Riparian management essential",
      "Range expanding with warming",
      "Coordinated area-wide management required",
      "Very high severity - can kill vines"
    ],
    weatherThresholds: {
      temperatureOptimal: 82, // °F
      temperatureUnit: "F",
      humidityOptimal: 65, // %
      precipitationRisk: "moderate"
    }
  },
  {
    commonName: "Vine Mealybug",
    scientificName: "Planococcus ficus",
    keyPoints: [
      "Warm conditions (70-90°F) increase generations",
      "Systemic insecticides via drip irrigation effective",
      "Ant management critical for biological control",
      "Expanded range into northern growing regions",
      "Hidden under bark during dormant season"
    ],
    weatherThresholds: {
      temperatureOptimal: 80, // °F
      temperatureUnit: "F",
      humidityOptimal: 60, // %
      precipitationRisk: "low"
    }
  },
  {
    commonName: "Botrytis",
    scientificName: "Botrytis cinerea",
    keyPoints: [
      "Wet conditions during bloom/harvest high risk",
      "Open canopy techniques reduce incidence",
      "Erratic rainfall changing disease patterns",
      "Cool (59-77°F), humid conditions favor development",
      "Applications at bloom, bunch closure, veraison"
    ],
    weatherThresholds: {
      temperatureOptimal: 68, // °F
      temperatureUnit: "F",
      humidityOptimal: 90, // %
      precipitationRisk: "very high" // needs moisture
    }
  },
  {
    commonName: "Grape Leafhopper",
    scientificName: "Erythroneura spp.",
    keyPoints: [
      "Hot days accelerate generations",
      "Natural enemy conservation key to management",
      "Additional generations with warming climate",
      "Dusty conditions increase problems",
      "Economic threshold: 15-20 nymphs per leaf"
    ],
    weatherThresholds: {
      temperatureOptimal: 85, // °F
      temperatureUnit: "F",
      humidityOptimal: 40, // % - prefers drier
      precipitationRisk: "low" // prefers dry
    }
  }
];

// TOMATO PESTS
const tomatoPestBullets = [
  {
    commonName: "Tomato Spotted Wilt Virus",
    scientificName: "Tomato spotted wilt virus (TSWV)",
    keyPoints: [
      "Transmitted by thrips vectors",
      "Warm temperatures (70-85°F) favor thrips reproduction",
      "Reflective mulches help repel vectors",
      "Resistant varieties with Sw-5 gene available",
      "High impact on yield and fruit quality"
    ],
    weatherThresholds: {
      temperatureOptimal: 77, // °F
      temperatureUnit: "F",
      humidityOptimal: 65, // %
      precipitationRisk: "low"
    }
  },
  {
    commonName: "Tomato Fruitworm",
    scientificName: "Helicoverpa zea",
    keyPoints: [
      "Direct fruit damage and pathogen entry",
      "Monitor with pheromone traps",
      "Economic threshold: 0.5-1% damaged fruit",
      "Bt and biological controls effective on young larvae",
      "Additional generations with warming climate"
    ],
    weatherThresholds: {
      temperatureOptimal: 82, // °F
      temperatureUnit: "F",
      humidityOptimal: 60, // %
      precipitationRisk: "moderate"
    }
  },
  {
    commonName: "Late Blight",
    scientificName: "Phytophthora infestans",
    keyPoints: [
      "Cool, wet conditions (60-70°F) with high humidity",
      "Leaf wetness >10-12 hours triggers infection",
      "Preventative fungicide applications crucial",
      "Can destroy crop rapidly in favorable conditions",
      "Resistant varieties like 'Mountain Magic' available"
    ],
    weatherThresholds: {
      temperatureOptimal: 65, // °F
      temperatureUnit: "F",
      humidityOptimal: 90, // %
      precipitationRisk: "very high" // needs moisture
    }
  }
];

// LETTUCE PESTS
const lettucePestBullets = [
  {
    commonName: "Lettuce Downy Mildew",
    scientificName: "Bremia lactucae",
    keyPoints: [
      "Cool (50-70°F), wet nights optimize infection",
      "Pathogen requires leaf wetness for 3+ hours",
      "Fungicide resistance management critical",
      "Resistant varieties available but pathogen evolves rapidly",
      "Spore release peaks at dawn"
    ],
    weatherThresholds: {
      temperatureOptimal: 60, // °F
      temperatureUnit: "F",
      humidityOptimal: 95, // %
      precipitationRisk: "high" // needs moisture
    }
  },
  {
    commonName: "Lettuce Aphid",
    scientificName: "Nasonovia ribisnigri",
    keyPoints: [
      "Prefers cool temperatures (60-75°F)",
      "Colonizes heart leaves making control difficult",
      "Resistant lettuce varieties available",
      "Overwintering success increases with milder winters",
      "Natural enemies include parasitic wasps and ladybugs"
    ],
    weatherThresholds: {
      temperatureOptimal: 68, // °F
      temperatureUnit: "F",
      humidityOptimal: 70, // %
      precipitationRisk: "moderate"
    }
  }
];

// STRAWBERRY PESTS
const strawberryPestBullets = [
  {
    commonName: "Two-spotted Spider Mite",
    scientificName: "Tetranychus urticae",
    keyPoints: [
      "Hot (>80°F), dry conditions accelerate reproduction",
      "Lifecycle can complete in just 5-7 days in summer",
      "Predatory mites provide effective biological control",
      "Increasing temperatures expanding seasonal activity",
      "Economic threshold: 5 mites per mid-tier leaflet"
    ],
    weatherThresholds: {
      temperatureOptimal: 85, // °F
      temperatureUnit: "F",
      humidityOptimal: 35, // % - prefers dry
      precipitationRisk: "very low" // prefers dry
    }
  },
  {
    commonName: "Botrytis Fruit Rot / Gray Mold",
    scientificName: "Botrytis cinerea",
    keyPoints: [
      "Wet, cool conditions (65-75°F) ideal for infection",
      "Spores require free moisture to germinate",
      "Fungicide resistance management crucial",
      "Canopy management to improve air circulation helps",
      "Most damaging during bloom and ripening"
    ],
    weatherThresholds: {
      temperatureOptimal: 70, // °F
      temperatureUnit: "F",
      humidityOptimal: 90, // %
      precipitationRisk: "very high" // needs moisture
    }
  }
];

// Structure for the pest database by crop
const californiaPestDatabase = {
  almonds: almondPestBullets,
  grapes: grapePestBullets,
  tomatoes: tomatoPestBullets,
  lettuce: lettucePestBullets,
  strawberries: strawberryPestBullets
};

// Export the database for use in the application
export default californiaPestDatabase;

// Also export individual crop pest arrays for selective imports
export {
  almondPestBullets,
  grapePestBullets,
  tomatoPestBullets,
  lettucePestBullets,
  strawberryPestBullets
};
