import React from 'react';
import { Link } from 'react-router-dom';

const RegionalPestAlert = ({ pest }) => {
  // Special handling for regional database links
  if (pest.isSpecialEntry) {
    const databaseType = pest.isRegionalDatabase || "custom";
    
    // Colors based on region
    const colors = {
      california: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        heading: "text-blue-800",
        button: "bg-blue-600 hover:bg-blue-700"
      },
      mena: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        heading: "text-amber-800",
        button: "bg-amber-600 hover:bg-amber-700"
      },
      custom: {
        bg: "bg-green-50",
        border: "border-green-200",
        heading: "text-green-800",
        button: "bg-green-600 hover:bg-green-700"
      }
    };
    
    const color = colors[databaseType];
    const linkPath = databaseType === "california" ? "/services/california-pests" :
                    databaseType === "mena" ? "/services/mena-pests" : "#";
    
    return (
      <div className={`${color.bg} rounded-lg p-5 ${color.border} shadow-sm mb-4`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/4">
            <div className="flex justify-between items-start">
              <h3 className={`text-lg font-bold ${color.heading}`}>{pest.name}</h3>
            </div>
            <p className="text-sm italic text-gray-600 mt-1">{pest.scientificName}</p>
            <p className="mt-3 text-sm text-gray-700">{pest.description}</p>
            <div className="mt-4">
              <Link 
                to={linkPath}
                className={`inline-block px-4 py-2 ${color.button} text-white rounded-md text-sm font-medium transition-colors`}
              >
                View {databaseType === "california" ? "California" : 
                     databaseType === "mena" ? "MENA Date Palm" : "Regional"} Pest Database
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal pest display
  return (
    <div className="bg-white rounded-lg p-5 border border-yellow-200 shadow-sm mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className={pest.image ? "md:w-1/4" : "hidden"}>
          {pest.image && (
            <img 
              src={pest.image} 
              alt={pest.name} 
              className="w-full h-auto rounded-lg object-cover"
              onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x300?text=Pest+Image"}}
            />
          )}
        </div>
        <div className={pest.image ? "md:w-3/4" : "w-full"}>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-yellow-800">{pest.name}</h3>
            {pest.severity && (
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                pest.severity === 'High' ? 'bg-red-100 text-red-800' : 
                pest.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {pest.severity} Risk
              </span>
            )}
          </div>
          
          <p className="text-sm italic text-gray-600 mt-1">{pest.scientificName}</p>
          
          {pest.description && <p className="mt-3 text-sm text-gray-700">{pest.description}</p>}
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {pest.symptoms && (
              <div>
                <h4 className="font-semibold text-yellow-700 text-sm">Key Symptoms</h4>
                <p className="mt-1 text-sm text-gray-600">{pest.symptoms}</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-green-700 text-sm">Management</h4>
              <p className="mt-1 text-sm text-gray-600">{pest.management}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalPestAlert;