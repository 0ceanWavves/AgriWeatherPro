import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../api/auth';
import { supabase } from '../lib/supabase';

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    full_name: '',
    bio: '',
    organization: '',
    farming_type: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const userData = await getUserProfile();
      setUser(userData);
      
      if (userData?.profile) {
        setFormData({
          display_name: userData.profile.display_name || '',
          full_name: userData.profile.full_name || '',
          bio: userData.profile.bio || '',
          organization: userData.profile.organization || '',
          farming_type: userData.profile.farming_type || ''
        });
      }
      
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      // Refresh user data
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Error updating profile. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
        <div className="bg-red-100 text-red-700 p-4 rounded">
          You need to be logged in to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
      
      {message.text && (
        <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={user.email || ''}
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="display_name">
            Display Name
          </label>
          <input
            type="text"
            id="display_name"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="How you want to be addressed"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="full_name">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Your full name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Tell us a bit about yourself"
            rows="3"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="organization">
            Organization
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Your organization or farm name"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="farming_type">
            Farming Type
          </label>
          <select
            id="farming_type"
            name="farming_type"
            value={formData.farming_type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select farming type</option>
            <option value="crop">Crop Farming</option>
            <option value="livestock">Livestock Farming</option>
            <option value="dairy">Dairy Farming</option>
            <option value="poultry">Poultry Farming</option>
            <option value="horticulture">Horticulture</option>
            <option value="mixed">Mixed Farming</option>
            <option value="organic">Organic Farming</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <button
            type="submit"
            className="bg-orange-1 text-black-1 px-4 py-2 rounded hover:bg-orange-2 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;