/**
 * AgriWeather Pro Database Initialization Script (Fixed)
 * 
 * This script initializes the database for AgriWeather Pro using the Supabase MCP.
 * It uses improved error handling and connection testing.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// MCP server URL - updated port to 3011
const MCP_URL = 'http://localhost:3011';

// Use the project reference that the MCP server is currently configured with
const PROJECT_REF = 'hpicefjfbyqxfbaugvyn';

// Load SQL from file
const loadSqlFromFile = (filename) => {
  const filePath = path.join(__dirname, filename);
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading SQL file ${filename}:`, error.message);
    process.exit(1);
  }
};

// Execute SQL with better error handling
const executeSQL = async (sql) => {
  try {
    console.log(`Executing SQL with project ref: ${PROJECT_REF}`);
    
    // Split the SQL into smaller chunks if it's large
    if (sql.length > 50000) {
      console.log(`SQL is large (${sql.length} chars), executing in smaller chunks...`);
      return await executeSQLInBatches(sql);
    }
    
    const response = await axios.post(`${MCP_URL}/execute_postgresql`, { 
      sql,
      projectRef: PROJECT_REF
    });
    
    if (response.data && response.data.error) {
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
    
    // Print detailed error information
    if (error.response) {
      console.error('Response status:', error.response.status);
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          console.error('Response data:', error.response.data.substring(0, 500) + '...');
        } else {
          console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.error(`Could not connect to MCP server at ${MCP_URL}. Make sure it's running.`);
    }
    
    return false;
  }
};

// Test MCP connection
const testConnection = async () => {
  try {
    console.log('Testing connection to MCP server...');
    console.log(`Using project reference: ${PROJECT_REF}`);
    console.log(`MCP URL: ${MCP_URL}`);
    
    // First try a basic health check
    try {
      const healthResponse = await axios.get(`${MCP_URL}/health`);
      console.log('MCP server health check:', healthResponse.data ? 'OK' : 'Failed');
    } catch (healthError) {
      console.log('MCP server health check failed. Continuing anyway...');
    }
    
    // Then try to get tables
    const response = await axios.post(`${MCP_URL}/get_tables`, {
      projectRef: PROJECT_REF,
      schema: 'public'
    });
    
    console.log('Connection successful!');
    if (response.data && Array.isArray(response.data)) {
      console.log(`Found ${response.data.length} tables`);
      if (response.data.length > 0) {
        console.log('Existing tables:', response.data.map(t => t.name).join(', '));
      }
    } else {
      console.log('Unexpected response format, but connection works');
    }
    return true;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error(`Could not connect to MCP server at ${MCP_URL}. Make sure it's running.`);
      console.error('Run "node C:\\MCP\\supabase-mcp-server\\run_mcp.js" in a separate terminal window');
    }
    
    return false;
  }
};

// Execute smaller batches of SQL
const executeSQLInBatches = async (sql) => {
  // Split SQL by semicolons, respecting function definitions
  const statements = [];
  let currentStatement = '';
  let nestedLevel = 0;
  let inComment = false;
  let inQuote = false;
  let escapeNext = false;
  
  // Improved SQL parser to handle function definitions and other nested structures
  const lines = sql.split('\n');
  for (const line of lines) {
    // Skip empty lines
    if (line.trim() === '') {
      continue;
    }
    
    // Add the line to the current statement
    currentStatement += line + '\n';
    
    // Check for statement termination
    if (line.trim().endsWith(';') && nestedLevel === 0 && !inComment) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
    
    // Check for BEGIN/END blocks, nested quotes, etc.
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = i < line.length - 1 ? line[i + 1] : '';
      
      // Handle escape character
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      // Handle escape sequence
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      // Check for quotes
      if (char === "'" && !inComment) {
        inQuote = !inQuote;
        continue;
      }
      
      // Skip everything if in quote or comment
      if (inQuote || inComment) {
        // Check for end of line comment
        if (inComment && char === '*' && nextChar === '/') {
          inComment = false;
          i++; // Skip the next character
        }
        continue;
      }
      
      // Check for comments
      if (char === '/' && nextChar === '*') {
        inComment = true;
        i++; // Skip the next character
        continue;
      }
      
      // Check for beginning of blocks
      if (char === 'B' && line.substring(i, i + 5) === 'BEGIN') {
        nestedLevel++;
        continue;
      }
      
      // Check for end of blocks
      if (char === 'E' && line.substring(i, i + 3) === 'END') {
        nestedLevel = Math.max(0, nestedLevel - 1);
        continue;
      }
      
      // Check for dollar-quoted strings
      if (char === '$' && nextChar === '$') {
        nestedLevel++;
        i++; // Skip the next character
        continue;
      }
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
      console.error('Statement:', stmt.length > 200 ? stmt.substring(0, 200) + '...' : stmt);
      return false;
    }
  }
  
  return true;
};

// Initialize database
const initializeDatabase = async () => {
  console.log('Starting AgriWeather Pro database initialization...');
  console.log('Using Supabase project reference:', PROJECT_REF);
  console.log('Using MCP URL:', MCP_URL);
  
  // Test connection first
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('Failed to connect to the MCP server. Please make sure it is running.');
    console.log('Run "node C:\\MCP\\supabase-mcp-server\\run_mcp.js" in a separate terminal window');
    return;
  }
  
  // Load SQL files - use fixed versions
  const schemaSQL = loadSqlFromFile('schema-fixed.sql');
  const seedSQL = loadSqlFromFile('seed-data-fixed.sql');
  
  // Execute schema SQL
  console.log('Creating database schema...');
  const schemaResult = await executeSQL(schemaSQL);
  if (!schemaResult) {
    console.error('Failed to create database schema');
    return;
  }
  
  // Execute seed data SQL
  console.log('Seeding initial data...');
  const seedResult = await executeSQL(seedSQL);
  if (!seedResult) {
    console.error('Failed to seed database');
    return;
  }
  
  console.log('✅ Database initialization completed successfully!');
  console.log('NOTE: Database was initialized in project hpicefjfbyqxfbaugvyn.');
  console.log('You may need to update your application settings if you wanted to use gexynwadeancyvnthsbu.');
};

// Run the initialization
initializeDatabase().catch(error => {
  console.error('Database initialization failed:', error);
});