// src/lib/supabase-proxy.js
import { createClient } from '@supabase/supabase-js';

// Use proxy URL for local development
const isDevelopment = process.env.NODE_ENV === 'development';
const supabaseUrl = isDevelopment 
  ? '/supabase-api' // This will be proxied through your dev server
  : 'https://gexynwadeancyvnthsbu.supabase.co';

const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual key

// Initialize the client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export { supabase };