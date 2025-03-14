import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getUserProfile } from '../api/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function checkSession() {
      try {
        console.log('Checking for existing session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) setUser(null);
        } else {
          console.log('Session check result:', data.session ? 'Session found' : 'No session');
          if (mounted) setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error('Exception checking session:', err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    checkSession();
    
    // Ensure we're properly tracking auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        if (mounted) setUser(session?.user || null);
      }
    );
    
    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign up function with detailed error handling
  async function signUp(email, password, fullName) {
    try {
      // Try a direct signup with minimal options
      // Get the current site URL - works in both development and production
      const siteUrl = window.location.origin;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          // Use dynamic origin instead of hardcoded URL
          emailRedirectTo: `${siteUrl}/dashboard`
        }
      });
      
      if (error) {
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: 'There was an issue creating your account. Please try again later.',
          originalError: error
        } 
      };
    }
  }

  // Resend email verification
  async function resendVerification(email) {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard',
        },
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Check if user email is verified
  async function isEmailVerified() {
    try {
      if (!user) return false;
      
      // Refresh the session to get the latest user data
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      // Check if email is confirmed in user metadata
      return data?.user?.email_confirmed_at != null;
    } catch (error) {
      return false;
    }
  }

  // Sign in function - simplified for reliability
  async function signIn(email, password) {
    try {
      // Directly attempt to sign in without any extra operations
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign out function
  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Password reset function with improved error handling
  async function resetPassword(email) {
    try {
      // Use the current site URL for redirects
      const siteUrl = window.location.origin;
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });
      
      if (error) {
        // Handle specific error codes
        if (error.status === 429 || error.message?.includes('rate limit') || error.message?.includes('security purposes')) {
          // If we have the error code for rate limiting, provide a more specific error
          if (error.message?.includes('after')) {
            return { 
              data: null, 
              error: {
                ...error,
                message: error.message,
                isRateLimit: true,
              }
            };
          }
          
          // Generic rate limit error if we can't extract specific details
          return { 
            data: null, 
            error: {
              ...error,
              message: 'Too many password reset attempts. Please wait before trying again.',
              isRateLimit: true,
            }
          };
        }
        
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update user profile
  async function updateProfile(profileData) {
    try {
      // Ensure the data matches the column names in the database
      const updatedData = { ...profileData };
      
      // If the profile data includes a full_name, split it into first_name and last_name
      if (updatedData.full_name && !updatedData.first_name) {
        const fullName = updatedData.full_name;
        delete updatedData.full_name;
        
        if (fullName.includes(' ')) {
          const nameParts = fullName.split(' ');
          updatedData.first_name = nameParts[0];
          updatedData.last_name = nameParts.slice(1).join(' ');
        } else {
          updatedData.first_name = fullName;
        }
      }
      
      const { data, error } = await supabase
        .from('profiles')  // Use the profiles table
        .upsert({
          id: user.id,
          ...updatedData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Update local profile state
      setUserProfile(prevProfile => ({
        ...prevProfile,
        ...updatedData
      }));
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    login: signIn,
    signOut,
    resetPassword,
    updateProfile,
    resendVerification,
    isEmailVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;