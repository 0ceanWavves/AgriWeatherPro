// Test Supabase connection script
// Run with: node test-supabase.js

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gexynwadeancyvnthsbu.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzczMDMsImV4cCI6MjAyNTkxMzMwM30.DjMm1jKSxjhSJxcCoUJcX1fxFc9oTGUPc0IwTfLQJFM';

console.log('Testing Supabase connection with:');
console.log('URL:', supabaseUrl);
console.log('Key (first 15 chars):', supabaseAnonKey.substring(0, 15) + '...');

async function test() {
  try {
    console.log('\n1. Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('\n2. Testing auth endpoints...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth check failed:', error);
    } else {
      console.log('Auth check successful!', data.session ? 'Session exists' : 'No active session');
    }
    
    console.log('\n3. Testing database access (profiles table)...');
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (profilesError) {
        console.error('Profiles table check failed:', profilesError);
      } else {
        console.log('Profiles table check successful!');
        console.log(`Found ${profilesData.length} profile(s)`);
      }
    } catch (err) {
      console.error('Profiles table exception:', err);
    }
    
    console.log('\n4. Testing a signup attempt with a random email...');
    try {
      const testEmail = `test.${Date.now()}@example.com`;
      const testPassword = 'Password123!';
      
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });
      
      if (signupError) {
        console.error('Signup test failed:', signupError);
      } else {
        console.log('Signup test successful!');
        console.log('Response:', JSON.stringify(signupData, null, 2));
      }
    } catch (err) {
      console.error('Signup exception:', err);
    }
    
  } catch (error) {
    console.error('Test failed with exception:', error);
  }
}

test();
