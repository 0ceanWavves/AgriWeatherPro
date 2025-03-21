import { supabase } from '../lib/supabase';

// Fetch pest data from Supabase
export const fetchPestData = async (region, crop) => {
  try {
    let query = supabase.from('pests')
      .select('*')
      .eq('region', region);
    
    if (crop) {
      query = query.eq('crop', crop);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching pest data:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching pest data:', error);
    return [];
  }
};

// Fetch MENA region date palm pests
export const fetchMENAPests = async () => {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('pests')
      .select('*')
      .eq('region', 'MENA')
      .eq('crop', 'date_palm');
    
    if (error || !data || data.length === 0) {
      // Fallback to open FAO data
      const response = await fetch('https://api.planteome.org/api/search?q=pest+date+palm&type=plant');
      if (response.ok) {
        const data = await response.json();
        return formatOpenData(data);
      }
      
      // If all else fails, return hardcoded data
      return getMENAPestsHardcoded();
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching MENA pests:', error);
    return getMENAPestsHardcoded();
  }
};

// Fetch California pests
export const fetchCaliforniaPests = async (crop) => {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('pests')
      .select('*')
      .eq('region', 'California')
      .eq('crop', crop || 'almonds');
    
    if (error || !data || data.length === 0) {
      // Try UC IPM API
      try {
        const response = await fetch(`https://ipm.ucanr.edu/pmg/r3400311.html`);
        if (response.ok) {
          const htmlText = await response.text();
          return parseUCIPMData(htmlText, crop);
        }
      } catch (apiError) {
        console.error('UC IPM API error:', apiError);
      }
      
      // If all else fails, return hardcoded data
      return getCaliforniaPestsHardcoded(crop);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching California pests:', error);
    return getCaliforniaPestsHardcoded(crop);
  }
};

// Helper to format open data into our schema
function formatOpenData(data) {
  if (!data || !data.items) return getMENAPestsHardcoded();
  
  return data.items.map(item => ({
    commonName: item.label || 'Unknown Pest',
    scientificName: item.id || '',
    description: item.definition || 'No description available',
    riskLevel: 'Medium', // Default risk level
    damageType: {
      severity: 'Medium',
      description: item.definition || 'No damage description available'
    },
    // Add other required fields with default values
    weatherThresholds: {
      temperatureOptimal: 30,
      humidityOptimal: 50,
      precipitationRisk: 'medium'
    }
  }));
}

// Helper to parse UC IPM data
function parseUCIPMData(htmlText, crop) {
  // This would be a real HTML parser in production
  // For now, return hardcoded data
  return getCaliforniaPestsHardcoded(crop);
}

// Hardcoded MENA pests data as fallback
function getMENAPestsHardcoded() {
  return [
    {
      commonName: "Red Palm Weevil",
      scientificName: "Rhynchophorus ferrugineus",
      riskLevel: "High",
      description: "Major threat to date palm production throughout the Middle East and North Africa.",
      damageType: {
        severity: "High",
        description: "Larvae tunnel through the trunk and growing point, often causing palm death."
      },
      weatherThresholds: {
        temperatureOptimal: 28,
        humidityOptimal: 60,
        precipitationRisk: "low"
      }
    },
    {
      commonName: "Dubas Bug",
      scientificName: "Ommatissus lybicus",
      riskLevel: "Medium",
      description: "Major pest of date palms in the Middle East, causing significant economic losses.",
      damageType: {
        severity: "Medium",
        description: "Sap-sucking pest that causes yellowing of fronds and reduces yield."
      },
      weatherThresholds: {
        temperatureOptimal: 30,
        humidityOptimal: 55,
        precipitationRisk: "medium"
      }
    },
    {
      commonName: "Date Palm Scale",
      scientificName: "Parlatoria blanchardi",
      riskLevel: "Medium",
      description: "Scale insect that can cause significant damage to date palms across North Africa and Middle East.",
      damageType: {
        severity: "Medium",
        description: "Feeding causes yellowing and weakening of fronds."
      },
      weatherThresholds: {
        temperatureOptimal: 32,
        humidityOptimal: 50,
        precipitationRisk: "low"
      }
    }
  ];
}

// Hardcoded California pests data as fallback
function getCaliforniaPestsHardcoded(crop) {
  const pestsByCrop = {
    'almonds': [
      {
        commonName: "Navel Orangeworm",
        scientificName: "Amyelois transitella",
        riskLevel: "High",
        description: "Major pest of almonds in California.",
        damageType: {
          severity: "High",
          description: "Larvae feed on nutmeat, causing significant economic damage."
        },
        weatherThresholds: {
          temperatureOptimal: 25,
          humidityOptimal: 65,
          precipitationRisk: "low"
        }
      },
      {
        commonName: "Peach Twig Borer",
        scientificName: "Anarsia lineatella",
        riskLevel: "Medium",
        description: "Attacks new shoots and developing nuts.",
        damageType: {
          severity: "Medium",
          description: "Larvae feed on new growth and developing nuts."
        },
        weatherThresholds: {
          temperatureOptimal: 23,
          humidityOptimal: 60,
          precipitationRisk: "medium"
        }
      }
    ],
    'grapes': [
      {
        commonName: "Vine Mealybug",
        scientificName: "Planococcus ficus",
        riskLevel: "High",
        description: "Serious pest of grapes in California.",
        damageType: {
          severity: "High",
          description: "Feeds on all parts of the vine and excretes honeydew."
        },
        weatherThresholds: {
          temperatureOptimal: 27,
          humidityOptimal: 70,
          precipitationRisk: "low"
        }
      }
    ],
    'tomatoes': [
      {
        commonName: "Tomato Hornworm",
        scientificName: "Manduca quinquemaculata",
        riskLevel: "Medium",
        description: "Large caterpillar that defoliates tomato plants.",
        damageType: {
          severity: "Medium",
          description: "Consumes leaves, stems, and can damage fruit."
        },
        weatherThresholds: {
          temperatureOptimal: 26,
          humidityOptimal: 65,
          precipitationRisk: "medium"
        }
      }
    ]
  };
  
  return pestsByCrop[crop] || pestsByCrop['almonds'];
}
