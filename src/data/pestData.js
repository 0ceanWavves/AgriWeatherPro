// Shared pest data for the pest management system
import { menaRegions } from './regions/menaPestData';

// Comprehensive global crop list with 50 crops
const globalCrops = [
  'alfalfa', 'almond', 'apple', 'avocado', 'banana', 
  'barley', 'bean', 'blueberry', 'cacao', 'carrot',
  'cassava', 'cherry', 'citrus', 'coffee', 'corn', 
  'cotton', 'cucumber', 'date', 'eggplant', 'ginger',
  'grape', 'kiwi', 'lentil', 'lettuce', 'mango',
  'melon', 'millet', 'oat', 'olive', 'onion',
  'palm', 'papaya', 'pea', 'peanut', 'pepper',
  'potato', 'rice', 'sorghum', 'soybean', 'spinach',
  'squash', 'strawberry', 'sugarcane', 'sunflower', 'sweet potato',
  'tea', 'tomato', 'walnut', 'watermelon', 'wheat'
];

// Comprehensive list of risk factors
const riskFactors = [
  'High humidity', 'High temperature', 'Drought conditions', 'Continuous monocropping',
  'Early planting', 'Late planting', 'Heavy rainfall', 'Poor drainage',
  'Nearby infested fields', 'Lack of crop rotation', 'Recent mild winter',
  'Sandy soil', 'Clayey soil', 'Plant stress', 'Excessive nitrogen',
  'Wind dispersal', 'Irrigation practices', 'Poor sanitation', 'Improper pruning',
  'Weed pressure', 'Soil compaction', 'Field borders', 'Previous infestation'
];

// Common crops and their associated pests
const cropPests = {
  corn: [
    { 
      name: 'Corn Earworm', 
      scientificName: 'Helicoverpa zea',
      riskFactors: ['High humidity', 'Temperatures above 80°F', 'Late planting', 'Nearby tomato fields'],
      management: 'Monitor with pheromone traps, apply Bt-based insecticides when detected, plant early to avoid peak populations, use resistant varieties',
      description: 'Larvae feed on corn silk and kernels, causing direct damage to the marketable portion of the crop.',
      symptoms: 'Damaged kernels at ear tip, frass (waste) inside ear, larvae feeding on developing kernels'
    },
    { 
      name: 'European Corn Borer', 
      scientificName: 'Ostrinia nubilalis',
      riskFactors: ['Warm nights', 'High humidity', 'Continuous corn planting', 'Crop debris from previous season'],
      management: 'Crop rotation, Bt corn varieties, targeted insecticide application, thorough post-harvest destruction of crop residue',
      description: 'Larvae bore into stalks, weakening plants and causing breakage; they can also feed on ears.',
      symptoms: 'Broken tassels, entry/exit holes in stalks, stalk tunneling, broken stalks, ear dropping'
    },
    { 
      name: 'Corn Rootworm', 
      scientificName: 'Diabrotica spp.',
      riskFactors: ['Continuous corn planting', 'Dry soil conditions', 'Clay soils', 'History of infestation'],
      management: 'Crop rotation, soil insecticides at planting, rootworm resistant varieties, adult beetle monitoring',
      description: 'Larvae feed on roots, reducing uptake of water and nutrients; adult beetles feed on silks and can reduce pollination.',
      symptoms: 'Lodging (leaning) of plants, stunted growth, "goose-necking" growth pattern, pruned roots'
    }
  ],
  palm: [
    { 
      name: 'Red Palm Weevil', 
      scientificName: 'Rhynchophorus ferrugineus',
      riskFactors: ['Wounds in trunk', 'Nearby infested palms', 'Improper pruning', 'Young palms'],
      management: 'Regular inspection, pheromone traps, trunk injection with systemic insecticides, proper pruning protocols',
      description: 'Large reddish-brown weevil whose larvae tunnel through the palm trunk, often killing the tree.',
      symptoms: 'Wilting fronds, holes in trunk with reddish-brown sawdust, fermented odor, empty pupal cases'
    },
    { 
      name: 'Dubas Bug', 
      scientificName: 'Ommatissus lybicus',
      riskFactors: ['High temperatures', 'Dense planting', 'Nearby infested palms', 'Inadequate maintenance'],
      management: 'Canopy sprays during nymph stage, proper spacing between trees, natural predator conservation',
      description: 'Small planthopper that feeds on palm sap, secreting honeydew that leads to sooty mold.',
      symptoms: 'Yellowing fronds, honeydew, black sooty mold, reduced fruit quality'
    }
  ]
};

