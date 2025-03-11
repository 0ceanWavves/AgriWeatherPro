import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to hardcoded values for development
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gexynwadeancyvnthsbu.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MzQ2NTMsImV4cCI6MjA1NjUxMDY1M30.TLgj23LVCqfM5lMBYBMTK3PBU78Ge78ezvwhjrALbHE';

console.log('Connecting to Supabase at:', supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
