import { execSync } from 'child_process';
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.magenta}Starting deployment process...${colors.reset}`);

// Step 1: Add changes to Git and create a commit
try {
  console.log(`${colors.blue}Adding changes to Git...${colors.reset}`);
  execSync('git add .', { stdio: 'inherit' });
  console.log(`${colors.blue}Creating Git commit...${colors.reset}`);
  execSync('git commit -m "Deploy to Netlify" --no-verify', { stdio: 'inherit' }); // --no-verify to skip git hooks if needed
  console.log(`${colors.green}Git commit created successfully.${colors.reset}`);
} catch (error) {
  console.error('Error during Git commit:', error);
  process.exit(1);
}

// Step 2: Push changes to Git repository
try {
  console.log(`${colors.blue}Pushing changes to Git repository...${colors.reset}`);
  execSync('git push', { stdio: 'inherit' });
  console.log(`${colors.green}Git push completed successfully.${colors.reset}`);
} catch (error) {
  console.error('Error during Git push:', error);
  process.exit(1);
}

// Step 3: Build the project
try {
  console.log(`${colors.blue}Building the project...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`${colors.green}Build completed successfully.${colors.reset}`);
} catch (error) {
  console.error('Error during build:', error);
  process.exit(1);
}

// Step 4: Ensure netlify.toml exists with proper config
const netlifyTomlPath = path.join(__dirname, 'netlify.toml');
const netlifyTomlContent = `[build]
  publish = "build"
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

// Step 5: Deploy to Netlify
try {
  console.log(`${colors.yellow}Deploying to Netlify...${colors.reset}`);
  
  // Check if Netlify CLI is installed
  try {
    execSync('netlify --version', { stdio: 'ignore' });
  } catch (error) {
    console.log(`${colors.yellow}Netlify CLI not found. Installing globally...${colors.reset}`);
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
  }
  
  // Deploy
  console.log(`${colors.cyan}Running Netlify deploy command...${colors.reset}`);
  execSync('netlify deploy --prod', { stdio: 'inherit' });
  
  console.log(`${colors.green}Deployment complete! Your site is now live on Netlify.${colors.reset}`);
} catch (error) {
  console.error('Error during deployment:', error);
  console.log(`${colors.yellow}If you see auth errors, you may need to run 'netlify login' first.${colors.reset}`);
  process.exit(1);
}
