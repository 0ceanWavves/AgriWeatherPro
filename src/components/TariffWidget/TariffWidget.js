import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaFileDownload, FaChartLine, FaSyncAlt } from 'react-icons/fa';
import './TariffWidget.css';

// Mock data - would be replaced with actual API data
const mockTariffData = [
  { 
    crop: 'Corn', 
    cropIcon: '🌽', 
    country: 'Korea', 
    rate: 0, 
    trend: -5, 
    expires: 'Permanent',
    insights: ['Korean corn imports increased 12% this quarter'],
    trendDirection: 'down'
  },
  { 
    crop: 'Wheat', 
    cropIcon: '🌾', 
    country: 'Colombia', 
    rate: 3.2, 
    trend: 2, 
    expires: '09/2025',
    insights: ['Colombia wheat tariff increases next month'],
    trendDirection: 'up'
  },
  { 
    crop: 'Peanuts', 
    cropIcon: '🥜', 
    country: 'Panama', 
    rate: 8.5, 
    trend: -10, 
    expires: '06/2025',
    insights: ['Favorable shipping conditions to Panama'],
    trendDirection: 'down'
  },
  { 
    crop: 'Soybeans', 
    cropIcon: '🫘', 
    country: 'Japan', 
    rate: 1.2, 
    trend: 0, 
    expires: 'Permanent',
    insights: ['Stable demand for US soybeans in Japanese market'],
    trendDirection: 'stable'
  },
  { 
    crop: 'Corn', 
    cropIcon: '🌽', 
    country: 'Canada', 
    rate: 0, 
    trend: 0, 
    expires: 'Permanent',
    insights: ['Canada increasing corn imports due to drought'],
    trendDirection: 'stable'
  },
  { 
    crop: 'Corn', 
    cropIcon: '🌽', 
    country: 'Mexico', 
    rate: 0, 
    trend: 0, 
    expires: 'Permanent',
    insights: ['Steady demand from Mexico for US corn'],
    trendDirection: 'stable'
  },
  { 
    crop: 'Corn', 
    cropIcon: '🌽', 
    country: 'Australia', 
    rate: 0, 
    trend: 0, 
    expires: 'Permanent',
    insights: ['Drought conditions in Australia increasing corn imports'],
    trendDirection: 'stable'
  },
  { 
    crop: 'Corn', 
    cropIcon: '🌽', 
    country: 'Panama', 
    rate: 2.5, 
    trend: -5, 
    expires: '06/2025',
    insights: ['Panama reducing import tariffs ahead of schedule'],
    trendDirection: 'down'
  },
];

