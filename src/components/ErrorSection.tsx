import React from 'react';
import './ErrorSection.css';

interface ErrorSectionProps {
  message: string;
  onRetry: () => void;
}

const ErrorSection: React.FC<ErrorSectionProps> = ({ message, onRetry }) => {
  return (
    <div className="error-section">
      <div className="error-card">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Something went wrong</h3>
        <p>{message}</p>
        <button onClick={onRetry} className="btn btn-primary">
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorSection;