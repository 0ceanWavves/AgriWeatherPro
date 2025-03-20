import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://agriweatherpro.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || 'your_anon_key_here';

export const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Weather data functions
export const fetchWeatherData = async (lat, lng) => {
  try {
    const { data, error } = await supabaseClient
      .from('weather_data')
      .select('*')
      .eq('location_id', `${lat},${lng}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching weather data from Supabase:', error);
    return null;
  }
};

// Tariff data functions
export const fetchTariffData = async (countryCode) => {
  try {
    const { data, error } = await supabaseClient
      .from('tariff_data')
      .select('*')
      .eq('country_code', countryCode)
      .order('effective_date', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tariff data from Supabase:', error);
    return [];
  }
};

// Farm triggers functions
export const fetchFarmTriggers = async (userId) => {
  try {
    const { data, error } = await supabaseClient
      .from('triggers')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching farm triggers from Supabase:', error);
    return [];
  }
};

// Create a new trigger
export const createTrigger = async (triggerData) => {
  try {
    const { data, error } = await supabaseClient
      .from('triggers')
      .insert([triggerData]);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating trigger in Supabase:', error);
    throw error;
  }
};

// Fetch report data
export const fetchReportData = async (reportType, startDate, endDate, locationId) => {
  try {
    const { data, error } = await supabaseClient
      .from('reports')
      .select('*')
      .eq('report_type', reportType)
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('location_id', locationId);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching report data from Supabase:', error);
    return [];
  }
}; 