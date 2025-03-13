import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function deployToNetlify() {
  try {
    console.log('Building project...');
    await execAsync('npm run build');
    console.log('Build completed.');

    console.log('Deploying to Netlify...');
    const { stdout, stderr } = await execAsync('npx netlify deploy --prod');
    
    if (stderr) {
      console.error('Deployment error:', stderr);
      return;
    }
    
    console.log('Deployment output:');
    console.log(stdout);
    console.log('Deployment complete!');
  } catch (error) {
    console.error('Error during deployment:', error);
  }
}

deployToNetlify(); 