const TariffWidget = () => {
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [sortBy, setSortBy] = useState('lowestRate');
  const [expandedView, setExpandedView] = useState(false);
  const [planningView, setPlanningView] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [availableCrops, setAvailableCrops] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set up available filters based on data
  useEffect(() => {
    // Extract unique crops and countries
    const crops = [...new Set(mockTariffData.map(item => item.crop))];
    const countries = [...new Set(mockTariffData.map(item => item.country))];
    
    setAvailableCrops(crops);
    setAvailableCountries(countries);
  }, []);

  // Filter and sort data based on selections
  useEffect(() => {
    setLoading(true);
    
    // In a real implementation, this would be an API call with the filters
    setTimeout(() => {
      let filtered = [...mockTariffData];
      
      // Apply crop filter
      if (selectedCrop !== 'All') {
        filtered = filtered.filter(item => item.crop === selectedCrop);
      }
      
      // Apply country filter
      if (selectedCountry !== 'All') {
        filtered = filtered.filter(item => item.country === selectedCountry);
      }
      
      // Apply sorting
      switch(sortBy) {
        case 'lowestRate':
          filtered.sort((a, b) => a.rate - b.rate);
          break;
        case 'highestRate':
          filtered.sort((a, b) => b.rate - a.rate);
          break;
        case 'country':
          filtered.sort((a, b) => a.country.localeCompare(b.country));
          break;
        case 'trend':
          filtered.sort((a, b) => b.trend - a.trend);
          break;
        default:
          filtered.sort((a, b) => a.rate - b.rate);
      }
      
      setFilteredData(filtered);
      setLoading(false);
    }, 500);
  }, [selectedCrop, selectedCountry, sortBy]);
  
  // Handle refreshing the data
  const handleRefresh = () => {
    setLoading(true);
    // In a real implementation, this would be an API call to get the latest data
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };
  
  // Format the trend display
  const formatTrend = (trend, direction) => {
    if (trend === 0) return '―';
    return `${direction === 'up' ? '↑' : '↓'}${Math.abs(trend)}%`;
  };
  
  // Render the main widget view
  const renderMainView = () => (
    <>
      <div className="tariff-widget-header">
        <h3>Export Tariffs</h3>
        <span className="last-updated">Last Updated: {new Date().toLocaleDateString()}</span>
      </div>
      
      <div className="tariff-widget-filters">
        <div className="filter-group">
          <label>Crop Type</label>
          <div className="select-wrapper">
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="All">All Crops</option>
              {availableCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
            <FaChevronDown className="select-icon" />
          </div>
        </div>
        
        <div className="filter-group">
          <label>Country</label>
          <div className="select-wrapper">
            <select 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="All">All Countries</option>
              {availableCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <FaChevronDown className="select-icon" />
          </div>
        </div>
      </div>
      
      <div className="tariff-widget-section-title">Current Export Opportunities</div>
      
      <div className="tariff-opportunities">
        {loading ? (
          <div className="loading-indicator">Loading tariff data...</div>
        ) : (
          filteredData.slice(0, 3).map((item, index) => (
            <div 
              key={index} 
              className={`opportunity-card ${item.trendDirection === 'down' ? 'favorable' : 
                item.trendDirection === 'up' ? 'unfavorable' : 'neutral'}`}
            >
              <div className="opportunity-header">
                <div className="crop-info">
                  <span className="crop-icon">{item.cropIcon}</span>
                  <span className="crop-name">{item.crop.toUpperCase()}</span>
                </div>
                <div className="trend-indicator">
                  {item.trend !== 0 && (
                    <>
                      {item.trend > 0 ? '+' : ''}{item.trend}%
                      <span className={`trend-arrow ${item.trendDirection}`}>
                        {item.trendDirection === 'up' ? '↑' : '↓'}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="opportunity-details">
                {item.country} FTA: {item.rate}% tariff
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="tariff-widget-section-title">Market Insights</div>
      
      <ul className="market-insights">
        {loading ? (
          <div className="loading-indicator">Loading market insights...</div>
        ) : (
          filteredData.slice(0, 3).map((item, index) => (
            <li key={index} className="insight-item">{item.insights[0]}</li>
          ))
        )}
      </ul>
      
      <div className="tariff-widget-actions">
        <button 
          className="action-button"
          onClick={() => setExpandedView(true)}
        >
          View All Tariffs
        </button>
        <button 
          className="action-button"
          onClick={() => setPlanningView(true)}
        >
          Export Planning Tool
        </button>
      </div>
    </>
  );
  
  // Render the expanded view with all tariffs
  const renderExpandedView = () => (
    <>
      <div className="tariff-widget-header expanded">
        <h3>Agricultural Export Tariffs</h3>
        <button 
          className="close-button"
          onClick={() => setExpandedView(false)}
        >
          ×
        </button>
      </div>
      
      <div className="tariff-widget-filters expanded">
        <div className="filter-group">
          <label>Crop Type</label>
          <div className="select-wrapper">
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="All">All Crops</option>
              {availableCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
            <FaChevronDown className="select-icon" />
          </div>
        </div>
        
        <div className="filter-group">
          <label>Country</label>
          <div className="select-wrapper">
            <select 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="All">All Countries</option>
              {availableCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <FaChevronDown className="select-icon" />
          </div>
        </div>
        
        <div className="filter-group">
          <label>Sort By</label>
          <div className="select-wrapper">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="lowestRate">Lowest Rate</option>
              <option value="highestRate">Highest Rate</option>
              <option value="country">Country</option>
              <option value="trend">Trend</option>
            </select>
            <FaChevronDown className="select-icon" />
          </div>
        </div>
      </div>
      
      <div className="tariff-table-container">
        <table className="tariff-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Tariff Rate</th>
              <th>Trend</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="loading-cell">Loading tariff data...</td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.country}</td>
                  <td>{item.rate}%</td>
                  <td className={item.trendDirection}>
                    {formatTrend(item.trend, item.trendDirection)}
                  </td>
                  <td>{item.expires}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="tariff-widget-section-title">Related Insights</div>
      
      <ul className="market-insights expanded">
        {filteredData.slice(0, 3).map((item, index) => (
          <li key={index} className="insight-item">{item.insights[0]}</li>
        ))}
      </ul>
      
      <div className="tariff-widget-actions expanded">
        <button className="icon-button">
          <FaFileDownload />
          <span>Export to CSV</span>
        </button>
        <button className="icon-button">
          <FaChartLine />
          <span>View Historical Trends</span>
        </button>
        <button className="icon-button" onClick={handleRefresh}>
          <FaSyncAlt className={loading ? 'spinning' : ''} />
          <span>Refresh</span>
        </button>
      </div>
    </>
  );
  
  // Render the export planning tool view
  const renderPlanningView = () => (
    <>
      <div className="tariff-widget-header expanded">
        <h3>Export Planning Tool</h3>
        <button 
          className="close-button"
          onClick={() => setPlanningView(false)}
        >
          ×
        </button>
      </div>
      
      <div className="planning-form">
        <div className="planning-form-row">
          <div className="filter-group">
            <label>Your Crop</label>
            <div className="select-wrapper">
              <select>
                {availableCrops.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
              <FaChevronDown className="select-icon" />
            </div>
          </div>
          
          <div className="filter-group">
            <label>Harvest Date</label>
            <input type="date" defaultValue="2025-09-15" />
          </div>
        </div>
      </div>
      
      <div className="tariff-widget-section-title">Recommended Export Markets</div>
      
      <div className="recommended-markets">
        <div className="market-card">
          <div className="market-rank">1️⃣</div>
          <div className="market-header">
            <h4>KOREA</h4>
            <div className="market-rating">★★★★★</div>
          </div>
          <ul className="market-benefits">
            <li>0% tariff rate</li>
            <li>High demand period (Sep-Nov)</li>
            <li>Favorable weather for shipping</li>
            <li>Est. price premium: +$0.42/bushel</li>
          </ul>
        </div>
        
        <div className="market-card">
          <div className="market-rank">2️⃣</div>
          <div className="market-header">
            <h4>CANADA</h4>
            <div className="market-rating">★★★★☆</div>
          </div>
          <ul className="market-benefits">
            <li>0% tariff rate</li>
            <li>Current supply shortage</li>
            <li>Close proximity (lower shipping costs)</li>
            <li>Est. price premium: +$0.28/bushel</li>
          </ul>
        </div>
      </div>
      
      <div className="tariff-widget-section-title">Export Documentation Required</div>
      
      <ul className="documentation-list">
        <li>Phytosanitary Certificate</li>
        <li>Certificate of Origin (for FTA benefits)</li>
        <li>Commercial Invoice</li>
      </ul>
      
      <div className="tariff-widget-actions">
        <button className="action-button">Contact Export Advisor</button>
        <button className="action-button">Download Full Report</button>
      </div>
    </>
  );

  return (
    <div className={`tariff-widget ${expandedView || planningView ? 'expanded' : ''}`}>
      {expandedView ? renderExpandedView() : 
        planningView ? renderPlanningView() : 
        renderMainView()}
    </div>
  );
};

export default TariffWidget;