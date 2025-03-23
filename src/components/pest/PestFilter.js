import React from 'react';

/**
 * Component for filtering pest risks by various criteria
 */
const PestFilter = ({ 
  pestFilter, 
  riskLevelFilter, 
  riskFactorFilter,
  setPestFilter,
  setRiskLevelFilter,
  setRiskFactorFilter,
  cropPests,
  selectedCrop,
  riskFactors
}) => {
  // Get unique pest names for the selected crop
  const pestOptions = cropPests[selectedCrop]
    ? [...new Set(cropPests[selectedCrop].map(pest => pest.name))]
    : [];
  
  return (
    <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200 mb-4">
      <h2 className="text-lg font-semibold text-green-800 mb-3">Filter Options</h2>
      
      {/* Risk Level Filter */}
      <div className="mb-3">
        <label htmlFor="risk-level-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Risk Level
        </label>
        <select
          id="risk-level-filter"
          className="w-full p-2 border border-gray-300 rounded-md text-gray-700 bg-white"
          value={riskLevelFilter}
          onChange={(e) => setRiskLevelFilter(e.target.value)}
        >
          <option value="all">All Risk Levels</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>
      </div>
      
      {/* Pest Filter */}
      <div className="mb-3">
        <label htmlFor="pest-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Pest Type
        </label>
        <select
          id="pest-filter"
          className="w-full p-2 border border-gray-300 rounded-md text-gray-700 bg-white"
          value={pestFilter}
          onChange={(e) => setPestFilter(e.target.value)}
        >
          <option value="all">All Pests</option>
          {pestOptions.map(pest => (
            <option key={pest} value={pest}>
              {pest}
            </option>
          ))}
        </select>
      </div>
      
      {/* Risk Factor Filter */}
      <div className="mb-1">
        <label htmlFor="risk-factor-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Risk Factor
        </label>
        <select
          id="risk-factor-filter"
          className="w-full p-2 border border-gray-300 rounded-md text-gray-700 bg-white"
          value={riskFactorFilter}
          onChange={(e) => setRiskFactorFilter(e.target.value)}
        >
          <option value="all">All Risk Factors</option>
          {riskFactors.map(factor => (
            <option key={factor} value={factor.toLowerCase()}>
              {factor}
            </option>
          ))}
        </select>
      </div>
      
      {/* Reset Filters Button */}
      <button
        className="w-full mt-3 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
        onClick={() => {
          setPestFilter('all');
          setRiskLevelFilter('all');
          setRiskFactorFilter('all');
        }}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default PestFilter;