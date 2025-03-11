# AgriWeather Pro Database Setup Instructions

This guide will help you set up your database for AgriWeather Pro.

## Project Reference Mismatch

There seems to be a mismatch between two Supabase projects:

1. **MCP Server Project**: `hpicefjfbyqxfbaugvyn`
   - This is the project the MCP server is currently configured to use for database operations

2. **Web Application Project**: `gexynwadeancyvnthsbu`
   - This is the project your AgriWeather Pro web application is configured to use

## MCP Server Configuration

The MCP server is running on port 3011 (not the default 3000).

## Database Initialization Steps

1. **Start the MCP Server**
   Make sure the MCP server is running in a separate terminal window:
   ```
   node C:\MCP\supabase-mcp-server\run_mcp.js
   ```

2. **Test the Connection**
   First, test if the connection to the MCP server works:
   ```
   node test-connection.js
   ```

3. **Run the Database Initialization**
   ```
   node init-database-fixed.js
   ```
   
   The script is configured to use:
   - MCP URL: http://localhost:3011
   - Project reference: hpicefjfbyqxfbaugvyn

## Important Notes

You have two options for handling the project reference mismatch:

### Option 1: Use the MCP database for development only

- Continue using the MCP-initialized database (`hpicefjfbyqxfbaugvyn`) for local development
- Keep your web application configured for the production database (`gexynwadeancyvnthsbu`)
- When deploying to production, initialize the `gexynwadeancyvnthsbu` database directly through the Supabase dashboard

### Option 2: Reconfigure MCP

You might need to edit the MCP server configuration files to make it use the `gexynwadeancyvnthsbu` project. Look for configuration files in:
```
C:\MCP\supabase-mcp-server\
```

## Troubleshooting

If you encounter issues:

1. Make sure the MCP server is running on port 3011
2. Verify your SQL statements for syntax errors
3. Check the console output for detailed error messages
4. You may need to run statements individually for complex errors

## Files

- `schema-fixed.sql`: Fixed database schema
- `seed-data-fixed.sql`: Fixed seed data
- `init-database-fixed.js`: Fixed initialization script using the MCP server's project
- `test-connection.js`: Test connection to MCP server