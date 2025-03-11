import React, { useState } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaFileAlt } from 'react-icons/fa';

const AlertsPanel = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for alerts and events
  const alertsData = [
    {
      type: 'trigger',
      date: '28 Nov, 2024',
      time: '12:00',
      title: 'Temperature falls below 15 °C at Adelaide',
      severity: 'warning'
    },
    {
      type: 'alert',
      date: '28 Nov, 2024',
      time: '09:00',
      title: 'Moderate Rain',
      severity: 'info'
    },
    {
      type: 'alert',
      date: '27 Nov, 2024',
      time: '11:00',
      title: 'Severe high temperature',
      severity: 'critical'
    },
    {
      type: 'report',
      date: '22 Nov, 2024',
      time: '11:52',
      title: 'Weather Forecast For Birmingham',
      severity: 'info'
    }
  ];

  // Filter alerts based on active tab
  const filteredAlerts = alertsData.filter(alert => {
    if (activeTab === 'all') return true;
    if (activeTab === 'alerts') return alert.type === 'alert';
    if (activeTab === 'cases') return alert.type === 'case';
    if (activeTab === 'reports') return alert.type === 'report';
    if (activeTab === 'triggers') return alert.type === 'trigger';
    return true;
  });

  return (
    <div className="alerts-panel h-full flex flex-col">
      <div className="alerts-header px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="filter-buttons flex flex-wrap gap-1">
          <button 
            className={`filter-btn px-3 py-1 rounded-full text-sm ${activeTab === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn px-3 py-1 rounded-full text-sm ${activeTab === 'alerts' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveTab('alerts')}
          >
            Alerts
          </button>
          <button 
            className={`filter-btn px-3 py-1 rounded-full text-sm ${activeTab === 'cases' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveTab('cases')}
          >
            Cases
          </button>
          <button 
            className={`filter-btn px-3 py-1 rounded-full text-sm ${activeTab === 'reports' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
          <button 
            className={`filter-btn px-3 py-1 rounded-full text-sm ${activeTab === 'triggers' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveTab('triggers')}
          >
            Trigger Events
          </button>
        </div>
      </div>

      <div className="alerts-list flex-grow overflow-y-auto p-4">
        {filteredAlerts.map((alert, index) => (
          <div key={index} className="alert-item mb-4 flex">
            <div className="alert-time flex flex-col items-center mr-3 w-16">
              <span className={`alert-dot w-3 h-3 rounded-full mb-1 ${
                alert.severity === 'critical' ? 'bg-red-500' : 
                alert.severity === 'warning' ? 'bg-orange-500' : 
                'bg-blue-500'
              }`}></span>
              <span className="text-sm font-medium">{alert.time}</span>
            </div>
            
            <div className="alert-content flex-grow">
              <div className="alert-header">
                {alert.type === 'trigger' && (
                  <span className="alert-type text-xs text-orange-500 uppercase">Trigger Event</span>
                )}
                {alert.type === 'alert' && (
                  <span className="alert-type text-xs text-blue-500 uppercase">Alert</span>
                )}
                {alert.type === 'report' && (
                  <span className="alert-type text-xs text-green-500 uppercase">Report</span>
                )}
                <h3 className="text-base font-medium mt-1">{alert.title}</h3>
              </div>
              <p className="alert-date text-xs text-gray-500 mt-1">{alert.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;