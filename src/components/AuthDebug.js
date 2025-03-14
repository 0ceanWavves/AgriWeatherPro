import React, { useState } from 'react';
import { supabase, testSupabaseAuth } from '../lib/supabase';

const AuthDebug = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const runTest = async () => {
    setLoading(true);
    const results = await testSupabaseAuth();
    setResults(results);
    setLoading(false);
  };
  
  const sendTestEmail = async () => {
    setLoading(true);
    try {
      // Try to send a password reset email
      const testEmail = 'kyletrapp808@gmail.com'; // Use your email
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: window.location.origin + '/reset-password'
      });
      
      setResults({
        emailTest: true,
        success: !error,
        error: error?.message || null,
        message: error ? 'Failed to send test email' : 'Test email sent successfully'
      });
    } catch (err) {
      setResults({
        emailTest: true,
        success: false,
        error: err.message,
        message: 'Exception occurred sending test email'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-lg font-bold mb-2">Auth Debugging Tools</h2>
      
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={runTest}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Auth Setup'}
        </button>
        
        <button 
          onClick={sendTestEmail}
          disabled={loading}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </button>
      </div>
      
      {results && (
        <div className="mt-4 border p-3 rounded bg-gray-50">
          <h3 className="font-bold">Test Results:</h3>
          <pre className="mt-2 text-xs overflow-auto max-h-40">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthDebug; 