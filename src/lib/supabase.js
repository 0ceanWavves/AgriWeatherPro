import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these values with your new Supabase project credentials
const supabaseUrl = 'https://imykwqkjiphztfyolsmn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWt3cWtqaXBoenRmeW9sc21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDI5NTUsImV4cCI6MjA1NzQ3ODk1NX0.zITI20Fs6wyys55gTNVFRXt7FALs9dPfcfQlwNaIMko';

// Create a singleton instance with a unique storage key to avoid conflicts
let supabaseInstance = null;

// Initialize Supabase client (singleton pattern)
function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Create new instance with unique storage key
  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'agriweatherpro-supabase-auth', // Unique storage key to avoid conflicts
      flowType: 'pkce' // Add PKCE flow for improved security
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-v2'
      },
    },
  });

  // Debug initialization (only happens once)
  console.log('Supabase client initialized with URL:', supabaseUrl);
  
  return supabaseInstance;
}

// Export the singleton instance
const supabase = getSupabaseClient();

// Testing function - use this for troubleshooting
export async function testSupabaseAuth() {
  try {
    // Test if we can make a basic auth request
    const { data, error } = await supabase.auth.getSession();
    
    return {
      success: !error,
      data,
      error,
      url: supabaseUrl,
      keyPrefix: supabaseKey.substring(0, 10) + '...' // Show first 10 chars of key for safety
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      url: supabaseUrl
    };
  }
}

export { supabase };