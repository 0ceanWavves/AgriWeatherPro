import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isEmailVerified } = useAuth();
  const [emailVerified, setEmailVerified] = useState(null);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  
  console.log('ProtectedRoute - Auth state:', { loading, isAuthenticated: !!user });
  
  useEffect(() => {
    let mounted = true;
    
    const checkEmailVerification = async () => {
      if (!user) return;
      
      try {
        console.log('Starting email verification check...');
        setVerifyingEmail(true);
        
        // Add timeout to prevent indefinite hanging
        const verificationPromise = isEmailVerified();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email verification timed out')), 5000)
        );
        
        const verified = await Promise.race([verificationPromise, timeoutPromise]);
        
        if (mounted) {
          console.log('Email verification result:', verified);
          setEmailVerified(verified);
          setVerifyingEmail(false);
        }
      } catch (error) {
        console.error('Email verification error:', error);
        if (mounted) {
          // Fail open - assume verified in case of errors
          setEmailVerified(true);
          setVerifyingEmail(false);
        }
      }
    };
    
    checkEmailVerification();
    
    return () => {
      mounted = false;
    };
  }, [user, isEmailVerified]);

  if (loading || verifyingEmail) {
    return <LoadingScreen message={loading ? "Checking authentication..." : "Verifying email status..."} />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  if (emailVerified === false) {
    return <Navigate to="/auth-required" replace state={{ message: "Please verify your email address to access this content." }} />;
  }

  return children;
};

export default ProtectedRoute;