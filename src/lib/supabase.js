import { createClient } from '@supabase/supabase-js';

// Load credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://imykwqkjiphztfyolsmn.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWt3cWtqaXBoenRmeW9sc21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDI5NTUsImV4cCI6MjA1NzQ3ODk1NX0.zITI20Fs6wyys55gTNVFRXt7FALs9dPfcfQlwNaIMko';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Test function to verify Supabase authentication is working
 * Used for troubleshooting
 */
export async function testSupabaseAuth() {
  try {
    // Test if we can make a basic auth request
    const { data, error } = await supabase.auth.getSession();
    
    return {
      success: !error,
      data: data,
      error: error,
      url: supabaseUrl,
      timestamp: new Date().toISOString()
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
      url: supabaseUrl,
      timestamp: new Date().toISOString()
    };
  }
}
