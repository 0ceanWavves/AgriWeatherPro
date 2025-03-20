import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1);
  };
  
  return (
    <button 
      onClick={goBack}
      className="flex items-center text-gray-600 hover:text-primary mb-4"
    >
      <FaArrowLeft className="mr-2" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;