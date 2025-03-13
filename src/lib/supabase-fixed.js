import { createClient } from '@supabase/supabase-js';

// Hard-coded values for reliability (will read from environment in production)
const supabaseUrl = 'https://gexynwadeancyvnthsbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzczMDMsImV4cCI6MjAyNTkxMzMwM30.DjMm1jKSxjhSJxcCoUJcX1fxFc9oTGUPc0IwTfLQJFM';

// Log values to ensure they're being loaded correctly
console.log('Supabase Fixed Client - URL:', supabaseUrl);
console.log('Supabase Fixed Client - Key (first 10 chars):', supabaseAnonKey?.substring(0, 10) + '...');

// Create client with specific config for auth
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'agriweatherpro-auth'
  }
});

export { supabase };
