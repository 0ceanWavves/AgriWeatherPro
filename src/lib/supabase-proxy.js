// src/lib/supabase-proxy.js
import { createClient } from '@supabase/supabase-js';

// Use proxy URL for local development
const isDevelopment = process.env.NODE_ENV === 'development';
const supabaseUrl = isDevelopment 
  ? '/supabase-api' // This will be proxied through your dev server
  : 'https://imykwqkjiphztfyolsmn.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWt3cWtqaXBoenRmeW9sc21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDI5NTUsImV4cCI6MjA1NzQ3ODk1NX0.zITI20Fs6wyys55gTNVFRXt7FALs9dPfcfQlwNaIMko'; // Replace with your actual key

// Initialize the client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export { supabase };