import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSeedling, 
  FaTwitter, 
  FaFacebook, 
  FaLinkedin, 
  FaGithub,
  FaHome,
  FaCloudSun,
  FaMapMarkedAlt,
  FaChartLine,
  FaTractor,
  FaInfoCircle,
  FaLeaf,
  FaBug,
  FaWater,
  FaTemperatureHigh,
  FaLightbulb
} from 'react-icons/fa';
import ContactForm from './ContactForm';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-green-900 to-green-950 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and mission */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-green-100 rounded-full p-1.5">
                <FaSeedling className="text-2xl text-green-600" />
              </div>
              <span className="text-xl font-heading font-bold">AgriWeather Pro</span>
            </Link>
            <p className="text-sm text-green-200 mb-4">
              Advanced weather analytics platform helping farmers optimize crop yields through AI-powered climate trend analysis and predictions.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-green-400 hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter className="text-xl" />
              </a>
              <a href="https://facebook.com" className="text-green-400 hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebook className="text-xl" />
              </a>
              <a href="https://linkedin.com" className="text-green-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="https://github.com" className="text-green-400 hover:text-white transition-colors" aria-label="GitHub">
                <FaGithub className="text-xl" />
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-green-300 border-b border-green-800 pb-2">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaHome className="mr-2 text-green-400" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/forecast" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaCloudSun className="mr-2 text-green-400" />
                  <span>Forecast</span>
                </Link>
              </li>
              <li>
                <Link to="/maps" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaMapMarkedAlt className="mr-2 text-green-400" />
                  <span>Maps</span>
                </Link>
              </li>
              <li>
                <Link to="/crop-yields" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaChartLine className="mr-2 text-green-400" />
                  <span>Crop Yields</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaTractor className="mr-2 text-green-400" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaInfoCircle className="mr-2 text-green-400" />
                  <span>About</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-green-300 border-b border-green-800 pb-2">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/weather-forecasting" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaCloudSun className="mr-2 text-yellow-400" />
                  <span>Weather Forecasting</span>
                </Link>
              </li>
              <li>
                <Link to="/services/crop-yield-prediction" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaChartLine className="mr-2 text-green-400" />
                  <span>Crop Yield Prediction</span>
                </Link>
              </li>
              <li>
                <Link to="/services/climate-analysis" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaTemperatureHigh className="mr-2 text-red-400" />
                  <span>Climate Analysis</span>
                </Link>
              </li>
              <li>
                <Link to="/services/agricultural-insights" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaLightbulb className="mr-2 text-yellow-300" />
                  <span>Agricultural Insights</span>
                </Link>
              </li>
              <li>
                <Link to="/services/pest-management" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaBug className="mr-2 text-amber-400" />
                  <span>Pest Management</span>
                </Link>
              </li>
              <li>
                <Link to="/services/irrigation-planning" className="text-green-200 hover:text-white transition-colors flex items-center">
                  <FaWater className="mr-2 text-blue-400" />
                  <span>Irrigation Planning</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Form */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-green-300 border-b border-green-800 pb-2">Contact Us</h3>
            <ContactForm />
          </div>
        </div>
        
        <hr className="border-green-800 my-6" />
        
        <div className="text-center text-green-400 text-sm">
          <p>&copy; {currentYear} AgriWeather Pro. All rights reserved.</p>
          <p className="mt-2">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            {' '} | {' '}
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;