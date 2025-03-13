import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navigation bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-primary text-white ${isScrolled ? 'shadow-md' : ''} fixed w-full z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <FaLeaf className="text-2xl text-accent" />
            <span className="text-xl font-heading font-bold">AgriWeather Pro</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
            <Link to="/services" className="hover:text-accent transition-colors">Services</Link>
            <Link to="/about" className="hover:text-accent transition-colors">About</Link>
            
            {currentUser ? (
              <button 
                onClick={signOut}
                className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link 
                to="/signin" 
                className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
          
          {/* Mobile navigation */}
          <div className="md:hidden">
            <Link 
              to="/signin" 
              className="bg-accent hover:bg-accent/90 text-white px-3 py-1.5 rounded transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;