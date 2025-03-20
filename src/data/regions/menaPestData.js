/**
 * Middle East North Africa (MENA) Date Palm Pest Database - Phase 2
 * 
 * This file contains structured data for the MENA Date Palm Pest Database,
 * focusing on the priority pests affecting date palm cultivation in the region.
 */

// Priority date palm pests in MENA region
const datePalmPests = [
  {
    commonName: "Red Palm Weevil",
    scientificName: "Rhynchophorus ferrugineus",
    crops: ["date palm", "coconut palm", "canary palm", "sago palm"],
    primaryCrop: "date palm",
    damageType: {
      description: "Larvae tunnel through the trunk creating extensive damage to internal tissues, often killing the tree",
      severity: "Very High"
    },
    riskFactors: [
      "Temperatures between 25-35°C accelerate development", 
      "Humidity above 60%", 
      "Wounded palms (pruning, offshooting)",
      "Proximity to infested palms",
      "Transportation of infested offshoots"
    ],
    ipmStrategies: {
      cultural: [
        "Proper sanitation of pruning tools",
        "Removal and destruction of heavily infested palms",
        "Avoiding wounds on trunks",
        "Quarantine of palms being transported",
        "Covering cut surfaces with protective substances"
      ],
      biological: [
        "Entomopathogenic nematodes (Steinernema carpocapsae)",
        "Entomopathogenic fungi (Beauveria bassiana, Metarhizium anisopliae)",
        "Viral and bacterial pathogens"
      ],
      chemical: [
        "Trunk injection with systemic insecticides",
        "Preventive treatment of wounds and cut surfaces",
        "Soil application of systemic insecticides",
        "Fumigation of severely infested palms"
      ],
      monitoring: [
        "Pheromone traps with food bait",
        "Regular visual inspection (focusing on crown and trunk base)",
        "Acoustic detection devices",
        "Thermal imaging in large plantations",
        "Trained sniffer dogs for early detection"
      ]
    },
    climateChangeImpacts: [
      "Expansion of suitable habitat into previously cooler regions",
      "Accelerated development rates with higher temperatures",
      "Potential for more generations per year",
      "Altered synchrony with natural enemies",
      "Increased stress on host palms making them more susceptible"
    ],
    weatherThresholds: {
      temperatureOptimal: 30, // °C
      temperatureUnit: "C",
      humidityOptimal: 70, // %
      precipitationRisk: "low" // prefers moderate to high humidity, but not dependent on rainfall
    },
    image: "https://www.plantwise.org/KnowledgeBank/800x640/PMDG_98764.jpg",
    link: "http://www.fao.org/food-chain-crisis/how-we-work/plant-protection/red-palm-weevil/en/"
  },
  {
    commonName: "Dubas Bug",
    scientificName: "Ommatissus lybicus",
    crops: ["date palm"],
    primaryCrop: "date palm",
    damageType: {
      description: "Sap-sucking pest causing yellowing of leaves, honeydew secretion leading to sooty mold, and reduced fruit quality and yield",
      severity: "High"
    },
    riskFactors: [
      "Temperatures between 30-35°C optimal for development", 
      "Dry conditions with moderate humidity (40-60%)", 
      "Dense planting of palms",
      "Poor ventilation in date gardens",
      "Two generations per year (spring and fall) in most MENA countries"
    ],
    ipmStrategies: {
      cultural: [
        "Proper spacing between palms for better ventilation",
        "Balanced irrigation and fertilization",
        "Removal of dense undergrowth",
        "Pruning of excess fronds to improve air circulation"
      ],
      biological: [
        "Conservation of natural enemies (Chrysoperla carnea, Aprostocetus sp.)",
        "Introduction of parasitoids such as Pseudoligosita babylonica",
        "Application of entomopathogenic fungi"
      ],
      chemical: [
        "Foliar sprays timed to nymphal stages",
        "Systemic insecticides during severe infestations",
        "Use of insect growth regulators",
        "Area-wide management approaches"
      ],
      monitoring: [
        "Regular inspection of lower frond surfaces for nymphs",
        "Yellow sticky traps for adults",
        "Monitoring for honeydew and sooty mold",
        "Population forecasting based on previous generation density"
      ]
    },
    climateChangeImpacts: [
      "Potential for additional generations per year with warming",
      "Expansion into new geographic areas",
      "Changes in population dynamics and outbreak frequency",
      "Altered effectiveness of biological control agents"
    ],
    weatherThresholds: {
      temperatureOptimal: 33, // °C
      temperatureUnit: "C",
      humidityOptimal: 50, // %
      precipitationRisk: "low" // prefers dry conditions
    },
    image: "https://www.ecoport.org/fileadmin/ecoport/0/37500.jpg",
    link: "http://www.fao.org/3/CA1541EN/ca1541en.pdf"
  },
  {
    commonName: "Date Palm Scale",
    scientificName: "Parlatoria blanchardi",
    crops: ["date palm"],
    primaryCrop: "date palm",
    damageType: {
      description: "Sap-sucking armored scale that infests fronds, fruits, and offshoots, causing yellowing, reduced photosynthesis, and affecting fruit quality",
      severity: "Medium to High"
    },
    riskFactors: [
      "Temperatures between 25-30°C", 
      "Moderate to low humidity conditions", 
      "Poor orchard sanitation",
      "Crowded plantations with poor ventilation",
      "Transportation of infested plant material"
    ],
    ipmStrategies: {
      cultural: [
        "Regular pruning of heavily infested fronds",
        "Adequate spacing between palms",
        "Proper irrigation and fertilization",
        "Cleaning and sanitizing harvesting tools",
        "Quarantine of new plant material"
      ],
      biological: [
        "Conservation of natural predators (Chilocorus bipustulatus, Pharoscymnus spp.)",
        "Introduction of specialist predatory beetles",
        "Application of entomopathogenic fungi"
      ],
      chemical: [
        "Mineral oils during crawler emergence periods",
        "Systemic insecticides for severe infestations",
        "Rotation of insecticide chemistries to prevent resistance"
      ],
      monitoring: [
        "Regular inspection of fronds for scale presence",
        "Monitoring for crawler emergence periods",
        "Frond sampling to assess population levels",
        "Use of phenological models for timing control measures"
      ]
    },
    climateChangeImpacts: [
      "Accelerated development under higher temperatures",
      "Potential for more generations per year",
      "Changes in crawler emergence timing",
      "Reduced effectiveness of certain control measures under altered climate conditions"
    ],
    weatherThresholds: {
      temperatureOptimal: 28, // °C
      temperatureUnit: "C",
      humidityOptimal: 40, // %
      precipitationRisk: "very low" // thrives in dry conditions
    },
    image: "https://www.plantwise.org/KnowledgeBank/ResizedImages/800/PMDG_138271.jpg",
    link: "https://www.cabi.org/isc/datasheet/38874"
  },
  {
    commonName: "Spider Mites",
    scientificName: "Tetranychus spp.",
    crops: ["date palm", "various crops"],
    primaryCrop: "date palm",
    damageType: {
      description: "Fine webbing on fronds, stippling, yellowing to bronzing of tissue, reduced photosynthesis and palm vigor",
      severity: "Medium"
    },
    riskFactors: [
      "Hot, dry conditions (30-35°C)", 
      "Low humidity (<40%)", 
      "Dust accumulation on fronds",
      "Water-stressed palms",
      "Use of broad-spectrum insecticides that kill natural enemies"
    ],
    ipmStrategies: {
      cultural: [
        "Maintaining adequate irrigation to avoid water stress",
        "Dust control measures in and around date gardens",
        "Avoiding excessive nitrogen fertilization",
        "Cover crops to increase humidity and harbor predators"
      ],
      biological: [
        "Conservation of predatory mites (Phytoseiidae)",
        "Introduction of predatory mites in high-value plantations",
        "Maintaining populations of predatory insects like Stethorus beetles"
      ],
      chemical: [
        "Acaricides applied at early infestation stages",
        "Selective miticides that preserve natural enemies",
        "Horticultural oils and soaps for moderate infestations",
        "Rotation of chemicals to prevent resistance"
      ],
      monitoring: [
        "Regular inspection of fronds with hand lens",
        "Monitoring temperature and humidity to predict outbreaks",
        "Establishing treatment thresholds based on mite densities",
        "Checking for natural enemy presence before treatment decisions"
      ]
    },
    climateChangeImpacts: [
      "Increased frequency of outbreaks with hotter, drier conditions",
      "Shorter generation times leading to more rapid population growth",
      "Expanded seasonal activity period",
      "Greater economic impact due to additional control measures needed"
    ],
    weatherThresholds: {
      temperatureOptimal: 33, // °C
      temperatureUnit: "C",
      humidityOptimal: 30, // %
      precipitationRisk: "very low" // thrives in hot, dry conditions
    },
    image: "https://www.infonet-biovision.org/sites/default/files/plant_health/pests/103.jpeg",
    link: "https://www.cabi.org/isc/datasheet/53366"
  },
  {
    commonName: "Fruit Stalk Borer",
    scientificName: "Oryctes elegans",
    crops: ["date palm"],
    primaryCrop: "date palm",
    damageType: {
      description: "Adults bore into the base of fruit stalks and young fronds, causing breakage of fruit bunches and damage to crown",
      severity: "Medium to High"
    },
    riskFactors: [
      "Presence of decaying organic matter in plantations", 
      "Temperatures between 25-30°C", 
      "Poor sanitation practices",
      "Rainy season (for adult emergence)",
      "Proximity to breeding sites in decomposing palm material"
    ],
    ipmStrategies: {
      cultural: [
        "Removal and proper disposal of dead palms and organic debris",
        "Clean cultivation practices",
        "Removal of potential breeding sites",
        "Proper pruning and maintenance of palms",
        "Sanitation of plantation floor"
      ],
      biological: [
        "Application of entomopathogenic fungi (Metarhizium anisopliae)",
        "Application of Oryctes virus",
        "Introduction of predatory ground beetles",
        "Nematode applications to larval habitats"
      ],
      chemical: [
        "Targeted application to crown and fruit stalks",
        "Limited effectiveness of chemical control on adults",
        "Preventative treatments during peak adult activity",
        "Soil treatments for larval stages in breeding sites"
      ],
      monitoring: [
        "Light traps for monitoring adult populations",
        "Pheromone traps for population surveillance",
        "Regular inspection of fruit stalks during fruiting season",
        "Monitoring of potential breeding sites"
      ]
    },
    climateChangeImpacts: [
      "Changes in adult emergence patterns with shifting rainfall patterns",
      "Potential for expanded geographic range",
      "Altered breeding site availability with changing moisture conditions",
      "Changes in effectiveness of biological control agents"
    ],
    weatherThresholds: {
      temperatureOptimal: 28, // °C
      temperatureUnit: "C",
      humidityOptimal: 60, // %
      precipitationRisk: "moderate" // adult emergence often coincides with rainy periods
    },
    image: "https://www.researchgate.net/profile/Mohammed-Ellaithy/publication/281150393/figure/fig3/AS:614124233687043@1523431190773/Fruit-stalk-borer-Oryctes-elegans.png",
    link: "https://www.cabi.org/isc/datasheet/38059"
  },
  {
    commonName: "Lesser Date Moth",
    scientificName: "Batrachedra amydraula",
    crops: ["date palm"],
    primaryCrop: "date palm",
    damageType: {
      description: "Larvae feed on flowers and developing fruits, causing fruit drop and quality reduction",
      severity: "Medium to High"
    },
    riskFactors: [
      "Temperatures between 25-35°C", 
      "Moderate humidity (40-60%)", 
      "Improper bunch sanitation from previous season",
      "Early season variety susceptibility",
      "Poor orchard hygiene"
    ],
    ipmStrategies: {
      cultural: [
        "Removing and destroying fallen fruits",
        "Bunch cleaning and pruning",
        "Proper spacing of fruit bunches",
        "Early harvesting of susceptible varieties",
        "Removal of fruit remains from previous season"
      ],
      biological: [
        "Conservation of natural parasitoids",
        "Application of Bacillus thuringiensis preparations",
        "Introduction of Trichogramma parasitoids",
        "Maintaining biodiversity in date gardens"
      ],
      chemical: [
        "Timing applications to fruit set period",
        "Use of selective insecticides",
        "Bunch spraying or dusting",
        "Pheromone-based mating disruption"
      ],
      monitoring: [
        "Pheromone traps for adult monitoring",
        "Regular inspection of developing fruit clusters",
        "Monitoring temperature accumulation for timing interventions",
        "Establishing treatment thresholds based on trap catches"
      ]
    },
    climateChangeImpacts: [
      "Earlier seasonal activity with warming temperatures",
      "Potential for additional generations in extended growing seasons",
      "Changes in synchrony with fruit development",
      "Altered effectiveness of biocontrol agents"
    ],
    weatherThresholds: {
      temperatureOptimal: 30, // °C
      temperatureUnit: "C",
      humidityOptimal: 50, // %
      precipitationRisk: "low" // thrives in typical arid to semi-arid date growing regions
    },
    image: "https://www.researchgate.net/profile/Mohammed-Elshafie/publication/319199238/figure/fig2/AS:668473051373576@1536386607662/Fruits-damaged-by-the-lesser-date-moth-Batrachedra-amydraula-photo-by-M-Z-Elshafie.jpg",
    link: "https://www.cabi.org/isc/datasheet/8143"
  }
];

