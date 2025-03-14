import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const DebugSupabase = () => {
  const [status, setStatus] = useState('Checking Supabase connection...');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Test basic Supabase connection
        const { data, error } = await supabase.from('_debug').select('*').limit(1).catch(() => ({
          data: null,
          error: { message: 'Could not connect to Supabase' }
        }));
        
        if (error) {
          throw error;
        }
        
        // Try to get auth config (doesn't need to succeed, just needs to connect)
        const { error: authError } = await supabase.auth.getSession();
        
        setStatus('Supabase connection successful!');
      } catch (err) {
        console.error('Supabase connection test failed:', err);
        setError(err.message || 'Connection failed');
        setStatus('Supabase connection failed');
      }
    };
    
    checkConnection();
  }, []);
  
  return (
    <div className="p-4 border rounded bg-gray-50 my-4">
      <h3 className="font-bold text-lg">Supabase Connection Test</h3>
      <p className={error ? 'text-red-600' : 'text-green-600'}>{status}</p>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <div className="mt-2 text-sm text-gray-600">
        <p>This is a temporary debug component to test Supabase connectivity.</p>
        <p>URL: {supabase.supabaseUrl ? '✓ Set' : '✗ Missing'}</p>
        <p>Key: {supabase.supabaseKey ? '✓ Set' : '✗ Missing'}</p>
      </div>
    </div>
  );
};

export default DebugSupabase; 