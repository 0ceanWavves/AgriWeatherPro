// Import the singleton instance creation function from the main supabase.js file
import { getSupabaseClient } from './supabase';

// For compatibility with existing code
const supabase = getSupabaseClient();

// Export the supabase client
export { supabase };
