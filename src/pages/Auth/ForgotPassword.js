import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaLeaf, FaEnvelope, FaClock } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  
  const { resetPassword } = useAuth();

  // Cooldown timer effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    // Check if we're in cooldown period
    if (cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before requesting another reset link`);
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        // Handle rate limit errors
        if (error.message?.includes('security purposes') || 
            error.message?.includes('rate limit') || 
            error.message?.includes('after')) {
          
          // Extract number of seconds from the error message if available
          const secondsMatch = error.message.match(/(\d+)\s*seconds/);
          const waitSeconds = secondsMatch ? parseInt(secondsMatch[1]) : 30;
          
          setCooldown(waitSeconds);
          setLastRequestTime(Date.now());
          throw new Error(`Rate limit reached. Please wait ${waitSeconds} seconds before trying again.`);
        }
        
        throw error;
      }
      
      // Set a default cooldown even on success to prevent rapid successive requests
      setCooldown(30);
      setLastRequestTime(Date.now());
      setMessage('Check your email for password reset instructions');
    } catch (error) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full">
            <FaLeaf className="text-4xl text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Enter your email and we'll send you instructions to reset your password
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
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
            disabled={loading || cooldown > 0}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 
             cooldown > 0 ? `Wait ${cooldown}s` : 
             'Send Reset Link'}
          </button>
        </form>
        
        {cooldown > 0 && (
          <div className="mt-4 flex items-center justify-center text-gray-600 dark:text-gray-400">
            <FaClock className="mr-2" />
            <span>You can request another reset link in {cooldown} seconds</span>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;