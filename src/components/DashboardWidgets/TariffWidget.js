import React, { useState, useEffect } from 'react';
import { FaFileDownload, FaChartLine, FaSyncAlt, FaArrowUp, FaArrowDown, FaArrowRight, FaInfo } from 'react-icons/fa';
import { getTariffData } from '../../services/tariffService';

const TariffWidget = ({ location, crops = [] }) => {
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [viewMode, setViewMode] = useState('summary'); // summary, all, planning
  const [tariffData, setTariffData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [harvestDate, setHarvestDate] = useState('');
  
  // Fetch tariff data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would call the actual Trade.gov API
        const data = await getTariffData(selectedCrop, selectedCountry);
        setTariffData(data);
      } catch (error) {
        console.error("Error fetching tariff data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCrop, selectedCountry]);
  
  // For demo purposes - mock data
  const mockOpportunities = [
    {
      crop: 'CORN',
      emoji: '🌽',
      country: 'Korea',
      agreement: 'Korea FTA',
      rate: '0%',
      trend: '-5%',
      direction: 'down'
    },
    {
      crop: 'WHEAT',
      emoji: '🌾',
      country: 'Colombia',
      agreement: 'Colombia FTA',
      rate: '3.2%',
      trend: '+2%',
      direction: 'up'
    },
    {
      crop: 'PEANUTS',
      emoji: '🥜',
      country: 'Panama',
      agreement: 'Panama FTA',
      rate: '8.5%',
      trend: '-10%',
      direction: 'down'
    }
  ];
  
  const mockAllTariffs = [
    { country: 'Korea', rate: '0.0%', trend: 'stable', expires: 'Permanent' },
    { country: 'Canada', rate: '0.0%', trend: 'stable', expires: 'Permanent' },
    { country: 'Mexico', rate: '0.0%', trend: 'stable', expires: 'Permanent' },
    { country: 'Australia', rate: '0.0%', trend: 'stable', expires: 'Permanent' },
    { country: 'Panama', rate: '2.5%', trend: 'down', trendValue: '5%', expires: '06/2025' },
    { country: 'Colombia', rate: '4.8%', trend: 'down', trendValue: '2%', expires: '09/2025' },
    { country: 'Peru', rate: '5.2%', trend: 'down', trendValue: '1%', expires: '12/2025' },
    { country: 'Chile', rate: '6.5%', trend: 'up', trendValue: '2%', expires: '03/2026' }
  ];
  
  const mockExportMarkets = [
    {
      rank: 1,
      country: 'KOREA',
      rating: 5,
      tariff: '0%',
      benefits: [
        'High demand period (Sep-Nov)',
        'Favorable weather for shipping',
        'Est. price premium: +$0.42/bushel'
      ]
    },
    {
      rank: 2,
      country: 'CANADA',
      rating: 4,
      tariff: '0%',
      benefits: [
        'Current supply shortage',
        'Close proximity (lower shipping costs)',
        'Est. price premium: +$0.28/bushel'
      ]
    }
  ];
  
  const mockInsights = [
    'Korean corn imports increased 12% this quarter',
    'Colombia wheat tariff increases next month',
    'Favorable shipping conditions to Panama'
  ];
  
  const mockRequiredDocs = [
    'Phytosanitary Certificate',
    'Certificate of Origin (for FTA benefits)',
    'Commercial Invoice'
  ];
  
  // Dynamic classes for trend indicators
  const getTrendColor = (direction) => {
    switch(direction) {
      case 'up': return 'text-red-500';
      case 'down': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };
  
  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <FaArrowUp className="inline" />;
      case 'down': return <FaArrowDown className="inline" />;
      default: return <FaArrowRight className="inline" />;
    }
  };
  
  // Render summary view (default view)
  const renderSummaryView = () => (
    <>
      <div className="flex justify-between items-center mb-3">
        <div className="flex space-x-2">
          <select 
            className="text-sm border rounded p-1"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="all">All Crops</option>
            <option value="corn">Corn</option>
            <option value="wheat">Wheat</option>
            <option value="peanuts">Peanuts</option>
          </select>
          
          <select 
            className="text-sm border rounded p-1"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="all">All Countries</option>
            <option value="korea">Korea</option>
            <option value="colombia">Colombia</option>
            <option value="panama">Panama</option>
          </select>
        </div>
        <div className="text-xs text-gray-500">
          Last Updated: 03/15/2025
        </div>
      </div>
      
      <h3 className="font-bold text-sm mb-2">CURRENT EXPORT OPPORTUNITIES</h3>
      <div className="space-y-2 mb-4">
        {mockOpportunities.map((item, index) => (
          <div key={index} className="border rounded p-2 bg-white shadow-sm">
            <div className="flex justify-between">
              <div className="font-bold">
                {item.emoji} {item.crop}
              </div>
              <div className={getTrendColor(item.direction)}>
                {item.trend}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {item.agreement}: {item.rate} tariff
              <span className="ml-2">
                {item.direction === 'down' ? '↓' : '↑'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <h3 className="font-bold text-sm mb-2">MARKET INSIGHTS</h3>
      <ul className="text-xs mb-4">
        {mockInsights.map((insight, index) => (
          <li key={index} className="mb-1">• {insight}</li>
        ))}
      </ul>
      
      <div className="flex justify-between mt-2">
        <button 
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => setViewMode('all')}
        >
          View All Tariffs
        </button>
        <button 
          className="text-sm bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => setViewMode('planning')}
        >
          Export Planning Tool
        </button>
      </div>
    </>
  );
  
  // Render expanded view (all tariffs)
  const renderAllTariffs = () => (
    <>
      <div className="flex justify-between items-center mb-3">
        <div className="flex space-x-2">
          <select 
            className="text-xs border rounded p-1"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="corn">Crop: Corn</option>
            <option value="wheat">Crop: Wheat</option>
            <option value="peanuts">Crop: Peanuts</option>
          </select>
          
          <select 
            className="text-xs border rounded p-1"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="all">Country: All</option>
            <option value="korea">Country: Korea</option>
            <option value="colombia">Country: Colombia</option>
          </select>
          
          <select className="text-xs border rounded p-1">
            <option>Sort: Lowest Rate</option>
            <option>Sort: Country</option>
            <option>Sort: Expiry</option>
          </select>
        </div>
        
        <button 
          className="text-xs text-blue-600"
          onClick={() => setViewMode('summary')}
        >
          Back
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left p-1">COUNTRY</th>
              <th className="text-left p-1">TARIFF RATE</th>
              <th className="text-left p-1">TREND</th>
              <th className="text-left p-1">EXPIRES</th>
            </tr>
          </thead>
          <tbody>
            {mockAllTariffs.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="p-1">{item.country}</td>
                <td className="p-1">{item.rate}</td>
                <td className="p-1">
                  <span className={getTrendColor(item.trend)}>
                    {item.trend === 'stable' ? '―' : (
                      item.trend === 'down' ? `↓${item.trendValue}` : `↑${item.trendValue}`
                    )}
                  </span>
                </td>
                <td className="p-1">{item.expires}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <h3 className="font-bold text-xs mt-4 mb-1">RELATED INSIGHTS</h3>
      <ul className="text-xs mb-3">
        <li>• Weather conditions in Korea favorable for corn imports</li>
        <li>• Canada increasing corn imports due to drought</li>
        <li>• Colombian peso strengthening against USD (favorable)</li>
      </ul>
      
      <div className="flex justify-between mt-2 text-xs">
        <button className="flex items-center text-gray-700">
          <FaFileDownload className="mr-1" /> Export to CSV
        </button>
        <button className="flex items-center text-gray-700">
          <FaChartLine className="mr-1" /> View Trends
        </button>
        <button className="flex items-center text-gray-700">
          <FaSyncAlt className="mr-1" /> Refresh
        </button>
      </div>
    </>
  );
  
  // Render planning tool view
  const renderPlanningTool = () => (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="font-bold text-sm">EXPORT PLANNING TOOL</h3>
        <button 
          className="text-xs text-blue-600"
          onClick={() => setViewMode('summary')}
        >
          Back
        </button>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <select 
          className="text-xs border rounded p-1 flex-1"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          <option value="corn">Corn</option>
          <option value="wheat">Wheat</option>
          <option value="peanuts">Peanuts</option>
        </select>
        
        <input
          type="date"
          className="text-xs border rounded p-1 flex-1"
          value={harvestDate}
          onChange={(e) => setHarvestDate(e.target.value)}
          placeholder="Harvest Date"
        />
      </div>
      
      <h3 className="font-bold text-xs mb-2">RECOMMENDED EXPORT MARKETS</h3>
      <div className="space-y-3 mb-4">
        {mockExportMarkets.map((market, index) => (
          <div key={index} className="border rounded p-2 bg-white shadow-sm">
            <div className="flex justify-between">
              <div className="font-bold">
                {market.rank === 1 ? '1️⃣' : '2️⃣'} {market.country}
              </div>
              <div>
                {'★'.repeat(market.rating) + '☆'.repeat(5 - market.rating)}
              </div>
            </div>
            <div className="text-xs mt-1">• {market.tariff} tariff rate</div>
            {market.benefits.map((benefit, i) => (
              <div key={i} className="text-xs">• {benefit}</div>
            ))}
          </div>
        ))}
      </div>
      
      <h3 className="font-bold text-xs mb-2">EXPORT DOCUMENTATION REQUIRED</h3>
      <ul className="text-xs mb-4">
        {mockRequiredDocs.map((doc, index) => (
          <li key={index} className="mb-1">• {doc}</li>
        ))}
      </ul>
      
      <div className="flex justify-between mt-2">
        <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded flex items-center">
          <FaInfo className="mr-1" /> Contact Export Advisor
        </button>
        <button className="text-xs bg-green-600 text-white px-2 py-1 rounded flex items-center">
          <FaFileDownload className="mr-1" /> Download Report
        </button>
      </div>
    </>
  );
  
  // Main render method
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">EXPORT TARIFFS</h2>
        {viewMode !== 'summary' && (
          <button 
            className="text-xs text-blue-600"
            onClick={() => setViewMode('summary')}
          >
            Back to Summary
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <>
          {viewMode === 'summary' && renderSummaryView()}
          {viewMode === 'all' && renderAllTariffs()}
          {viewMode === 'planning' && renderPlanningTool()}
        </>
      )}
    </div>
  );
};

export default TariffWidget;