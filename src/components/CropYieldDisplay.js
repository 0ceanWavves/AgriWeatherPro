import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaMinus, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { cropYields } from '../api/mockData';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cropData.riskFactors.map((risk, index) => (
            <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="mr-4">
                <div className={`w-2 h-full ${getImpactColor(risk.impact)}`} style={{ minHeight: '30px' }}></div>
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold">{risk.factor}</h4>
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
              </div>
            </div>
          ))}
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
        <p>
          Our analysis indicates that {selectedCrop} yields in your region are trending 
          {cropData.forecast > cropData.current ? ' upward, suggesting potential for above-average harvests' : ' downward, suggesting caution in production planning'}.
          Consider {cropData.riskFactors.sort((a, b) => b.impact - a.impact)[0].risk === 'High' 
            ? 'implementing specific strategies to mitigate ' + cropData.riskFactors.sort((a, b) => b.impact - a.impact)[0].factor.toLowerCase() + ' risks'
            : 'optimizing resource allocation based on these predictions'}.
        </p>
      </div>
    </div>
  );
};

export default CropYieldDisplay;