import React, { useState } from 'react';
import ExportDropdown from './shared/ExportDropdown';
import { calculateIrrigationRequirements, getSampleWeatherForecast } from '../../utils/irrigation/calculationUtils';
import { exportScheduleData } from '../../utils/irrigation/exportUtils';

const ScheduleTab = () => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [waterBalance, setWaterBalance] = useState(65);
  const [fieldSettings, setFieldSettings] = useState({
    cropType: 'Almonds',
    growthStage: 'Mid-season (Flowering)',
    soilType: 'Silt Loam'
  });
  const [scheduleData, setScheduleData] = useState([
    {date: 'Mar 20 (Today)', etc: 4.7, rain: 0.0, irrigation: 5.5, status: 'Irrigate Today'},
    {date: 'Mar 21', etc: 4.5, rain: 0.0, irrigation: 0.0, status: 'No Irrigation'},
    {date: 'Mar 22', etc: 4.8, rain: 2.3, irrigation: 0.0, status: 'No Irrigation'},
    {date: 'Mar 23', etc: 5.1, rain: 0.0, irrigation: 5.8, status: 'Scheduled'},
    {date: 'Mar 24', etc: 4.9, rain: 0.0, irrigation: 0.0, status: 'No Irrigation'},
    {date: 'Mar 25', etc: 4.8, rain: 0.0, irrigation: 0.0, status: 'No Irrigation'},
    {date: 'Mar 26', etc: 5.0, rain: 0.0, irrigation: 5.6, status: 'Scheduled'}
  ]);

  const generateSchedule = () => {
    const forecast = getSampleWeatherForecast();
    const newSchedule = calculateIrrigationRequirements(
      fieldSettings.cropType, 
      fieldSettings.growthStage, 
      85, // Irrigation efficiency 
      forecast
    );
    
    setScheduleData(newSchedule);
    setWaterBalance(prevBalance => Math.min(85, prevBalance + 5));
  };
  
  const handleExport = (format) => {
    exportScheduleData(scheduleData, format);
    setExportMenuOpen(false);
  };

  return (
    <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Smart Irrigation Scheduler</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium">Field Settings</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Configure your field parameters</p>
          </div>
          <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Edit</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Crop Type</p>
            <p className="font-medium">{fieldSettings.cropType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Growth Stage</p>
            <p className="font-medium">{fieldSettings.growthStage}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Soil Type</p>
            <p className="font-medium">{fieldSettings.soilType}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Current Water Balance</h3>
        <div className="relative h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-blue-500" style={{width: `${waterBalance}%`}}></div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center px-3">
            <span className="text-xs font-medium text-white">Current Soil Moisture: {waterBalance}%</span>
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Wilting Point</span>
          <span>Field Capacity</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">7-Day Irrigation Schedule</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ET<sub>c</sub> (mm)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rain (mm)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Irrigation (mm)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {scheduleData.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm">{row.date}</td>
                  <td className="px-4 py-3 text-sm">{row.etc}</td>
                  <td className="px-4 py-3 text-sm">{row.rain}</td>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{row.irrigation}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full 
                      ${row.status === 'Irrigate Today' 
                        ? 'bg-green-100 text-green-800' 
                        : row.status === 'Scheduled' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>Irrigation recommendations based on: crop coefficient (Kc) = 1.05, soil moisture depletion threshold = 50%, and irrigation efficiency = 85%.</p>
        </div>
      </div>
      
      <div className="flex justify-between">
        <ExportDropdown 
          isOpen={exportMenuOpen}
          toggle={() => setExportMenuOpen(!exportMenuOpen)}
          onExport={handleExport}
          buttonText="Export"
          icon="export"
        />
        <button 
          onClick={generateSchedule}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm"
        >
          Generate Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleTab;