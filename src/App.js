import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Maps from './pages/Maps';
import CropYields from './pages/CropYields';
import About from './pages/About';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PestManagement from './pages/ServicePages/PestManagement';
import IrrigationPlanning from './pages/ServicePages/IrrigationPlanning';

// Only import components needed for initial load immediately
import SignIn from './pages/Auth/SignIn';

// Lazy load other components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SignUp = lazy(() => import('./pages/Auth/SignUp'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const AuthRequired = lazy(() => import('./pages/AuthRequired'));
const AuthError = lazy(() => import('./pages/Auth/AuthError'));

function App() {
  // Add any state you need
  const [isLoading, setIsLoading] = useState(false);

  // Detect auth errors in URL (from Supabase redirects)
  useEffect(() => {
    const handleAuthError = () => {
      const url = window.location.href;
      
      // Check if URL contains error parameters (either in hash or query params)
      if (url.includes('error=') || url.includes('error_code=') || url.includes('error_description=')) {
        // Redirect to our error handling page while preserving the error parameters
        const hash = window.location.hash;
        const search = window.location.search;
        
        // Determine which format the error is in (hash or query)
        if (hash && (hash.includes('error=') || hash.includes('error_code='))) {
          window.location.href = `/auth-error${hash}`;
        } else if (search && (search.includes('error=') || search.includes('error_code='))) {
          window.location.href = `/auth-error${search}`;
        }
      }
    };
    
    handleAuthError();

    // Return cleanup function if needed
    return () => {
      console.log('App component unmounted');
    };
  }, []);
  
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen app-content">
        <Suspense fallback={<LoadingScreen message="Loading..." />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth-required" element={<AuthRequired />} />
            <Route path="/auth-error" element={<AuthError />} />
            
            {/* Redirect routes for handling auth errors in the URL */}
            <Route path="/#error=*" element={<Navigate to="/auth-error" replace />} />
            <Route path="/?error=*" element={<Navigate to="/auth-error" replace />} />
            
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
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;