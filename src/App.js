import React, { useEffect } from 'react';
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
import PestManagement from './pages/ServicePages/PestManagement';
import IrrigationPlanning from './pages/ServicePages/IrrigationPlanning';

function App() {
  // Cleanup any debug elements that might accidentally be displayed
  useEffect(() => {
    // Remove any debug information elements that might get injected
    const removeDebugElements = () => {
      // Look for elements that contain debug information strings
      const debugElements = document.querySelectorAll('div, pre, span, p');
      
      for (const element of debugElements) {
        const text = element.textContent || '';
        
        // Check if element contains debug information
        if (
          (text.includes('Debug Info') || 
           text.includes('Supabase Initialized') || 
           text.includes('API Status') || 
           text.includes('API Key')) && 
          !element.classList.contains('app-content')
        ) {
          // Remove the debug element
          element.remove();
        }
      }
    };
    
    // Run on load
    removeDebugElements();
    
    // Set up an observer to catch any dynamically added debug elements
    const observer = new MutationObserver(() => {
      removeDebugElements();
    });
    
    // Start observing
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen app-content">
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
                  <Route path="/services/pest-management" element={<PestManagement />} />
                  <Route path="/services/irrigation-planning" element={<IrrigationPlanning />} />
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