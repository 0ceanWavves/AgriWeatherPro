import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../../services/profileService';
import { getCurrentSubscription, getSubscriptionPlans } from '../../services/subscriptionService';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    website: '',
    avatar_url: '',
  });

  // Fetch user profile and subscription data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user profile
        const profileResult = await getUserProfile();
        
        if (!profileResult.success) {
          throw new Error(profileResult.error || 'Failed to load profile');
        }
        
        setProfile(profileResult.data);
        setFormData({
          username: profileResult.data.username || '',
          full_name: profileResult.data.full_name || '',
          website: profileResult.data.website || '',
          avatar_url: profileResult.data.avatar_url || '',
        });
        
        // Fetch subscription info
        const subscriptionResult = await getCurrentSubscription();
        if (subscriptionResult.success) {
          setSubscription(subscriptionResult.data);
        }
        
        // Fetch available plans
        const plansResult = await getSubscriptionPlans();
        if (plansResult.success) {
          setPlans(plansResult.data);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await updateUserProfile(formData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }
      
      setProfile({
        ...profile,
        ...formData,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile.username || '',
      full_name: profile.full_name || '',
      website: profile.website || '',
      avatar_url: profile.avatar_url || '',
    });
    setIsEditing(false);
  };

  const getCurrentPlan = () => {
    if (!subscription || !plans.length) return 'Free';
    
    const currentPlan = plans.find(plan => plan.id === subscription.plan_id);
    return currentPlan ? currentPlan.name : 'Free';
  };

  const navigateToSubscription = () => {
    navigate('/subscription');
  };

  if (loading && !profile) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-container">
        <div className="error-message">{error}</div>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        {!isEditing && (
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="profile-content">
        <div className="profile-section">
          <div className="profile-avatar">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || profile.username || 'User avatar'} 
              />
            ) : (
              <div className="avatar-placeholder">
                {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || '?'}
              </div>
            )}
          </div>

          {isEditing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="avatar_url">Avatar URL</label>
                <input
                  type="url"
                  id="avatar_url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-buttons">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Username:</span>
                <span className="detail-value">{profile?.username || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{profile?.full_name || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Website:</span>
                <span className="detail-value">
                  {profile?.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                      {profile.website}
                    </a>
                  ) : (
                    'Not set'
                  )}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{profile?.email || 'Not set'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="subscription-section">
          <h2>Your Subscription</h2>
          <div className="subscription-details">
            <div className="detail-item">
              <span className="detail-label">Current Plan:</span>
              <span className="detail-value plan-name">{getCurrentPlan()}</span>
            </div>
            
            {subscription && (
              <>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value status-${subscription.status}`}>
                    {subscription.status}
                  </span>
                </div>
                
                {subscription.current_period_end && (
                  <div className="detail-item">
                    <span className="detail-label">Next Billing Date:</span>
                    <span className="detail-value">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </>
            )}
            
            <button 
              className="subscription-button"
              onClick={navigateToSubscription}
            >
              {subscription ? 'Manage Subscription' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 