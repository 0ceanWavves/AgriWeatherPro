/**
 * AgriWeather Pro Database Initialization Script
 * 
 * This script initializes the database for AgriWeather Pro using the Supabase MCP.
 * Run this script using Node.js with your Supabase MCP server running
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// MCP server URL - modify if different
const MCP_URL = 'http://localhost:3000';

// Your Supabase project reference
const PROJECT_REF = 'hpicefjfbyqxfbaugvyn';

// Load SQL from file
const loadSqlFromFile = (filename) => {
  const filePath = path.join(__dirname, filename);
  return fs.readFileSync(filePath, 'utf8');
};

// Execute SQL
const executeSQL = async (sql) => {
  try {
    console.log(`Executing SQL with project ref: ${PROJECT_REF}`);
    
    const response = await axios.post(`${MCP_URL}/execute_postgresql`, { 
      sql,
      projectRef: PROJECT_REF
    });
    
    if (response.data.error) {
      console.error('SQL Execution Error:', response.data.error);
      if (response.data.details) {
        console.error('Error Details:', response.data.details);
      }
      return false;
    }
    
    console.log('SQL executed successfully');
    return true;
  } catch (error) {
    console.error('Failed to execute SQL:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
};

// Test MCP connection
const testConnection = async () => {
  try {
    console.log('Testing connection to MCP server...');
    const response = await axios.post(`${MCP_URL}/get_tables`, {
      projectRef: PROJECT_REF,
      schema: 'public'
    });
    
    console.log('Connection successful!');
    console.log(`Found ${response.data.length} tables`);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
};

// Execute smaller batches of SQL
const executeSQLInBatches = async (sql) => {
  // Split SQL by semicolons, respecting the boundaries of functions and other multi-line statements
  const statements = [];
  let currentStatement = '';
  let nestedLevel = 0;
  
  // Crude SQL parser to handle function definitions and other nested structures
  const lines = sql.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (trimmedLine === '' || trimmedLine.startsWith('--')) {
      continue;
    }
    
    // Check for beginning of blocks (function definitions, etc.)
    if (trimmedLine.includes('BEGIN') || trimmedLine.includes('$$')) {
      nestedLevel++;
    }
    
    // Check for end of blocks
    if (trimmedLine.includes('END;') || trimmedLine.includes('$$')) {
      nestedLevel = Math.max(0, nestedLevel - 1);
    }
    
    // Add the line to the current statement
    currentStatement += line + '\n';
    
    // If we're at the top level and the line ends with a semicolon, it's a complete statement
    if (nestedLevel === 0 && trimmedLine.endsWith(';')) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim() !== '') {
    statements.push(currentStatement.trim());
  }
  
  console.log(`Executing ${statements.length} SQL statements in batches...`);
  
  // Execute each statement
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (stmt.trim() === '') continue;
    
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    const result = await executeSQL(stmt);
    if (!result) {
      console.error(`Failed at statement ${i + 1}/${statements.length}`);
      console.error('Statement:', stmt);
      return false;
    }
  }
  
  return true;
};

// Initialize database
const initializeDatabase = async () => {
  console.log('Starting AgriWeather Pro database initialization...');
  
  // Test connection first
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('Failed to connect to the MCP server. Please check that it is running.');
    return;
  }
  
  // Load SQL files
  const schemaSQL = loadSqlFromFile('schema.sql');
  const seedSQL = loadSqlFromFile('seed-data.sql');
  
  // Execute schema SQL in batches
  console.log('Creating database schema...');
  const schemaResult = await executeSQLInBatches(schemaSQL);
  if (!schemaResult) {
    console.error('Failed to create database schema');
    return;
  }
  
  // Execute seed data SQL
  console.log('Seeding initial data...');
  const seedResult = await executeSQLInBatches(seedSQL);
  if (!seedResult) {
    console.error('Failed to seed database');
    return;
  }
  
  console.log('✅ Database initialization completed successfully!');
};

// Run the initialization
initializeDatabase().catch(error => {
  console.error('Database initialization failed:', error);
});