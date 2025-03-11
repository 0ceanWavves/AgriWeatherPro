import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on page load
    const checkSession = async () => {
      console.log('Checking for active session...');
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Session data:', data);
        setUser(data?.session?.user || null);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    // Listen for auth state changes
    console.log('Setting up auth state listener...');
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      // Clean up subscription
      if (authListener && authListener.subscription) {
        console.log('Cleaning up auth listener...');
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign up function
  async function signUp(email, password) {
    console.log('Attempting to sign up with email:', email);
    console.log('Supabase client initialized:', !!supabase);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      console.log('Sign up response:', data ? 'Data received' : 'No data');
      if (error) {
        console.error('Sign up error:', error.message, error);
        throw error;
      }
      console.log('Sign up successful for:', email);
      return { data, error: null };
    } catch (error) {
      console.error('Sign up exception:', error.message);
      return { data: null, error };
    }
  }

  // Sign in function
  async function signIn(email, password) {
    console.log('Attempting to sign in with email:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in response:', data ? 'Data received' : 'No data');
      if (error) {
        console.error('Sign in error:', error.message);
        throw error;
      }
      console.log('Sign in successful for:', email);
      return { data, error: null };
    } catch (error) {
      console.error('Sign in exception:', error.message);
      return { data: null, error };
    }
  }

  // Sign out function
  async function signOut() {
    console.log('Attempting to sign out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error.message);
        throw error;
      }
      console.log('Sign out successful');
      return { error: null };
    } catch (error) {
      console.error('Sign out exception:', error.message);
      return { error };
    }
  }

  // Reset password function
  async function resetPassword(email) {
    console.log('Attempting to reset password for:', email);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      console.log('Reset password response:', data ? 'Data received' : 'No data');
      if (error) {
        console.error('Reset password error:', error.message);
        throw error;
      }
      console.log('Reset password email sent to:', email);
      return { data, error: null };
    } catch (error) {
      console.error('Reset password exception:', error.message);
      return { data: null, error };
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
