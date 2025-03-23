import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getSubscriptionPlans, 
  getCurrentSubscription, 
  subscribeToPlan, 
  cancelSubscription 
} from '../../services/subscriptionService';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingCancel, setProcessingCancel] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch subscription plans
        const plansResult = await getSubscriptionPlans();
        if (!plansResult.success) {
          throw new Error(plansResult.error || 'Failed to load subscription plans');
        }
        setPlans(plansResult.data);
        
        // Fetch user's current subscription
        const subscriptionResult = await getCurrentSubscription();
        if (subscriptionResult.success && subscriptionResult.data) {
          setUserSubscription(subscriptionResult.data);
          
          // Pre-select the user's current plan
          const userPlan = plansResult.data.find(plan => 
            plan.id === subscriptionResult.data.plan_id);
          if (userPlan) {
            setSelectedPlan(userPlan.id);
            setBillingCycle(subscriptionResult.data.billing_cycle || 'monthly');
          }
        } else {
          // If no subscription, pre-select the first non-free plan
          const firstPaidPlan = plansResult.data.find(plan => plan.name !== 'Free');
          if (firstPaidPlan) {
            setSelectedPlan(firstPaidPlan.id);
          }
        }
      } catch (err) {
        console.error('Error fetching subscription data:', err);
        setError('Failed to load subscription data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setError(null);
    setSuccess(null);
  };
  
  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
    setError(null);
    setSuccess(null);
  };
  
  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Please select a subscription plan');
      return;
    }
    
    setProcessingPayment(true);
    setError(null);
    setSuccess(null);
    
    try {
      // In a real application, you would integrate with a payment provider here
      // For now, we'll just call the subscribe endpoint with dummy payment info
      const dummyPaymentMethod = {
        type: 'credit_card',
        last4: '4242',
        brand: 'Visa',
      };
      
      const result = await subscribeToPlan(selectedPlan, billingCycle, dummyPaymentMethod);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process subscription');
      }
      
      setUserSubscription(result.data);
      setSuccess('Subscription updated successfully!');
      
      // Refresh page after a short delay to show success message
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('Error subscribing to plan:', err);
      setError('Failed to process subscription. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!userSubscription) return;
    
    if (!window.confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.')) {
      return;
    }
    
    setProcessingCancel(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await cancelSubscription();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel subscription');
      }
      
      setUserSubscription(result.data);
      setSuccess('Your subscription has been canceled. You will still have access until the end of your current billing period.');
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setProcessingCancel(false);
    }
  };
  
  const getPlanPrice = (plan) => {
    if (!plan) return '';
    
    const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
    
    if (price === 0) return 'Free';
    
    return `$${price} / ${billingCycle === 'yearly' ? 'year' : 'month'}`;
  };
  
  const getFormattedDate = (dateString) => {
    if (!dateString) return '';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };
  
  const isPlanDisabled = (planId) => {
    if (!userSubscription) return false;
    
    // If the user has a canceled subscription, they can only choose a new plan
    if (userSubscription.status === 'canceled' || 
        userSubscription.cancel_at_period_end) {
      return false;
    }
    
    // If the plan is their current plan, disable it to prevent resubscribing
    return planId === userSubscription.plan_id;
  };
  
  const renderFeatures = (features) => {
    if (!features || !Array.isArray(features)) return null;
    
    return (
      <ul className="plan-features">
        {features.map((feature, index) => (
          <li key={index} className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">{feature}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  const renderSubscriptionInfo = () => {
    if (!userSubscription) return null;
    
    return (
      <div className="current-subscription-info">
        <h3>Your Current Subscription</h3>
        
        <div className="subscription-detail">
          <span className="detail-label">Status:</span>
          <span className={`detail-value status-${userSubscription.status}`}>
            {userSubscription.cancel_at_period_end ? 'Canceled (Access until end of period)' : userSubscription.status}
          </span>
        </div>
        
        {userSubscription.current_period_end && (
          <div className="subscription-detail">
            <span className="detail-label">Current period ends:</span>
            <span className="detail-value">
              {getFormattedDate(userSubscription.current_period_end)}
            </span>
          </div>
        )}
        
        {userSubscription.status === 'active' && !userSubscription.cancel_at_period_end && (
          <button 
            className="cancel-subscription-button"
            onClick={handleCancelSubscription}
            disabled={processingCancel}
          >
            {processingCancel ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="subscription-container">
        <div className="loading-spinner">Loading subscription plans...</div>
      </div>
    );
  }

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1>Subscription Plans</h1>
        <button className="back-button" onClick={() => navigate('/profile')}>
          Back to Profile
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {renderSubscriptionInfo()}
      
      <div className="billing-cycle-selector">
        <span 
          className={`cycle-option ${billingCycle === 'monthly' ? 'active' : ''}`}
          onClick={() => handleBillingCycleChange('monthly')}
        >
          Monthly Billing
        </span>
        <span 
          className={`cycle-option ${billingCycle === 'yearly' ? 'active' : ''}`}
          onClick={() => handleBillingCycleChange('yearly')}
        >
          Yearly Billing <span className="save-badge">Save 16%</span>
        </span>
      </div>
      
      <div className="plans-container">
        {plans.map(plan => (
          <div 
            key={plan.id}
            className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
            onClick={() => !isPlanDisabled(plan.id) && handlePlanSelect(plan.id)}
          >
            <div className="plan-header">
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-price">{getPlanPrice(plan)}</p>
            </div>
            
            <div className="plan-description">{plan.description}</div>
            
            {renderFeatures(plan.features)}
            
            <button 
              className="select-plan-button"
              disabled={isPlanDisabled(plan.id)}
              onClick={(e) => {
                e.stopPropagation();
                handlePlanSelect(plan.id);
              }}
            >
              {isPlanDisabled(plan.id) 
                ? 'Current Plan' 
                : (userSubscription ? 'Switch to this Plan' : 'Select Plan')}
            </button>
          </div>
        ))}
      </div>
      
      {selectedPlan && (
        <div className="subscription-actions">
          <button 
            className="subscribe-button"
            onClick={handleSubscribe}
            disabled={processingPayment || 
              (userSubscription && userSubscription.plan_id === selectedPlan && 
              userSubscription.billing_cycle === billingCycle)}
          >
            {processingPayment ? 'Processing...' : 'Confirm Subscription'}
          </button>
          
          <p className="subscription-note">
            By confirming your subscription, you agree to the 
            <a href="/terms" target="_blank" rel="noopener noreferrer"> Terms of Service</a>.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage; 