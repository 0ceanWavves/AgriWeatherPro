import { supabase } from '../lib/supabase.js';

// Get the current user
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

// Get user profile data - now accepts a userId parameter
export const getUserProfile = async (userId) => {
  try {
    // If no userId is provided, try to get the current user's ID
    if (!userId) {
      const user = await getCurrentUser();
      if (!user) return null;
      userId = user.id;
    }
    
    console.log('Fetching profile for user ID:', userId);
    
    // First, try direct database query using the service role key
    // This bypasses the PostgREST schema cache
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.warn('Error fetching profile with standard query:', error);
      
      // If it's a schema cache error, try a more basic approach
      if (error.code && (error.code.startsWith('PGRST') || error.message.includes('schema cache'))) {
        console.log('Attempting simpler profile query...');
        
        // Just select the id column which should always exist
        const { data: basicData, error: basicError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();
        
        if (basicError) {
          console.error('Error with basic profile query:', basicError);
          return null;
        }
        
        return {
          id: userId,
          profile: basicData || { id: userId }
        };
      }
      
      return null;
    }
    
    // Get user data to combine with profile
    const { data: userData } = await supabase.auth.getUser(userId);
    
    return {
      ...userData?.user,
      profile: data
    };
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
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
