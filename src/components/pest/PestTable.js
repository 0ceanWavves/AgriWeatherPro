import React from 'react';

const PestTable = ({ filteredPestRisks, pestRisks, location, selectedCrop, riskFactorFilter }) => {
  return (
    <div className="mt-4 md:mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-3 md:p-4 border-b border-gray-200 flex-wrap">
        <h2 className="text-lg md:text-xl font-semibold text-green-800">
          Pest Risk Assessment for {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}
        </h2>
        <div className="text-xs md:text-sm text-gray-500 mt-1 md:mt-0">
          <span className="font-medium">{location.name}, {location.country}</span> | 
          Showing {filteredPestRisks.length} of {pestRisks.length} pests
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                Pest
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                Risk Factors
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                Management
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPestRisks.length > 0 ? (
              filteredPestRisks.map((pest, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div className="text-xs md:text-sm font-medium text-gray-900">{pest.name}</div>
                    <div className="text-xs text-gray-500 italic">{pest.scientificName}</div>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pest.riskLevel === 'High' ? 'bg-red-100 text-red-800' : 
                      pest.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {pest.riskLevel}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      {pest.riskFactors.map((factor, i) => (
                        <li key={i} className={riskFactorFilter !== 'all' && factor.toLowerCase().includes(riskFactorFilter.toLowerCase()) 
                          ? 'font-semibold text-green-700' 
                          : ''
                        }>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-500">
                    {pest.management.split(', ').map((item, i) => (
                      <div key={i} className="mb-1">• {item}</div>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-3 md:px-6 py-3 md:py-4 text-center text-sm text-gray-500">
                  No pests match your current filters. Try adjusting your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PestTable;