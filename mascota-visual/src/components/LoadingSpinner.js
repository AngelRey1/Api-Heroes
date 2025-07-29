import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-blob">🐾</div>
        <div className="spinner-blob">🦸‍♂️</div>
        <div className="spinner-blob">🎮</div>
        <div className="spinner-blob">💰</div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner; 