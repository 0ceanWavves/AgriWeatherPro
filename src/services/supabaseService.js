// Supabase service for AgriWeather Pro

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with public keys
// In production, these should be stored in environment variables
const supabaseUrl = 'https://gexynwadeancyvnthsbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHlud2FkZWFuY3l2bnRoc2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM5MTAyOTYsImV4cCI6MTk5OTQ4NjI5Nn0.v6k2v53alndEvfaNl4UkywHlcLYeJDggFNESWxF7umc';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Auth response
 */
export const signInWithEmail = async (email, password) => {
  return await supabaseClient.auth.signInWithPassword({
    email,
    password
  });
};

/**
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Auth response
 */
export const signUpWithEmail = async (email, password) => {
  return await supabaseClient.auth.signUp({
    email,
    password
  });
};

/**
 * Sign out the current user
 * @returns {Promise<Object>} Sign out response
 */
export const signOut = async () => {
  return await supabaseClient.auth.signOut();
};

/**
 * Get the current session
 * @returns {Promise<Object>} Session response
 */
export const getSession = async () => {
  return await supabaseClient.auth.getSession();
};

/**
 * Get the current user
 * @returns {Promise<Object>} User response
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabaseClient.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return data.user;
};

/**
 * Get user profile data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
  if (!userId) return null;
  
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
  
  return data;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated profile data
 */
export const updateUserProfile = async (userId, profileData) => {
  if (!userId) return null;
  
  const { data, error } = await supabaseClient
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  return data;
};

/**
 * Get user saved locations
 * @param {string} userId - User ID
 * @returns {Promise<Array>} User locations
 */
export const getUserLocations = async (userId) => {
  if (!userId) return [];
  
  const { data, error } = await supabaseClient
    .from('saved_locations')
    .select('*')
    .eq('user_id', userId)
    .order('is_primary', { ascending: false });
    
  if (error) {
    console.error('Error getting user locations:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Add a new location
 * @param {Object} locationData - Location data
 * @returns {Promise<Object>} Added location
 */
export const addLocation = async (locationData) => {
  const { data, error } = await supabaseClient
    .from('saved_locations')
    .insert([locationData])
    .select();
    
  if (error) {
    console.error('Error adding location:', error);
    throw error;
  }
  
  return data[0];
};

/**
 * Update an existing location
 * @param {string} locationId - Location ID
 * @param {Object} locationData - Location data to update
 * @returns {Promise<Object>} Updated location
 */
export const updateLocation = async (locationId, locationData) => {
  const { data, error } = await supabaseClient
    .from('saved_locations')
    .update(locationData)
    .eq('id', locationId)
    .select();
    
  if (error) {
    console.error('Error updating location:', error);
    throw error;
  }
  
  return data[0];
};

/**
 * Delete a location
 * @param {string} locationId - Location ID
 * @returns {Promise<void>}
 */
export const deleteLocation = async (locationId) => {
  const { error } = await supabaseClient
    .from('saved_locations')
    .delete()
    .eq('id', locationId);
    
  if (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
};
