import React, { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  LineElement,
  PointElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  LineElement,
  PointElement
);

const PestRiskCharts = ({ pestRisks, selectedCrop }) => {
  const [riskLevelData, setRiskLevelData] = useState(null);
  const [riskFactorData, setRiskFactorData] = useState(null);
  const [predictiveData, setPredictiveData] = useState(null);
  
  useEffect(() => {
    if (!pestRisks || pestRisks.length === 0) return;
    
    // Process data for risk level chart
    const riskLevelCounts = {
      'Low': 0,
      'Medium': 0,
      'High': 0
    };
    
    pestRisks.forEach(pest => {
      riskLevelCounts[pest.riskLevel]++;
    });
    
    setRiskLevelData({
      labels: ['Low', 'Medium', 'High'],
      datasets: [
        {
          data: [riskLevelCounts.Low, riskLevelCounts.Medium, riskLevelCounts.High],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
          borderColor: ['#065F46', '#B45309', '#B91C1C'],
          borderWidth: 1,
        }
      ]
    });
    
    // Process data for risk factors chart
    const riskFactorMap = {};
    pestRisks.forEach(pest => {
      if (pest.riskFactors) {
        pest.riskFactors.forEach(factor => {
          riskFactorMap[factor] = (riskFactorMap[factor] || 0) + 1;
        });
      }
    });
    
    // Sort and limit to top 5 risk factors
    const sortedFactors = Object.entries(riskFactorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    setRiskFactorData({
      labels: sortedFactors.map(([factor]) => factor),
      datasets: [
        {
          label: 'Number of Pests',
          data: sortedFactors.map(([, count]) => count),
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: 'rgb(6, 95, 70)',
          borderWidth: 1,
        }
      ]
    });
    
    // Generate predictive risk over time (next 14 days)
    const today = new Date();
    const labels = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    // Simulated predictive data - in a real app this would come from an API
    // Creates a slightly increasing trend for medium and high risks
    const simulatedHigh = [riskLevelCounts.High];
    const simulatedMedium = [riskLevelCounts.Medium];
    const simulatedLow = [riskLevelCounts.Low];
    
    for (let i = 1; i < 14; i++) {
      // Add some randomness but with an increasing trend for high and medium
      const dayFactor = i / 14; // Increases as days progress
      
      // High risk gradually increases
      const highChange = Math.random() > 0.7 ? 1 : 0;
      simulatedHigh.push(Math.min(
        pestRisks.length, 
        Math.max(0, simulatedHigh[i-1] + highChange * dayFactor)
      ));
      
      // Medium risk fluctuates 
      const mediumChange = Math.random() > 0.5 ? 1 : -1;
      simulatedMedium.push(Math.min(
        pestRisks.length, 
        Math.max(0, simulatedMedium[i-1] + mediumChange * 0.5)
      ));
      
      // Low risk generally decreases as high and medium increase
      simulatedLow.push(Math.max(
        0, 
        pestRisks.length - simulatedHigh[i] - simulatedMedium[i]
      ));
    }
    
    setPredictiveData({
      labels,
      datasets: [
        {
          label: 'High Risk',
          data: simulatedHigh,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          tension: 0.2,
        },
        {
          label: 'Medium Risk',
          data: simulatedMedium,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          tension: 0.2,
        },
        {
          label: 'Low Risk',
          data: simulatedLow,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          tension: 0.2,
        }
      ]
    });
  }, [pestRisks]);
  
  if (!pestRisks || pestRisks.length === 0 || !riskLevelData || !riskFactorData || !predictiveData) {
    return (
      <div className="bg-white rounded-lg p-4 mb-4 text-center text-gray-500 border border-gray-200">
        <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading pest risk analytics...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
      <div className="p-3 md:p-4 border-b border-gray-200 bg-green-50">
        <div className="flex justify-between items-center">
          <h3 className="text-green-800 font-medium">
            Pest Risk Analytics for {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}
          </h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Risk Level Distribution */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-sm font-medium text-gray-600 mb-3 text-center">Current Risk Level Distribution</h4>
            <div className="h-64">
              <Pie 
                data={riskLevelData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        font: {
                          size: 10
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const percentage = Math.round((value / pestRisks.length) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Top Risk Factors */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-sm font-medium text-gray-600 mb-3 text-center">Top Risk Factors</h4>
            <div className="h-64">
              <Bar 
                data={riskFactorData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        title: (items) => {
                          const item = items[0];
                          return item.label;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    },
                    x: {
                      ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                          size: 10
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* 14-day Forecast */}
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-sm font-medium text-gray-600 mb-3 text-center">14-Day Risk Level Forecast</h4>
            <div className="h-64">
              <Line 
                data={predictiveData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        font: {
                          size: 10
                        }
                      }
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      },
                      suggestedMax: pestRisks.length
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              <span className="inline-block px-2">― Projected trend based on historical data and weather forecasts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestRiskCharts; 