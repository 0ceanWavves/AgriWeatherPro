import { execSync } from 'child_process';

console.log('Building the project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Error during build:', error);
  process.exit(1);
}

// The built files will be in the dist directory
console.log('Project built successfully. Files are in the dist directory.');
console.log('To deploy, you can upload the dist directory to your hosting provider or use the Netlify CLI.');
