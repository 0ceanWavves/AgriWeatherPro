import React, { useState, useEffect } from 'react';
import { FaBug } from 'react-icons/fa';
import { getPestAlerts } from '../../services/pestService';
import { useGlobalLocation } from '../../context/LocationContext';

const PestAlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentLocation } = useGlobalLocation();
  
  useEffect(() => {
    const fetchAlerts = async () => {
      if (!currentLocation) return;
      
      setLoading(true);
      try {
        const alertsData = await getPestAlerts(currentLocation, ['corn', 'wheat', 'soybean']);
        setAlerts(alertsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching pest alerts:', err);
        setError('Failed to load pest alerts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
    
    // Set up interval to refresh data every 3 hours
    const refreshInterval = setInterval(fetchAlerts, 3 * 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [currentLocation]);
  
  if (loading && !alerts.length) {
    return (
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-3 py-1.5 border-b">
          <h2 className="font-semibold text-gray-700 text-sm flex items-center">
            <FaBug className="mr-1.5 text-green-600 h-3 w-3" /> Pest Alerts
          </h2>
        </div>
        <div className="p-4 text-center text-sm text-gray-500">
          Loading pest alerts...
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-3 py-1.5 border-b">
          <h2 className="font-semibold text-gray-700 text-sm flex items-center">
            <FaBug className="mr-1.5 text-green-600 h-3 w-3" /> Pest Alerts
          </h2>
        </div>
        <div className="p-4 text-center text-sm text-red-500">
          {error}
        </div>
      </div>
    );
  }
  
  if (!alerts.length) {
    return (
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-3 py-1.5 border-b">
          <h2 className="font-semibold text-gray-700 text-sm flex items-center">
            <FaBug className="mr-1.5 text-green-600 h-3 w-3" /> Pest Alerts
          </h2>
        </div>
        <div className="p-4 text-center text-sm text-gray-700">
          No pest alerts for your current location.
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-3 py-1.5 border-b">
        <h2 className="font-semibold text-gray-700 text-sm flex items-center">
          <FaBug className="mr-1.5 text-green-600 h-3 w-3" /> Pest Alerts
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {alerts.map((alert, index) => (
          <div key={index} className="p-2">
            <div className="flex items-start">
              <div className={`w-2 h-2 mt-1 rounded-full mr-1.5 ${
                alert.level === 'High' ? 'bg-red-500' :
                alert.level === 'Medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}></div>
              <div>
                <div className={`font-medium text-xs ${
                  alert.level === 'High' ? 'text-red-700' :
                  alert.level === 'Medium' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {alert.level} Risk: {alert.pest}
                </div>
                <p className="text-xs text-gray-800">{alert.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PestAlertsPanel;