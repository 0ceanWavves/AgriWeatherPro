// Mock API for pest data
// In a real app, this would be connected to Supabase/database

// MENA date palm pests
const menaPestData = [
  {
    commonName: "Red Palm Weevil",
    scientificName: "Rhynchophorus ferrugineus",
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
    }
  },
  {
    commonName: "Dubas Bug",
    scientificName: "Ommatissus lybicus",
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
    }
  },
  {
    commonName: "Date Palm Scale",
    scientificName: "Parlatoria blanchardi",
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
    }
  }
];

// Southeast Asia rice pests
const asiaPestData = [
  {
    commonName: "Rice Stem Borer",
    scientificName: "Scirpophaga incertulas",
    description: "Major pest of rice in Southeast Asia that can cause devastating yield losses.",
    damageType: {
      severity: "High",
      description: "Larvae bore into rice stems, causing 'deadhearts' (dead central shoots) during vegetative stage and 'whiteheads' (empty panicles) during reproductive stage, leading to significant yield losses."
    },
    weatherThresholds: {
      temperatureOptimal: 27,
      humidityOptimal: 80,
      precipitationRisk: "medium"
    },
    image: "https://www.plantwise.org/KnowledgeBank/ContentImages/800px/Stemborerdamage.jpg",
    riskFactors: [
      "High temperatures (25-32°C)",
      "High humidity (>70%)",
      "Monsoon conditions",
      "Continuous rice cropping",
      "Use of susceptible varieties"
    ],
    ipmStrategies: {
      cultural: [
        "Synchronized planting and harvesting",
        "Remove and destroy rice stubble after harvest",
        "Crop rotation with non-host crops",
        "Water management in irrigated systems"
      ],
      biological: [
        "Conservation of natural enemies (Trichogramma wasps)",
        "Microbial agents (Bacillus thuringiensis)",
        "Predatory insects and spiders"
      ],
      chemical: [
        "Strategic insecticide application at early infestation",
        "Resistance management through rotation of active ingredients",
        "Proper timing based on pest monitoring"
      ],
      monitoring: [
        "Light traps for adult moths",
        "Regular field scouting for egg masses",
        "Monitoring for deadhearts and whiteheads",
        "Pheromone traps"
      ]
    },
    climateChangeImpacts: [
      "Increased number of generations per year with warming temperatures",
      "Range expansion to higher elevations",
      "Changes in synchronization with natural enemies",
      "Altered effectiveness of certain management practices"
    ]
  },
  {
    commonName: "Brown Planthopper",
    scientificName: "Nilaparvata lugens",
    description: "Destructive pest of rice throughout Southeast Asia, causing both direct damage and virus transmission.",
    damageType: {
      severity: "High",
      description: "Sap-sucking insect that causes 'hopperburn' (complete drying and browning of plants). Also transmits Rice Grassy Stunt Virus and Rice Ragged Stunt Virus, leading to severe yield losses."
    },
    weatherThresholds: {
      temperatureOptimal: 28,
      humidityOptimal: 85,
      precipitationRisk: "high"
    },
    image: "https://www.cabi.org/isc/FullTextPDF/2009/20097200423.pdf",
    riskFactors: [
      "High temperatures with high humidity",
      "Heavy nitrogen fertilization",
      "Staggered planting",
      "Insecticide overuse that kills natural enemies",
      "Close plant spacing"
    ],
    ipmStrategies: {
      cultural: [
        "Synchronized planting and fallow periods",
        "Balanced fertilization (avoid excessive nitrogen)",
        "Appropriate spacing between plants",
        "Water management (periodic draining)"
      ],
      biological: [
        "Conservation of natural enemies (spiders, beetles, parasitoids)",
        "Use of resistant varieties (carrying Bph genes)",
        "Ecological engineering to enhance biodiversity"
      ],
      chemical: [
        "Selective insecticides only when threshold levels are reached",
        "Avoid early-season spraying to protect natural enemies",
        "Insecticide rotation to prevent resistance"
      ],
      monitoring: [
        "Regular field monitoring with sweep nets",
        "Light traps for adult monitoring",
        "Action threshold-based management",
        "Yellow sticky traps"
      ]
    },
    climateChangeImpacts: [
      "Shortened life cycle with higher temperatures",
      "Increased number of generations per year",
      "Enhanced overwintering success in warming climates",
      "Potential changes in virus transmission patterns"
    ]
  },
  {
    commonName: "Rice Blast",
    scientificName: "Magnaporthe oryzae",
    description: "One of the most widespread and destructive rice diseases in Southeast Asia, causing significant yield losses annually.",
    damageType: {
      severity: "High",
      description: "Fungal disease affecting leaves, nodes, and panicles. Causes diamond-shaped lesions on leaves, node rot, and panicle blast, significantly reducing grain quality and yield."
    },
    weatherThresholds: {
      temperatureOptimal: 24,
      humidityOptimal: 90,
      precipitationRisk: "high"
    },
    image: "https://www.plantwise.org/KnowledgeBank/ContentImages/800px/rice_blast_7241.jpg",
    riskFactors: [
      "High humidity (>90%)",
      "Temperatures between 20-28°C",
      "Prolonged leaf wetness (>10 hours)",
      "Excessive nitrogen fertilization",
      "Drought stress followed by high humidity"
    ],
    ipmStrategies: {
      cultural: [
        "Use of resistant varieties",
        "Balanced fertilization (avoid excessive nitrogen)",
        "Proper water management to avoid drought stress",
        "Proper spacing to reduce humidity in canopy",
        "Silicon application to strengthen plant tissues"
      ],
      biological: [
        "Antagonistic microorganisms (Trichoderma spp.)",
        "Plant growth-promoting rhizobacteria",
        "Compost amendments to enhance soil health"
      ],
      chemical: [
        "Preventative fungicide applications during high-risk periods",
        "Rotation of fungicides with different modes of action",
        "Seed treatment with fungicides"
      ],
      monitoring: [
        "Regular scouting for early lesions",
        "Weather monitoring for blast-favorable conditions",
        "Disease forecasting systems",
        "Nursery monitoring before transplanting"
      ]
    },
    climateChangeImpacts: [
      "Changes in geographic distribution and severity",
      "Altered timing of disease outbreaks",
      "Potential breakdown of host resistance due to pathogen adaptation",
      "Increased disease pressure with more variable rainfall patterns"
    ]
  },
  {
    commonName: "Bacterial Leaf Blight",
    scientificName: "Xanthomonas oryzae pv. oryzae",
    description: "Serious bacterial disease of rice throughout Southeast Asia, particularly in irrigated and rainfed lowland environments.",
    damageType: {
      severity: "High",
      description: "Bacterial infection that causes water-soaked lesions which turn yellow to white and spread along leaf veins. Can cause significant yield losses up to 70% in severe cases."
    },
    weatherThresholds: {
      temperatureOptimal: 30,
      humidityOptimal: 85,
      precipitationRisk: "high"
    },
    image: "https://www.plantwise.org/KnowledgeBank/ContentImages/800px/bacterial_leaf_blight_5428.jpg",
    riskFactors: [
      "High temperatures (28-34°C)",
      "High humidity",
      "Heavy rainfall and strong winds",
      "Flooding and deep water",
      "High nitrogen applications",
      "Susceptible varieties"
    ],
    ipmStrategies: {
      cultural: [
        "Use of resistant varieties (Xa genes)",
        "Balanced fertilization (avoid excessive nitrogen)",
        "Proper field drainage",
        "Clean seeds and seedlings",
        "Crop rotation"
      ],
      biological: [
        "Plant growth-promoting rhizobacteria",
        "Biocontrol agents (Pseudomonas spp.)",
        "Organic amendments to enhance soil health"
      ],
      chemical: [
        "Copper-based bactericides (limited effectiveness)",
        "Seed treatment with antibiotics",
        "Chemical agents inducing systemic resistance"
      ],
      monitoring: [
        "Regular field scouting for early symptoms",
        "Monitoring of water management practices",
        "Weather monitoring for disease-favorable conditions",
        "Nursery inspection before transplanting"
      ]
    },
    climateChangeImpacts: [
      "Increased disease pressure with more frequent extreme weather events",
      "Changes in geographic distribution",
      "Earlier onset of disease with warming",
      "Potential changes in pathogen virulence"
    ]
  }
];

