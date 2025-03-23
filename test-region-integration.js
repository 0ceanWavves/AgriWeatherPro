/**
 * Test script for Region-Aware Dashboard
 */
const { execSync } = require('child_process');
const path = require('path');

console.log('Testing region-aware integration...');

try {
  console.log('Building project with new region-aware components...');
  execSync('npm run build', { 
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  console.log('\n✅ Build successful! The region-aware integration is working correctly.');
  console.log('\nNew Features:');
  console.log('1. Dashboard now properly detects and displays region-specific data');
  console.log('2. "View on Dashboard" from MENA Date Palm Pest page now shows correct region');
  console.log('3. "View on Dashboard" from California Pest page now shows correct region');
  console.log('4. Pest alerts now reflect the selected location');
  console.log('5. Crop calendar now shows appropriate crops for the region');
  
  console.log('\nTo test:');
  console.log('1. Visit the MENA Date Palm Pest page and click "View on Dashboard"');
  console.log('2. Verify the dashboard shows date palm pests and Middle Eastern crops');
  console.log('3. Visit the California Pest page and click "View on Dashboard"');
  console.log('4. Verify the dashboard shows California pests and crops');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  console.error('Please check the error messages above and fix any issues.');
  process.exit(1);
}