// Region-specific pest information
const regionPests = {
  // UAE - Dubai specific pests
  "AE": {
    "Dubai": [
      {
        name: "Red Palm Weevil",
        scientificName: "Rhynchophorus ferrugineus",
        description: "Major pest of date palms in Dubai and throughout UAE. Adult weevils are reddish-brown with a long snout and can fly up to 1km. Larvae tunnel through palm trunk causing severe damage.",
        symptoms: "Wilting fronds, holes in trunk with reddish-brown sawdust, fermented odor, empty pupal cases around base of tree.",
        management: "Regular inspection, pheromone traps, injection of systemic insecticides, proper pruning and sanitation techniques. Affected palms should be reported to municipality.",
        severity: "High",
        image: "https://www.plantwise.org/KnowledgeBank/800x640/PMDG_98764.jpg"
      },
      {
        name: "MENA Date Palm Database",
        scientificName: "Multiple Species",
        description: "Access our detailed Middle East & North Africa date palm pest database with comprehensive information on management strategies for this critical crop.",
        management: "Specialized IPM strategies for date palm cultivation in the MENA region",
        severity: "Various",
        isSpecialEntry: true,
        isRegionalDatabase: "mena"
      }
    ],
    "Abu Dhabi": [
      {
        name: "MENA Date Palm Database",
        scientificName: "Multiple Species",
        description: "Access our detailed Middle East & North Africa date palm pest database with comprehensive information on management strategies for this critical crop.",
        management: "Specialized IPM strategies for date palm cultivation in the MENA region",
        severity: "Various",
        isSpecialEntry: true,
        isRegionalDatabase: "mena"
      }
    ]
  },
  // US - California specific pests
  "US": {
    "California": [
      {
        name: "California Regional Database",
        scientificName: "Multiple Species",
        description: "Access our detailed California crop pest database focusing on almonds, grapes, tomatoes, lettuce, and strawberries.",
        management: "Comprehensive IPM strategies tailored to California's growing conditions",
        severity: "Various",
        isSpecialEntry: true,
        isRegionalDatabase: "california"
      }
    ]
  },
  // Saudi Arabia
  "SA": {
    "Riyadh": [
      {
        name: "MENA Date Palm Database",
        scientificName: "Multiple Species",
        description: "Access our detailed Middle East & North Africa date palm pest database with comprehensive information on management strategies for this critical crop.",
        management: "Specialized IPM strategies for date palm cultivation in the MENA region",
        severity: "Various",
        isSpecialEntry: true,
        isRegionalDatabase: "mena"
      }
    ]
  },
  // Egypt
  "EG": {
    "Cairo": [
      {
        name: "MENA Date Palm Database",
        scientificName: "Multiple Species",
        description: "Access our detailed Middle East & North Africa date palm pest database with comprehensive information on management strategies for this critical crop.",
        management: "Specialized IPM strategies for date palm cultivation in the MENA region",
        severity: "Various",
        isSpecialEntry: true,
        isRegionalDatabase: "mena"
      }
    ]
  }
};

// Add MENA regions to our global data
for (const countryCode in menaRegions) {
  if (!regionPests[countryCode]) {
    regionPests[countryCode] = {};
  }
  
  for (const city in menaRegions[countryCode]) {
    // Add special entry for MENA database
    if (!regionPests[countryCode][city]) {
      regionPests[countryCode][city] = [
        {
          name: "MENA Date Palm Database",
          scientificName: "Multiple Species",
          description: "Access our detailed Middle East & North Africa date palm pest database with comprehensive information on management strategies for this critical crop.",
          management: "Specialized IPM strategies for date palm cultivation in the MENA region",
          severity: "Various",
          isSpecialEntry: true,
          isRegionalDatabase: "mena"
        }
      ];
    }
  }
}

export { globalCrops, riskFactors, cropPests, regionPests };
export default { globalCrops, riskFactors, cropPests, regionPests };