// California pests by crop
const californiaPestData = {
  'almonds': [
    {
      commonName: "Navel Orangeworm",
      scientificName: "Amyelois transitella",
      description: "Major pest of almonds and other nut crops in California.",
      damageType: {
        severity: "High",
        description: "Larvae feed directly on almond kernels, causing significant damage and increasing risk of aflatoxin contamination."
      },
      weatherThresholds: {
        temperatureOptimal: 75,
        humidityOptimal: 60,
        precipitationRisk: "low"
      },
      riskFactors: [
        "Warm temperatures",
        "Poor orchard sanitation",
        "Proximity to other nut crops",
        "Previous infestations"
      ],
      ipmStrategies: {
        cultural: [
          "Maintain good orchard sanitation",
          "Timely harvest of nuts",
          "Timely mummy nut removal and destruction"
        ],
        biological: [
          "Releasing Trichogramma wasps",
          "Supporting natural predators"
        ],
        chemical: [
          "Well-timed insecticide applications",
          "Mating disruption techniques"
        ],
        monitoring: [
          "Egg traps",
          "Pheromone traps",
          "Presence of eggs on mummy nuts"
        ]
      }
    },
    {
      commonName: "Peach Twig Borer",
      scientificName: "Anarsia lineatella",
      description: "Common pest in California almond orchards.",
      damageType: {
        severity: "Medium",
        description: "Larvae feed on shoots and nuts, causing economic damage particularly in early season."
      },
      weatherThresholds: {
        temperatureOptimal: 72,
        humidityOptimal: 65,
        precipitationRisk: "medium"
      },
      riskFactors: [
        "Mild winter temperatures",
        "Early season warm periods",
        "Previous infestations",
        "Proximity to peach orchards"
      ],
      ipmStrategies: {
        cultural: [
          "Proper pruning",
          "Removal of mummy nuts"
        ],
        biological: [
          "Conservation of natural enemies",
          "Bacillus thuringiensis sprays"
        ],
        chemical: [
          "Dormant and bloom-time sprays",
          "Timed insecticide applications based on trap data"
        ],
        monitoring: [
          "Pheromone traps",
          "Shoot strike inspections",
          "Degree-day models"
        ]
      }
    }
  ],
  'grapes': [
    {
      commonName: "Vine Mealybug",
      scientificName: "Planococcus ficus",
      description: "Invasive pest in California vineyards.",
      damageType: {
        severity: "High",
        description: "Sap-feeding pest that excretes honeydew, leading to sooty mold. Also vectors leafroll virus."
      },
      weatherThresholds: {
        temperatureOptimal: 78,
        humidityOptimal: 70,
        precipitationRisk: "low"
      },
      riskFactors: [
        "Warm temperatures",
        "Dust on vines",
        "Presence of ants",
        "Limited natural enemies"
      ],
      ipmStrategies: {
        cultural: [
          "Dust management",
          "Ant control",
          "Clean nursery stock"
        ],
        biological: [
          "Anagyrus wasps",
          "Cryptolaemus beetles"
        ],
        chemical: [
          "Systemic insecticides",
          "Contact insecticides",
          "Insect growth regulators"
        ],
        monitoring: [
          "Visual inspections",
          "Pheromone traps",
          "Sticky tape monitoring"
        ]
      }
    }
  ],
  'tomatoes': [
    {
      commonName: "Tomato Russet Mite",
      scientificName: "Aculops lycopersici",
      description: "Microscopic pest that can cause serious damage to tomato plants.",
      damageType: {
        severity: "Medium",
        description: "Causes bronzing of stems and leaves, eventually leading to plant death if untreated."
      },
      weatherThresholds: {
        temperatureOptimal: 80,
        humidityOptimal: 50,
        precipitationRisk: "low"
      },
      riskFactors: [
        "Hot, dry conditions",
        "Continuous tomato cropping",
        "Late detection due to small size",
        "Dust on plants"
      ],
      ipmStrategies: {
        cultural: [
          "Crop rotation",
          "Removal of plant debris",
          "Avoid water stress"
        ],
        biological: [
          "Predatory mites",
          "Conservation of natural enemies"
        ],
        chemical: [
          "Sulfur applications",
          "Selective miticides"
        ],
        monitoring: [
          "Regular inspection with magnification",
          "Monitoring for early bronzing symptoms",
          "Focus on lower stem inspection"
        ]
      }
    }
  ],
  'lettuce': [
    {
      commonName: "Lettuce Aphid",
      scientificName: "Nasonovia ribisnigri",
      description: "Major pest of lettuce crops in California.",
      damageType: {
        severity: "Medium",
        description: "Feeds within developing lettuce heads, contaminating produce and transmitting viruses."
      },
      weatherThresholds: {
        temperatureOptimal: 65,
        humidityOptimal: 75,
        precipitationRisk: "medium"
      },
      riskFactors: [
        "Cool weather",
        "Sequential plantings",
        "Presence of weedy hosts",
        "Insecticide resistance"
      ],
      ipmStrategies: {
        cultural: [
          "Resistant varieties",
          "Avoid sequential plantings",
          "Weed management"
        ],
        biological: [
          "Lady beetles",
          "Parasitic wasps",
          "Syrphid flies"
        ],
        chemical: [
          "Selective aphicides",
          "Systemic insecticides at planting"
        ],
        monitoring: [
          "Yellow sticky traps",
          "Regular field scouting",
          "Check interior leaves"
        ]
      }
    }
  ],
  'strawberries': [
    {
      commonName: "Lygus Bug",
      scientificName: "Lygus hesperus",
      description: "Common pest in California strawberry production.",
      damageType: {
        severity: "High",
        description: "Feeds on developing fruits, causing deformities known as 'cat-facing' and reducing marketable yield."
      },
      weatherThresholds: {
        temperatureOptimal: 75,
        humidityOptimal: 65,
        precipitationRisk: "high"
      },
      riskFactors: [
        "Warm temperatures",
        "Proximity to alfalfa or weedy areas",
        "Early season population buildup",
        "Dry conditions"
      ],
      ipmStrategies: {
        cultural: [
          "Vacuum machines",
          "Management of surrounding vegetation",
          "Trap crops"
        ],
        biological: [
          "Predatory bugs",
          "Parasitic wasps"
        ],
        chemical: [
          "Selective insecticides",
          "Timed applications based on sampling"
        ],
        monitoring: [
          "Sweep net sampling",
          "Visual inspection of flowers",
          "Beat sampling"
        ]
      }
    }
  ]
};

// Fetch MENA pests data
export const fetchMENAPests = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return menaPestData;
};

// Fetch Southeast Asia rice pests data
export const fetchAsiaPests = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return asiaPestData;
};

// Fetch California pests by crop type
export const fetchCaliforniaPests = async (cropType) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return californiaPestData[cropType] || [];
};

// Fetch all crops
export const fetchAllCrops = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Object.keys(californiaPestData);
};

// Fetch pest by ID
export const fetchPestById = async (id) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Search in all pest collections
  const allPests = [
    ...menaPestData,
    ...asiaPestData,
    ...Object.values(californiaPestData).flat()
  ];
  
  return allPests.find(pest => pest.scientificName === id);
};

// Export a default function for convenience
export default {
  fetchMENAPests,
  fetchAsiaPests,
  fetchCaliforniaPests,
  fetchAllCrops,
  fetchPestById
};