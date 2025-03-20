export const calculateIrrigationRequirements = (cropType, growthStage, efficiency, forecast) => {
  // Crop coefficient data
  const cropCoefficients = {
    'Almonds': {initial: 0.4, mid: 1.05, late: 0.65},
    'Grapes': {initial: 0.3, mid: 0.85, late: 0.45},
    'Tomatoes': {initial: 0.6, mid: 1.15, late: 0.8},
    'Lettuce': {initial: 0.7, mid: 1.0, late: 0.95},
    'Strawberries': {initial: 0.4, mid: 0.85, late: 0.75}
  };
  
  // Get the appropriate crop coefficient (Kc)
  const stage = growthStage.includes('Mid') ? 'mid' : 
               growthStage.includes('Initial') ? 'initial' : 'late';
  const kc = cropCoefficients[cropType]?.[stage] || 1.0;
  
  // Calculate irrigation requirements
  return forecast.map((day, index) => {
    const etc = parseFloat((day.eto * kc).toFixed(1));
    const netIrrigation = Math.max(0, etc - day.rain);
    let grossIrrigation = parseFloat((netIrrigation / (efficiency / 100)).toFixed(1));
    
    // Irrigation logic - simple schedule where irrigation happens every 3 days
    // In a real system, this would use soil moisture depletion calculations
    if (index % 3 !== 0) {
      grossIrrigation = 0;
    }
    
    return {
      date: index === 0 ? `${day.date} (Today)` : day.date,
      etc: etc,
      rain: day.rain,
      irrigation: grossIrrigation,
      status: index === 0 && grossIrrigation > 0 ? 'Irrigate Today' : 
              grossIrrigation > 0 ? 'Scheduled' : 'No Irrigation'
    };
  });
};

export const getSampleWeatherForecast = () => {
  // Mock weather forecast data
  return [
    {date: 'Mar 20', eto: 4.5, rain: 0.0},
    {date: 'Mar 21', eto: 4.3, rain: 0.0},
    {date: 'Mar 22', eto: 4.6, rain: 2.3},
    {date: 'Mar 23', eto: 5.0, rain: 0.0},
    {date: 'Mar 24', eto: 4.7, rain: 0.0},
    {date: 'Mar 25', eto: 4.6, rain: 0.0},
    {date: 'Mar 26', eto: 4.8, rain: 0.0}
  ];
};

export const getMockAnalyticsData = (timeframe) => {
  // Mock data based on timeframe
  const mockData = {
    'Last 30 Days': {
      totalIrrigation: 125.3,
      totalRainfall: 20.5,
      efficiency: 85,
      appliedWater: 125.3,
      cropWaterNeed: 106.5,
      percolationLoss: 18.8,
      currentUsage: 1230,
      optimizedUsage: 1045,
      potentialSavings: 185,
      savingsPercent: 15,
      irrigationHistory: [
        {date: 'Mar 16', applied: 6.2, recommended: 5.5, efficiency: 89, status: 'Slight Over-irrigation'},
        {date: 'Mar 13', applied: 5.8, recommended: 5.9, efficiency: 98, status: 'Optimal'},
        {date: 'Mar 10', applied: 7.0, recommended: 5.4, efficiency: 77, status: 'Over-irrigation'},
        {date: 'Mar 7', applied: 5.5, recommended: 5.7, efficiency: 96, status: 'Optimal'}
      ]
    },
    'Last 60 Days': {
      totalIrrigation: 220.8,
      totalRainfall: 45.2,
      efficiency: 82,
      appliedWater: 220.8,
      cropWaterNeed: 181.1,
      percolationLoss: 39.7,
      currentUsage: 2180,
      optimizedUsage: 1788,
      potentialSavings: 392,
      savingsPercent: 18,
      irrigationHistory: [
        {date: 'Mar 16', applied: 6.2, recommended: 5.5, efficiency: 89, status: 'Slight Over-irrigation'},
        {date: 'Mar 13', applied: 5.8, recommended: 5.9, efficiency: 98, status: 'Optimal'},
        {date: 'Mar 10', applied: 7.0, recommended: 5.4, efficiency: 77, status: 'Over-irrigation'},
        {date: 'Mar 7', applied: 5.5, recommended: 5.7, efficiency: 96, status: 'Optimal'},
        {date: 'Feb 22', applied: 6.4, recommended: 5.8, efficiency: 91, status: 'Slight Over-irrigation'},
        {date: 'Feb 15', applied: 5.2, recommended: 5.2, efficiency: 100, status: 'Optimal'}
      ]
    },
    'Last 90 Days': {
      totalIrrigation: 315.4,
      totalRainfall: 72.8,
      efficiency: 80,
      appliedWater: 315.4,
      cropWaterNeed: 252.3,
      percolationLoss: 63.1,
      currentUsage: 3150,
      optimizedUsage: 2520,
      potentialSavings: 630,
      savingsPercent: 20,
      irrigationHistory: [
        {date: 'Mar 16', applied: 6.2, recommended: 5.5, efficiency: 89, status: 'Slight Over-irrigation'},
        {date: 'Mar 13', applied: 5.8, recommended: 5.9, efficiency: 98, status: 'Optimal'},
        {date: 'Mar 10', applied: 7.0, recommended: 5.4, efficiency: 77, status: 'Over-irrigation'},
        {date: 'Mar 7', applied: 5.5, recommended: 5.7, efficiency: 96, status: 'Optimal'},
        {date: 'Feb 22', applied: 6.4, recommended: 5.8, efficiency: 91, status: 'Slight Over-irrigation'},
        {date: 'Feb 15', applied: 5.2, recommended: 5.2, efficiency: 100, status: 'Optimal'},
        {date: 'Jan 30', applied: 7.5, recommended: 5.6, efficiency: 75, status: 'Over-irrigation'},
        {date: 'Jan 23', applied: 6.8, recommended: 5.9, efficiency: 87, status: 'Slight Over-irrigation'}
      ]
    }
  };
  
  return mockData[timeframe] || mockData['Last 30 Days'];
};