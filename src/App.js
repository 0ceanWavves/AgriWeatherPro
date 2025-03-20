import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Forecast from './pages/Forecast';
import CropYields from './pages/CropYields';
import Maps from './pages/Maps';
import Methodology from './pages/Methodology';
import IrrigationPlanning from './pages/ServicePages/IrrigationPlanning';
import PestManagement from './pages/ServicePages/PestManagement';
import CaliforniaPestDashboard from './pages/ServicePages/CaliforniaPestDashboard';
import MenaPestDashboard from './pages/ServicePages/MenaPestDashboard';
import './app.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/crop-yields" element={<CropYields />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/services/irrigation-planning" element={<IrrigationPlanning />} />
        <Route path="/services/pest-management" element={<PestManagement />} />
        <Route path="/services/california-pests" element={<CaliforniaPestDashboard />} />
        <Route path="/services/mena-pests" element={<MenaPestDashboard />} />
      </Routes>
    </div>
  );
}

export default App;