// Mock data for crop yields
export const cropYields = {
  corn: {
    title: "Corn Yield Forecast",
    current: 185.3, // bushels per acre
    previous: 176.7,
    trend: "up", // up, down, steady
    forecast: 190.2,
    history: [
      { year: 2018, yield: 171.4 },
      { year: 2019, yield: 168.3 },
      { year: 2020, yield: 172.0 },
      { year: 2021, yield: 176.7 },
      { year: 2022, yield: 173.3 },
      { year: 2023, yield: 177.8 },
      { year: 2024, yield: 185.3 },
      { year: 2025, yield: 190.2 }, // Forecast
    ],
    riskFactors: [
      { factor: "Drought", risk: "Low", impact: 2 },
      { factor: "Heat Stress", risk: "Medium", impact: 5 },
      { factor: "Excess Moisture", risk: "Low", impact: 3 },
      { factor: "Pests", risk: "Low", impact: 1 },
    ],
  },
  soybeans: {
    title: "Soybean Yield Forecast",
    current: 52.1, // bushels per acre
    previous: 50.7,
    trend: "up",
    forecast: 54.3,
    history: [
      { year: 2018, yield: 47.4 },
      { year: 2019, yield: 46.1 },
      { year: 2020, yield: 48.3 },
      { year: 2021, yield: 50.7 },
      { year: 2022, yield: 49.8 },
      { year: 2023, yield: 51.2 },
      { year: 2024, yield: 52.1 },
      { year: 2025, yield: 54.3 }, // Forecast
    ],
    riskFactors: [
      { factor: "Drought", risk: "Medium", impact: 6 },
      { factor: "Heat Stress", risk: "Medium", impact: 4 },
      { factor: "Excess Moisture", risk: "Low", impact: 2 },
      { factor: "Pests", risk: "Medium", impact: 5 },
    ],
  },
  wheat: {
    title: "Wheat Yield Forecast",
    current: 48.6, // bushels per acre
    previous: 46.3,
    trend: "up",
    forecast: 50.1,
    history: [
      { year: 2018, yield: 39.3 },
      { year: 2019, yield: 41.7 },
      { year: 2020, yield: 44.5 },
      { year: 2021, yield: 46.3 },
      { year: 2022, yield: 45.2 },
      { year: 2023, yield: 47.4 },
      { year: 2024, yield: 48.6 },
      { year: 2025, yield: 50.1 }, // Forecast
    ],
    riskFactors: [
      { factor: "Drought", risk: "High", impact: 8 },
      { factor: "Heat Stress", risk: "Medium", impact: 5 },
      { factor: "Excess Moisture", risk: "Low", impact: 3 },
      { factor: "Pests", risk: "Low", impact: 2 },
    ],
  },
  cotton: {
    title: "Cotton Yield Forecast",
    current: 942, // pounds per acre
    previous: 899,
    trend: "up",
    forecast: 965,
    history: [
      { year: 2018, yield: 864 },
      { year: 2019, yield: 823 },
      { year: 2020, yield: 847 },
      { year: 2021, yield: 899 },
      { year: 2022, yield: 867 },
      { year: 2023, yield: 912 },
      { year: 2024, yield: 942 },
      { year: 2025, yield: 965 }, // Forecast
    ],
    riskFactors: [
      { factor: "Drought", risk: "Medium", impact: 7 },
      { factor: "Heat Stress", risk: "Low", impact: 3 },
      { factor: "Excess Moisture", risk: "Medium", impact: 6 },
      { factor: "Pests", risk: "High", impact: 8 },
    ],
  },
  rice: {
    title: "Rice Yield Forecast",
    current: 7628, // pounds per acre
    previous: 7453,
    trend: "up",
    forecast: 7740,
    history: [
      { year: 2018, yield: 7107 },
      { year: 2019, yield: 7218 },
      { year: 2020, yield: 7323 },
      { year: 2021, yield: 7453 },
      { year: 2022, yield: 7502 },
      { year: 2023, yield: 7564 },
      { year: 2024, yield: 7628 },
      { year: 2025, yield: 7740 }, // Forecast
    ],
    riskFactors: [
      { factor: "Drought", risk: "High", impact: 9 },
      { factor: "Heat Stress", risk: "Medium", impact: 4 },
      { factor: "Excess Moisture", risk: "Low", impact: 2 },
      { factor: "Pests", risk: "Medium", impact: 5 },
    ],
  },
};

