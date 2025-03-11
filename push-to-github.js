/**
 * Push AgriWeather Pro to GitHub
 * This script pushes the entire project to GitHub repository
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const GITHUB_REPO = 'https://github.com/0ceanWavves/AgriWeatherPro.git';
const PROJECT_DIR = path.resolve(__dirname);

// Helper to execute commands
function runCommand(command) {
  console.log(`> ${command}`);
  try {
    const output = execSync(command, { cwd: PROJECT_DIR, encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    return null;
  }
}

// Main function
async function pushToGitHub() {
  console.log('Starting push to GitHub...');
  
  // Check if .git directory exists (if not, initialize git)
  const gitDirExists = fs.existsSync(path.join(PROJECT_DIR, '.git'));
  if (!gitDirExists) {
    console.log('Initializing Git repository...');
    runCommand('git init');
  }
  
  // Check if remote is already configured
  const remotes = runCommand('git remote -v');
  if (!remotes || !remotes.includes('origin')) {
    console.log('Adding GitHub remote...');
    runCommand(`git remote add origin ${GITHUB_REPO}`);
  }
  
  // Stage files
  console.log('Staging files...');
  runCommand('git add .');
  
  // Commit changes
  console.log('Committing changes...');
  const commitMessage = 'Add complete AgriWeather Pro project';
  runCommand(`git commit -m "${commitMessage}"`);
  
  // Push to GitHub
  console.log('Pushing to GitHub...');
  runCommand('git push -f origin main');
  
  console.log('Successfully pushed to GitHub!');
  console.log(`Repository URL: ${GITHUB_REPO}`);
}

// Run the script
pushToGitHub().catch(error => {
  console.error('Failed to push to GitHub:', error);
  process.exit(1);
});
