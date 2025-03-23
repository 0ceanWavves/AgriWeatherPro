import { supabase } from '../lib/supabaseClient';

/**
 * Get user's current subscription
 * @returns {Promise<Object>} - Object with success flag and data or error message
 */
export const getCurrentSubscription = async () => {
  try {
    // Get user ID from session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      return {
        success: false,
        message: 'You must be logged in to view subscription details'
      };
    }
    
    const userId = sessionData.session.user.id;
    
    // Get current subscription with plan details
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans:plan_id (
          name,
          description,
          price_monthly,
          price_yearly,
          features
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      // No subscription found, return free tier info
      return {
        success: true,
        data: {
          plan_name: 'Free',
          status: 'active',
          current_period_end: null,
          cancel_at_period_end: false,
          billing_cycle: null,
          features: ['Basic weather forecasts', 'Limited location saving', 'Standard weather alerts']
        }
      };
    }
    
    // Format subscription data for easy consumption
    return {
      success: true,
      data: {
        subscription_id: data.id,
        plan_id: data.plan_id,
        plan_name: data.subscription_plans.name,
        status: data.status,
        current_period_start: data.current_period_start,
        current_period_end: data.current_period_end,
        cancel_at_period_end: data.cancel_at_period_end,
        billing_cycle: data.billing_cycle,
        payment_method: data.payment_method,
        features: data.subscription_plans.features,
        price_monthly: data.subscription_plans.price_monthly,
        price_yearly: data.subscription_plans.price_yearly
      }
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return {
      success: false,
      message: 'Failed to fetch subscription information'
    };
  }
};

/**
 * Get all available subscription plans
 * @returns {Promise<Object>} - Object with success flag and data or error message
 */
export const getSubscriptionPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });
    
    if (error) throw error;
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return {
      success: false,
      message: 'Failed to fetch subscription plans'
    };
  }
};

/**
 * Subscribe user to a plan
 * @param {string} planName - Name of the plan to subscribe to
 * @param {string} billingCycle - 'monthly' or 'yearly'
 * @returns {Promise<Object>} - Object with success flag and data or error message
 */
export const subscribeUserToPlan = async (planName, billingCycle) => {
  try {
    // Get user ID from session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      return {
        success: false,
        message: 'You must be logged in to subscribe'
      };
    }
    
    const userId = sessionData.session.user.id;
    
    // Get plan ID
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('id, price_monthly, price_yearly')
      .eq('name', planName)
      .eq('is_active', true)
      .single();
    
    if (planError) throw planError;
    if (!planData) {
      return {
        success: false,
        message: 'Invalid subscription plan'
      };
    }
    
    // Check if user already has an active subscription
    const { data: existingSubscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'trial', 'grace_period'])
      .maybeSingle();
    
    if (subscriptionError) throw subscriptionError;
    
    // Calculate subscription period
    const now = new Date();
    let endDate;
    
    if (billingCycle === 'yearly') {
      endDate = new Date(now);
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);
    }
    
    // Calculate amount based on billing cycle
    const amount = billingCycle === 'yearly' ? 
      planData.price_yearly : 
      planData.price_monthly;
    
    // Format dates for Supabase
    const startDate = now.toISOString();
    const endDateStr = endDate.toISOString();
    
    let result;
    
    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          plan_id: planData.id,
          status: 'active',
          current_period_start: startDate,
          current_period_end: endDateStr,
          cancel_at_period_end: false,
          billing_cycle: billingCycle,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscription.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planData.id,
          status: 'active',
          current_period_start: startDate,
          current_period_end: endDateStr,
          cancel_at_period_end: false,
          billing_cycle: billingCycle,
          payment_method: 'card' // Default placeholder
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    // Update profile with subscription tier
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: planName.toLowerCase()
      })
      .eq('id', userId);
    
    if (profileError) throw profileError;
    
    // Record transaction
    const { error: transactionError } = await supabase
      .from('subscription_transactions')
      .insert({
        user_id: userId,
        subscription_id: result.id,
        amount: amount,
        currency: 'USD',
        status: 'completed',
        payment_method: 'card', // Default placeholder
        transaction_date: new Date().toISOString(),
        metadata: { billing_cycle: billingCycle }
      });
    
    if (transactionError) throw transactionError;
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error subscribing to plan:', error);
    return {
      success: false,
      message: 'Failed to process subscription'
    };
  }
};

/**
 * Cancel a user's subscription
 * @returns {Promise<Object>} - Object with success flag and data or error message
 */
export const cancelSubscription = async () => {
  try {
    // Get user ID from session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      return {
        success: false,
        message: 'You must be logged in to cancel a subscription'
      };
    }
    
    const userId = sessionData.session.user.id;
    
    // Get current subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'trial', 'grace_period'])
      .maybeSingle();
    
    if (subscriptionError) throw subscriptionError;
    
    if (!subscription) {
      return {
        success: false,
        message: 'No active subscription found'
      };
    }
    
    // Mark subscription for cancellation at the end of the period
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id);
    
    if (updateError) throw updateError;
    
    return {
      success: true,
      message: 'Subscription will be canceled at the end of the billing period'
    };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return {
      success: false,
      message: 'Failed to cancel subscription'
    };
  }
};

/**
 * Change user's subscription plan
 * @param {string} newPlanName - Name of the new plan
 * @param {string} billingCycle - 'monthly' or 'yearly'
 * @returns {Promise<Object>} - Object with success flag and data or error message
 */
export const changePlan = async (newPlanName, billingCycle) => {
  return subscribeUserToPlan(newPlanName, billingCycle);
};

/**
 * Check if a user has access to a specific premium feature
 * @param {string} featureKey - The key of the feature to check
 * @returns {Promise<Object>} - Object with success flag and hasAccess boolean
 */
export const checkFeatureAccess = async (featureKey) => {
  try {
    // Call the Supabase function to check feature access
    const { data, error } = await supabase.rpc('check_premium_feature_access', {
      feature_name: featureKey
    });
    
    if (error) throw error;
    
    return {
      success: true,
      hasAccess: data
    };
  } catch (error) {
    console.error('Error checking feature access:', error);
    return {
      success: false,
      hasAccess: false,
      message: 'Failed to check feature access'
    };
  }
};

/**
 * Get user's billing history
 * @returns {Promise<Object>} - Object with success flag and transaction data
 */
export const getBillingHistory = async () => {
  try {
    // Get user ID from session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      return {
        success: false,
        message: 'You must be logged in to view billing history'
      };
    }
    
    const userId = sessionData.session.user.id;
    
    // Get transaction history
    const { data, error } = await supabase
      .from('subscription_transactions')
      .select(`
        *,
        user_subscriptions:subscription_id (
          subscription_plans:plan_id (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });
    
    if (error) throw error;
    
    // Format transaction data
    const transactions = data.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      date: transaction.transaction_date,
      planName: transaction.user_subscriptions?.subscription_plans?.name || 'Unknown',
      paymentMethod: transaction.payment_method
    }));
    
    return {
      success: true,
      data: transactions
    };
  } catch (error) {
    console.error('Error fetching billing history:', error);
    return {
      success: false,
      message: 'Failed to fetch billing history'
    };
  }
}; 