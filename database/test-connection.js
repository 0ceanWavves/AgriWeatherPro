/**
 * Test connection to Supabase MCP
 */
const axios = require('axios');

// MCP server URL with updated port
const MCP_URL = 'http://localhost:3011';

// Using the project reference that MCP server is configured with
const PROJECT_REF = 'hpicefjfbyqxfbaugvyn';

// Test connection function
const testConnection = async () => {
  try {
    console.log('Testing connection to MCP server...');
    console.log(`Project ref: ${PROJECT_REF}`);
    console.log(`MCP URL: ${MCP_URL}`);
    
    const response = await axios.get(`${MCP_URL}/health`);
    
    console.log('MCP Server health check response:', response.data);
    
    // Try to get tables
    try {
      const tablesResponse = await axios.post(`${MCP_URL}/get_tables`, {
        projectRef: PROJECT_REF,
        schema: 'public'
      });
      
      console.log('Connection successful!');
      if (tablesResponse.data && Array.isArray(tablesResponse.data)) {
        console.log(`Found ${tablesResponse.data.length} tables:`, 
          tablesResponse.data.map(t => t.name).join(', '));
      } else {
        console.log('Response data:', tablesResponse.data);
      }
    } catch (tableError) {
      console.error('Could not get tables:', tableError.message);
      if (tableError.response) {
        console.error('Response data:', tableError.response.data);
        console.error('Response status:', tableError.response.status);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    console.error('Make sure the Supabase MCP server is running!');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.code === 'ECONNREFUSED') {
      console.error(`Could not connect to the MCP server. Is it running on port 3011?`);
    }
    return false;
  }
};

// Run the test
testConnection().catch(error => {
  console.error('Test failed with error:', error);
});