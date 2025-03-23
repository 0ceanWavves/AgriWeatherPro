import React, { useState } from 'react';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import './TariffPanel.css';

const TariffPanel = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingTiers = [
    {
      name: 'Basic',
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        'Basic weather forecasting',
        'Standard crop recommendations',
        'Single location monitoring',
        'Email support',
        '7-day data history'
      ],
      recommended: false,
      ctaText: 'Get Started'
    },
    {
      name: 'Professional',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Advanced weather analytics',
        'Crop-specific recommendations',
        'Up to 5 location monitoring',
        'Phone and email support',
        '30-day data history',
        'Irrigation planning',
        'Pest risk alerts'
      ],
      recommended: true,
      ctaText: 'Try Professional'
    },
    {
      name: 'Enterprise',
      monthlyPrice: 249,
      yearlyPrice: 2490,
      features: [
        'Advanced weather analytics',
        'Custom crop recommendations',
        'Unlimited location monitoring',
        'Priority 24/7 support',
        'Full data history access',
        'Advanced irrigation planning',
        'Comprehensive pest management',
        'Climate change projections',
        'API access for integration',
        'Custom reporting'
      ],
      recommended: false,
      ctaText: 'Contact Sales'
    }
  ];

  return (
    <div className="tariff-panel">
      <div className="tariff-header">
        <h1>Pricing Plans</h1>
        <p>Choose the right plan for your agricultural needs</p>
        
        <div className="billing-toggle">
          <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={billingCycle === 'yearly'} 
              onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            />
            <span className="slider"></span>
          </label>
          <span className={billingCycle === 'yearly' ? 'active' : ''}>
            Yearly <span className="savings-badge">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="pricing-tiers">
        {pricingTiers.map((tier, index) => (
          <div 
            key={index} 
            className={`pricing-card ${tier.recommended ? 'recommended' : ''}`}
          >
            {tier.recommended && (
              <div className="recommended-badge">
                Recommended
              </div>
            )}
            
            <h2>{tier.name}</h2>
            
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">
                {billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
              </span>
              <span className="period">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </span>
            </div>
            
            <div className="features">
              <h3>Features</h3>
              <ul>
                {tier.features.map((feature, i) => (
                  <li key={i}>
                    <FaCheckCircle className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <button className="cta-button">
              {tier.ctaText}
            </button>
          </div>
        ))}
      </div>

      <div className="custom-plan">
        <div className="custom-plan-info">
          <FaInfoCircle className="info-icon" />
          <div>
            <h3>Need a custom solution?</h3>
            <p>Contact our sales team for a customized plan tailored to your specific agricultural requirements.</p>
          </div>
        </div>
        <button className="contact-button">Contact Sales</button>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I change plans later?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
          </div>
          
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
          </div>
          
          <div className="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes, we offer a 14-day free trial on all plans so you can test our services before committing.</p>
          </div>
          
          <div className="faq-item">
            <h3>How accurate is your weather data?</h3>
            <p>Our weather forecasts have a 92-95% accuracy rate and are continuously improved with new data sources.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffPanel;