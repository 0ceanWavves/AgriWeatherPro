# Deployment Guide

This guide provides instructions for deploying AgriWeather Pro to production environments.

## Overview

AgriWeather Pro is designed to be deployed as a modern web application with:
- Static frontend assets hosted on a CDN
- Supabase as the backend service
- Integration with external weather APIs

## Prerequisites

Before deployment, ensure you have:

- Supabase account with a project set up
- Domain name (optional, but recommended)
- SSL certificate (automatically handled by most hosting providers)
- API keys for weather data providers
- Node.js and npm installed for building the application

## Deployment Steps

### 1. Prepare Environment Variables

Create production environment variables that will be used during the build:

```
REACT_APP_SUPABASE_URL=https://gexynwadeancyvnthsbu.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_production_anon_key
REACT_APP_OPENWEATHERMAP_API_KEY=your_production_api_key
REACT_APP_USE_REAL_MAPS=true
REACT_APP_USE_MOCK_DATA=false
```

### 2. Build the Frontend

Run the production build command:

```bash
npm run build
```

This creates optimized static files in the `build` directory.

### 3. Deploy Frontend to Hosting Provider

Choose one of the following hosting options:

#### Option A: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy to Netlify:
   ```bash
   netlify deploy --prod --dir=build
   ```

#### Option B: Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

#### Option C: AWS S3 + CloudFront

1. Create an S3 bucket:
   ```bash
   aws s3 mb s3://agriweatherpro-production
   ```

2. Configure the bucket for website hosting:
   ```bash
   aws s3 website s3://agriweatherpro-production --index-document index.html --error-document index.html
   ```

3. Upload build files:
   ```bash
   aws s3 sync build/ s3://agriweatherpro-production
   ```

4. Set up CloudFront distribution pointing to the S3 bucket

### 4. Set Up Supabase Database

1. Initialize the production database:

   Option A: Use the Supabase dashboard
   - Navigate to the SQL Editor
   - Upload and run the schema.sql file
   - Upload and run the seed-data.sql file (if needed)

   Option B: Use database CLI tools
   ```bash
   cd database
   node init-database.js --env=production
   ```

2. Verify the database schema and tables are correctly set up

### 5. Configure Authentication

1. In the Supabase dashboard, go to Authentication > Settings
2. Configure authentication providers:
   - Email/password
   - OAuth providers (Google, Apple, etc., if needed)
3. Set up email templates for verification, password resets, etc.
4. Configure allowed redirect URLs for your production domain

### 6. Set Up Security Rules

1. In the Supabase dashboard, go to Database > Policies
2. Verify Row Level Security (RLS) policies are correctly applied
3. Test with sample queries to ensure data access is properly restricted

### 7. Configure Domain and SSL

If using a custom domain:

1. Configure your domain with your hosting provider
2. Set up DNS records pointing to your hosting provider
3. Enable SSL/TLS encryption
4. Test HTTPS access

### 8. Set Up Monitoring and Logging

1. Configure application monitoring:
   - Set up error tracking (e.g., Sentry)
   - Configure performance monitoring
   - Set up log aggregation

2. Set up infrastructure monitoring:
   - Database performance
   - API response times
   - Frontend load times

### 9. Deploy Updates

For future updates:

1. Make code changes in development
2. Test thoroughly in staging environment
3. Run the build process for production
4. Deploy the new build to your hosting provider
5. Verify the deployment

## Post-Deployment Checklist

After deployment, verify:

- [ ] Application loads correctly
- [ ] Authentication works
- [ ] API endpoints are accessible
- [ ] Weather data is displayed correctly
- [ ] Map functionality works
- [ ] Database queries are performing well
- [ ] All external integrations work properly
- [ ] SSL certificate is valid and secure
- [ ] Performance meets expectations
- [ ] Monitoring is correctly capturing data

## Continuous Integration/Deployment

Set up CI/CD for automated deployments:

### GitHub Actions Example

```yaml
name: Deploy AgriWeather Pro

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        REACT_APP_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        REACT_APP_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        REACT_APP_OPENWEATHERMAP_API_KEY: ${{ secrets.OPENWEATHERMAP_API_KEY }}
        REACT_APP_USE_REAL_MAPS: true
        REACT_APP_USE_MOCK_DATA: false
        
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --prod --dir=build
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Scaling Considerations

As your user base grows:

1. **Database Scaling**:
   - Monitor database performance
   - Consider increasing your Supabase plan as needed
   - Optimize queries for efficiency

2. **Frontend Performance**:
   - Implement code splitting
   - Use efficient bundling techniques
   - Optimize image and asset delivery
   - Consider a global CDN

3. **API Rate Limiting**:
   - Implement caching for weather data
   - Consider using a weather data proxy
   - Monitor external API usage costs

## Rollback Procedures

If you need to roll back a deployment:

1. Identify the last stable build
2. Re-deploy the previous build to your hosting provider
3. Verify the rollback resolved the issue
4. If database changes were made, restore from backup if necessary

## Security Best Practices

1. **Environment Variables**:
   - Never commit environment variables to your repository
   - Use environment variable management in your hosting platform

2. **API Keys**:
   - Regularly rotate API keys
   - Use the principle of least privilege
   - Monitor for unusual API usage patterns

3. **User Data**:
   - Implement proper data sanitization
   - Use HTTPS for all connections
   - Follow data protection regulations (GDPR, CCPA, etc.)

## Backup and Recovery

1. **Database Backups**:
   - Enable automatic backups in Supabase
   - Download regular backups for offsite storage
   - Test restoration procedures periodically

2. **Configuration Backups**:
   - Document and backup all configuration settings
   - Store in a secure, version-controlled location

## Support and Maintenance

After deployment:

1. Set up a monitoring dashboard
2. Establish alert thresholds
3. Create an on-call rotation if necessary
4. Document common issues and resolution steps
5. Plan a regular maintenance schedule

For additional deployment support, contact Sales@synthed.xyz.
