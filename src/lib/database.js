import { supabase } from './supabase';

/**
 * Database API for AgriWeather Pro
 * This file provides functions to interact with the Supabase database
 */

// User profile functions
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  return { data, error };
};

// User preferences functions
export const getUserPreferences = async (userId) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

export const updateUserPreferences = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
  
  return { data, error };
};

// Saved locations functions
export const getSavedLocations = async (userId) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .select('*')
    .eq('user_id', userId)
    .order('is_primary', { ascending: false })
    .order('name', { ascending: true });
  
  return { data, error };
};

export const getSavedLocation = async (locationId) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .select('*')
    .eq('id', locationId)
    .single();
  
  return { data, error };
};

export const addSavedLocation = async (userId, locationData) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .insert({
      user_id: userId,
      ...locationData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select();
  
  return { data, error };
};

export const updateSavedLocation = async (locationId, updates) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', locationId)
    .select();
  
  return { data, error };
};

export const deleteSavedLocation = async (locationId) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .delete()
    .eq('id', locationId);
  
  return { data, error };
};

// Weather reports functions
export const getWeatherReports = async (userId) => {
  const { data, error } = await supabase
    .from('weather_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getWeatherReport = async (reportId) => {
  const { data, error } = await supabase
    .from('weather_reports')
    .select('*')
    .eq('id', reportId)
    .single();
  
  return { data, error };
};

export const saveWeatherReport = async (userId, reportData) => {
  const { data, error } = await supabase
    .from('weather_reports')
    .insert({
      user_id: userId,
      ...reportData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select();
  
  return { data, error };
};

export const updateWeatherReport = async (reportId, updates) => {
  const { data, error } = await supabase
    .from('weather_reports')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', reportId)
    .select();
  
  return { data, error };
};

export const deleteWeatherReport = async (reportId) => {
  const { data, error } = await supabase
    .from('weather_reports')
    .delete()
    .eq('id', reportId);
  
  return { data, error };
};

// Crop predictions functions
export const getCropPredictions = async (userId) => {
  const { data, error } = await supabase
    .from('crop_predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getCropPrediction = async (predictionId) => {
  const { data, error } = await supabase
    .from('crop_predictions')
    .select('*')
    .eq('id', predictionId)
    .single();
  
  return { data, error };
};

export const saveCropPrediction = async (userId, predictionData) => {
  const { data, error } = await supabase
    .from('crop_predictions')
    .insert({
      user_id: userId,
      ...predictionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select();
  
  return { data, error };
};

export const updateCropPrediction = async (predictionId, updates) => {
  const { data, error } = await supabase
    .from('crop_predictions')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', predictionId)
    .select();
  
  return { data, error };
};

export const deleteCropPrediction = async (predictionId) => {
  const { data, error } = await supabase
    .from('crop_predictions')
    .delete()
    .eq('id', predictionId);
  
  return { data, error };
};

// Weather alerts functions
export const getWeatherAlerts = async (userId) => {
  const { data, error } = await supabase
    .from('user_weather_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('is_read', { ascending: true })
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getUnreadAlertCount = async (userId) => {
  const { data, error, count } = await supabase
    .from('user_weather_alerts')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  return { count, error };
};

export const markAlertAsRead = async (alertId) => {
  const { data, error } = await supabase
    .from('user_weather_alerts')
    .update({
      is_read: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', alertId);
  
  return { data, error };
};

export const dismissAlert = async (alertId) => {
  const { data, error } = await supabase
    .from('user_weather_alerts')
    .update({
      is_dismissed: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', alertId);
  
  return { data, error };
};

export const createAlert = async (alertData) => {
  const { data, error } = await supabase
    .from('user_weather_alerts')
    .insert({
      ...alertData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select();
  
  return { data, error };
};
