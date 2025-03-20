import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaMinus, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { cropYields } from '../api/mockData';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CropYieldDisplay = () => {
  const [selectedCrop, setSelectedCrop] = useState('corn');
  const cropData = cropYields[selectedCrop];
  
  // Chart data preparation
  const chartData = {
    labels: cropData.history.map(item => item.year),
    datasets: [
      {
        label: 'Yield',
        data: cropData.history.map(item => item.yield),
        borderColor: 'rgb(60, 165, 92)',
        backgroundColor: 'rgba(60, 165, 92, 0.5)',
        tension: 0.2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += selectedCrop === 'cotton' || selectedCrop === 'rice' 
                ? `${context.parsed.y} lbs/acre`
                : `${context.parsed.y} bu/acre`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return selectedCrop === 'cotton' || selectedCrop === 'rice' 
              ? `${value} lbs`
              : `${value} bu`;
          }
        }
      }
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend) => {
    if (trend === 'up') return <FaArrowUp className="text-green-500" />;
    if (trend === 'down') return <FaArrowDown className="text-red-500" />;
    return <FaMinus className="text-gray-500" />;
  };
  
  // Get impact level color class
  const getImpactColor = (impact) => {
    if (impact >= 7) return 'bg-red-500';
    if (impact >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Generate explanation text based on crop data
  const getCurrentYieldExplanation = () => {
    const percentChange = ((cropData.current - cropData.previous) / cropData.previous * 100).toFixed(1);
    const changeDirection = cropData.trend === 'up' ? 'increase' : 'decrease';
    
    let factorsText = '';
    if (cropData.trend === 'up') {
      factorsText = 'Favorable weather conditions, improved seed varieties, and effective pest management have contributed to this yield.';
    } else {
      factorsText = 'Challenging weather patterns, pest pressure, and resource limitations have impacted this yield.';
    }
    
    return `The current yield represents a ${percentChange}% ${changeDirection} from the previous year. ${factorsText}`;
  };
  
  const getForecastYieldExplanation = () => {
    const percentChange = ((cropData.forecast - cropData.current) / cropData.current * 100).toFixed(1);
    const mainRiskFactor = cropData.riskFactors.sort((a, b) => b.impact - a.impact)[0].factor.toLowerCase();
    
    return `This forecast is based on current weather patterns, soil conditions, and historical trends. 
             Our AI models predict a ${percentChange}% increase from current yields, with ${mainRiskFactor} 
             being the primary factor that could impact final results.`;
  };

  return (
    <div className="card max-w-5xl mx-auto">
      <h2 className="text-2xl font-heading font-bold mb-6">{cropData.title}</h2>
      
      {/* Crop selector */}
      <div className="mb-6">
        <label htmlFor="crop-select" className="block mb-2">Select Crop:</label>
        <select 
          id="crop-select"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="input-field w-full md:w-64"
        >
          <option value="corn">Corn</option>
          <option value="soybeans">Soybeans</option>
          <option value="wheat">Wheat</option>
          <option value="cotton">Cotton</option>
          <option value="rice">Rice</option>
        </select>
      </div>
      
      {/* Current yields info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-primary/10 p-5 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Current Yield</h3>
          <div className="flex items-center mb-3">
            <span className="text-3xl font-bold">
              {cropData.current} 
              <span className="text-sm font-normal ml-1">
                {selectedCrop === 'cotton' || selectedCrop === 'rice' ? 'lbs/acre' : 'bu/acre'}
              </span>
            </span>
            <span className="ml-2">
              {getTrendIcon(cropData.trend)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {cropData.trend === 'up' 
              ? `Up ${((cropData.current - cropData.previous) / cropData.previous * 100).toFixed(1)}% from previous year`
              : cropData.trend === 'down'
                ? `Down ${((cropData.previous - cropData.current) / cropData.previous * 100).toFixed(1)}% from previous year`
                : 'No change from previous year'
            }
          </p>
          <div className="text-sm text-gray-700 mt-3 pt-3 border-t border-gray-200">
            <FaInfoCircle className="inline-block mr-1 text-primary" />
            {getCurrentYieldExplanation()}
          </div>
        </div>
        
        <div className="bg-primary/10 p-5 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Forecast Yield</h3>
          <div className="flex items-center mb-3">
            <span className="text-3xl font-bold">
              {cropData.forecast}
              <span className="text-sm font-normal ml-1">
                {selectedCrop === 'cotton' || selectedCrop === 'rice' ? 'lbs/acre' : 'bu/acre'}
              </span>
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Expected {((cropData.forecast - cropData.current) / cropData.current * 100).toFixed(1)}% {cropData.forecast > cropData.current ? 'increase' : 'decrease'} from current
          </p>
          <div className="text-sm text-gray-700 mt-3 pt-3 border-t border-gray-200">
            <FaInfoCircle className="inline-block mr-1 text-primary" />
            {getForecastYieldExplanation()}
          </div>
        </div>
        
        <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold mb-2">Weather Influence</h3>
          <p className="text-sm mb-3">
            Current weather conditions are {cropData.trend === 'up' ? 'favorable' : 'challenging'} for {selectedCrop} production.
          </p>
          <div className="mt-3">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-yellow-500 mr-2" />
              <span className="font-semibold">Primary risk factor:</span>
            </div>
            <p className="mt-1">
              {cropData.riskFactors.sort((a, b) => b.impact - a.impact)[0].factor} 
              (Risk: {cropData.riskFactors.sort((a, b) => b.impact - a.impact)[0].risk})
            </p>
          </div>
          <div className="text-sm text-gray-700 mt-3 pt-3 border-t border-gray-200">
            <FaInfoCircle className="inline-block mr-1 text-primary" />
            Monitoring weather forecasts regularly is recommended to adapt management practices as needed.
          </div>
        </div>
      </div>
      
      {/* Yield history chart */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Historical Yield Trends</h3>
        <div className="h-96 w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* Risk factors */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Risk Assessment</h3>
        <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <FaInfoCircle className="text-primary" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-semibold">Data source:</span> Risk assessments are calculated using data from NOAA weather services, USDA historical records, and our proprietary AI models that analyze 10+ years of crop performance metrics. Updated daily.
              </p>
              <p className="text-sm mt-2">
                <span className="font-semibold">Methodology:</span> Our machine learning algorithms calculate risk by combining current weather conditions, climate forecasts, historical patterns, and crop-specific vulnerability factors.
              </p>
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs">
            <span className="flex items-center mr-4">
              <span className="inline-block w-3 h-3 bg-red-500 mr-1 rounded-sm"></span>
              High risk (7-10)
            </span>
            <span className="flex items-center mr-4">
              <span className="inline-block w-3 h-3 bg-yellow-500 mr-1 rounded-sm"></span>
              Medium risk (4-6)
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 mr-1 rounded-sm"></span>
              Low risk (1-3)
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cropData.riskFactors.map((risk, index) => (
            <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="mr-4">
                <div className={`w-2 h-full ${getImpactColor(risk.impact)}`} style={{ minHeight: '30px' }}></div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{risk.factor}</h4>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Last updated: Today</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm">Risk Level: {risk.risk}</span>
                  <span className="text-sm">Impact: {risk.impact}/10</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {risk.risk === 'High' 
                    ? `This factor needs immediate attention and mitigation strategies.` 
                    : risk.risk === 'Medium'
                      ? `Monitor this factor regularly and be prepared to adjust practices.`
                      : `Minor impact expected, but should still be monitored.`
                  }
                </p>
                <div className="mt-2 text-xs bg-primary/5 p-2 rounded flex items-center">
                  <FaInfoCircle className="text-primary mr-1" />
                  <span>See <Link to="/dashboard" className="text-primary underline">historical data</Link> for this risk factor's trends over time</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-500 border-t border-gray-200 pt-3">
          <span>Data refreshed daily at 6:00 AM local time</span>
          <Link to="/methodology" className="text-primary flex items-center">
            <span>Learn more about our risk assessment methodology</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" clipRule="evenodd" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </Link>
        </div>
      </div>
      
      <div className="mt-8 p-5 bg-primary/10 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Agricultural Intelligence Insights</h3>
        <p className="mb-3">
          Based on current weather patterns and historical yield data, our AI model predicts 
          {cropData.trend === 'up' ? ' favorable ' : ' challenging '} 
          conditions for {selectedCrop} production this year. Farmers should monitor 
          {cropData.riskFactors.sort((a, b) => b.impact - a.impact)[0].risk === 'High' 
            ? ` ${cropData.riskFactors.sort((a, b) => b.impact - a.impact)[0].factor.toLowerCase()} conditions closely`
            : ' weather conditions'} 
          and adjust management practices accordingly.
        </p>
        <p className="mb-4">
          Our analysis indicates that {selectedCrop} yields in your region are trending 
          {cropData.trend === 'up' ? ' upward' : ' downward'}. Consider implementing specific strategies to 
          {cropData.trend === 'up' ? ' maximize potential yields' : ' mitigate yield losses'}.
        </p>
        <div className="bg-white p-4 rounded-lg border border-primary/20 mt-4">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            <h4 className="font-medium text-primary">Dashboard Connection</h4>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            <span className="font-medium">Want to dive deeper?</span> Visit the Dashboard for granular, real-time data analysis that powers these predictions. The interactive weather map, historical trends, and sensor data visualizations will help you understand exactly why these yield forecasts are occurring.
          </p>
          <div className="border-l-4 border-primary/30 pl-3 mb-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Example:</strong> For {selectedCrop}, our Dashboard shows that {
              cropData.riskFactors.sort((a, b) => b.impact - a.impact)[0].risk === 'High'
                ? `${cropData.riskFactors.sort((a, b) => b.impact - a.impact)[0].factor.toLowerCase()} conditions are currently a high-risk factor`
                : cropData.trend === 'up'
                  ? 'favorable temperature and precipitation patterns are contributing to potential yield increases'
                  : 'challenging environmental factors are impacting growth conditions'
            }. Access the Dashboard to monitor these conditions in real-time.
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2 mb-3 md:mb-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Weather Maps
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Soil Moisture Data
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Temperature Trends
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Precipitation History
              </span>
            </div>
            <Link to="/dashboard" className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
              <span>Go to Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropYieldDisplay;