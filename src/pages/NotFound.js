import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found page component
 */
const NotFound = () => {
  return (
    <div className="not-found-page flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound; 