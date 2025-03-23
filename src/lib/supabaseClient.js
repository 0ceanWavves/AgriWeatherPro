import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://imykwqkjiphztfyolsmn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWt3cWtqaXBoenRmeW9sc21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDI5NTUsImV4cCI6MjA1NzQ3ODk1NX0.zITI20Fs6wyys55gTNVFRXt7FALs9dPfcfQlwNaIMko';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if a user is logged in
export const isLoggedIn = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return !!user;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};