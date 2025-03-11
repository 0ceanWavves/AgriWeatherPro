import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
import ForgotPassword from './pages/Auth/ForgotPassword';
import AuthRequired from './pages/AuthRequired';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
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
                  
                  {/* Service-specific routes will redirect to the appropriate pages */}
                  <Route path="/services/weather-forecasting" element={<Forecast />} />
                  <Route path="/services/crop-yield-prediction" element={<CropYields />} />
                  <Route path="/services/climate-analysis" element={<AuthRequired />} />
                  <Route path="/services/agricultural-insights" element={<AuthRequired />} />
                  <Route path="/services/pest-management" element={<Forecast />} />
                  <Route path="/services/irrigation-planning" element={<Maps />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;