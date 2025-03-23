import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { ServiceMapProvider } from './context/ServiceMapContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Profile from './pages/Profile/index';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import WeatherDetails from './pages/WeatherDetails';
import PestManagement from './pages/ServicePages/PestManagement';

// Subscription and premium features
import SubscriptionPlans from './pages/Subscription/SubscriptionPlans';
import PremiumFeaturesPage from './pages/Subscription/PremiumFeaturesPage';
import AccountBilling from './pages/Subscription/AccountBilling';

// Import PremiumWeatherMap - will be visible only to premium users
import PremiumWeatherMap from './components/WeatherDashboard/PremiumWeatherMap';

import './App.css';

// Helper component to apply authenticated class to body
const AuthStateHandler = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      document.body.classList.add('authenticated');
    } else {
      document.body.classList.remove('authenticated');
    }
  }, [user]);
  
  return null;
};

function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <ServiceMapProvider>
          <AuthStateHandler />
          <div className="app">
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Private routes that require authentication */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/weather/:locationId" element={<PrivateRoute><WeatherDetails /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                
                {/* Routes for specific features */}
                <Route path="/reports" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/triggers" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/tariff" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/support" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/about" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/pest-management" element={<PrivateRoute><PestManagement /></PrivateRoute>} />
                
                {/* Subscription and Premium Features routes */}
                <Route path="/subscription" element={<PrivateRoute><SubscriptionPlans /></PrivateRoute>} />
                <Route path="/premium-features" element={<PrivateRoute><PremiumFeaturesPage /></PrivateRoute>} />
                <Route path="/account/billing" element={<PrivateRoute><AccountBilling /></PrivateRoute>} />
                
                {/* Premium features - these will only show content to premium users */}
                <Route path="/premium/weather-maps" element={<PrivateRoute><PremiumWeatherMap /></PrivateRoute>} />
                
                {/* Catch all for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </ServiceMapProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
}

export default App;