// Simple test script
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gexynwadeancyvnthsbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzczMDMsImV4cCI6MjAyNTkxMzMwM30.DjMm1jKSxjhSJxcCoUJcX1fxFc9oTGUPc0IwTfLQJFM';

console.log("Creating Supabase client...");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Testing auth.getSession...");
supabase.auth.getSession()
  .then(response => {
    console.log("Session response:", response);
  })
  .catch(error => {
    console.error("Error fetching session:", error);
  });
