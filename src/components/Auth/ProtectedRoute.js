import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserProfile } from '../../contexts/UserProfileContext';

/**
 * A wrapper for routes that should only be accessible to authenticated users
 * Redirects to sign in page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUserProfile();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-green-200 h-12 w-12 flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-600 h-6 w-6"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }
  
  // Redirect to sign in if not authenticated
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // Render children if authenticated
  return children;
};

export default ProtectedRoute;