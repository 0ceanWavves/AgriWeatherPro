const fs = require('fs');
const path = require('path');

// Make sure App.css exists
const srcDir = path.join(__dirname, 'src');
const appCssPath = path.join(srcDir, 'App.css');
const appCssLowerPath = path.join(srcDir, 'app.css');

// Check if App.css exists (case sensitive)
if (!fs.existsSync(appCssPath)) {
  console.log('App.css does not exist, creating it...');
  
  // If app.css exists (lowercase), copy its content
  if (fs.existsSync(appCssLowerPath)) {
    console.log('Copying content from existing app.css...');
    const content = fs.readFileSync(appCssLowerPath, 'utf8');
    fs.writeFileSync(appCssPath, content, 'utf8');
  } else {
    // Create a basic App.css file if neither exists
    console.log('Creating new App.css file...');
    const basicCss = `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      
      :root {
        --primary-color: #FF8C00;
        --primary-light: #FFA500;
        --secondary-color: #4786C6;
        --accent-color: #44C1C3;
        --sidebar-background: #121212;
        --background-color: #f5f5f5;
        --text-color: #333;
      }
      
      body {
        margin: 0;
        padding: 0;
        background-color: var(--background-color);
        color: var(--text-color);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }
    `;
    fs.writeFileSync(appCssPath, basicCss, 'utf8');
  }
  
  console.log('App.css created successfully!');
}

console.log('Prebuild checks completed successfully!'); 