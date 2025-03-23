// Southeast Asian Rice Pest Database (Phase 3)
// Comprehensive data about rice pests in Southeast Asia's tropical climate

export const southeastAsiaPests = [
  {
    id: 'rice_stem_borer',
    commonName: "Rice Stem Borer",
    scientificName: "Scirpophaga incertulas",
    description: "Major pest of rice in Southeast Asia that can cause devastating yield losses.",
    damageType: {
      severity: "High",
      description: "Larvae bore into rice stems, causing 'deadhearts' (dying of the central shoot) during vegetative stage and 'whiteheads' (empty panicles) during reproductive stage."
    },
    weatherThresholds: {
      temperatureOptimal: 28,
      temperatureRange: [25, 32],
      humidityOptimal: 85,
      humidityRange: [80, 100],
      precipitationRisk: "medium",
      precipitationOptimal: [10, 30]
    },
    riskFactors: [
      "Temperatures between 25-32°C favor rapid development",
      "High humidity (>80%) promotes egg viability and larval survival",
      "Moderate rainfall with intermittent dry periods increases infestation",
      "Continuous rice cropping creates favorable conditions",
      "Nitrogen-rich environments enhance larval development"
    ],
    ipmStrategies: {
      cultural: [
        "Use resistant rice varieties (e.g., IR36, IR64, and newly developed varieties from IRRI)",
        "Implement synchronized planting within a region to break the pest cycle",
        "Remove and destroy stubble and ratoons after harvest to eliminate overwintering sites",
        "Maintain appropriate water levels to submerge eggs laid on lower parts of plants"
      ],
      biological: [
        "Use pheromone traps for monitoring and mass trapping of adult moths",
        "Encourage natural enemies such as Trichogramma wasps for egg parasitism",
        "Release parasitoids during peak moth activity periods",
        "Maintain diverse vegetation around fields to support natural enemy populations"
      ],
      chemical: [
        "Apply appropriate pesticides only when pest populations exceed economic thresholds",
        "Use systemic insecticides for severe infestations",
        "Time applications to coincide with vulnerable life stages",
        "Rotate insecticide modes of action to prevent resistance development"
      ]
    },
    climateChangeImpacts: "Climate change is expected to increase the number of generations per year due to rising temperatures. Altered monsoon patterns may create more favorable conditions for outbreaks, particularly in central and northern regions of Southeast Asia. Changes in planting dates to adapt to climate change may also affect synchronization of pest cycles with vulnerable crop stages."
  },
  {
    id: 'brown_planthopper',
    commonName: "Brown Planthopper",
    scientificName: "Nilaparvata lugens",
    description: "A sap-sucking insect that is one of the most destructive pests of rice throughout Southeast Asia.",
    damageType: {
      severity: "Very High",
      description: "Both nymphs and adults suck sap from the plant base, causing yellowing, drying, and eventual death of plants ('hopper burn'). Also transmits rice viruses such as grassy stunt and ragged stunt."
    },
    weatherThresholds: {
      temperatureOptimal: 27,
      temperatureRange: [25, 30],
      humidityOptimal: 85,
      humidityRange: [70, 100],
      precipitationRisk: "medium",
      precipitationOptimal: [5, 20]
    },
    riskFactors: [
      "Optimal development at 25-30°C",
      "High humidity (>70%) is ideal for reproduction and survival",
      "Excessive nitrogen fertilization increases susceptibility",
      "Close plant spacing creates favorable microclimate",
      "Widespread insecticide use that disrupts natural enemy populations"
    ],
    ipmStrategies: {
      cultural: [
        "Plant resistant varieties with BPH resistance genes",
        "Avoid excessive use of nitrogen fertilizers",
        "Reduce plant density to create less favorable microclimate",
        "Drain rice fields periodically to disrupt the pest lifecycle",
        "Implement area-wide synchronized planting and fallow periods"
      ],
      biological: [
        "Conserve natural enemies like mirid bugs, spiders, and parasitoids",
        "Create habitat for predators through ecological engineering",
        "Maintain vegetation diversity around fields",
        "Support generalist predator populations"
      ],
      chemical: [
        "Use yellow light traps to monitor pest populations",
        "Apply insecticides judiciously to avoid resistance development",
        "Target applications to high-risk fields or hotspots",
        "Avoid early season spraying to protect natural enemies"
      ]
    },
    climateChangeImpacts: "Warmer temperatures may lead to more generations per year and expanded geographic range. Changes in rainfall patterns may affect population dynamics, potentially causing more frequent and severe outbreaks. Higher CO2 levels may reduce rice nutritional quality, leading to increased feeding by planthoppers to obtain sufficient nutrients."
  },
  {
    id: 'rice_blast',
    commonName: "Rice Blast",
    scientificName: "Magnaporthe oryzae",
    description: "A devastating fungal disease affecting rice production throughout Southeast Asia.",
    damageType: {
      severity: "Very High",
      description: "Fungal disease causing lesions on leaves, nodes, panicle necks, and grains. Neck blast results in unfilled grains and panicle breakage."
    },
    weatherThresholds: {
      temperatureOptimal: 26,
      temperatureRange: [24, 28],
      humidityOptimal: 95,
      humidityRange: [90, 100],
      precipitationRisk: "high",
      precipitationOptimal: [5, 15]
    },
    riskFactors: [
      "Temperature range of 24-28°C with cool nights and warm days",
      "High humidity (>90%) and prolonged leaf wetness (>10 hours)",
      "Frequent light rains and foggy conditions enhance disease spread",
      "Excessive nitrogen fertilization increases susceptibility",
      "Drought stress followed by high humidity"
    ],
    ipmStrategies: {
      cultural: [
        "Plant resistant varieties with Pi genes (over 100 resistance genes identified)",
        "Use certified disease-free seeds",
        "Balance nitrogen fertilization - avoid excessive amounts",
        "Improve field drainage to reduce humidity around plants",
        "Practice field sanitation by removing and destroying crop residues"
      ],
      biological: [
        "Apply silicon-based fertilizers to strengthen plant cell walls",
        "Use biofungicides containing Trichoderma spp.",
        "Apply plant growth-promoting rhizobacteria",
        "Incorporate organic amendments for overall plant health"
      ],
      chemical: [
        "Apply fungicides preventatively during vulnerable growth stages",
        "Use systemic fungicides for protection during high-risk periods",
        "Rotate fungicide classes to prevent resistance development",
        "Time applications according to weather forecasts"
      ]
    },
    climateChangeImpacts: "Changing temperature and rainfall patterns may alter the geographic and temporal distribution of rice blast. Areas previously unfavorable for the disease may become conducive. Earlier planting dates in response to climate change may expose crops to more favorable conditions for disease development. Increased CO2 levels may enhance plant canopy density, creating more favorable microclimate for the pathogen."
  },
  {
    id: 'rice_water_weevil',
    commonName: "Rice Water Weevil",
    scientificName: "Lissorhoptrus oryzophilus",
    description: "An invasive pest in parts of Asia that causes significant damage to rice crops.",
    damageType: {
      severity: "Medium to High",
      description: "Adults feed on leaf tissue creating characteristic linear scars. Larvae feed on roots, reducing nutrient uptake and plant stability."
    },
    weatherThresholds: {
      temperatureOptimal: 25,
      temperatureRange: [20, 35],
      humidityOptimal: 80,
      humidityRange: [60, 100],
      precipitationRisk: "high",
      precipitationOptimal: [10, 40]
    },
    riskFactors: [
      "Active in temperatures between 20-35°C, with optimal development around 25°C",
      "Requires high moisture for survival of larvae",
      "Flooded conditions are essential for larval development",
      "Continuous rice cultivation increases pest pressure",
      "Early planting in consistently warm regions"
    ],
    ipmStrategies: {
      cultural: [
        "Delay permanent flooding by 2-4 weeks after seeding where possible",
        "Implement temporary drainage periods to strand larvae",
        "Plant early-maturing varieties to avoid peak adult activity",
        "Maintain clean bunds and surroundings to reduce overwintering sites",
        "Use moderate seeding rates to promote vigorous plants that can tolerate damage"
      ],
      biological: [
        "Consider rice-fish culture systems where appropriate as some fish species feed on larvae",
        "Conserve natural predators such as aquatic insects",
        "Implement integrated systems that support biological control",
        "Use ducks in rice paddies after harvest to reduce overwintering adults"
      ],
      chemical: [
        "Apply appropriate seed treatments or soil insecticides in high-risk areas",
        "Monitor adult populations using sweep nets before flooding",
        "Time insecticide applications to target adults before egg-laying",
        "Use economic thresholds to determine need for treatment"
      ]
    },
    climateChangeImpacts: "Rising temperatures may accelerate development rates and increase the number of generations per year. Changes in precipitation patterns affecting water availability may impact management practices like delayed flooding. This invasive pest may continue to spread to new areas as climate conditions become favorable."
  },
  {
    id: 'fall_armyworm',
    commonName: "Fall Armyworm",
    scientificName: "Spodoptera frugiperda",
    description: "A recently invasive pest in Southeast Asia that poses a growing threat to rice and other crops.",
    damageType: {
      severity: "Medium to High",
      description: "Larvae feed on leaves, stems, and reproductive parts. Young larvae skeletonize leaves, while older larvae can cut seedlings and damage growing points."
    },
    weatherThresholds: {
      temperatureOptimal: 30,
      temperatureRange: [25, 35],
      humidityOptimal: 65,
      humidityRange: [50, 80],
      precipitationRisk: "low",
      precipitationOptimal: [0, 10]
    },
    riskFactors: [
      "Thrives in warm conditions between 25-35°C",
      "Moderate humidity levels are favorable for development",
      "Drought conditions often exacerbate infestations",
      "Continuous cropping increases pest pressure",
      "Lack of established natural enemies in newly invaded areas"
    ],
    ipmStrategies: {
      cultural: [
        "Implement early monitoring using pheromone traps",
        "Practice good field sanitation to reduce overwintering sites",
        "Use trap crops to draw pests away from main crop",
        "Adjust planting timing to avoid peak infestation periods",
        "Maintain field diversity to support natural enemies"
      ],
      biological: [
        "Apply biopesticides such as Bacillus thuringiensis (Bt) for early instar larvae",
        "Release natural enemies like Trichogramma wasps for egg parasitism",
        "Practice push-pull strategy using repellent and trap plants where applicable",
        "Promote habitat for natural enemies through ecological engineering"
      ],
      chemical: [
        "Apply selective insecticides only when threshold levels are exceeded",
        "Use light traps to monitor and reduce adult populations",
        "Target applications to early instar larvae when most vulnerable",
        "Rotate insecticide modes of action to prevent resistance"
      ]
    },
    climateChangeImpacts: "As a recent invasive species in Southeast Asia, climate change may accelerate its establishment and spread. Warmer temperatures will likely increase the number of generations per year and expand its geographic range. Extreme weather events may influence population dynamics and outbreak patterns. Drought conditions associated with climate change may increase crop vulnerability to this pest."
  },
  {
    id: 'bacterial_leaf_blight',
    commonName: "Bacterial Leaf Blight",
    scientificName: "Xanthomonas oryzae pv. oryzae",
    description: "A serious bacterial disease affecting rice production throughout Southeast Asia.",
    damageType: {
      severity: "High",
      description: "Causes water-soaked lesions that turn yellow-orange and eventually gray-white as they expand along leaf veins. In severe cases, entire leaves may wilt and die."
    },
    weatherThresholds: {
      temperatureOptimal: 30,
      temperatureRange: [25, 34],
      humidityOptimal: 85,
      humidityRange: [70, 100],
      precipitationRisk: "high",
      precipitationOptimal: [20, 50]
    },
    riskFactors: [
      "Optimal temperature range of 25-34°C",
      "High relative humidity (>70%) and leaf wetness promote infection and disease development",
      "Heavy rainfall, flooding, and typhoons increase disease spread and severity",
      "Wounding of plants during transplanting or from insect damage",
      "High nitrogen fertilization increases susceptibility"
    ],
    ipmStrategies: {
      cultural: [
        "Plant resistant varieties with Xa genes (over 40 resistance genes identified)",
        "Use clean, certified disease-free seeds",
        "Avoid clipping of seedlings during transplanting to prevent injury and infection points",
        "Maintain balanced fertilization - high nitrogen increases susceptibility",
        "Practice field sanitation by removing infected plant debris"
      ],
      biological: [
        "Apply beneficial bacteria as seed treatments or foliar sprays",
        "Use plant resistance inducers",
        "Apply silicon to strengthen plant cell walls",
        "Support overall plant health through balanced nutrition"
      ],
      chemical: [
        "Avoid field operations when plants are wet to reduce mechanical disease spread",
        "Maintain good drainage to reduce humidity levels",
        "In severe cases, apply copper-based bactericides during the early disease stages",
        "Use antibiotics in nursery stages where approved"
      ]
    },
    climateChangeImpacts: "Increased temperatures and humidity associated with climate change may enhance disease severity and expand the geographic range. Extreme weather events like stronger typhoons will likely increase disease incidence and spread. Changes in rainfall patterns affecting flooding frequency and duration may influence disease epidemiology. Earlier planting dates may expose crops to different disease pressure patterns."
  },
  {
    id: 'sheath_blight',
    commonName: "Sheath Blight",
    scientificName: "Rhizoctonia solani",
    description: "A fungal disease that significantly impacts rice production in warm, humid regions of Southeast Asia.",
    damageType: {
      severity: "Medium to High",
      description: "Causes lesions on leaf sheaths that initially appear as water-soaked spots, later expanding into oval or elliptical lesions with grayish-white centers and brown margins. The disease can spread to leaf blades and eventually to panicles."
    },
    weatherThresholds: {
      temperatureOptimal: 30,
      temperatureRange: [28, 32],
      humidityOptimal: 97,
      humidityRange: [95, 100],
      precipitationRisk: "high",
      precipitationOptimal: [15, 35]
    },
    riskFactors: [
      "Optimum temperature range of 28-32°C for disease development",
      "High relative humidity (>95%) and prolonged leaf wetness",
      "Frequent rainfall creating humid microclimate within the canopy",
      "Dense canopy from high nitrogen application",
      "Close plant spacing limiting air circulation"
    ],
    ipmStrategies: {
      cultural: [
        "Use moderately resistant or tolerant varieties (complete resistance is not available)",
        "Adopt wider spacing to reduce humidity within the canopy",
        "Apply balanced fertilization - excessive nitrogen increases disease susceptibility",
        "Practice field sanitation by removing and destroying crop residues",
        "Maintain proper water management - avoid excessive flooding"
      ],
      biological: [
        "Apply silicon fertilizers to strengthen plant resistance",
        "Use biofungicides containing beneficial microorganisms",
        "Apply compost and organic matter to enhance soil suppressive properties",
        "Implement biological soil amendments to reduce inoculum"
      ],
      chemical: [
        "Apply fungicides at early disease onset, particularly at booting stage",
        "Use systemic fungicides during high-risk periods",
        "Rotate fungicide modes of action to prevent resistance",
        "Time applications according to disease forecasting systems"
      ]
    },
    climateChangeImpacts: "Rising temperatures and humidity levels due to climate change may increase disease severity and expand the geographic range. Changes in rainfall patterns may create more favorable conditions for disease development. Increased CO2 levels may enhance plant canopy density, creating a more favorable microclimate for the pathogen. Adapted rice cultivation practices in response to climate change may inadvertently influence disease dynamics."
  }
];

export default southeastAsiaPests;