import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  server: {
    port: 4200,
    open: true
  },
  css: {
    modules: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'auth': [
            './src/pages/Auth/SignIn.js', 
            './src/pages/Auth/SignUp.js',
            './src/pages/Auth/ForgotPassword.js',
            './src/pages/Auth/ResetPassword.js'
          ],
          'dashboard': ['./src/pages/Dashboard.js'],
          'weather': [] // Add weather-related components here
        }
      }
    },
    chunkSizeWarningLimit: 700
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      './App.css': path.resolve(__dirname, 'src/App.css')
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
    include: ['./src/App.css']
  },
}); 