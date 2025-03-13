import { createClient } from '@supabase/supabase-js';

// Hard-coded values for reliability (will read from environment in production)
const supabaseUrl = 'https://imykwqkjiphztfyolsmn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWt3cWtqaXBoenRmeW9sc21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDI5NTUsImV4cCI6MjA1NzQ3ODk1NX0.zITI20Fs6wyys55gTNVFRXt7FALs9dPfcfQlwNaIMko';

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
