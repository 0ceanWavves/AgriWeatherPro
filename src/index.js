import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Web vitals reporting removed to fix Netlify deployment issues
// If you want to re-enable performance monitoring later, uncomment the following lines
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();