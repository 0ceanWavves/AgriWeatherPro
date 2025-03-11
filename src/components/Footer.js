import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaTwitter, FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';
import ContactForm from './ContactForm';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and mission */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <FaLeaf className="text-2xl text-accent" />
              <span className="text-xl font-heading font-bold">AgriWeather Pro</span>
            </Link>
            <p className="text-sm text-gray-300 mb-4">
              Advanced weather analytics platform helping farmers optimize crop yields through AI-powered climate trend analysis and predictions.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-accent" aria-label="Twitter">
                <FaTwitter className="text-xl" />
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-accent" aria-label="Facebook">
                <FaFacebook className="text-xl" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-accent" aria-label="LinkedIn">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="https://github.com" className="text-gray-400 hover:text-accent" aria-label="GitHub">
                <FaGithub className="text-xl" />
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-accent">Home</Link></li>
              <li><Link to="/forecast" className="text-gray-300 hover:text-accent">Forecast</Link></li>
              <li><Link to="/maps" className="text-gray-300 hover:text-accent">Maps</Link></li>
              <li><Link to="/crop-yields" className="text-gray-300 hover:text-accent">Crop Yields</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-accent">Dashboard</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-accent">About</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services/weather-forecasting" className="text-gray-300 hover:text-accent">Weather Forecasting</Link></li>
              <li><Link to="/services/crop-yield-prediction" className="text-gray-300 hover:text-accent">Crop Yield Prediction</Link></li>
              <li><Link to="/services/climate-analysis" className="text-gray-300 hover:text-accent">Climate Analysis</Link></li>
              <li><Link to="/services/agricultural-insights" className="text-gray-300 hover:text-accent">Agricultural Insights</Link></li>
              <li><Link to="/services/pest-management" className="text-gray-300 hover:text-accent">Pest Management</Link></li>
              <li><Link to="/services/irrigation-planning" className="text-gray-300 hover:text-accent">Irrigation Planning</Link></li>
            </ul>
          </div>
          
          {/* Contact Form */}
          <div className="col-span-1">
            <ContactForm />
          </div>
        </div>
        
        <hr className="border-gray-700 my-6" />
        
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} AgriWeather Pro. All rights reserved.</p>
          <p className="mt-2">
            <Link to="/privacy" className="hover:text-accent">Privacy Policy</Link>
            {' '} | {' '}
            <Link to="/terms" className="hover:text-accent">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;