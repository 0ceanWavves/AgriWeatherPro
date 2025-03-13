import { createClient } from '@supabase/supabase-js';

// Use hardcoded URL and key for development
const supabaseUrl = 'https://gexynwadeancyvnthsbu.supabase.co';
// Replace with your actual anon key from Supabase dashboard
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzczMDMsImV4cCI6MjAyNTkxMzMwM30.DjMm1jKSxjhSJxcCoUJcX1fxFc9oTGUPc0IwTfLQJFM';

// Create Supabase client with simpler options to fix auth issues
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'agriweatherpro_auth',
    autoRefreshToken: true
  }
});

export { supabase };
