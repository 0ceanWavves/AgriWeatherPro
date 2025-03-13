# Troubleshooting Guide

This guide helps solve common issues you might encounter when using or developing AgriWeather Pro.

## Table of Contents

- [Application Issues](#application-issues)
- [Authentication Issues](#authentication-issues)
- [Data and API Issues](#data-and-api-issues)
- [Map Functionality Issues](#map-functionality-issues)
- [Installation and Setup Issues](#installation-and-setup-issues)
- [Performance Issues](#performance-issues)
- [Database Issues](#database-issues)
- [Deployment Issues](#deployment-issues)

## Application Issues

### Application Not Loading

**Symptoms**: Blank screen or loading spinner that never resolves.

**Possible Solutions**:

1. **Clear Browser Cache**:
   - Chrome: Press Ctrl+Shift+Del, select "Cached images and files", and click "Clear data"
   - Firefox: Press Ctrl+Shift+Del, select "Cache", and click "Clear Now"
   - Safari: Go to Safari > Preferences > Advanced, check "Show Develop menu", then Develop > Empty Caches

2. **Try Different Browser**:
   Try accessing the application in a different browser to rule out browser-specific issues.

3. **Check Network Connectivity**:
   Ensure you have a stable internet connection.

4. **Disable Browser Extensions**:
   Temporarily disable browser extensions that might interfere with the application.

### Page Not Rendering Correctly

**Symptoms**: Layout issues, missing elements, or visual glitches.

**Possible Solutions**:

1. **Update Browser**:
   Ensure you're using the latest version of your browser.

2. **Check Console for Errors**:
   - Open browser developer tools (F12 or Right-click > Inspect)
   - Look for error messages in the Console tab

3. **Check Device Compatibility**:
   Ensure your device meets the minimum requirements for the application.

## Authentication Issues

### Cannot Log In

**Symptoms**: Login attempts fail despite correct credentials.

**Possible Solutions**:

1. **Reset Password**:
   Use the "Forgot Password" option to reset your password.

2. **Check Email Verification**:
   Ensure you've verified your email address if required.

3. **Clear Browser Cookies**:
   Clear cookies specific to the application domain.

4. **Check for Caps Lock**:
   Ensure Caps Lock is not enabled when entering your password.

### Account Locked

**Symptoms**: Message indicating account is locked or too many failed attempts.

**Possible Solutions**:

1. **Wait and Retry**:
   Wait for the lockout period to expire (typically 30 minutes).

2. **Contact Support**:
   Reach out to support@agriweatherpro.com for assistance.

## Data and API Issues

### Weather Data Not Loading

**Symptoms**: Weather cards show loading indicators or error messages.

**Possible Solutions**:

1. **Check Location Settings**:
   Ensure you have added at least one farm location.

2. **Allow Location Access**:
   If using current location, ensure browser location permissions are enabled.

3. **Check for Service Outages**:
   Weather data providers might be experiencing service disruptions.

4. **Refresh the Application**:
   Try refreshing the page to re-fetch weather data.

### Forecast Data Inaccurate

**Symptoms**: Forecast data doesn't match actual conditions or other forecasts.

**Possible Solutions**:

1. **Verify Location Accuracy**:
   Ensure the coordinates for your locations are accurate.

2. **Check Last Update Time**:
   Weather data might not be the most current. Check when it was last updated.

3. **Switch Data Sources**:
   If available, try switching to an alternative weather data source in settings.

## Map Functionality Issues

### Maps Not Loading

**Symptoms**: Maps show as gray boxes or error messages.

**Possible Solutions**:

1. **Check Internet Connection**:
   Maps require a stable internet connection to load tiles.

2. **Allow Mixed Content**:
   If using HTTPS, ensure your browser isn't blocking mixed content.

3. **Enable JavaScript**:
   Ensure JavaScript is enabled in your browser.

4. **Try Another Browser**:
   Some map features might work better in specific browsers.

### Cannot Add Locations on Map

**Symptoms**: Unable to place markers or select locations on the map.

**Possible Solutions**:

1. **Check Permissions**:
   Ensure you have the necessary permissions to add locations.

2. **Zoom In for Precision**:
   Zoom in on the map for more precise location placement.

3. **Try Manual Coordinate Entry**:
   Use the manual entry option to input coordinates instead.

## Installation and Setup Issues

### NPM Install Errors

**Symptoms**: Errors during `npm install` command.

**Possible Solutions**:

1. **Clear NPM Cache**:
   ```bash
   npm cache clean --force
   ```

2. **Update NPM**:
   ```bash
   npm install -g npm@latest
   ```

3. **Check Node.js Version**:
   Ensure you're using a compatible Node.js version (v14+).
   ```bash
   node -v
   ```

4. **Delete node_modules and Reinstall**:
   ```bash
   rm -rf node_modules
   npm install
   ```

### Environment Variables Not Working

**Symptoms**: Application fails to connect to services or displays API errors.

**Possible Solutions**:

1. **Check .env.local File**:
   Ensure `.env.local` file exists in the root directory.

2. **Verify Variable Format**:
   Environment variables should be in format:
   ```
   REACT_APP_VARIABLE_NAME=value
   ```

3. **Restart Development Server**:
   Stop and restart the development server after changing environment variables.

4. **Check for Typos**:
   Ensure variable names match exactly what the application expects.

## Performance Issues

### Slow Loading Times

**Symptoms**: Application takes a long time to load or respond.

**Possible Solutions**:

1. **Check Network Speed**:
   Slow internet connections will affect application performance.

2. **Reduce Active Components**:
   Close unused tabs or components to free up resources.

3. **Clear Browser Cache**:
   Regularly clear your browser cache to improve performance.

4. **Check Device Resources**:
   Ensure your device has sufficient memory and processing power.

### High CPU/Memory Usage

**Symptoms**: Application causes device to slow down, fan noise, or battery drain.

**Possible Solutions**:

1. **Limit Open Tabs**:
   Close other browser tabs when using the application.

2. **Disable Animations**:
   If available, use "Lite Mode" or disable animations in settings.

3. **Update Browser**:
   Ensure you're using the latest browser version for best performance.

4. **Restart Browser**:
   Occasionally restart your browser to free up memory.

## Database Issues

### Database Initialization Errors

**Symptoms**: Errors when running database initialization scripts.

**Possible Solutions**:

1. **Check MCP Server**:
   Ensure the Supabase MCP server is running:
   ```bash
   node C:\MCP\supabase-mcp-server\run_mcp.js
   ```

2. **Verify Project Reference**:
   Ensure the correct Supabase project reference is being used.

3. **Check SQL Syntax**:
   Verify there are no syntax errors in your schema files.

4. **Examine Error Logs**:
   Look for specific error messages in the console output.

### Data Not Appearing in Application

**Symptoms**: Data exists in the database but doesn't show in the application.

**Possible Solutions**:

1. **Check Row-Level Security**:
   Ensure RLS policies allow the current user to access the data.

2. **Verify User Authentication**:
   Ensure you're logged in as the correct user who owns the data.

3. **Check Query Filters**:
   Verify that any filters or search parameters aren't excluding the data.

4. **Refresh Data Cache**:
   Use the refresh button to fetch the latest data from the database.

## Deployment Issues

### Build Failure

**Symptoms**: Application fails to build for production.

**Possible Solutions**:

1. **Check for Compilation Errors**:
   Look for syntax or import errors in the build logs.

2. **Verify Dependencies**:
   Ensure all required dependencies are installed:
   ```bash
   npm install
   ```

3. **Check Environment Variables**:
   Ensure all required environment variables are set.

4. **Increase Memory Limit**:
   If you get "JavaScript heap out of memory" errors:
   ```bash
   export NODE_OPTIONS=--max_old_space_size=4096
   ```

### Application Works Locally But Not in Production

**Symptoms**: Application functions correctly in development but fails in production.

**Possible Solutions**:

1. **Check Environment Variables**:
   Ensure production environment variables are properly set.

2. **Verify API Access**:
   Ensure APIs allow requests from your production domain.

3. **Check CORS Settings**:
   Verify CORS settings allow requests from your production domain.

4. **Inspect Browser Console**:
   Check the browser console for errors specific to the production environment.

## Still Having Issues?

If you've tried the solutions above and are still experiencing problems:

1. **Check Documentation**:
   Review our detailed documentation for specific features.

2. **Community Forum**:
   Visit our community forum at forum.agriweatherpro.com for help from other users.

3. **Contact Support**:
   Email us at support@agriweatherpro.com with:
   - Detailed description of the issue
   - Steps to reproduce
   - Screenshots if applicable
   - Browser and device information
   - Your account email (if relevant)

## Reporting Bugs

To help us improve AgriWeather Pro, please report any bugs or issues:

1. **Be Specific**:
   Clearly describe the problem and steps to reproduce it.

2. **Include Environment Details**:
   Browser, operating system, device type, etc.

3. **Attach Screenshots**:
   Visual evidence helps us understand the issue.

4. **Note Time and Date**:
   When the issue occurred, including timezone.

Submit bug reports to bugs@agriweatherpro.com or via the in-app feedback form.
