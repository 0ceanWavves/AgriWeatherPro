import { supabase } from '../lib/supabase.js';

// Get the current user
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

// Get user profile data
export const getUserProfile = async () => {
  const user = await getCurrentUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')  // Changed from user_profiles to profiles to match the actual table name
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return {
    ...user,
    profile: data
  };
};

// Logout function
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    return false;
  }
  
  return true;
};
