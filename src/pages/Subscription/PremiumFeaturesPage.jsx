import React from 'react';
import { Link } from 'react-router-dom';
import PremiumFeatures from '../../components/UserProfile/PremiumFeatures';
import './PremiumFeaturesPage.css';

/**
 * Premium features page displays subscription information and available premium features
 */
const PremiumFeaturesPage = () => {
  return (
    <div className="premium-features-page">
      <div className="page-header">
        <h1>Premium Features</h1>
        <p>View and manage your premium features and subscription</p>
      </div>
      
      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link> &gt; Premium Features
      </div>
      
      <div className="page-content">
        <PremiumFeatures />
        
        <div className="premium-samples">
          <h2>Featured Premium Content</h2>
          <div className="premium-samples-grid">
            <div className="premium-sample-card">
              <div className="sample-icon">⛅</div>
              <h3>Advanced Weather Maps</h3>
              <p>Access high-resolution weather maps with multiple layers and detailed forecasts.</p>
              <Link to="/premium/weather-maps" className="sample-link">View Weather Maps</Link>
            </div>
            
            <div className="premium-sample-card">
              <div className="sample-icon">💧</div>
              <h3>Irrigation Planning</h3>
              <p>Optimize your irrigation schedule based on weather forecasts and crop needs.</p>
              <Link to="/premium/irrigation" className="sample-link">View Irrigation Tools</Link>
            </div>
            
            <div className="premium-sample-card">
              <div className="sample-icon">🌱</div>
              <h3>Crop Management</h3>
              <p>Track crop growth, predict yields, and monitor field conditions.</p>
              <Link to="/premium/crops" className="sample-link">View Crop Tools</Link>
            </div>
            
            <div className="premium-sample-card">
              <div className="sample-icon">📊</div>
              <h3>Historical Data</h3>
              <p>Access historical weather data and analytics for your locations.</p>
              <Link to="/premium/historical" className="sample-link">View Historical Data</Link>
            </div>
          </div>
        </div>
        
        <div className="premium-support">
          <h2>Premium Support</h2>
          <p>
            As a premium subscriber, you have access to dedicated support and resources.
            If you have any questions about your subscription or premium features, 
            our support team is ready to help.
          </p>
          <div className="support-options">
            <a href="mailto:support@agriweatherpro.com" className="support-option">
              <div className="support-icon">✉️</div>
              <div className="support-details">
                <h3>Email Support</h3>
                <p>support@agriweatherpro.com</p>
              </div>
            </a>
            
            <a href="tel:+18005551234" className="support-option">
              <div className="support-icon">📞</div>
              <div className="support-details">
                <h3>Phone Support</h3>
                <p>+1 800 555 1234</p>
                <p className="support-hours">Monday-Friday, 9am-5pm EST</p>
              </div>
            </a>
            
            <Link to="/help/premium" className="support-option">
              <div className="support-icon">📚</div>
              <div className="support-details">
                <h3>Knowledge Base</h3>
                <p>Browse tutorials and FAQs</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeaturesPage; 