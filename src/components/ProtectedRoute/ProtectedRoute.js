import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Log authentication state
  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { loading, isAuthenticated: !!user });
  }, [loading, user]);

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!user) {
    // Redirect immediately instead of showing loading screen
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;