import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaLeaf, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const AuthRequired = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-lg w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="inline-block p-4 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <FaLock className="text-4xl text-yellow-500" />
          </div>
        </div>
        
        <div className="mb-6">
          <FaLeaf className="text-6xl text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please sign in or create an account to access the AgriWeather Pro dashboard and view weather forecasts, maps, and crop yield predictions.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link 
            to="/signin" 
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <FaSignInAlt />
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-primary border-2 border-primary font-bold py-3 px-6 rounded-lg transition-colors dark:bg-transparent dark:hover:bg-gray-700"
          >
            <FaUserPlus />
            Create Account
          </Link>
        </div>
        
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Why Create an Account?
          </h3>
          <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Access personalized weather forecasts for your specific locations
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Save and track crop yield predictions for different crops
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Receive customized alerts and notifications for weather events
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Track historical weather data and view agricultural insights
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthRequired;