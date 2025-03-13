import React, { useState } from 'react';
import { supabase } from '../lib/supabase-fixed'; // Use the fixed Supabase client

const FixedSignup = () => {
  const [formData, setFormData] = useState({
    email: `test.${Date.now()}@example.com`,
    password: 'Password123!',
    fullName: 'Test User'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [networkDetails, setNetworkDetails] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setNetworkDetails(null);

    try {
      console.log('Starting signup with data:', {
        email: formData.email,
        password: formData.password.replace(/./g, '*')  // Don't log actual password
      });

      // Override fetch to capture request details
      const originalFetch = window.fetch;
      let requestInfo = null;
      let responseInfo = null;

      window.fetch = async function(url, options) {
        if (url.includes('auth/v1/signup')) {
          requestInfo = {
            url,
            method: options.method,
            headers: options.headers
          };

          try {
            const response = await originalFetch(url, options);
            const clonedResponse = response.clone();
            
            responseInfo = {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries([...response.headers])
            };
            
            try {
              const body = await clonedResponse.json();
              responseInfo.body = body;
            } catch (e) {
              responseInfo.parseError = e.message;
            }
            
            return response;
          } catch (fetchError) {
            responseInfo = { error: fetchError.message };
            throw fetchError;
          }
        }
        return originalFetch(url, options);
      };

      // Make signup request
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      });

      // Restore original fetch
      window.fetch = originalFetch;

      // Set network details
      setNetworkDetails({ request: requestInfo, response: responseInfo });

      if (error) {
        console.error('Signup error:', error);
        setError(error);
      } else {
        console.log('Signup successful:', data);
        setResult(data);
      }
    } catch (err) {
      console.error('Exception during signup:', err);
      setError(err);
    } finally {
      setLoading(false);
      
      // Restore fetch if it somehow didn't get restored
      if (window.fetch !== originalFetch) {
        window.fetch = originalFetch;
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Fixed Signup Test</h1>
      
      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Full Name:
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <pre className="text-xs mt-2 overflow-auto max-h-40">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-bold">Success:</h3>
          <pre className="text-xs mt-2 overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      {networkDetails && (
        <div className="mt-4 p-3 bg-gray-100 border border-gray-400 rounded">
          <h3 className="font-bold">Network Details:</h3>
          
          <div className="mt-2">
            <h4 className="font-semibold">Request:</h4>
            <pre className="text-xs mt-1 overflow-auto max-h-40">
              {JSON.stringify(networkDetails.request, null, 2)}
            </pre>
          </div>
          
          <div className="mt-2">
            <h4 className="font-semibold">Response:</h4>
            <pre className="text-xs mt-1 overflow-auto max-h-40">
              {JSON.stringify(networkDetails.response, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedSignup;