import React from 'react';
import { FaLeaf } from 'react-icons/fa';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="animate-pulse">
        <FaLeaf className="text-6xl text-primary mb-4" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Loading</h2>
      <div className="mt-2 w-16 h-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-loading-bar"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;