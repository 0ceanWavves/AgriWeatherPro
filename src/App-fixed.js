import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FixedAuthProvider } from './contexts/FixedAuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Maps from './pages/Maps';
import CropYields from './pages/CropYields';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import DirectSignup from './pages/Auth/DirectSignup';
import FixedSignup from './pages/FixedSignup';
import SignupDebug from './pages/SignupDebug';
import ForgotPassword from './pages/Auth/ForgotPassword';
import AuthRequired from './pages/AuthRequired';
import ProtectedRoute from './components/ProtectedRoute';
import PestManagement from './pages/ServicePages/PestManagement';
import IrrigationPlanning from './pages/ServicePages/IrrigationPlanning';

function App() {
  return (
    <FixedAuthProvider>
      <div className="flex flex-col min-h-screen app-content">
        <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/direct-signup" element={<DirectSignup />} />
          <Route path="/fixed-signup" element={<FixedSignup />} />
          <Route path="/signup-debug" element={<SignupDebug />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth-required" element={<AuthRequired />} />
          
          {/* Protected Dashboard Route */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Public Routes with Header/Footer */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/forecast" element={<Forecast />} />
                  <Route path="/maps" element={<Maps />} />
                  <Route path="/crop-yields" element={<CropYields />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* Service-specific routes */}
                  <Route path="/services/weather-forecasting" element={<Forecast />} />
                  <Route path="/services/crop-yield-prediction" element={<CropYields />} />
                  <Route path="/services/climate-analysis" element={<AuthRequired />} />
                  <Route path="/services/agricultural-insights" element={<AuthRequired />} />
                  <Route path="/services/pest-management" element={<PestManagement />} />
                  <Route path="/services/irrigation-planning" element={<IrrigationPlanning />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </FixedAuthProvider>
  );
}

export default App;