// Regional data and country-specific information
const menaRegions = {
  // Saudi Arabia
  "SA": {
    "Riyadh": datePalmPests,
    "AlQassim": datePalmPests,
    "AlAhsa": datePalmPests,
    "Madinah": datePalmPests
  },
  // United Arab Emirates
  "AE": {
    "Abu Dhabi": datePalmPests,
    "Al Ain": datePalmPests,
    "Dubai": datePalmPests,
    "Sharjah": datePalmPests
  },
  // Oman
  "OM": {
    "Muscat": datePalmPests,
    "Nizwa": datePalmPests,
    "Salalah": datePalmPests
  },
  // Egypt
  "EG": {
    "Aswan": datePalmPests,
    "New Valley": datePalmPests,
    "Siwa": datePalmPests
  },
  // Iraq
  "IQ": {
    "Basra": datePalmPests,
    "Baghdad": datePalmPests
  },
  // Morocco
  "MA": {
    "Marrakech": datePalmPests,
    "Errachidia": datePalmPests
  },
  // Tunisia
  "TN": {
    "Tozeur": datePalmPests,
    "Kebili": datePalmPests
  },
  // Algeria
  "DZ": {
    "Biskra": datePalmPests,
    "Adrar": datePalmPests
  }
};

export { datePalmPests, menaRegions };
export default { datePalmPests, menaRegions };