// Weather anomalies data for regions
export const weatherAnomalies = [
  {
    region: "Midwest",
    temperature: {
      current: 2.3, // degrees above average
      trend: "up",
      forecast: 2.7,
    },
    precipitation: {
      current: -15.6, // percent from average
      trend: "down",
      forecast: -17.2,
    },
    growingDegreeDay: {
      current: 112, // GDD units
      trend: "up",
      forecast: 124,
    },
  },
  {
    region: "Southeast",
    temperature: {
      current: 1.8,
      trend: "up",
      forecast: 2.1,
    },
    precipitation: {
      current: 12.4,
      trend: "up",
      forecast: 14.3,
    },
    growingDegreeDay: {
      current: 98,
      trend: "up",
      forecast: 107,
    },
  },
  {
    region: "Plains",
    temperature: {
      current: 3.1,
      trend: "up",
      forecast: 3.4,
    },
    precipitation: {
      current: -24.8,
      trend: "down",
      forecast: -26.5,
    },
    growingDegreeDay: {
      current: 135,
      trend: "up",
      forecast: 148,
    },
  },
  {
    region: "West",
    temperature: {
      current: 2.7,
      trend: "up",
      forecast: 3.0,
    },
    precipitation: {
      current: -32.6,
      trend: "down",
      forecast: -35.2,
    },
    growingDegreeDay: {
      current: 125,
      trend: "up",
      forecast: 142,
    },
  },
  {
    region: "Northeast",
    temperature: {
      current: 1.6,
      trend: "up",
      forecast: 1.9,
    },
    precipitation: {
      current: 7.3,
      trend: "up",
      forecast: 8.6,
    },
    growingDegreeDay: {
      current: 89,
      trend: "up",
      forecast: 95,
    },
  },
];

// Calendar of ideal planting dates with weather conditions
export const plantingCalendar = {
  corn: [
    { region: "Midwest", startDate: "2024-04-15", endDate: "2024-05-10", idealConditions: "Soil temperature above 50°F, low precipitation" },
    { region: "Southeast", startDate: "2024-03-25", endDate: "2024-04-20", idealConditions: "Soil temperature above 55°F, moderate moisture" },
    { region: "Plains", startDate: "2024-04-10", endDate: "2024-05-05", idealConditions: "Soil temperature above 50°F, low wind speeds" },
    { region: "Northeast", startDate: "2024-04-25", endDate: "2024-05-15", idealConditions: "Soil temperature above 50°F, low precipitation" },
  ],
  soybeans: [
    { region: "Midwest", startDate: "2024-05-01", endDate: "2024-06-01", idealConditions: "Soil temperature above 54°F, moderate moisture" },
    { region: "Southeast", startDate: "2024-04-15", endDate: "2024-05-15", idealConditions: "Soil temperature above 60°F, moderate precipitation" },
    { region: "Plains", startDate: "2024-05-01", endDate: "2024-05-25", idealConditions: "Soil temperature above 55°F, low wind speeds" },
    { region: "Northeast", startDate: "2024-05-10", endDate: "2024-06-05", idealConditions: "Soil temperature above 54°F, moderate moisture" },
  ],
  wheat: [
    { region: "Midwest", startDate: "2024-09-20", endDate: "2024-10-10", idealConditions: "Soil temperature below 70°F, moderate moisture" },
    { region: "Plains", startDate: "2024-09-10", endDate: "2024-10-05", idealConditions: "Soil temperature below 70°F, adequate moisture" },
    { region: "West", startDate: "2024-10-01", endDate: "2024-10-25", idealConditions: "Soil temperature below 70°F, adequate moisture" },
    { region: "Northeast", startDate: "2024-09-15", endDate: "2024-10-05", idealConditions: "Soil temperature below 70°F, low precipitation" },
  ],
};

// Mock historical climate trends
export const climateTrends = {
  temperatures: [
    { year: 2014, value: 0.7 },
    { year: 2015, value: 0.9 },
    { year: 2016, value: 1.0 },
    { year: 2017, value: 0.9 },
    { year: 2018, value: 0.8 },
    { year: 2019, value: 1.2 },
    { year: 2020, value: 1.3 },
    { year: 2021, value: 1.2 },
    { year: 2022, value: 1.5 },
    { year: 2023, value: 1.7 },
    { year: 2024, value: 2.1 },
  ],
  precipitation: [
    { year: 2014, value: 3.2 },
    { year: 2015, value: 1.7 },
    { year: 2016, value: -2.3 },
    { year: 2017, value: 5.6 },
    { year: 2018, value: 2.1 },
    { year: 2019, value: 7.3 },
    { year: 2020, value: -4.2 },
    { year: 2021, value: -5.7 },
    { year: 2022, value: -8.4 },
    { year: 2023, value: -10.2 },
    { year: 2024, value: -12.8 },
  ],
  drought: [
    { year: 2014, value: 12.3 },
    { year: 2015, value: 15.7 },
    { year: 2016, value: 10.2 },
    { year: 2017, value: 8.4 },
    { year: 2018, value: 18.3 },
    { year: 2019, value: 12.7 },
    { year: 2020, value: 21.4 },
    { year: 2021, value: 24.8 },
    { year: 2022, value: 28.9 },
    { year: 2023, value: 31.2 },
    { year: 2024, value: 34.7 },
  ],
};