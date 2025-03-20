export const downloadFile = (content, filename, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportScheduleData = (scheduleData, format) => {
  let content = '';
  const filename = `irrigation-schedule-${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    content = 'Date,ETc (mm),Rain (mm),Irrigation (mm),Status\n';
    scheduleData.forEach(row => {
      content += `${row.date},${row.etc},${row.rain},${row.irrigation},${row.status}\n`;
    });
  } else if (format === 'json') {
    content = JSON.stringify(scheduleData, null, 2);
  } else if (format === 'markdown') {
    content = '# Irrigation Schedule\n\n';
    content += '| Date | ETc (mm) | Rain (mm) | Irrigation (mm) | Status |\n';
    content += '|------|----------|-----------|-----------------|--------|\n';
    scheduleData.forEach(row => {
      content += `| ${row.date} | ${row.etc} | ${row.rain} | ${row.irrigation} | ${row.status} |\n`;
    });
  }
  
  downloadFile(content, `${filename}.${format === 'markdown' ? 'md' : format}`, 
    format === 'csv' ? 'text/csv' : 
    format === 'json' ? 'application/json' : 
    'text/markdown');
};

export const exportAnalyticsData = (waterUsageData, timeframe, format) => {
  let content = '';
  const filename = `water-analytics-${timeframe.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    content = 'Metric,Value,Unit\n';
    content += `Total Irrigation,${waterUsageData.totalIrrigation},mm\n`;
    content += `Total Rainfall,${waterUsageData.totalRainfall},mm\n`;
    content += `Efficiency,${waterUsageData.efficiency},%\n`;
    content += `Applied Water,${waterUsageData.appliedWater},mm\n`;
    content += `Crop Water Need,${waterUsageData.cropWaterNeed},mm\n`;
    content += `Deep Percolation Loss,${waterUsageData.percolationLoss},mm\n`;
    content += `Current Usage,${waterUsageData.currentUsage},m³\n`;
    content += `Optimized Usage,${waterUsageData.optimizedUsage},m³\n`;
    content += `Potential Savings,${waterUsageData.potentialSavings},m³\n`;
    content += `Savings Percentage,${waterUsageData.savingsPercent},%\n`;
  } else if (format === 'json') {
    content = JSON.stringify(waterUsageData, null, 2);
  } else if (format === 'markdown') {
    content = `# Water Usage Analytics - ${timeframe}\n\n`;
    content += '## Summary\n\n';
    content += `- **Water Use Efficiency**: ${waterUsageData.efficiency}%\n`;
    content += `- **Applied Water**: ${waterUsageData.appliedWater} mm\n`;
    content += `- **Crop Water Need**: ${waterUsageData.cropWaterNeed} mm\n`;
    content += `- **Deep Percolation Loss**: ${waterUsageData.percolationLoss} mm\n\n`;
    content += '## Water Savings Opportunity\n\n';
    content += `- **Potential Savings**: ${waterUsageData.savingsPercent}%\n`;
    content += `- **Current Season Usage**: ${waterUsageData.currentUsage} m³\n`;
    content += `- **Optimized Usage**: ${waterUsageData.optimizedUsage} m³\n`;
    content += `- **Volume Savings**: ${waterUsageData.potentialSavings} m³\n\n`;
    content += '## Irrigation History\n\n';
    content += '| Date | Applied (mm) | Recommended (mm) | Efficiency | Status |\n';
    content += '|------|--------------|------------------|------------|--------|\n';
    waterUsageData.irrigationHistory.forEach(item => {
      content += `| ${item.date} | ${item.applied} | ${item.recommended} | ${item.efficiency}% | ${item.status} |\n`;
    });
  }
  
  downloadFile(content, `${filename}.${format === 'markdown' ? 'md' : format}`, 
    format === 'csv' ? 'text/csv' : 
    format === 'json' ? 'application/json' : 
    'text/markdown');
};

export const exportCropSettings = (cropData, cropType, plantingDate, growthStage, format) => {
  let content = '';
  const filename = `crop-settings-${cropType.toLowerCase()}-${new Date().toISOString().split('T')[0]}`;
  
  const exportData = {
    cropType,
    plantingDate,
    growthStage,
    stages: cropData.stages,
    waterRequirements: {
      eto: cropData.currentEto,
      kc: cropData.currentKc,
      etc: parseFloat((cropData.currentEto * cropData.currentKc).toFixed(1)),
      irrigationEfficiency: cropData.irrigationEfficiency,
      grossIrrigationRequirement: parseFloat(((cropData.currentEto * cropData.currentKc) / (cropData.irrigationEfficiency / 100)).toFixed(1))
    },
    soilParameters: {
      soilType: cropData.soilType,
      fieldCapacity: cropData.fieldCapacity,
      wiltingPoint: cropData.wiltingPoint,
      availableWater: cropData.availableWater,
      mad: cropData.mad,
      rootZoneDepth: cropData.rootZoneDepth
    }
  };
  
  if (format === 'csv') {
    content = 'Parameter,Value\n';
    content += `Crop Type,${cropType}\n`;
    content += `Planting Date,${plantingDate}\n`;
    content += `Current Growth Stage,${growthStage}\n`;
    content += `Current Kc,${cropData.currentKc}\n`;
    content += `Reference ET (ETo),${cropData.currentEto} mm/day\n`;
    content += `Crop ET (ETc),${(cropData.currentEto * cropData.currentKc).toFixed(1)} mm/day\n`;
    content += `Irrigation Efficiency,${cropData.irrigationEfficiency}%\n`;
    content += `Gross Irrigation Requirement,${((cropData.currentEto * cropData.currentKc) / (cropData.irrigationEfficiency / 100)).toFixed(1)} mm/day\n`;
    content += `Soil Type,${cropData.soilType}\n`;
    content += `Field Capacity,${cropData.fieldCapacity}%\n`;
    content += `Wilting Point,${cropData.wiltingPoint}%\n`;
    content += `Available Water,${cropData.availableWater}%\n`;
    content += `Management Allowable Depletion,${cropData.mad}%\n`;
    content += `Root Zone Depth,${cropData.rootZoneDepth} cm\n`;
  } else if (format === 'json') {
    content = JSON.stringify(exportData, null, 2);
  } else if (format === 'markdown') {
    content = `# Crop Water Requirements - ${cropType}\n\n`;
    content += `- **Planting Date**: ${plantingDate}\n`;
    content += `- **Current Growth Stage**: ${growthStage}\n\n`;
    
    content += '## Growth Stages\n\n';
    content += '| Stage | Kc | Duration (days) |\n';
    content += '|-------|----|-----------------|\n';
    cropData.stages.forEach(stage => {
      content += `| ${stage.name} | ${stage.kc} | ${stage.days} |\n`;
    });
    
    content += '\n## Water Requirements\n\n';
    content += `- **Reference ET (ETo)**: ${cropData.currentEto} mm/day\n`;
    content += `- **Crop Coefficient (Kc)**: ${cropData.currentKc}\n`;
    content += `- **Crop ET (ETc)**: ${(cropData.currentEto * cropData.currentKc).toFixed(1)} mm/day\n`;
    content += `- **Irrigation Efficiency**: ${cropData.irrigationEfficiency}%\n`;
    content += `- **Gross Irrigation Requirement**: ${((cropData.currentEto * cropData.currentKc) / (cropData.irrigationEfficiency / 100)).toFixed(1)} mm/day\n\n`;
    
    content += '## Soil Parameters\n\n';
    content += `- **Soil Type**: ${cropData.soilType}\n`;
    content += `- **Field Capacity**: ${cropData.fieldCapacity}%\n`;
    content += `- **Wilting Point**: ${cropData.wiltingPoint}%\n`;
    content += `- **Available Water Capacity**: ${cropData.availableWater}%\n`;
    content += `- **Management Allowable Depletion**: ${cropData.mad}%\n`;
    content += `- **Root Zone Depth**: ${cropData.rootZoneDepth} cm\n`;
  }
  
  downloadFile(content, `${filename}.${format === 'markdown' ? 'md' : format}`, 
    format === 'csv' ? 'text/csv' : 
    format === 'json' ? 'application/json' : 
    'text/markdown');
};