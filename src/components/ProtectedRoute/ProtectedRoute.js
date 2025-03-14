import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isEmailVerified } = useAuth();
  const [emailVerified, setEmailVerified] = useState(null);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const navigate = useNavigate();

  // Log authentication state
  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { loading, isAuthenticated: !!user });
    
    // Check email verification status when user is available
    const checkEmailVerification = async () => {
      if (user) {
        setVerifyingEmail(true);
        const verified = await isEmailVerified();
        setEmailVerified(verified);
        setVerifyingEmail(false);
        
        console.log('Email verification status:', verified ? 'Verified' : 'Not verified');
      }
    };
    
    checkEmailVerification();
  }, [user, isEmailVerified]);

  if (loading || verifyingEmail) {
    return <LoadingScreen message={loading ? "Checking authentication..." : "Verifying email status..."} />;
  }

  if (!user) {
    // Redirect to sign in if not authenticated
    return <Navigate to="/signin" replace />;
  }
  
  if (emailVerified === false) {
    // Redirect to auth required page if email is not verified
    return <Navigate to="/auth-required" replace state={{ message: "Please verify your email address to access this content." }} />;
  }

  return children;
};

export default ProtectedRoute;