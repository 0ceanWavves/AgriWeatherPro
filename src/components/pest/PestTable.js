import React, { useState } from 'react';

/**
 * Component for displaying pest risks in a table format
 */
const PestTable = ({ filteredPestRisks, pestRisks, location, selectedCrop, riskFactorFilter }) => {
  const [expandedPest, setExpandedPest] = useState(null);
  
  // Toggle pest details expansion
  const toggleDetails = (index) => {
    if (expandedPest === index) {
      setExpandedPest(null);
    } else {
      setExpandedPest(index);
    }
  };
  
  // No pest risks to display
  if (filteredPestRisks.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 mb-4 text-center border border-gray-200">
        <div className="bg-green-50 inline-flex rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">No Pest Risks Found</h3>
        {riskFactorFilter !== 'all' ? (
          <p className="mt-2 text-sm text-gray-500">
            No pests match your current filter criteria. Try adjusting your filters.
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Great news! No significant pest risks are currently forecast for {selectedCrop} in {location.name}.
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
      <div className="p-3 md:p-4 border-b border-gray-200 bg-green-50">
        <div className="flex justify-between items-center">
          <h3 className="text-green-800 font-medium">Pest Risk Analysis</h3>
          <div className="text-xs text-gray-500">
            Showing {filteredPestRisks.length} of {pestRisks.length} pests
          </div>
        </div>
      </div>
      
      {/* Table Header */}
      <div className="bg-gray-50 text-gray-700 text-xs md:text-sm font-medium grid grid-cols-10 border-b border-gray-200">
        <div className="col-span-4 p-3">Pest Name</div>
        <div className="col-span-2 p-3">Risk Level</div>
        <div className="col-span-4 p-3">Primary Risk Factors</div>
      </div>
      
      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {filteredPestRisks.map((pest, index) => (
          <div key={index} className="text-sm hover:bg-gray-50">
            {/* Main row */}
            <div 
              className="grid grid-cols-10 cursor-pointer"
              onClick={() => toggleDetails(index)}
            >
              <div className="col-span-4 p-3 font-medium">
                {pest.name}
                <div className="text-xs text-gray-500 mt-0.5 italic">
                  {pest.scientificName}
                </div>
              </div>
              <div className="col-span-2 p-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pest.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                  pest.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {pest.riskLevel}
                </span>
              </div>
              <div className="col-span-4 p-3 text-xs text-gray-600">
                {pest.riskFactors && pest.riskFactors.slice(0, 2).join(", ")}
                {pest.riskFactors && pest.riskFactors.length > 2 && "..."}
              </div>
            </div>
            
            {/* Expanded details */}
            {expandedPest === index && (
              <div className="p-3 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Risk Factors</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {pest.riskFactors && pest.riskFactors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Management Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {pest.management && pest.management.split(',').map((item, idx) => (
                      <li key={idx}>{item.trim()}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                  <p>{pest.description || "No detailed description available for this pest."}</p>
                </div>
                
                <div className="md:col-span-2 mt-1 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://extension.org/search?q=${encodeURIComponent(pest.name + ' pest management ' + selectedCrop)}`, '_blank');
                    }}
                  >
                    Research more about this pest →
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PestTable;