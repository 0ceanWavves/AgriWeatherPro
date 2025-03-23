import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { FaSave, FaSync } from 'react-icons/fa';

const UserPreferences = () => {
  const { preferences, updatePreferences, loading, error } = useUserProfile();
  const [formData, setFormData] = useState({
    theme: 'light',
    temperature_unit: 'celsius',
    notification_enabled: true
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update form when preferences change
  useEffect(() => {
    if (preferences) {
      setFormData({
        theme: preferences.theme || 'light',
        temperature_unit: preferences.temperature_unit || 'celsius',
        notification_enabled: preferences.notification_enabled !== false // default to true
      });
    }
  }, [preferences]);

  // Handle form field changes
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  // Save preferences
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    const result = await updatePreferences(formData);
    
    if (result.success) {
      setSaveSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(result.error);
    }
    
    setSaving(false);
  };

  // Display placeholder during loading
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Application Preferences</h2>
      
      {saveError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {saveError}
        </div>
      )}
      
      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          Preferences saved successfully!
        </div>
      )}
      
      {error && !preferences && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          Error loading preferences: {error}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Theme Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={formData.theme === 'light'}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Light</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={formData.theme === 'dark'}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Dark</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="theme"
                value="system"
                checked={formData.theme === 'system'}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">System</span>
            </label>
          </div>
        </div>
        
        {/* Temperature Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature Unit
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="temperature_unit"
                value="celsius"
                checked={formData.temperature_unit === 'celsius'}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Celsius (°C)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="temperature_unit"
                value="fahrenheit"
                checked={formData.temperature_unit === 'fahrenheit'}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Fahrenheit (°F)</span>
            </label>
          </div>
        </div>
        
        {/* Notifications */}
        <div>
          <div className="flex items-center">
            <input
              id="notification_enabled"
              name="notification_enabled"
              type="checkbox"
              checked={formData.notification_enabled}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="notification_enabled" className="ml-2 block text-sm font-medium text-gray-700">
              Enable Notifications
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Receive alerts about weather events, pest risks, and system updates.
          </p>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <FaSync className="animate-spin mr-2 -ml-1" /> Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2 -ml-1" /> Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;