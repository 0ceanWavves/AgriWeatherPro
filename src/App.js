import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserServicesProvider } from './context/UserServicesContext';
import { ServiceMapProvider } from './context/ServiceMapContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Forecast from './pages/Forecast';
import CropYields from './pages/CropYields';
import IrrigationPlanning from './pages/ServicePages/IrrigationPlanning';
import PestManagement from './pages/ServicePages/PestManagement';
import CaliforniaPestDashboard from './pages/ServicePages/CaliforniaPestDashboard';
import MenaPestDashboard from './pages/ServicePages/MenaPestDashboard';
import './app.css';

function App() {
  return (
    <UserServicesProvider>
      <ServiceMapProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/crop-yields" element={<CropYields />} />
            <Route path="/services/irrigation-planning" element={<IrrigationPlanning />} />
            <Route path="/services/pest-management" element={<PestManagement />} />
            <Route path="/services/california-pest" element={<CaliforniaPestDashboard />} />
            <Route path="/services/mena-pest" element={<MenaPestDashboard />} />
          </Routes>
        </Layout>
      </ServiceMapProvider>
    </UserServicesProvider>
  );
}

export default App;