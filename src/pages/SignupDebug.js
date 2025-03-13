import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const SignupDebug = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  // Helper to log debug information
  const logDebug = (message, data = null) => {
    const logMsg = data ? `${message}: ${JSON.stringify(data, null, 2)}` : message;
    console.log(logMsg);
    setDebugInfo(prev => prev + '\n' + logMsg);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setDebugInfo('Starting signup process...');
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      // Log the request we're about to make
      logDebug('About to make signup request with', { email, fullName });
      
      // First, try to check if the API key is valid by making a simple API call
      try {
        logDebug('Testing Supabase connection...');
        const { data: healthCheck, error: healthError } = await supabase.auth.getSession();
        
        if (healthError) {
          logDebug('Connection test failed', healthError);
        } else {
          logDebug('Connection test successful', { sessionExists: !!healthCheck.session });
        }
      } catch (healthError) {
        logDebug('Connection test exception', healthError);
      }
      
      // Now try the actual signup
      logDebug('Making signup request now...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // Explicitly set email confirmation to true
          emailRedirectTo: window.location.origin + '/login',
        },
      });

      logDebug('Signup request completed');
      
      if (error) {
        logDebug('Signup error received', error);
        throw error;
      }
      
      logDebug('Signup successful', data);
      
      // Navigate to login page with success message
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please check your email for verification link.' 
        } 
      });
    } catch (error) {
      console.error('Error signing up:', error);
      logDebug('Exception during signup', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        status: error.status,
        statusText: error.statusText
      });
      
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  // Direct API test without going through your app's logic
  const testDirectSignup = async () => {
    setDebugInfo('Starting direct API test...');
    try {
      const testEmail = 'test' + Date.now() + '@example.com';
      const testPassword = 'Test123456!';
      
      logDebug('Testing direct API with', { testEmail });
      
      const response = await fetch('https://gexynwadeancyvnthsbu.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzczMDMsImV4cCI6MjAyNTkxMzMwM30.DjMm1jKSxjhSJxcCoUJcX1fxFc9oTGUPc0IwTfLQJFM'
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          data: {
            full_name: 'Test User'
          }
        })
      });
      
      const responseData = await response.json();
      logDebug('Direct API response', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
    } catch (error) {
      logDebug('Direct API test error', {
        name: error.name,
        message: error.message
      });
    }
  };

  // Test the Supabase client directly
  const testSupabaseClient = async () => {
    setDebugInfo('Testing Supabase client configuration...');
    
    try {
      const url = await supabase.storage.url || 'UNDEFINED';
      logDebug('Supabase instance URL', url);
      
      // Check what headers the client is using
      logDebug('Attempting auth.getSession() to see headers...');
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        logDebug('getSession error', error);
      } else {
        logDebug('getSession successful');
      }
    } catch (error) {
      logDebug('Supabase client test error', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Signup Debug Mode
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="fullName" className="sr-only">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Creating account...' : 'Sign up (normal flow)'}
            </button>
            
            <button
              type="button"
              onClick={testDirectSignup}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Test Direct API
            </button>
            
            <button
              type="button"
              onClick={testSupabaseClient}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Test Supabase Client
            </button>
          </div>
        </form>

        <div className="text-sm text-center mb-4">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to normal signup
          </Link>
        </div>
        
        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="text-sm font-bold mb-2">Debug Information:</h3>
            <pre className="text-xs overflow-auto max-h-60">
              {debugInfo}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupDebug;