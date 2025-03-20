import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.magenta}Starting deployment to Netlify...${colors.reset}`);

// Step 1: Build the project
try {
  console.log(`${colors.blue}Building the project...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`${colors.green}Build completed successfully.${colors.reset}`);
} catch (error) {
  console.error('Error during build:', error);
  process.exit(1);
}

// Step 2: Ensure netlify.toml exists with proper config
const netlifyTomlPath = path.join(__dirname, 'netlify.toml');
const netlifyTomlContent = `[build]
  publish = "dist"
  command = "npm run build"

# Handle React Router's client-side routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

try {
  fs.writeFileSync(netlifyTomlPath, netlifyTomlContent);
  console.log(`${colors.cyan}netlify.toml created/updated with SPA redirect rules.${colors.reset}`);
} catch (error) {
  console.error('Error creating netlify.toml:', error);
  process.exit(1);
}

// Step 3: Deploy to Netlify
try {
  console.log(`${colors.yellow}Deploying to Netlify...${colors.reset}`);
  
  // Check if Netlify CLI is installed
  try {
    execSync('netlify --version', { stdio: 'ignore' });
  } catch (error) {
    console.log(`${colors.yellow}Netlify CLI not found. Installing globally...${colors.reset}`);
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
  }
  
  // Deploy manually specifying the correct publish directory
  console.log(`${colors.cyan}Running Netlify deploy command...${colors.reset}`);
  execSync('netlify deploy --prod --dir=dist', { stdio: 'inherit' });
  
  console.log(`${colors.green}Deployment complete! Your site is now live on Netlify.${colors.reset}`);
} catch (error) {
  console.error('Error during deployment:', error);
  console.log(`${colors.yellow}If you see auth errors, you may need to run 'netlify login' first.${colors.reset}`);
  process.exit(1);
}
