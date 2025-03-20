import React from 'react';
import { FaDownload, FaFileExport } from 'react-icons/fa';

const ExportDropdown = ({ isOpen, toggle, onExport, buttonText = 'Export', icon = 'export', buttonClass = '' }) => {
  return (
    <div className="relative">
      <button 
        onClick={toggle}
        className={`px-4 py-2 rounded-md shadow-sm text-sm flex items-center ${buttonClass || 'bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700'}`}
      >
        {icon === 'export' ? <FaFileExport className="mr-2" /> : <FaDownload className="mr-2" />}
        {buttonText} <span className="ml-1">▼</span>
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button onClick={() => onExport('csv')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">CSV</button>
            <button onClick={() => onExport('json')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">JSON</button>
            <button onClick={() => onExport('markdown')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Markdown</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;