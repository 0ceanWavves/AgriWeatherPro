import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile } from '../services/profileService';
import { getCurrentSubscription } from '../services/subscriptionService';

const UserProfileContext = createContext();

export function useUserProfile() {
  return useContext(UserProfileContext);
}

export function UserProfileProvider({ children }) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for when using dummy authentication
  const mockUserProfile = {
    id: 'temp-user-001',
    first_name: 'Demo',
    last_name: 'User',
    avatar_url: null,
    subscription_tier: 'premium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Mock subscription data
  const mockSubscription = {
    subscription_id: 'mock-sub-001',
    plan_id: 'premium-plan',
    plan_name: 'Premium',
    status: 'active',
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    cancel_at_period_end: false,
    billing_cycle: 'monthly',
    payment_method: 'card',
    features: [
      'Advanced weather forecasts',
      'Unlimited saved locations',
      'Premium weather alerts',
      'Agricultural insights',
      'Crop-specific recommendations',
      'Historical data access'
    ],
    price_monthly: 9.99,
    price_yearly: 99.99
  };

  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Check if we're using the dummy authentication
        if (user.id === 'temp-user-001') {
          // Use mock data instead of fetching from Supabase
          setUserProfile(mockUserProfile);
          setSubscription(mockSubscription);
        } else {
          // For real authentication, fetch from Supabase
          const profileResult = await getUserProfile();
          if (!profileResult.success) {
            console.error('Error fetching profile:', profileResult.error);
            setError('Failed to load user profile');
          } else {
            setUserProfile(profileResult.data);
          }

          const subscriptionResult = await getCurrentSubscription();
          if (!subscriptionResult.success) {
            console.error('Error fetching subscription:', subscriptionResult.message);
            // Use a fallback for subscription tier
            setSubscription({
              plan_name: 'Free',
              status: 'active',
              features: ['Basic weather forecasts', 'Limited location saving', 'Standard weather alerts']
            });
          } else {
            setSubscription(subscriptionResult.data);
          }
        }
      } catch (err) {
        console.error('Error in user profile context:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  // Value to be provided by the context
  const value = {
    userProfile,
    subscription,
    loading,
    error,
    // Additional methods for updating profile could go here
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export default UserProfileProvider;
