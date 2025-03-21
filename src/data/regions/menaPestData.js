// Mock data for date palm pests in the MENA region
export const datePalmPests = [
  {
    commonName: "Red Palm Weevil",
    scientificName: "Rhynchophorus ferrugineus",
    riskLevel: "High",
    description: "Major threat to date palm production throughout the Middle East and North Africa.",
    damageType: {
      severity: "High",
      description: "Larvae tunnel through the trunk and growing point, often causing palm death. Signs include yellowing and wilting of fronds, tunnels in trunk, and fermented odor."
    },
    weatherThresholds: {
      temperatureOptimal: 28,
      humidityOptimal: 60,
      precipitationRisk: "low"
    },
    image: "https://www.cabi.org/media-library/optimized/pimages/red-palm-weevil-(rhynchophorus-ferrugineus)_590e1a1a2cb42.jpg",
    riskFactors: [
      "Warm temperatures (25-35°C)",
      "Presence of wounds in palm tissue",
      "Transport of infested offshoots",
      "Proximity to infested palms"
    ],
    ipmStrategies: {
      cultural: [
        "Avoid mechanical injuries to palms",
        "Remove and destroy severely infested palms",
        "Apply white latex paint to wounds"
      ],
      biological: [
        "Entomopathogenic nematodes (Steinernema carpocapsae)",
        "Entomopathogenic fungi (Beauveria bassiana)"
      ],
      chemical: [
        "Trunk injection of imidacloprid",
        "Application of chlorpyrifos to trunk"
      ],
      monitoring: [
        "Pheromone traps with food bait",
        "Regular visual inspection of palms",
        "Early detection using acoustic devices"
      ]
    },
    climateChangeImpacts: [
      "Expanding geographical range due to warming temperatures",
      "Potential for faster development cycles with higher temperatures",
      "Increased stress on palms may increase susceptibility"
    ],
    link: "https://www.fao.org/3/ca1590en/CA1590EN.pdf"
  },
  {
    commonName: "Dubas Bug",
    scientificName: "Ommatissus lybicus",
    riskLevel: "Medium",
    description: "Major pest of date palms in the Middle East, causing significant economic losses.",
    damageType: {
      severity: "Medium",
      description: "Sap-sucking pest that causes yellowing of fronds, reduces yield, and produces honeydew that leads to sooty mold development."
    },
    weatherThresholds: {
      temperatureOptimal: 30,
      humidityOptimal: 55,
      precipitationRisk: "medium"
    },
    image: "https://www.cabi.org/media-library/optimized/pimages/dubas-bug-feeding-white_63cc5cb8b79c5.jpg",
    riskFactors: [
      "Hot, dry conditions",
      "High planting density",
      "Inadequate farm management",
      "Two generations per year (spring and fall)"
    ],
    ipmStrategies: {
      cultural: [
        "Proper pruning to improve aeration",
        "Appropriate spacing between palms",
        "Removal of alternative host plants"
      ],
      biological: [
        "Parasitic wasps (Pseudoligosita babylonica)",
        "Predatory insects like lacewings and ladybird beetles"
      ],
      chemical: [
        "Insecticide application during nymph stage",
        "Aerial spraying of diflubenzuron or deltamethrin in severe cases"
      ],
      monitoring: [
        "Yellow sticky traps",
        "Regular inspection of frond undersides",
        "Monitoring timing of nymph emergence"
      ]
    },
    climateChangeImpacts: [
      "Potential for additional generations per year with warming",
      "Changes in synchrony with natural enemies",
      "Expanded geographic range into new areas"
    ],
    link: "https://www.cabi.org/isc/datasheet/37852"
  },
  {
    commonName: "Date Palm Scale",
    scientificName: "Parlatoria blanchardi",
    riskLevel: "Medium",
    description: "Scale insect that can cause significant damage to date palms across North Africa and Middle East.",
    damageType: {
      severity: "Medium",
      description: "Feeding causes yellowing and weakening of fronds, reduced fruit production, and general decline in palm vigor."
    },
    weatherThresholds: {
      temperatureOptimal: 32,
      humidityOptimal: 50,
      precipitationRisk: "low"
    },
    image: "https://www.cabi.org/media-library/optimized/pimages/parlatoria-blanchardi-white-date-palm-scale_5fcd4de8ae0bd.jpg",
    riskFactors: [
      "Hot, dry conditions",
      "Dense plantings with poor air circulation",
      "Transport of infested plant material",
      "Multiple overlapping generations"
    ],
    ipmStrategies: {
      cultural: [
        "Avoid planting susceptible varieties",
        "Proper spacing and pruning to improve ventilation",
        "Certified pest-free planting material"
      ],
      biological: [
        "Predatory beetles (Chilocorus bipustulatus)",
        "Parasitic wasps (Aphytis mytilaspidis)"
      ],
      chemical: [
        "Mineral oil sprays during dormancy",
        "Insecticide application targeting crawler stage"
      ],
      monitoring: [
        "Regular inspection of fronds with hand lens",
        "Monitoring for presence of crawlers",
        "White tape traps for detecting crawler movement"
      ]
    },
    climateChangeImpacts: [
      "Faster development with higher temperatures",
      "Potential reduction in efficacy of natural enemies",
      "Increased stress on host plants may increase susceptibility"
    ],
    link: "https://www.cabi.org/isc/datasheet/38964"
  },
  {
    commonName: "Lesser Date Moth",
    scientificName: "Batrachedra amydraula",
    riskLevel: "Medium",
    description: "Important pest of date fruits in most date-growing regions of the Middle East.",
    damageType: {
      severity: "Medium",
      description: "Larvae feed on developing fruits causing premature fruit drop and quality reduction. Can cause 30-80% fruit loss if uncontrolled."
    },
    weatherThresholds: {
      temperatureOptimal: 29,
      humidityOptimal: 45,
      precipitationRisk: "medium"
    },
    image: "https://www.biolib.cz/IMG/GAL/BIG/205537.jpg",
    riskFactors: [
      "High temperatures (28-35°C)",
      "Low rainfall periods",
      "Presence of unharvested fruits",
      "Poorly managed orchards"
    ],
    ipmStrategies: {
      cultural: [
        "Complete harvest with no fruits left on palms",
        "Orchard sanitation to remove fallen fruits",
        "Fruit bunch bagging"
      ],
      biological: [
        "Trichogramma egg parasitoids",
        "Bacillus thuringiensis applications"
      ],
      chemical: [
        "Pheromone-based mating disruption",
        "Chemical control during peak flight periods"
      ],
      monitoring: [
        "Pheromone traps for adult moths",
        "Regular fruit inspection in spring",
        "Monitoring of fruit drop"
      ]
    },
    climateChangeImpacts: [
      "Potential for earlier seasonal emergence",
      "Possible additional generations per year",
      "Changes in synchrony with host plant phenology"
    ],
    link: "https://www.fao.org/3/i8372en/I8372EN.pdf"
  },
  {
    commonName: "Rhinoceros Beetle",
    scientificName: "Oryctes agamemnon",
    riskLevel: "High",
    description: "Serious pest of date palms across the Arabian Peninsula and North Africa.",
    damageType: {
      severity: "High",
      description: "Adults tunnel into the crown and base of fronds, damaging growing tissues. Severe infestations can kill young palms and weaken mature trees."
    },
    weatherThresholds: {
      temperatureOptimal: 27,
      humidityOptimal: 60,
      precipitationRisk: "low"
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Oryctes_rhinoceros.jpg/800px-Oryctes_rhinoceros.jpg",
    riskFactors: [
      "Presence of decaying organic matter",
      "Wounded or stressed palms",
      "Older plantations with dead standing palms",
      "Organic farming systems with mulch"
    ],
    ipmStrategies: {
      cultural: [
        "Remove and destroy dead palms and stumps",
        "Proper disposal of farm organic waste",
        "Avoid fresh manure application near palms"
      ],
      biological: [
        "Metarhizium anisopliae fungus",
        "Oryctes rhinoceros nudivirus (OrNV)",
        "Pheromone traps for mass trapping"
      ],
      chemical: [
        "Soil application of chlorpyrifos around palm base",
        "Treatment of breeding sites with insecticides"
      ],
      monitoring: [
        "Aggregation pheromone traps",
        "Regular inspection of crown and frond bases",
        "Monitoring of adult flight periods"
      ]
    },
    climateChangeImpacts: [
      "Faster development rates with higher temperatures",
      "Potential changes in voltinism",
      "Expanded geographic range"
    ],
    link: "https://www.fao.org/3/ca7148en/ca7148en.pdf"
  }
];

// Mock locations for MENA region date palm cultivation
export const datePalmLocations = [
  { name: "Medina", country: "Saudi Arabia", lat: 24.5247, lng: 39.5692 },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753 },
  { name: "Al Ain", country: "UAE", lat: 24.1302, lng: 55.8023 },
  { name: "Siwa Oasis", country: "Egypt", lat: 29.2033, lng: 25.5199 },
  { name: "Tozeur", country: "Tunisia", lat: 33.9197, lng: 8.1335 },
  { name: "Biskra", country: "Algeria", lat: 34.8515, lng: 5.7282 },
  { name: "Najran", country: "Saudi Arabia", lat: 17.4923, lng: 44.1277 },
  { name: "Al Qatif", country: "Saudi Arabia", lat: 26.5196, lng: 50.0115 },
  { name: "Basrah", country: "Iraq", lat: 30.5085, lng: 47.7804 },
  { name: "Oman", country: "Nizwa", lat: 22.9333, lng: 57.5333 }
];

// Mock data for pest risk levels at different locations
export const pestRiskByLocation = {
  "Medina": {
    "Red Palm Weevil": "High",
    "Dubas Bug": "Medium",
    "Date Palm Scale": "Low"
  },
  "Al Ain": {
    "Red Palm Weevil": "High",
    "Rhinoceros Beetle": "Medium",
    "Lesser Date Moth": "Medium"
  },
  "Siwa Oasis": {
    "Date Palm Scale": "High",
    "Lesser Date Moth": "Medium",
    "Dubas Bug": "Low"
  }
};
