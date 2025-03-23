import React, { useState } from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import ProfileInfo from '../../components/Profile/ProfileInfo';
import UserPreferences from '../../components/Profile/UserPreferences';
import SavedLocations from '../../components/Profile/SavedLocations';
import { 
  FaUser, 
  FaCog, 
  FaMapMarkerAlt, 
  FaSignOutAlt, 
  FaShieldAlt,
  FaLock
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, signOut, loading } = useUserProfile();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Tabs configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'preferences', label: 'Preferences', icon: <FaCog /> },
    { id: 'locations', label: 'Locations', icon: <FaMapMarkerAlt /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'subscription', label: 'Subscription', icon: <FaShieldAlt /> }
  ];
  
  // Handle sign out
  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      // Redirect should happen automatically via auth state change
    }
  };
  
  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo />;
      case 'preferences':
        return <UserPreferences />;
      case 'locations':
        return <SavedLocations />;
      case 'security':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <p className="text-gray-500 mb-4">Manage your password and account security settings.</p>
            
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <p className="text-sm text-gray-500 mb-4">
                  It's a good idea to use a strong password that you're not using elsewhere
                </p>
                <Link
                  to="/change-password"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Change Password
                </Link>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Set Up Two-Factor Authentication
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Permanent actions that cannot be undone
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );
      case 'subscription':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Subscription</h2>
            <div className="border rounded-lg p-4 bg-gray-50 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Current Plan: <span className="text-green-600">Free</span></h3>
                  <p className="text-sm text-gray-500 mt-1">Basic access to weather data and forecasts</p>
                </div>
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Upgrade
                </Link>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-3">Premium Benefits</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Advanced Irrigation Planning</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Enhanced Weather Analytics</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Advanced Crop Management</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Priority Support</span>
              </li>
            </ul>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium mb-3">Need Help?</h3>
              <Link
                to="/support"
                className="inline-flex items-center text-green-600 hover:text-green-500"
              >
                Contact our support team
              </Link>
            </div>
          </div>
        );
      default:
        return <ProfileInfo />;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-green-700 text-white">
              <h2 className="text-xl font-bold truncate">
                {loading ? 'Loading...' : (user?.email || 'User')}
              </h2>
              <p className="text-green-100 text-sm truncate">
                Account Settings
              </p>
            </div>
            
            <nav className="mt-2">
              <div className="px-2 space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left
                      ${activeTab === tab.id
                        ? 'bg-green-100 text-green-900'
                        : 'text-gray-700 hover:bg-gray-50'}
                    `}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="mr-3 text-green-600">
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="px-2 mt-6 mb-4">
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left text-red-700 hover:bg-red-50"
                >
                  <FaSignOutAlt className="mr-3 text-red-600" /> Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;