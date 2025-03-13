import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaLeaf, FaCaretDown } from 'react-icons/fa';
import ServicesMenu from './ServicesMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const servicesMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleServicesMenu = () => {
    setShowServicesMenu(!showServicesMenu);
  };

  const handleServiceSelected = () => {
    setShowServicesMenu(false);
    setIsMenuOpen(false);
  };

  // Close services menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target)) {
        setShowServicesMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <FaLeaf className="text-2xl text-accent" />
            <span className="text-xl font-heading font-bold">AgriWeather Pro</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
          
          {/* Desktop navigation - Simplified to match the image */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
            <div className="relative" ref={servicesMenuRef}>
              <button 
                onClick={toggleServicesMenu}
                className="flex items-center hover:text-accent transition-colors focus:outline-none"
                aria-label="Services"
              >
                Services <FaCaretDown className="ml-1" />
              </button>
              {showServicesMenu && (
                <div className="absolute top-full left-0 mt-1 bg-dark p-4 rounded-md shadow-lg z-10 w-64">
                  <ServicesMenu onSelectService={handleServiceSelected} />
                </div>
              )}
            </div>
            <Link to="/about" className="hover:text-accent transition-colors">About</Link>
            <Link to="/signin" className="bg-accent hover:bg-accent/80 text-white py-1 px-4 rounded transition-colors">Sign In</Link>
          </nav>
        </div>
        
        {/* Mobile navigation - Simplified to match the image */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-4 pb-4">
            <Link 
              to="/dashboard" 
              className="hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            
            <div className="py-2 px-4 bg-primary/20 rounded-md">
              <ServicesMenu onSelectService={handleServiceSelected} />
            </div>
            
            <Link 
              to="/about" 
              className="hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            <Link 
              to="/signin" 
              className="bg-accent hover:bg-accent/80 text-white py-1 px-4 rounded transition-colors inline-block text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;