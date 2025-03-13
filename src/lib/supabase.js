import { createClient } from '@supabase/supabase-js';

// Hardcoded fallback values (make sure these are your actual values)
const FALLBACK_URL = 'https://gexynwadeancyvnthsbu.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzczMDMsImV4cCI6MjAyNTkxMzMwM30.DjMm1jKSxjhSJxcCoUJcX1fxFc9oTGUPc0IwTfLQJFM';

// Try environment variables first, fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

// Log configuration (remove in production)
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0,
  usingFallbacks: !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY
});

// Create Supabase client with simpler options to fix auth issues
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'agriweatherpro_auth',
    autoRefreshToken: true
  }
});

export { supabase };
