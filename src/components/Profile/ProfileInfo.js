import React, { useState } from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { FaEdit, FaCheck, FaTimes, FaCamera, FaUser } from 'react-icons/fa';
import { uploadAvatar } from '../../services/profileService';

const ProfileInfo = () => {
  const { profile, updateProfile, loading, error } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    display_name: '',
    organization: '',
    farming_type: '',
    bio: '',
    phone_number: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Start editing and initialize form with current data
  const handleStartEditing = () => {
    setFormData({
      full_name: profile?.full_name || '',
      display_name: profile?.display_name || '',
      organization: profile?.organization || '',
      farming_type: profile?.farming_type || '',
      bio: profile?.bio || '',
      phone_number: profile?.phone_number || ''
    });
    setIsEditing(true);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size - limit to 2MB
      if (file.size > 2 * 1024 * 1024) {
        setUpdateError('Image size should be less than 2MB');
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setUpdateError('Please select an image file');
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload the avatar if one is selected
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    setUploadingAvatar(true);
    setUpdateError(null);
    
    const result = await uploadAvatar(profile.id, avatarFile);
    
    if (result.success) {
      // Clear file and preview after successful upload
      setAvatarFile(null);
      setAvatarPreview(null);
    } else {
      setUpdateError(result.error);
    }
    
    setUploadingAvatar(false);
  };

  // Save profile changes
  const handleSave = async () => {
    setUpdateError(null);
    
    // First upload avatar if present
    if (avatarFile) {
      await handleAvatarUpload();
    }
    
    // Update profile information
    const result = await updateProfile(formData);
    
    if (result.success) {
      setIsEditing(false);
    } else {
      setUpdateError(result.error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setUpdateError(null);
  };

  // Display placeholder during loading
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="flex items-center mb-6">
            <div className="rounded-full bg-gray-200 h-20 w-20"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Display error if any
  if (error && !profile) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="text-red-500">
          Error loading profile: {error}
        </div>
      </div>
    );
  }

  // Edit mode
  if (isEditing) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        
        {updateError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {updateError}
          </div>
        )}
        
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-2">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'User'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-green-600 flex items-center justify-center cursor-pointer">
              <FaCamera className="text-white" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />
            </label>
          </div>
          {avatarFile && (
            <span className="text-xs text-gray-500">
              {avatarFile.name}
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
              Farm/Organization
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="farming_type" className="block text-sm font-medium text-gray-700">
              Farming Type
            </label>
            <select
              id="farming_type"
              name="farming_type"
              value={formData.farming_type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="">Select a farming type</option>
              <option value="row_crops">Row Crops</option>
              <option value="orchards">Orchards</option>
              <option value="vineyards">Vineyards</option>
              <option value="vegetables">Vegetables</option>
              <option value="mixed">Mixed Farming</option>
              <option value="livestock">Livestock</option>
              <option value="dairy">Dairy</option>
              <option value="greenhouse">Greenhouse</option>
              <option value="organic">Organic</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaTimes className="mr-2 -ml-1" /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaCheck className="mr-2 -ml-1" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <button
          type="button"
          onClick={handleStartEditing}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <FaEdit className="mr-1.5 -ml-0.5" /> Edit
        </button>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'User'}
              className="h-full w-full object-cover"
            />
          ) : (
            <FaUser className="h-10 w-10 text-gray-400" />
          )}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">
            {profile?.full_name || 'User'}
          </h3>
          <p className="text-sm text-gray-500">
            {profile?.display_name && `@${profile.display_name}`}
          </p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <dl className="divide-y divide-gray-200">
          <div className="py-3 flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Farm/Organization</dt>
            <dd className="text-sm text-gray-900">{profile?.organization || '-'}</dd>
          </div>
          
          <div className="py-3 flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Farming Type</dt>
            <dd className="text-sm text-gray-900">
              {profile?.farming_type ? (
                <span className="capitalize">
                  {profile.farming_type.replace('_', ' ')}
                </span>
              ) : (
                '-'
              )}
            </dd>
          </div>
          
          <div className="py-3 flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-sm text-gray-900 break-all">
              {profile?.email || '-'}
            </dd>
          </div>
          
          <div className="py-3 flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="text-sm text-gray-900">{profile?.phone_number || '-'}</dd>
          </div>
          
          {profile?.bio && (
            <div className="py-3">
              <dt className="text-sm font-medium text-gray-500 mb-1">Bio</dt>
              <dd className="text-sm text-gray-900 whitespace-pre-line">{profile.bio}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default ProfileInfo;