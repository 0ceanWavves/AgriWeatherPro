import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://gexynwadeancyvnthsbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzczMDMsImV4cCI6MjAyNTkxMzMwM30.DjMm1jKSxjhSJxcCoUJcX1fxFc9oTGUPc0IwTfLQJFM';

// Force production mode for security
const isProduction = true;

// Create Supabase client with security-focused options
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    },
  },
  // Explicitly disable debug mode to prevent info leaks
  debug: false
});

// Remove any debug information from global scope
if (typeof window !== 'undefined') {
  // Remove any debug props that might be attached
  window.__SUPABASE_DEBUG__ = undefined;
}

export { supabase };
