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
        console.log('Checking for existing session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setUser(null);
          setLoading(false);
          return;
        }
        
        console.log('Session check result:', data?.session ? 'Session exists' : 'No session');
        
        // Update user state from session
        const userData = data?.session?.user || null;
        setUser(userData);
        
        // If user exists, get their profile
        if (userData) {
          try {
            console.log('Fetching user profile for ID:', userData.id);
            const profileData = await getUserProfile(userData.id);
            
            // If no profile exists yet, create one
            if (!profileData?.profile) {
              console.log('No profile found, creating new profile');
              
              try {
                // Try to create a profile
                const { error: createError } = await supabase.from('profiles').insert({
                  id: userData.id,
                  email: userData.email,
                  first_name: userData?.user_metadata?.full_name || '',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
                
                if (createError) {
                  console.error('Error creating profile during session check:', createError);
                } else {
                  console.log('Profile created successfully during session check');
                  // Fetch the newly created profile
                  const newProfileData = await getUserProfile(userData.id);
                  setUserProfile(newProfileData?.profile || null);
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
        
        // If user exists after auth state change, fetch or create their profile
        if (userData) {
          try {
            console.log('Fetching user profile after auth change for ID:', userData.id);
            const profileData = await getUserProfile(userData.id);
            
            if (!profileData?.profile) {
              console.log('No profile found after auth change, creating new profile');
              
              try {
                // Split name from user metadata if available
                let firstName = '';
                let lastName = '';
                
                if (userData?.user_metadata?.full_name) {
                  const fullName = userData.user_metadata.full_name;
                  if (fullName.includes(' ')) {
                    const nameParts = fullName.split(' ');
                    firstName = nameParts[0];
                    lastName = nameParts.slice(1).join(' ');
                  } else {
                    firstName = fullName;
                  }
                }
                
                const { error: createError } = await supabase.from('profiles').insert({
                  id: userData.id,
                  email: userData.email,
                  first_name: firstName,
                  last_name: lastName,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
                
                if (createError) {
                  console.error('Error creating profile after auth change:', createError);
                } else {
                  console.log('Profile created successfully after auth change');
                  // Fetch the newly created profile
                  const newProfileData = await getUserProfile(userData.id);
                  setUserProfile(newProfileData?.profile || null);
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
          },
          // Redirect to dashboard after verification, but error page will handle failures
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('Signup API returned error:', error);
        return { data: null, error };
      }
      
      console.log('Signup API call succeeded:', data ? 'Data returned' : 'No data');
      
      // If user was created, try to create a profile using raw SQL instead
      if (data?.user) {
        console.log('User created, id:', data.user.id);
        
        try {
          // Split fullName into first_name and last_name (assuming format "First Last")
          let firstName = fullName;
          let lastName = '';
          
          if (fullName.includes(' ')) {
            const nameParts = fullName.split(' ');
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          }
          
          // Use a direct RPC call to avoid schema cache issues
          const { error: profileError } = await supabase.rpc('create_user_profile', {
            user_id: data.user.id,
            user_email: email,
            user_first_name: firstName,
            user_last_name: lastName
          });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
            
            // Fall back to direct SQL if RPC fails
            console.log('Attempting alternative profile creation method...');
            
            // Trying simpler approach with fewer columns
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: data.user.id,
                  first_name: firstName,
                  last_name: lastName
                }
              ]);
              
            if (insertError) {
              console.error('Alternative profile creation failed:', insertError);
            } else {
              console.log('Profile created successfully with alternative method');
            }
          } else {
            console.log('Profile created successfully via RPC');
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
      console.error('Error resending verification email:', error);
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
      console.error('Error checking email verification:', error);
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