import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileSettings from '../components/ProfileSettings';

/**
 * Settings page component that displays user settings options
 */
const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="settings-page container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>
      
      {user ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProfileSettings user={user} />
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Please sign in to view and update your settings.</p>
        </div>
      )}
    </div>
  );
};

export default Settings; 