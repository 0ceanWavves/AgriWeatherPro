export const cropData = {
  'Almonds': {
    stages: [
      {name: 'Initial Stage', kc: 0.4, days: 30},
      {name: 'Development', kc: '0.4-1.05', days: 35},
      {name: 'Mid-season', kc: 1.05, days: 60},
      {name: 'Late season', kc: 0.6, days: 25}
    ],
    currentKc: 1.05,
    rootZoneDepth: 90
  },
  'Grapes': {
    stages: [
      {name: 'Initial Stage', kc: 0.3, days: 20},
      {name: 'Development', kc: '0.3-0.85', days: 40},
      {name: 'Mid-season', kc: 0.85, days: 40},
      {name: 'Late season', kc: 0.45, days: 60}
    ],
    currentKc: 0.85,
    rootZoneDepth: 100
  },
  'Tomatoes': {
    stages: [
      {name: 'Initial Stage', kc: 0.6, days: 30},
      {name: 'Development', kc: '0.6-1.15', days: 40},
      {name: 'Mid-season', kc: 1.15, days: 40},
      {name: 'Late season', kc: 0.8, days: 30}
    ],
    currentKc: 1.15,
    rootZoneDepth: 70
  },
  'Lettuce': {
    stages: [
      {name: 'Initial Stage', kc: 0.7, days: 15},
      {name: 'Development', kc: '0.7-1.0', days: 25},
      {name: 'Mid-season', kc: 1.0, days: 20},
      {name: 'Late season', kc: 0.95, days: 10}
    ],
    currentKc: 1.0,
    rootZoneDepth: 30
  },
  'Strawberries': {
    stages: [
      {name: 'Initial Stage', kc: 0.4, days: 20},
      {name: 'Development', kc: '0.4-0.85', days: 30},
      {name: 'Mid-season', kc: 0.85, days: 20},
      {name: 'Late season', kc: 0.75, days: 20}
    ],
    currentKc: 0.85,
    rootZoneDepth: 40
  }
};

export const getDefaultSoilData = () => {
  return {
    soilType: 'Silt Loam',
    fieldCapacity: 28,
    wiltingPoint: 12,
    availableWater: 16,
    mad: 50,
    irrigationEfficiency: 85,
    currentEto: 4.8 // This would come from weather data in a real app
  };
};