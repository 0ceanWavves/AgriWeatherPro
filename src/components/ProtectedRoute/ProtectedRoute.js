import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingScreen from '../LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isEmailVerified } = useAuth();
  const [emailVerified, setEmailVerified] = useState(null);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionUser, setSessionUser] = useState(null);
  
  console.log('ProtectedRoute - Auth state:', { loading, isAuthenticated: !!user });
  
  // Double-check session directly from Supabase
  useEffect(() => {
    const checkDirectSession = async () => {
      try {
        // Get session directly from Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setSessionUser(null);
        } else {
          console.log('Direct session check:', data.session ? 'Found session' : 'No session');
          setSessionUser(data.session?.user || null);
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkDirectSession();
  }, []);
  
  // Check email verification
  useEffect(() => {
    let mounted = true;
    
    // Use either the context user or session user
    const activeUser = user || sessionUser;
    
    const checkEmailVerification = async () => {
      if (!activeUser) return;
      
      try {
        console.log('Starting email verification check...');
        setVerifyingEmail(true);
        
        // Simplified approach - don't use timeout for now to avoid race conditions
        let verified = false;
        
        if (typeof isEmailVerified === 'function') {
          verified = await isEmailVerified();
        } else {
          // Fallback if isEmailVerified is not available
          const { data } = await supabase.auth.getUser();
          verified = data?.user?.email_confirmed_at != null;
        }
        
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
  }, [user, sessionUser, isEmailVerified]);

  // When still loading or verifying, show loading screen
  if (loading || verifyingEmail || checkingSession) {
    return <LoadingScreen message={
      loading ? "Checking authentication..." : 
      verifyingEmail ? "Verifying email status..." :
      "Verifying session..."
    } />;
  }

  // Prioritize sessionUser over context user for more reliable auth checks
  const activeUser = user || sessionUser;

  if (!activeUser) {
    console.log('No active user found, redirecting to signin');
    return <Navigate to="/signin" replace />;
  }
  
  if (emailVerified === false) {
    return <Navigate to="/auth-required" replace state={{ message: "Please verify your email address to access this content." }} />;
  }

  console.log('User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;