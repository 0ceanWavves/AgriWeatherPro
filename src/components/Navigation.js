import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar/Sidebar';

/**
 * Navigation component that renders the app's navigation structure
 * Conditionally renders Header or Sidebar based on authentication
 */
const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Extract the active view from the current path
  const getActiveView = () => {
    const path = location.pathname.split('/')[1] || 'home';
    return path;
  };
  
  // Set the active view by navigating to the appropriate route
  const setActiveView = (view) => {
    navigate(`/${view === 'home' ? '' : view}`);
  };

  // If user is logged in, show Sidebar, otherwise show Header
  return user ? (
    <Sidebar 
      activeView={getActiveView()} 
      setActiveView={setActiveView} 
    />
  ) : (
    <Header />
  );
};

export default Navigation; 