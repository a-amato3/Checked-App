import React from 'react';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => (
  <div className="loading">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
); 