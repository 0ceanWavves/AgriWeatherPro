import React, { useState } from 'react';
import { FaChartLine, FaExclamationTriangle, FaCalendarAlt, FaCloud, FaSun, FaTint, FaWind, FaThermometerHalf } from 'react-icons/fa';
import { weatherAnomalies, climateTrends, plantingCalendar } from '../api/mockData';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardComponent = () => {
  const [selectedRegion, setSelectedRegion] = useState('Midwest');
  const [selectedCrop, setSelectedCrop] = useState('corn');
  
  // Get the regional data for selected region
  const regionData = weatherAnomalies.find(region => region.region === selectedRegion);
  
  // Filter planting calendar for selected crop and region
  const plantingData = plantingCalendar[selectedCrop]?.filter(
    entry => entry.region === selectedRegion
  )[0] || null;
  
  // Prepare chart data for climate trends
  const temperatureChartData = {
    labels: climateTrends.temperatures.map(item => item.year),
    datasets: [
      {
        label: 'Temperature Anomaly (°C)',
        data: climateTrends.temperatures.map(item => item.value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.2,
      },
    ],
  };
  
  const precipitationChartData = {
    labels: climateTrends.precipitation.map(item => item.year),
    datasets: [
      {
        label: 'Precipitation Anomaly (%)',
        data: climateTrends.precipitation.map(item => item.value),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.2,
      },
    ],
  };
  
  const droughtChartData = {
    labels: climateTrends.drought.map(item => item.year),
    datasets: [
      {
        label: 'Drought Index',
        data: climateTrends.drought.map(item => item.value),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.2,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  
  // Helper function to get trend icon
  const getTrendIcon = (trend) => {
    if (trend === 'up') return <FaChartLine className="text-red-500" />;
    if (trend === 'down') return <FaChartLine className="text-blue-500" />;
    return null;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Region and crop selector */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Location Settings</h3>
          <div className="mb-4">
            <label htmlFor="region-select" className="block mb-2">Agricultural Region:</label>
            <select 
              id="region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input-field w-full"
            >
              {weatherAnomalies.map(region => (
                <option key={region.region} value={region.region}>
                  {region.region}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="crop-select" className="block mb-2">Primary Crop:</label>
            <select 
              id="crop-select"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="input-field w-full"
            >
              <option value="corn">Corn</option>
              <option value="soybeans">Soybeans</option>
              <option value="wheat">Wheat</option>
            </select>
          </div>
        </div>
      
        {/* Weather anomalies */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">
            Weather Anomalies for {selectedRegion}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center">
                <FaThermometerHalf className="text-red-500 mr-2 text-xl" />
                <span>Temperature</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">
                  {regionData.temperature.current > 0 ? '+' : ''}
                  {regionData.temperature.current}°C
                </span>
                {getTrendIcon(regionData.temperature.trend)}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center">
                <FaTint className="text-blue-500 mr-2 text-xl" />
                <span>Precipitation</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">
                  {regionData.precipitation.current > 0 ? '+' : ''}
                  {regionData.precipitation.current}%
                </span>
                {getTrendIcon(regionData.precipitation.trend)}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center">
                <FaSun className="text-yellow-500 mr-2 text-xl" />
                <span>Growing Degree Days</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">
                  {regionData.growingDegreeDay.current > 0 ? '+' : ''}
                  {regionData.growingDegreeDay.current} units
                </span>
                {getTrendIcon(regionData.growingDegreeDay.trend)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Planting calendar */}
      {plantingData && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">
            <FaCalendarAlt className="inline-block mr-2 text-green-600" />
            Planting Calendar for {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} in {selectedRegion}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p><strong>Ideal Planting Window:</strong></p>
              <p className="text-lg">
                {new Date(plantingData.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} to {' '}
                {new Date(plantingData.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
              <div className="mt-4">
                <p><strong>Ideal Weather Conditions:</strong></p>
                <p>{plantingData.idealConditions}</p>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold flex items-center">
                <FaExclamationTriangle className="text-yellow-500 mr-2" />
                Weather Advisory
              </h4>
              <p className="mt-2">
                {regionData.temperature.current > 2 
                  ? 'Temperatures are significantly above normal. Consider adjusting planting dates accordingly.'
                  : regionData.precipitation.current < -15
                    ? 'Precipitation levels are below normal. Ensure adequate irrigation is available.'
                    : regionData.precipitation.current > 15
                      ? 'Precipitation levels are above normal. Monitor field conditions and drainage.'
                      : 'Current conditions are within seasonal norms for planting preparation.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Climate trends charts */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-6">Climate Trends Analysis</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h4 className="text-lg font-medium mb-2">Temperature Anomalies (°C)</h4>
            <div className="h-64">
              <Line data={temperatureChartData} options={chartOptions} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="text-lg font-medium mb-2">Precipitation Anomalies (%)</h4>
              <div className="h-64">
                <Line data={precipitationChartData} options={chartOptions} />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-2">Drought Index</h4>
              <div className="h-64">
                <Line data={droughtChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Insights */}
      <div className="card bg-primary/5">
        <h3 className="text-xl font-semibold mb-4">AI-Powered Agricultural Insights</h3>
        <div className="p-4 bg-white rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Climate Impact Analysis</h4>
          <p>
            Based on current climate trends, the {selectedRegion} region is experiencing
            {regionData.temperature.current > 2 ? ' significantly higher' : ' slightly higher'} temperatures and
            {regionData.precipitation.current < -15 ? ' lower than normal' : 
              regionData.precipitation.current > 15 ? ' higher than normal' : ' normal'} precipitation levels.
          </p>
          <p className="mt-2">
            For {selectedCrop} production in this region, our models suggest:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>
              {regionData.temperature.current > 2 
                ? 'Consider earlier planting to avoid heat stress during pollination'
                : 'Standard planting windows remain optimal'}
            </li>
            <li>
              {regionData.precipitation.current < -20 
                ? 'Irrigation planning should be a priority this season'
                : regionData.precipitation.current > 20
                  ? 'Ensure adequate drainage and monitor fields for excess moisture'
                  : 'Normal moisture management practices should be sufficient'}
            </li>
            <li>
              {regionData.growingDegreeDay.current > 100 
                ? 'Growing degree days are accumulating faster than normal, which may accelerate crop development'
                : 'Growing degree day accumulation is near normal'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;