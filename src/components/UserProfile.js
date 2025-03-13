import React, { useState, useEffect } from 'react';
import { getUserProfile, logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const userData = await getUserProfile();
      setUser(userData);
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-4">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Not logged in. <button 
          onClick={() => navigate('/login')}
          className="underline text-blue-600 hover:text-blue-800"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
            {user.profile?.display_name?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-lg">
              {user.profile?.display_name || user.profile?.full_name || user.email}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
      
      {user.profile?.organization && (
        <p className="text-sm text-gray-700 mb-1">
          <span className="font-medium">Organization:</span> {user.profile.organization}
        </p>
      )}
      
      {user.profile?.farming_type && (
        <p className="text-sm text-gray-700 mb-1">
          <span className="font-medium">Farming Type:</span> {user.profile.farming_type}
        </p>
      )}
      
      {user.profile?.bio && (
        <p className="text-sm text-gray-700 mt-2">{user.profile.bio}</p>
      )}
    </div>
  );
};

export default UserProfile;
