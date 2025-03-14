import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';

const AuthError = () => {
  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Parse error parameters from URL hash or query parameters
    const parseErrorParams = () => {
      // Check for hash fragment first (Supabase redirect format)
      if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const error = hashParams.get('error');
        const errorCode = hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
          setErrorType(errorCode || error);
          setErrorMessage(errorDescription || 'An authentication error occurred');
          return;
        }
      }
      
      // Check query parameters as fallback
      const queryParams = new URLSearchParams(location.search);
      const error = queryParams.get('error');
      const errorCode = queryParams.get('error_code');
      const errorDescription = queryParams.get('error_description');
      
      if (error) {
        setErrorType(errorCode || error);
        setErrorMessage(errorDescription || 'An authentication error occurred');
      } else {
        // Default error if none specified
        setErrorType('unknown');
        setErrorMessage('An unknown authentication error occurred');
      }
    };
    
    parseErrorParams();
  }, [location]);
  
  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setSuccessMessage('');
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      setSuccessMessage(`Verification email resent to ${email}. Please check your inbox and spam folder.`);
    } catch (error) {
      console.error('Error resending verification email:', error);
      setErrorMessage(error.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };
  
  const renderErrorContent = () => {
    switch (errorType) {
      case 'otp_expired':
      case 'expired_otp':
        return (
          <div>
            <p className="mb-4">Your verification link has expired. Please enter your email below to request a new link.</p>
            
            <form onSubmit={handleResendVerification} className="mt-6">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaEnvelope className="text-gray-400" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend Verification Link'}
              </button>
            </form>
          </div>
        );
        
      case 'access_denied':
        return (
          <div>
            <p className="mb-4">Access denied. You may not have permission to access this resource or your session has expired.</p>
            <button
              onClick={() => navigate('/signin')}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors mt-4"
            >
              Go to Sign In
            </button>
          </div>
        );
        
      case 'invalid_token':
        return (
          <div>
            <p className="mb-4">The authentication token is invalid or has expired.</p>
            <button
              onClick={() => navigate('/signin')}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors mt-4"
            >
              Go to Sign In
            </button>
          </div>
        );
        
      default:
        return (
          <div>
            <p className="mb-4">An authentication error occurred. Please try signing in again or contact support if the problem persists.</p>
            <button
              onClick={() => navigate('/signin')}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors mt-4"
            >
              Go to Sign In
            </button>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <FaExclamationTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">Authentication Error</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{errorMessage}</p>
        </div>
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg text-green-800 dark:text-green-200">
            {successMessage}
          </div>
        )}
        
        {renderErrorContent()}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link to="/signin" className="text-primary hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthError; 