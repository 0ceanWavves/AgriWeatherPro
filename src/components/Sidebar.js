import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar/Sidebar.css';

/**
 * Sidebar component for navigation
 */
const Sidebar = ({ currentPath }) => {
  // Determine active nav item based on current path
  const isActive = (path) => currentPath === path;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <Link to="/dashboard" className="nav-link">
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
            <Link to="/profile" className="nav-link">
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/subscription') || isActive('/account/billing') ? 'active' : ''}`}>
            <Link to="/subscription" className="nav-link">
              <i className="fas fa-star"></i>
              <span>Subscription</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
            <Link to="/settings" className="nav-link">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 