import { supabase } from '../lib/supabaseClient';

/**
 * Get the user's profile
 * @returns {Promise<Object>} - Result with success/error information and profile data
 */
export const getUserProfile = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.session.user.id)
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update the user's profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} - Result with success/error information and updated profile data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', session.session.user.id)
      .select();
    
    if (error) throw error;
    
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload user avatar to Supabase Storage
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - Result with success/error information and file path
 */
export const uploadAvatar = async (file) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = session.session.user.id;
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-content')
      .getPublicUrl(filePath);
    
    // Update user profile with new avatar URL
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
      .select();
    
    if (updateError) throw updateError;
    
    return { success: true, data: data[0], publicUrl };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a user's preferences
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Result with success/error information
 */
export const getPreferences = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // No data found is ok
      throw error;
    }
    
    // Return default preferences if none found
    const preferences = data || {
      theme: 'light',
      temperature_unit: 'celsius',
      notification_enabled: true
    };
    
    return { success: true, data: preferences };
  } catch (error) {
    console.error('Error getting preferences:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a user's preferences
 * @param {string} userId - User ID
 * @param {Object} preferencesData - Preferences data to update
 * @returns {Promise<Object>} - Result with success/error information
 */
export const updatePreferences = async (userId, preferencesData) => {
  try {
    // Check if preferences record exists
    const { data: existingData } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    // Add timestamps
    const dataToUpdate = {
      ...preferencesData,
      updated_at: new Date()
    };
    
    let result;
    
    if (existingData) {
      // Update existing record
      result = await supabase
        .from('user_preferences')
        .update(dataToUpdate)
        .eq('id', existingData.id)
        .select();
    } else {
      // Create new record
      result = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          ...dataToUpdate,
          created_at: new Date()
        })
        .select();
    }
    
    const { data, error } = result;
    
    if (error) throw error;
    
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating preferences:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a user's saved locations
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Result with success/error information
 */
export const getSavedLocations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('saved_locations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error getting saved locations:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add a new saved location
 * @param {string} userId - User ID
 * @param {Object} locationData - Location data to save
 * @returns {Promise<Object>} - Result with success/error information
 */
export const addSavedLocation = async (userId, locationData) => {
  try {
    const { data, error } = await supabase
      .from('saved_locations')
      .insert({
        user_id: userId,
        ...locationData,
        created_at: new Date(),
        updated_at: new Date()
      })
      .select();
      
    if (error) throw error;
    
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding location:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a saved location
 * @param {string} userId - User ID
 * @param {string} locationId - Location ID
 * @param {Object} locationData - Location data to update
 * @returns {Promise<Object>} - Result with success/error information
 */
export const updateSavedLocation = async (userId, locationId, locationData) => {
  try {
    const { data, error } = await supabase
      .from('saved_locations')
      .update({
        ...locationData,
        updated_at: new Date()
      })
      .eq('id', locationId)
      .eq('user_id', userId)
      .select();
      
    if (error) throw error;
    
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating location:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a saved location
 * @param {string} userId - User ID
 * @param {string} locationId - Location ID
 * @returns {Promise<Object>} - Result with success/error information
 */
export const deleteSavedLocation = async (userId, locationId) => {
  try {
    const { error } = await supabase
      .from('saved_locations')
      .delete()
      .eq('id', locationId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting location:', error);
    return { success: false, error: error.message };
  }
};