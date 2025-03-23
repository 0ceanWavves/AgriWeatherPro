import React from 'react';

export const Card = ({ title, children, className = '', ...rest }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden mb-6 ${className}`} {...rest}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
