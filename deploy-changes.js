const { execSync } = require('child_process');
const path = require('path');

console.log('Building and deploying AgriWeather Pro...');
console.log('========================================');

try {
  // Step 1: Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { 
    cwd: __dirname,
    stdio: 'inherit'
  });
  console.log('✅ Build completed successfully\n');
  
  // Step 2: Deploy to Netlify
  console.log('🚀 Deploying to Netlify...');
  execSync('npm run deploy:netlify', { 
    cwd: __dirname,
    stdio: 'inherit'
  });
  console.log('✅ Deployment completed successfully\n');
  
  console.log('🎉 AgriWeather Pro has been successfully built and deployed!');
  
} catch (error) {
  console.error('❌ Error during build or deployment:', error.message);
  process.exit(1);
}