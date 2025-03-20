import React from 'react';

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
  return (
    <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200 mb-4">
      <h2 className="text-base md:text-lg font-semibold text-green-800 mb-2 md:mb-3">Filter Options</h2>
      
      <div className="space-y-3 md:space-y-4">
        {/* Pest Filter */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-green-700 mb-1">Pest Type</label>
          <select 
            className="w-full p-2 border border-green-300 rounded-md text-xs md:text-sm"
            value={pestFilter}
            onChange={(e) => setPestFilter(e.target.value)}
          >
            <option value="all">All Pests</option>
            {cropPests[selectedCrop]?.map(pest => (
              <option key={pest.name} value={pest.name}>
                {pest.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Risk Level Filter */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-green-700 mb-1">Risk Level</label>
          <select 
            className="w-full p-2 border border-green-300 rounded-md text-xs md:text-sm"
            value={riskLevelFilter}
            onChange={(e) => setRiskLevelFilter(e.target.value)}
          >
            <option value="all">All Risk Levels</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        
        {/* Risk Factor Filter */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-green-700 mb-1">Risk Factor</label>
          <select 
            className="w-full p-2 border border-green-300 rounded-md text-xs md:text-sm"
            value={riskFactorFilter}
            onChange={(e) => setRiskFactorFilter(e.target.value)}
          >
            <option value="all">All Risk Factors</option>
            {riskFactors.map(factor => (
              <option key={factor} value={factor}>
                {factor}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PestFilter;