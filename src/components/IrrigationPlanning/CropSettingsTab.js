import React, { useState, useEffect } from 'react';
import ExportDropdown from './shared/ExportDropdown';
import { cropData, getDefaultSoilData } from '../../utils/irrigation/cropData';
import { exportCropSettings } from '../../utils/irrigation/exportUtils';

const CropSettingsTab = () => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [selectedCropType, setSelectedCropType] = useState('Almonds');
  const [plantingDate, setPlantingDate] = useState('2025-02-15');
  const [growthStage, setGrowthStage] = useState('mid-season');
  const [cropSettings, setCropSettings] = useState({
    ...cropData['Almonds'],
    ...getDefaultSoilData()
  });

  useEffect(() => {
    // Update crop settings when crop type changes
    setCropSettings({
      ...cropSettings,
      ...cropData[selectedCropType]
    });
  }, [selectedCropType]);

  const handleCropChange = (crop) => {
    setSelectedCropType(crop);
  };

  const handleInputChange = (field, value) => {
    setCropSettings({
      ...cropSettings,
      [field]: value
    });
  };
  
  const handleExport = (format) => {
    exportCropSettings(cropSettings, selectedCropType, plantingDate, growthStage, format);
    setExportMenuOpen(false);
  };

  const resetToDefaults = () => {
    setCropSettings({
      ...cropData[selectedCropType],
      ...getDefaultSoilData()
    });
  };

  return (
    <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Crop Water Requirements</h2>
      
      <div className="mb-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crop Type</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              value={selectedCropType}
              onChange={(e) => handleCropChange(e.target.value)}
            >
              {Object.keys(cropData).map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Planting Date</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600" 
              value={plantingDate} 
              onChange={(e) => setPlantingDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Growth Stage</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
            >
              <option value="initial">Initial</option>
              <option value="development">Development</option>
              <option value="mid-season">Mid-season</option>
              <option value="late-season">Late season</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Crop Coefficient (Kc) Curve</h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <div className="h-64 mb-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            {/* Mock line chart */}
            <div className="w-full h-full p-4 relative">
              {/* Y-axis */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>1.2</span>
                <span>1.0</span>
                <span>0.8</span>
                <span>0.6</span>
                <span>0.4</span>
                <span>0.2</span>
                <span>0.0</span>
              </div>
              
              {/* Chart */}
              <div className="h-full ml-8 relative">
                {/* Line representing Kc curve */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                  <path d="M0,380 L200,380 L400,100 L800,100 L1000,320" 
                        stroke="#3B82F6" fill="none" strokeWidth="3" />
                </svg>
                
                {/* Points for each growth stage */}
                <div className="absolute left-0 bottom-[5%] w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="absolute left-[20%] bottom-[5%] w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="absolute left-[40%] bottom-[75%] w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="absolute left-[80%] bottom-[75%] w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="absolute left-[100%] bottom-[20%] w-2 h-2 bg-blue-600 rounded-full"></div>
                
                {/* Current stage indicator */}
                <div className="absolute left-[60%] bottom-[75%] w-4 h-4 bg-green-500 rounded-full -translate-x-2 -translate-y-2"></div>
              </div>
              
              {/* X-axis */}
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Feb 15</span>
                <span>Mar 15</span>
                <span>Apr 20</span>
                <span>May 25</span>
                <span>Jun 20</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-8">
            {cropSettings.stages.map((stage, index) => (
              <div key={index} className="text-center">
                <span className={`block text-sm font-medium ${growthStage === stage.name.toLowerCase().replace(' ', '-') ? 'text-green-600' : ''}`}>
                  {stage.name}
                </span>
                <span className={`block text-xs ${growthStage === stage.name.toLowerCase().replace(' ', '-') ? 'text-green-600' : 'text-gray-500'}`}>
                  Kc: {stage.kc}
                </span>
                <span className={`block text-xs ${growthStage === stage.name.toLowerCase().replace(' ', '-') ? 'text-green-600' : 'text-gray-500'}`}>
                  {stage.days} days
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Current Water Requirements</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Reference ET (ETo):</span>
                <span className="font-medium">{cropSettings.currentEto} mm/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Crop Coefficient (Kc):</span>
                <span className="font-medium">{cropSettings.currentKc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Crop ET (ETc):</span>
                <span className="font-medium">{(cropSettings.currentEto * cropSettings.currentKc).toFixed(1)} mm/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Irrigation Efficiency:</span>
                <span className="font-medium">{cropSettings.irrigationEfficiency}%</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Gross Irrigation Requirement:</span>
                <span className="font-medium text-blue-600">
                  {((cropSettings.currentEto * cropSettings.currentKc) / (cropSettings.irrigationEfficiency / 100)).toFixed(1)} mm/day
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Soil Parameters</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Soil Type:</span>
                <span className="font-medium">{cropSettings.soilType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Field Capacity:</span>
                <span className="font-medium">{cropSettings.fieldCapacity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Wilting Point:</span>
                <span className="font-medium">{cropSettings.wiltingPoint}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Available Water Capacity:</span>
                <span className="font-medium">{cropSettings.availableWater}%</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Management Allowable Depletion:</span>
                <span className="font-medium">{cropSettings.mad}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Irrigation System Type</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
              <option>Drip</option>
              <option>Micro-sprinkler</option>
              <option>Sprinkler</option>
              <option>Furrow</option>
              <option>Flood</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Root Zone Depth (cm)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600" 
              value={cropSettings.rootZoneDepth} 
              onChange={(e) => handleInputChange('rootZoneDepth', parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Management Allowed Depletion (%)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600" 
              value={cropSettings.mad} 
              onChange={(e) => handleInputChange('mad', parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Irrigation Efficiency (%)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600" 
              value={cropSettings.irrigationEfficiency} 
              onChange={(e) => handleInputChange('irrigationEfficiency', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button 
          onClick={resetToDefaults}
          className="px-4 py-2 bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm text-sm"
        >
          Reset to Defaults
        </button>
        <ExportDropdown 
          isOpen={exportMenuOpen}
          toggle={() => setExportMenuOpen(!exportMenuOpen)}
          onExport={handleExport}
          buttonText="Save Settings"
          icon="download"
          buttonClass="bg-blue-600 text-white"
        />
      </div>
    </div>
  );
};

export default CropSettingsTab;