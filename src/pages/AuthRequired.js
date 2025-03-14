import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaLock, FaLeaf, FaSignInAlt, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const AuthRequired = () => {
  const { user, resendVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  // Check if we have a state message (e.g., from redirection)
  const message = location.state?.message || "Authentication required to access this content.";
  const isEmailVerificationIssue = user && message.toLowerCase().includes('verify') && message.toLowerCase().includes('email');
  
  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      const { error } = await resendVerification(user.email);
      
      if (error) throw error;
      
      setSuccess(true);
    } catch (error) {
      console.error('Error resending verification email:', error);
      setError(error.message || 'Failed to resend verification email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-lg w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="inline-block p-4 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <FaLock className="text-4xl text-yellow-500" />
          </div>
        </div>
        
        <div className="mb-6">
          <FaLeaf className="text-6xl text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {isEmailVerificationIssue ? 'Email Verification Required' : 'Authentication Required'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {message}
          </p>
          
          {isEmailVerificationIssue && (
            <div className="mt-6 mb-6">
              {success ? (
                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-green-800 dark:text-green-200 mb-4">
                  Verification email sent! Please check your inbox and spam folder.
                </div>
              ) : error ? (
                <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-red-800 dark:text-red-200 mb-4">
                  {error}
                </div>
              ) : null}
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We've sent a verification link to <strong>{user?.email}</strong>. 
                If you didn't receive it, click below to resend the email.
              </p>
              
              <button
                onClick={handleResendVerification}
                disabled={loading || success}
                className="flex items-center justify-center gap-2 mx-auto bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                <FaEnvelope />
                {loading ? 'Sending...' : success ? 'Email Sent' : 'Resend Verification Email'}
              </button>
            </div>
          )}
        </div>
        
        {!user && (
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              to="/signin" 
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <FaSignInAlt />
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-primary border-2 border-primary font-bold py-3 px-6 rounded-lg transition-colors dark:bg-transparent dark:hover:bg-gray-700"
            >
              <FaUserPlus />
              Create Account
            </Link>
          </div>
        )}
        
        {!isEmailVerificationIssue && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Why Create an Account?
            </h3>
            <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Access personalized weather forecasts for your specific locations
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Save and track crop yield predictions for different crops
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Receive customized alerts and notifications for weather events
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Track historical weather data and view agricultural insights
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthRequired;