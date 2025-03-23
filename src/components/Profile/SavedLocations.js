import React, { useState } from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';

const SavedLocations = () => {
  const { savedLocations, addSavedLocation, updateSavedLocation, deleteSavedLocation, loading, error } = useUserProfile();
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: ''
  });
  const [formError, setFormError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Start adding new location
  const handleStartAdd = () => {
    setFormData({
      name: '',
      latitude: '',
      longitude: ''
    });
    setFormError(null);
    setIsAddingLocation(true);
    setIsEditingLocation(null);
    setDeleteConfirm(null);
  };

  // Start editing a location
  const handleStartEdit = (location) => {
    setFormData({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude
    });
    setFormError(null);
    setIsAddingLocation(false);
    setIsEditingLocation(location.id);
    setDeleteConfirm(null);
  };

  // Cancel adding/editing
  const handleCancel = () => {
    setIsAddingLocation(false);
    setIsEditingLocation(null);
    setFormError(null);
  };

  // Validate the form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Location name is required');
      return false;
    }
    
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setFormError('Latitude must be a number between -90 and 90');
      return false;
    }
    
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setFormError('Longitude must be a number between -180 and 180');
      return false;
    }
    
    return true;
  };

  // Save new location
  const handleAddLocation = async () => {
    if (!validateForm()) return;
    
    const result = await addSavedLocation({
      name: formData.name.trim(),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    });
    
    if (result.success) {
      setIsAddingLocation(false);
    } else {
      setFormError(result.error);
    }
  };

  // Update existing location
  const handleUpdateLocation = async () => {
    if (!validateForm()) return;
    
    const result = await updateSavedLocation(isEditingLocation, {
      name: formData.name.trim(),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    });
    
    if (result.success) {
      setIsEditingLocation(null);
    } else {
      setFormError(result.error);
    }
  };

  // Confirm deletion of a location
  const handleConfirmDelete = (locationId) => {
    setDeleteConfirm(locationId);
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Delete location
  const handleDeleteLocation = async (locationId) => {
    const result = await deleteSavedLocation(locationId);
    
    if (result.success) {
      setDeleteConfirm(null);
    } else {
      setFormError(result.error);
    }
  };

  // Set location as primary
  const handleSetAsPrimary = async (locationId) => {
    const result = await updateSavedLocation(locationId, {
      is_primary: true
    });
    
    if (!result.success) {
      setFormError(result.error);
    }
  };

  // Display placeholder during loading
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded w-full"></div>
            <div className="h-16 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Saved Locations</h2>
        {!isAddingLocation && !isEditingLocation && (
          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaPlus className="mr-1.5 -ml-0.5" /> Add Location
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {formError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {formError}
        </div>
      )}
      
      {/* Add/Edit Location Form */}
      {(isAddingLocation || isEditingLocation) && (
        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-3">
            {isAddingLocation ? 'Add New Location' : 'Edit Location'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="e.g., My Farm, North Field"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="e.g., 37.7749"
                />
              </div>
              
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="e.g., -122.4194"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={isAddingLocation ? handleAddLocation : handleUpdateLocation}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isAddingLocation ? 'Add Location' : 'Update Location'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Locations List */}
      <div className="space-y-4">
        {savedLocations.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No saved locations yet. Add your first location to get started.
          </p>
        ) : (
          savedLocations.map(location => (
            <div key={location.id} className="border border-gray-200 rounded-md p-4">
              {deleteConfirm === location.id ? (
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-red-700 text-sm mb-3">
                    Are you sure you want to delete this location? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancelDelete}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLocation(location.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-green-600 mt-1 mr-2" />
                      <div>
                        <h3 className="text-md font-medium text-gray-900 flex items-center">
                          {location.name}
                          {location.is_primary && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <FaStar className="mr-1" /> Primary
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Lat: {location.latitude}, Lng: {location.longitude}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!location.is_primary && (
                        <button
                          type="button"
                          onClick={() => handleSetAsPrimary(location.id)}
                          className="text-xs text-gray-500 hover:text-green-600"
                          title="Set as primary location"
                        >
                          <FaStar />
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleStartEdit(location)}
                        className="text-xs text-gray-500 hover:text-blue-600"
                        title="Edit location"
                      >
                        <FaEdit />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleConfirmDelete(location.id)}
                        className="text-xs text-gray-500 hover:text-red-600"
                        title="Delete location"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedLocations;