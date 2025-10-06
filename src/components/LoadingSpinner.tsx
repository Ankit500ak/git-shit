import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <div className="loading-section">
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;