import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';

// Create a fresh Supabase client directly in this component
const supabaseUrl = 'https://gexynwadeancyvnthsbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzczMDMsImV4cCI6MjAyNTkxMzMwM30.DjMm1jKSxjhSJxcCoUJcX1fxFc9oTGUPc0IwTfLQJFM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DirectSignup = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  // Helper to log debug info
  const logDebug = (message, data = null) => {
    const logMsg = data ? `${message}: ${JSON.stringify(data, null, 2)}` : message;
    console.log(logMsg);
    setDebugInfo(prev => prev + '\n' + logMsg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    logDebug('Starting direct signup process...');
    
    const formEmail = e.target.email.value;
    const formPassword = e.target.password.value;
    const formFullName = e.target.fullName.value;
    
    // Validate inputs
    if (!formEmail || !formPassword || !formFullName) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    
    try {
      logDebug('Sending signup request for email:', formEmail);
      
      // Direct signup with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formEmail,
        password: formPassword,
        options: {
          data: {
            full_name: formFullName
          }
        }
      });

      if (error) {
        logDebug('Signup error received:', { message: error.message, status: error.status });
        throw error;
      }
      
      logDebug('Signup successful!', data);
      setSuccess(true);
      
      // Redirect after successful signup
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
      
    } catch (error) {
      console.error('Direct signup error:', error);
      logDebug('Signup exception:', { 
        message: error.message, 
        status: error.status,
        name: error.name
      });
      setError(error.message || 'An error occurred during signup');
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
        
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Direct Signup Test
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
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              defaultValue="Test User"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              defaultValue={`test.${Date.now()}@example.com`}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              defaultValue="Password123!"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Create a password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Test Direct Signup'}
          </button>
        </form>
        
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <h3 className="text-sm font-bold mb-2">Debug Information:</h3>
            <pre className="text-xs overflow-auto max-h-60 whitespace-pre-wrap">
              {debugInfo}
            </pre>
          </div>
        )}
        
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <a href="/signup" className="text-primary hover:text-primary/90 font-semibold">
            Back to normal signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default DirectSignup;