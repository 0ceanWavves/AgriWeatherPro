const { execSync } = require('child_process');
const path = require('path');

console.log('Building application...');

try {
  console.log('Running npm run build');
  const output = execSync('npm run build', { 
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error.message);
}
