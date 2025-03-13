import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaLeaf, FaCaretDown, FaSeedling, FaCloudSun, FaWater, FaTractor } from 'react-icons/fa';
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
    <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-green-100 rounded-full p-1.5">
              <FaSeedling className="text-2xl text-green-600" />
            </div>
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
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/dashboard" className="flex items-center space-x-1 hover:text-green-200 transition-colors">
              <FaTractor className="text-green-300" />
              <span>Dashboard</span>
            </Link>
            <div className="relative" ref={servicesMenuRef}>
              <button 
                onClick={toggleServicesMenu}
                className="flex items-center hover:text-green-200 transition-colors focus:outline-none"
                aria-label="Services"
              >
                <FaLeaf className="mr-1 text-green-300" />
                Services <FaCaretDown className="ml-1" />
              </button>
              {showServicesMenu && (
                <div className="absolute top-full left-0 mt-1 bg-green-900 p-4 rounded-md shadow-lg z-10 w-64 border border-green-700">
                  <ServicesMenu onSelectService={handleServiceSelected} />
                </div>
              )}
            </div>
            <Link to="/about" className="flex items-center space-x-1 hover:text-green-200 transition-colors">
              <FaCloudSun className="text-green-300" />
              <span>About</span>
            </Link>
            <Link to="/signin" className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md transition-colors flex items-center">
              <FaWater className="mr-2" />
              Sign In
            </Link>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-4 pb-4 bg-green-800 rounded-md p-4">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 hover:text-green-200 transition-colors border-b border-green-700 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTractor className="text-green-300" />
              <span>Dashboard</span>
            </Link>
            
            <div className="py-2 px-4 bg-green-900/50 rounded-md border-l-4 border-green-600">
              <h3 className="flex items-center text-green-300 font-semibold mb-2">
                <FaLeaf className="mr-2" />
                Services
              </h3>
              <ServicesMenu onSelectService={handleServiceSelected} className="pl-2" />
            </div>
            
            <Link 
              to="/about" 
              className="flex items-center space-x-2 hover:text-green-200 transition-colors border-b border-green-700 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaCloudSun className="text-green-300" />
              <span>About</span>
            </Link>
            
            <Link 
              to="/signin" 
              className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaWater className="mr-2" />
              Sign In
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;