import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { subscribeUserToPlan, getSubscriptionPlans } from '../../services/subscriptionService';
import './SubscriptionPlans.css';

/**
 * SubscriptionPlans component allows users to view and subscribe to different plans
 */
const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingSubscription, setProcessingSubscription] = useState(false);
  
  const { subscription, refreshSubscription } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get URL parameters for pre-selecting a plan
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planParam = params.get('plan');
    
    if (planParam) {
      // Pre-select the plan based on URL parameter
      const planName = planParam.charAt(0).toUpperCase() + planParam.slice(1);
      setSelectedPlan(planName);
    }
  }, [location]);
  
  // Fetch available subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const planData = await getSubscriptionPlans();
        
        if (planData.success) {
          setPlans(planData.data);
          
          // If no plan is selected yet, and we have a URL parameter, select that plan
          if (selectedPlan && !planData.data.find(p => p.name === selectedPlan)) {
            setSelectedPlan(planData.data[0]?.name || null);
          }
        } else {
          setError(planData.message || 'Failed to load subscription plans');
        }
      } catch (err) {
        setError('An error occurred while fetching subscription plans');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, [selectedPlan]);
  
  // Handle plan selection
  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
  };
  
  // Handle subscription
  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    try {
      setProcessingSubscription(true);
      const result = await subscribeUserToPlan(selectedPlan, billingCycle);
      
      if (result.success) {
        // Refresh subscription data
        await refreshSubscription();
        // Redirect to premium features page
        navigate('/premium-features');
      } else {
        setError(result.message || 'Failed to process subscription');
      }
    } catch (err) {
      setError('An error occurred during subscription process');
      console.error(err);
    } finally {
      setProcessingSubscription(false);
    }
  };
  
  // Calculate price based on billing cycle
  const getPrice = (plan) => {
    if (!plan) return null;
    return billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
  };
  
  // Calculate yearly savings percentage
  const calculateSavings = (plan) => {
    if (!plan) return 0;
    const monthlyTotal = plan.price_monthly * 12;
    const yearlyCost = plan.price_yearly;
    return Math.round(((monthlyTotal - yearlyCost) / monthlyTotal) * 100);
  };
  
  // Get feature description by tier
  const getFeatureDescription = (feature, planName) => {
    const tierMap = {
      'locations': {
        'Free': '3 locations',
        'Basic': '10 locations',
        'Professional': 'Unlimited',
        'Enterprise': 'Unlimited'
      },
      'forecast_days': {
        'Free': '5 days',
        'Basic': '10 days',
        'Professional': '15 days',
        'Enterprise': '15 days'
      },
      'historical_data': {
        'Free': 'None',
        'Basic': '1 month',
        'Professional': '1 year',
        'Enterprise': 'Full history'
      },
      'api_access': {
        'Free': 'No',
        'Basic': 'No',
        'Professional': 'Limited',
        'Enterprise': 'Full access'
      },
      'support': {
        'Free': 'Email only',
        'Basic': 'Email support',
        'Professional': 'Priority support',
        'Enterprise': 'Dedicated support'
      }
    };
    
    return tierMap[feature]?.[planName] || '-';
  };
  
  // Check if the plan is the user's current plan
  const isCurrentPlan = (planName) => {
    return subscription?.plan_name === planName;
  };
  
  if (loading) {
    return <div className="loading-container">Loading subscription plans...</div>;
  }
  
  return (
    <div className="subscription-plans-page">
      <div className="page-header">
        <h1>Subscription Plans</h1>
        <p>Choose the plan that works best for you</p>
      </div>
      
      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link> &gt; Subscription Plans
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="billing-toggle">
        <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={billingCycle === 'yearly'}
            onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          />
          <span className="slider round"></span>
        </label>
        <span className={billingCycle === 'yearly' ? 'active' : ''}>
          Yearly
          <span className="save-badge">Save up to 20%</span>
        </span>
      </div>
      
      <div className="plans-container">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`plan-card ${selectedPlan === plan.name ? 'selected' : ''} ${isCurrentPlan(plan.name) ? 'current-plan' : ''}`}
            onClick={() => handlePlanSelect(plan.name)}
          >
            {isCurrentPlan(plan.name) && (
              <div className="current-plan-badge">Current Plan</div>
            )}
            
            <div className="plan-header">
              <h2>{plan.name}</h2>
              <div className="plan-price">
                ${getPrice(plan)}
                <span className="billing-period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              
              {billingCycle === 'yearly' && plan.price_yearly < (plan.price_monthly * 12) && (
                <div className="yearly-savings">
                  Save {calculateSavings(plan)}% with annual billing
                </div>
              )}
            </div>
            
            <div className="plan-features">
              <ul>
                {plan.features && plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="plan-action">
              {isCurrentPlan(plan.name) ? (
                <button className="current-plan-btn" disabled>
                  Your Current Plan
                </button>
              ) : (
                <button 
                  className={`select-plan-btn ${selectedPlan === plan.name ? 'selected' : ''}`}
                  onClick={() => handlePlanSelect(plan.name)}
                  disabled={processingSubscription}
                >
                  {selectedPlan === plan.name ? 'Selected' : 'Select Plan'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="features-comparison">
        <h2>Features Comparison</h2>
        <div className="comparison-table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                {plans.map(plan => (
                  <th key={plan.id} className={isCurrentPlan(plan.name) ? 'current-plan-column' : ''}>
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Saved Locations</td>
                {plans.map(plan => (
                  <td key={plan.id} className={isCurrentPlan(plan.name) ? 'current-plan-column' : ''}>
                    {getFeatureDescription('locations', plan.name)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Forecast Days</td>
                {plans.map(plan => (
                  <td key={plan.id} className={isCurrentPlan(plan.name) ? 'current-plan-column' : ''}>
                    {getFeatureDescription('forecast_days', plan.name)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Historical Data</td>
                {plans.map(plan => (
                  <td key={plan.id} className={isCurrentPlan(plan.name) ? 'current-plan-column' : ''}>
                    {getFeatureDescription('historical_data', plan.name)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>API Access</td>
                {plans.map(plan => (
                  <td key={plan.id} className={isCurrentPlan(plan.name) ? 'current-plan-column' : ''}>
                    {getFeatureDescription('api_access', plan.name)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Technical Support</td>
                {plans.map(plan => (
                  <td key={plan.id} className={isCurrentPlan(plan.name) ? 'current-plan-column' : ''}>
                    {getFeatureDescription('support', plan.name)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedPlan && !isCurrentPlan(selectedPlan) && (
        <div className="subscription-summary">
          <h2>Subscription Summary</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Selected Plan:</span>
              <span>{selectedPlan}</span>
            </div>
            <div className="summary-row">
              <span>Billing Cycle:</span>
              <span>{billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>
                ${getPrice(plans.find(p => p.name === selectedPlan))}
                /{billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
          </div>
          
          <button 
            className="subscribe-button"
            onClick={handleSubscribe}
            disabled={processingSubscription || !selectedPlan}
          >
            {processingSubscription ? 'Processing...' : `Subscribe to ${selectedPlan}`}
          </button>
          
          <p className="terms-note">
            By subscribing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
            You can cancel or change your subscription at any time.
          </p>
        </div>
      )}
      
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do I change my plan?</h3>
            <p>
              You can upgrade or downgrade your plan at any time. Changes take effect at the end of your current billing cycle.
            </p>
          </div>
          <div className="faq-item">
            <h3>Can I cancel my subscription?</h3>
            <p>
              Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period.
            </p>
          </div>
          <div className="faq-item">
            <h3>Do you offer refunds?</h3>
            <p>
              We offer a 14-day money-back guarantee for all paid subscriptions. If you're not satisfied, contact our support team.
            </p>
          </div>
          <div className="faq-item">
            <h3>How do I get technical support?</h3>
            <p>
              All plans include some level of support. Higher tier plans include priority support with faster response times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans; 