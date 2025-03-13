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
        // Remove debug logging in production
        const { data } = await supabase.auth.getSession();
        const userData = data?.session?.user || null;
        
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

  // Check if a user already exists with the given email
  async function checkUserExists(email) {
    try {
      // Try to sign in with an incorrect password
      // If we get "Invalid login credentials", the user exists
      // If we get "Email not found", the user doesn't exist
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'intentional-wrong-password-for-check',
      });
      
      if (error) {
        // "Invalid login credentials" means user exists
        if (error.message.includes('Invalid login credentials')) {
          console.log('Email exists check: User exists with email', email);
          return true;
        }
        
        // Any other error suggests user doesn't exist
        console.log('Email exists check: No user with email', email);
        return false;
      }
      
      // If no error (should never happen with wrong password)
      return true;
    } catch (e) {
      console.error('Error checking if user exists:', e);
      // Assume user might exist on error to prevent duplicates
      return false;
    }
  }
  
  // Sign up function with improved error handling and duplicate detection
  async function signUp(email, password, fullName) {
    try {
      // Check if user already exists first
      const userExists = await checkUserExists(email);
      if (userExists) {
        return { 
          data: null, 
          error: { message: 'An account with this email already exists. Please sign in instead.' } 
        };
      }
      
      // Clear any existing auth state to prevent conflicts
      window.localStorage.removeItem('agriweatherpro_auth');
      await supabase.auth.signOut();
      
      // Simplified signup without extra options that might cause issues
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
        // Provide better error messages for common issues
        if (error.message.includes('email') && 
            (error.message.includes('already') || error.message.includes('duplicate'))) {
          return { 
            data: null, 
            error: { message: 'This email is already registered. Please sign in instead.' } 
          };
        }
        
        throw error;
      }
      
      // Check for empty identities array, which indicates the user already exists
      if (data?.user?.identities?.length === 0) {
        return { 
          data: null, 
          error: { message: 'This email is already registered. Please sign in instead.' } 
        };
      }
      
      // Create user profile in the profiles table
      if (data?.user) {
        try {
          console.log('Creating user profile for:', data.user.id);
          // First check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (!existingProfile) {
            // Only insert if profile doesn't exist
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({  // Use upsert instead of insert to handle possible duplicates
                id: data.user.id,
                full_name: fullName,
                email: email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
              
            if (profileError) {
              console.error('Error creating user profile:', profileError);
              // Continue anyway as the auth user was created
            } else {
              console.log('User profile created successfully');
            }
          } else {
            console.log('Profile already exists, skipping creation');
          }
        } catch (profileErr) {
          console.error('Exception creating profile:', profileErr);
          // Continue anyway as the auth user was created
        }
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up exception:', error.message);
      
      // User-friendly error message for database errors
      if (error.message && 
          (error.message.includes('duplicate') || 
           error.message.includes('constraint') || 
           error.message.includes('violates'))) {
        return { 
          data: null, 
          error: { message: 'There was an issue creating your account. This email may already be registered.' } 
        };
      }
      
      return { data: null, error };
    }
  }

  // Sign in function
  async function signIn(email, password) {
    try {
      console.log('Attempting to sign in with email:', email);
      
      // Clear any existing sessions before signing in
      await supabase.auth.signOut();
      
      // Now attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data);
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
