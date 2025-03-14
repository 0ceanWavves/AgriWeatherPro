import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create the context
const AuthContext = createContext(null);

// Direct initialization of Supabase client
const supabaseUrl = 'https://imykwqkjiphztfyolsmn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWt3cWtqaXBoenRmeW9sc21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDI5NTUsImV4cCI6MjA1NzQ3ODk1NX0.zITI20Fs6wyys55gTNVFRXt7FALs9dPfcfQlwNaIMko';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true, 
    detectSessionInUrl: true
  }
});

// Hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
export function FixedAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for session on initial load
  useEffect(() => {
    async function checkSession() {
      try {
        console.log('Checking for existing session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setError(error);
          setUser(null);
        } else {
          console.log('Session check result:', data);
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error('Exception checking session:', err);
        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setUser(session?.user || null);
      }
    );
    
    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign up function
  async function signUp(email, password, fullName) {
    try {
      console.log('Signing up with email:', email);
      
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      console.log('Signup response:', data, error);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  }

  // Sign in function
  async function signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
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
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Password reset function
  async function resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Create user profile
  async function createProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Profile creation error:', error);
      return { data: null, error };
    }
  }

  // Get user profile
  async function getProfile(userId) {
    try {
      if (!userId) return { data: null, error: new Error('No user ID provided') };
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get profile error:', error);
      return { data: null, error };
    }
  }

  // Update user profile
  async function updateProfile(userId, profileData) {
    try {
      if (!userId) return { data: null, error: new Error('No user ID provided') };
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  }

  // Test connection function - useful for debugging
  async function testConnection() {
    try {
      const { data, error } = await supabase.auth.getSession();
      return {
        success: !error,
        data,
        error,
        url: supabaseUrl,
        keyPrefix: supabaseKey.substring(0, 10) + '...'
      };
    } catch (error) {
      return {
        success: false,
        error,
        url: supabaseUrl,
        keyPrefix: supabaseKey.substring(0, 10) + '...'
      };
    }
  }

  // Create context value
  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    createProfile,
    getProfile,
    updateProfile,
    testConnection,
    supabase // Expose supabase client for direct access if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { supabase };