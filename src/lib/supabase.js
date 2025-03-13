import { createClient } from '@supabase/supabase-js';

// Use hardcoded URL and key for all environments
const supabaseUrl = 'https://gexynwadeancyvnthsbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzczMDMsImV4cCI6MjAyNTkxMzMwM30.DjMm1jKSxjhSJxcCoUJcX1fxFc9oTGUPc0IwTfLQJFM';

// Log configuration (remove in production)
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0
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
