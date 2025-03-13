import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getUserProfile } from '../api/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on page load
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const userData = data?.session?.user || null;
        setUser(userData);
        
        // Fetch user profile if user is logged in
        if (userData) {
          const profileData = await getUserProfile();
          setUserProfile(profileData?.profile || null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const userData = session?.user || null;
        setUser(userData);
        
        // Fetch user profile if user is logged in or clear it on logout
        if (userData && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const profileData = await getUserProfile();
          setUserProfile(profileData?.profile || null);
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      // Clean up subscription
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign up function
  async function signUp(email, password, fullName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      // Create user profile if signup successful and user created
      if (data?.user) {
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: data.user.id,
                full_name: fullName,
                display_name: fullName.split(' ')[0], // Default display name to first name
                created_at: new Date().toISOString(),
              },
            ]);

          if (profileError) throw profileError;
        } catch (profileError) {
          console.error('Error creating user profile:', profileError);
          // Continue anyway as auth is successful
        }
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up exception:', error.message);
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
      console.error('Sign in exception:', error.message);
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
      console.error('Sign out exception:', error.message);
      return { error };
    }
  }

  // Reset password function
  async function resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Reset password exception:', error.message);
      return { data: null, error };
    }
  }

  // Update user profile
  async function updateProfile(profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Update local profile state
      setUserProfile(prevProfile => ({
        ...prevProfile,
        ...profileData
      }));
      
      return { data, error: null };
    } catch (error) {
      console.error('Update profile exception:', error.message);
      return { data: null, error };
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
