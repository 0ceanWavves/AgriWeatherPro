import { supabase } from '../lib/supabase';

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {Object} metadata - Additional user metadata
 * @returns {Promise<Object>} - Result with success/error information
 */
export const signUp = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    
    // Create initial profile record
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: metadata.full_name || '',
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Result with success/error information
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in with a third-party provider
 * @param {string} provider - Provider name (e.g., 'google', 'facebook')
 * @returns {Promise<Object>} - Result with success/error information
 */
export const signInWithProvider = async (provider) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error signing in with provider:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Reset password
 * @param {string} email - User's email
 * @returns {Promise<Object>} - Result with success/error information
 */
export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Result with success/error information
 */
export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current session
 * @returns {Promise<Object>} - Current session data
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error getting session:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<Object>} - Result with success/error information
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};