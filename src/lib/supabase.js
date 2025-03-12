import { createClient } from '@supabase/supabase-js';

// Use environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase at:', supabaseUrl);
console.log('Using API key (first 10 chars):', supabaseAnonKey?.substring(0, 10) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
