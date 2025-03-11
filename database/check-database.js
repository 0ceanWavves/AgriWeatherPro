/**
 * AgriWeather Pro Database Status Checker
 * 
 * This script checks the status of the database for AgriWeather Pro using the Supabase MCP.
 * Run this script using Node.js with your Supabase MCP server running
 */

const axios = require('axios');

// MCP server URL - modify if different
const MCP_URL = 'http://localhost:3000';
const PROJECT_REF = 'gexynwadeancyvnthsbu'; // Your Supabase project reference

// Execute a query
const executeQuery = async (sql) => {
  try {
    const response = await axios.post(`${MCP_URL}/execute_postgresql`, { 
      sql,
      projectRef: PROJECT_REF
    });
    
    if (response.data.error) {
      console.error('Query Error:', response.data.error);
      return { error: response.data.error };
    }
    
    return { data: response.data };
  } catch (error) {
    console.error('Failed to execute query:', error.message);
    return { error: error.message };
  }
};

// Get tables
const getTables = async () => {
  try {
    const response = await axios.post(`${MCP_URL}/get_tables`, { 
      projectRef: PROJECT_REF,
      schema: 'public'
    });
    
    if (response.data.error) {
      console.error('Error getting tables:', response.data.error);
      return { error: response.data.error };
    }
    
    return { tables: response.data };
  } catch (error) {
    console.error('Failed to get tables:', error.message);
    return { error: error.message };
  }
};

// Check database status
const checkDatabaseStatus = async () => {
  console.log('🔍 Checking AgriWeather Pro database status...');
  
  // Get tables
  console.log('\n📋 Checking tables...');
  const tablesResult = await getTables();
  if (tablesResult.error) {
    console.error('Failed to get tables');
    return;
  }
  
  const tables = tablesResult.tables;
  console.log(`Found ${tables.length} tables:`);
  tables.forEach(table => {
    console.log(`- ${table.name}`);
  });
  
  // Check row counts in main tables
  console.log('\n📊 Checking row counts...');
  const tableNames = [
    'user_profiles', 
    'user_preferences', 
    'saved_locations',
    'weather_reports',
    'crop_predictions',
    'user_weather_alerts'
  ];
  
  for (const tableName of tableNames) {
    if (!tables.find(t => t.name === tableName)) {
      console.log(`❌ Table '${tableName}' does not exist`);
      continue;
    }
    
    const countResult = await executeQuery(`SELECT COUNT(*) FROM ${tableName}`);
    if (countResult.error) {
      console.log(`❌ Error counting rows in '${tableName}': ${countResult.error}`);
      continue;
    }
    
    const count = countResult.data.result[0].count;
    console.log(`✅ Table '${tableName}': ${count} rows`);
  }
  
  // Check auth users
  console.log('\n👤 Checking auth users...');
  const usersResult = await executeQuery('SELECT COUNT(*) FROM auth.users');
  if (usersResult.error) {
    console.log('❌ Error checking auth users');
  } else {
    const userCount = usersResult.data.result[0].count;
    console.log(`Found ${userCount} users in auth.users`);
  }
  
  // Check triggers
  console.log('\n⚡ Checking triggers...');
  const triggersResult = await executeQuery(`
    SELECT trigger_name, event_manipulation, action_statement 
    FROM information_schema.triggers 
    WHERE trigger_schema = 'public'
  `);
  
  if (triggersResult.error) {
    console.log('❌ Error checking triggers');
  } else {
    const triggers = triggersResult.data.result;
    if (triggers.length === 0) {
      console.log('No triggers found');
    } else {
      console.log(`Found ${triggers.length} triggers:`);
      triggers.forEach(trigger => {
        console.log(`- ${trigger.trigger_name} (${trigger.event_manipulation})`);
      });
    }
  }
  
  console.log('\n✅ Database status check completed');
};

// Run the check
checkDatabaseStatus().catch(error => {
  console.error('Database status check failed:', error);
});