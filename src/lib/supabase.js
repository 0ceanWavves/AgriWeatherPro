import { createClient } from '@supabase/supabase-js';

// Use hardcoded values for troubleshooting
const supabaseUrl = 'https://gexynwadeancyvnthsbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTQyMTcsImV4cCI6MjA1NzI5MDIxN30.hWr5DqCEHAWjgejgYmZw2ARvO_UoiydGILI25-7NivM';

console.log('Connecting to Supabase at:', supabaseUrl);
console.log('Using API key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
