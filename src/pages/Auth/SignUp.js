import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaLeaf, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Add debug info on component load
  useEffect(() => {
    const getDebugInfo = async () => {
      try {
        console.log('Getting debug information...');
        
        // Check if supabase client is initialized
        const supabaseInitialized = !!supabase;
        console.log('Supabase initialized:', supabaseInitialized);
        
        // Check API connection
        let apiStatus = 'Unknown';
        try {
          // A simple query to test if Supabase is accessible
          const start = Date.now();
          const { error } = await supabase.from('profiles').select('count', { count: 'exact' }).limit(1);
          const end = Date.now();
          
          if (error) {
            apiStatus = `Error: ${error.message}`;
            console.error('Supabase API test error:', error);
          } else {
            apiStatus = `Connected (${end - start}ms)`;
            console.log('Supabase API test successful');
          }
        } catch (error) {
          apiStatus = `Exception: ${error.message}`;
          console.error('Supabase API test exception:', error);
        }
        
        // Get the origin for CORS debugging
        const origin = window.location.origin;
        
        setDebugInfo({
          supabaseInitialized,
          apiStatus,
          origin,
          url: supabase.supabaseUrl,
          keyFirstChars: supabase.supabaseKey ? supabase.supabaseKey.substring(0, 10) + '...' : 'Not available'
        });
        
        console.log('Debug info collected:', {
          supabaseInitialized,
          apiStatus,
          origin,
          url: supabase.supabaseUrl,
          keyFirstChars: supabase.supabaseKey ? supabase.supabaseKey.substring(0, 10) + '...' : 'Not available'
        });
      } catch (error) {
        console.error('Error collecting debug info:', error);
        setDebugInfo({ error: error.message });
      }
    };
    
    getDebugInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Form submitted for:', email);
    
    // Validate inputs
    if (password !== confirmPassword) {
      console.log('Password validation failed: passwords do not match');
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      console.log('Password validation failed: password too short');
      return setError('Password must be at least 6 characters');
    }
    
    setLoading(true);
    console.log('Starting signup process...');
    
    try {
      console.log('Calling signUp function with email:', email);
      const { data, error } = await signUp(email, password);
      console.log('Sign up result:', error ? 'Error occurred' : 'Success');
      
      if (error) {
        console.error('Error from signUp function:', error);
        throw error;
      }
      
      console.log('Sign up successful, user data:', data?.user?.id ? 'User ID exists' : 'No user ID');
      setSuccess(true);
      // In a real app, you might want to save the user's name to a profile table here
      
      // Automatically redirect after a short delay
      console.log('Scheduling redirect to dashboard...');
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Exception in handleSubmit:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
      console.log('Sign up process completed');
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
        
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create your AgriWeather Pro account
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Account created successfully! Redirecting you to the dashboard...
          </div>
        )}
        
        {/* Debug info panel */}
        {Object.keys(debugInfo).length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            <p className="font-bold mb-1">Debug Info:</p>
            <ul className="space-y-1">
              <li>Supabase Initialized: {debugInfo.supabaseInitialized ? 'Yes' : 'No'}</li>
              <li>API Status: {debugInfo.apiStatus}</li>
              <li>Origin: {debugInfo.origin}</li>
              <li>Supabase URL: {debugInfo.url}</li>
              <li>API Key (first chars): {debugInfo.keyFirstChars}</li>
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </span>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div className="mb-4">
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
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;