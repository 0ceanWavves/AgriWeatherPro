import React, { useState } from 'react';
import { ServiceMapProvider } from '../context/ServiceMapContext';
import ServicesMenu from './ServicesMenu/ServicesMenu';
import ServiceAwareMap from './DashboardWidgets/ServiceAwareMap';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <ServiceMapProvider>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside 
          className={`${
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          } transition-all duration-300 ease-in-out bg-green-900 text-white fixed h-full z-10 shadow-lg`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">AgriWeather Pro</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-white focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ServicesMenu />
          </div>
        </aside>
        
        {/* Main content */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Top navigation */}
          <nav className="bg-white shadow-md p-4 flex items-center justify-between">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Demo User</span>
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                D
              </div>
            </div>
          </nav>
          
          {/* Dashboard content */}
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Agricultural Weather Dashboard</h2>
              <p className="text-gray-600">
                Monitor weather conditions, get pest alerts, and optimize your farming operations with real-time data.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Main map component that responds to service selection */}
              <ServiceAwareMap />
              
              {/* Additional dashboard widgets would go here */}
            </div>
          </div>
        </main>
      </div>
    </ServiceMapProvider>
  );
};

export default Dashboard;
