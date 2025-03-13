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
    // Check for active session on page load
    const checkSession = async () => {
      try {
        // Log for debugging
        console.log('Checking for existing session...');
        
        const { data } = await supabase.auth.getSession();
        const userData = data?.session?.user || null;
        
        console.log('Session check result:', userData ? 'User found' : 'No user found');
        
        // IMPORTANT: Set loading to false even if no user is found
        if (!userData) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          return;
        }
        
        setUser(userData);
        
        // Fetch user profile if user is logged in
        try {
          const profileData = await getUserProfile();
          console.log('Profile data fetched:', profileData);
          
          // If profile doesn't exist but we have user data, create the profile
          if (!profileData?.profile && userData.user_metadata?.full_name) {
            console.log('Profile not found during session check, creating one for user:', userData.id);
            try {
              // First check if profile already exists (extra safety)
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userData.id)
                .single();
                
              if (!existingProfile) {
                // Use upsert instead of insert to handle possible duplicates
                const { error: profileError } = await supabase
                  .from('profiles')
                  .upsert({
                    id: userData.id,
                    full_name: userData.user_metadata.full_name,
                    email: userData.email,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });
                
                if (profileError) {
                  console.error('Error creating profile during session check:', profileError);
                } else {
                  console.log('Profile created during session check');
                  // Refresh profile data after creation
                  const freshProfileData = await getUserProfile();
                  setUserProfile(freshProfileData?.profile || null);
                }
              } else {
                console.log('Profile already exists during session check, using existing');
                setUserProfile(existingProfile);
              }
            } catch (createError) {
              console.error('Exception creating profile during session check:', createError);
            }
          } else {
            setUserProfile(profileData?.profile || null);
          }
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          // Still consider the user logged in even if profile fetch fails
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Clear user data on error and finish loading
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Auth state has changed
        console.log('Auth state changed:', event);
        const userData = session?.user || null;
        
        // When signed out, clear everything
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          return;
        }
        
        // For other events, update the user state
        setUser(userData);
        
        // Fetch user profile only if signed in or token refreshed
        if (userData && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          try {
            const profileData = await getUserProfile();
            
            // If the profile doesn't exist but we have user data, create the profile
            if (!profileData?.profile && userData?.user_metadata?.full_name) {
              console.log('Profile not found, creating one for user:', userData.id);
              try {
                // First check if profile already exists
                const { data: existingProfile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', userData.id)
                  .single();
                  
                if (!existingProfile) {
                  // Use upsert instead of insert to handle possible duplicates
                  const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                      id: userData.id,
                      full_name: userData.user_metadata.full_name,
                      email: userData.email,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    });
                  
                  if (profileError) {
                    console.error('Error creating profile on auth change:', profileError);
                  } else {
                    console.log('Profile created on auth change');
                    // Refresh profile data after creation
                    const freshProfileData = await getUserProfile();
                    setUserProfile(freshProfileData?.profile || null);
                  }
                } else {
                  console.log('Profile already exists during auth change, using existing');
                  setUserProfile(existingProfile);
                }
              } catch (createError) {
                console.error('Exception creating profile on auth change:', createError);
              }
            } else {
              setUserProfile(profileData?.profile || null);
            }
          } catch (profileError) {
            console.error('Error fetching profile on auth change:', profileError);
            // Continue without profile
          }
        }
        
        // Always finish loading at the end
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

  // Sign up function with detailed error handling
  async function signUp(email, password, fullName) {
    console.log('Starting signup process for:', email);
    
    try {
      // Try a direct signup with minimal options
      console.log('Making signup API call...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        console.error('Signup API returned error:', error);
        return { data: null, error };
      }
      
      console.log('Signup API call succeeded:', data ? 'Data returned' : 'No data');
      
      // If user was created, try to create a profile
      if (data?.user) {
        console.log('User created, id:', data.user.id);
        
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: fullName,
              email: email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (profileError) {
            console.error('Error creating profile:', profileError);
          } else {
            console.log('Profile created successfully');
          }
        } catch (profileError) {
          console.error('Exception creating profile:', profileError);
        }
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Exception during signup:', error);
      return { 
        data: null, 
        error: { 
          message: 'There was an issue creating your account. Please try again later.',
          originalError: error
        } 
      };
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
        .from('profiles')  // Use the profiles table
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