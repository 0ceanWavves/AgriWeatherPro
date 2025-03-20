import React, { useState } from 'react';
import ExportDropdown from './shared/ExportDropdown';
import { getMockAnalyticsData } from '../../utils/irrigation/calculationUtils';
import { exportAnalyticsData } from '../../utils/irrigation/exportUtils';

const AnalyticsTab = () => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('Last 30 Days');
  const [waterUsageData, setWaterUsageData] = useState(getMockAnalyticsData('Last 30 Days'));

  const updateAnalytics = (timeframe) => {
    setAnalyticsTimeframe(timeframe);
    setWaterUsageData(getMockAnalyticsData(timeframe));
  };
  
  const handleExport = (format) => {
    exportAnalyticsData(waterUsageData, analyticsTimeframe, format);
    setExportMenuOpen(false);
  };

  return (
    <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Water Use Analytics</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Monthly Water Balance</h3>
          <div className="flex space-x-2">
            <select 
              className="text-sm border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
              value={analyticsTimeframe}
              onChange={(e) => updateAnalytics(e.target.value)}
            >
              <option>Last 30 Days</option>
              <option>Last 60 Days</option>
              <option>Last 90 Days</option>
              <option>This Season</option>
            </select>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="h-64 mb-4 bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
            <div className="w-full h-full p-2">
              {/* Mock bar chart */}
              <div className="h-full flex items-end space-x-6 pl-10">
                <div className="flex flex-col items-center">
                  <div className="w-16 bg-blue-500 rounded-t" style={{height: '40%'}}></div>
                  <div className="w-16 bg-green-500 mt-1 rounded-t" style={{height: '10%'}}></div>
                  <p className="text-xs mt-2">Feb 20</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
                  <div className="w-16 bg-green-500 mt-1 rounded-t" style={{height: '5%'}}></div>
                  <p className="text-xs mt-2">Feb 27</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 bg-blue-500 rounded-t" style={{height: '45%'}}></div>
                  <div className="w-16 bg-green-500 mt-1 rounded-t" style={{height: '20%'}}></div>
                  <p className="text-xs mt-2">Mar 6</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 bg-blue-500 rounded-t" style={{height: '70%'}}></div>
                  <div className="w-16 bg-green-500 mt-1 rounded-t" style={{height: '5%'}}></div>
                  <p className="text-xs mt-2">Mar 13</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 bg-blue-500 rounded-t" style={{height: '55%'}}></div>
                  <div className="w-16 bg-green-500 mt-1 rounded-t" style={{height: '8%'}}></div>
                  <p className="text-xs mt-2">Mar 20</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-2"></div>
              <span className="text-sm">Irrigation</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2"></div>
              <span className="text-sm">Rainfall</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Water Use Efficiency</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Current Efficiency:</span>
              <span className="font-medium text-green-600">{waterUsageData.efficiency}%</span>
            </div>
            <div className="relative h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-6">
              <div className="absolute top-0 left-0 h-full bg-green-500" style={{width: `${waterUsageData.efficiency}%`}}></div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Applied Water:</span>
                <span>{waterUsageData.appliedWater} mm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Crop Water Need:</span>
                <span>{waterUsageData.cropWaterNeed} mm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Deep Percolation Loss:</span>
                <span className="text-red-500">{waterUsageData.percolationLoss} mm</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Water Savings Opportunity</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-800 mb-2">
                <span className="text-2xl font-bold">{waterUsageData.savingsPercent}%</span>
              </div>
              <p className="text-sm">Potential Water Savings</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Current Season Usage:</span>
                <span>{waterUsageData.currentUsage} m³</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Optimized Usage:</span>
                <span className="text-green-500">{waterUsageData.optimizedUsage} m³</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Potential Savings:</span>
                <span className="text-green-500">{waterUsageData.potentialSavings} m³</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Irrigation Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applied (mm)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recommended (mm)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Efficiency</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {waterUsageData.irrigationHistory.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm">{item.date}</td>
                  <td className="px-4 py-3 text-sm">{item.applied}</td>
                  <td className="px-4 py-3 text-sm">{item.recommended}</td>
                  <td className="px-4 py-3 text-sm">{item.efficiency}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full 
                      ${item.status === 'Optimal' 
                        ? 'bg-green-100 text-green-800' 
                        : item.status === 'Slight Over-irrigation' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end">
        <ExportDropdown 
          isOpen={exportMenuOpen}
          toggle={() => setExportMenuOpen(!exportMenuOpen)}
          onExport={handleExport}
          buttonText="Export Report"
          icon="download"
          buttonClass="bg-blue-600 text-white"
        />
      </div>
    </div>
  );
};

export default AnalyticsTab;