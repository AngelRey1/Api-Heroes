import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import PetFigure from './PetFigure';
import './ActivePetDisplay.css';

const ActivePetDisplay = ({ showStats = true, showActions = false, onAction = null }) => {
  const { activePet, updateActivePet } = useUser();
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const getPetMood = () => {
    if (!activePet) return 'normal';
    if (activePet.health < 30) return 'sad';
    if (activePet.happiness > 80) return 'happy';
    if (activePet.energy < 30) return 'sleepy';
    return 'normal';
  };

  const handleAction = (action) => {
    if (!activePet || !onAction) return;
    
    setIsAnimating(true);
    setLastAction(action);
    
    // Simular la acción
    setTimeout(() => {
      onAction(action, activePet._id);
      setIsAnimating(false);
      setLastAction(null);
    }, 1000);
  };

  if (!activePet) {
    return (
      <div className="active-pet-display no-pet">
        <div className="no-pet-message">
          <span className="pet-icon">🐾</span>
          <p>No hay mascota activa</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`active-pet-display ${isAnimating ? 'animating' : ''}`}>
      <div className="pet-header">
        <h3>{activePet.name}</h3>
        <span className="pet-type">{activePet.petType}</span>
      </div>
      
      <div className="pet-visual">
        <PetFigure
          color={activePet.color || '#f39c12'}
          type={activePet.type || 'dog'}
          accessories={activePet.accessories || []}
          size={120}
          animated={true}
          mood={getPetMood()}
        />
        
        {isAnimating && (
          <div className="action-overlay">
            <span className="action-icon">
              {lastAction === 'feed' && '🍖'}
              {lastAction === 'play' && '🎾'}
              {lastAction === 'bath' && '🛁'}
              {lastAction === 'heal' && '💊'}
              {lastAction === 'walk' && '🚶'}
            </span>
          </div>
        )}
      </div>

      {showStats && (
        <div className="pet-stats">
          <div className="stat-item">
            <span className="stat-label">❤️</span>
            <div className="stat-bar">
              <div 
                className="stat-fill health" 
                style={{ width: `${activePet.health || 100}%` }}
              ></div>
            </div>
            <span className="stat-value">{activePet.health || 100}%</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">😊</span>
            <div className="stat-bar">
              <div 
                className="stat-fill happiness" 
                style={{ width: `${activePet.happiness || 100}%` }}
              ></div>
            </div>
            <span className="stat-value">{activePet.happiness || 100}%</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">⚡</span>
            <div className="stat-bar">
              <div 
                className="stat-fill energy" 
                style={{ width: `${activePet.energy || 100}%` }}
              ></div>
            </div>
            <span className="stat-value">{activePet.energy || 100}%</span>
          </div>
        </div>
      )}

      {showActions && (
        <div className="pet-actions">
          <button 
            className="action-btn feed-btn"
            onClick={() => handleAction('feed')}
            disabled={isAnimating}
            title="Alimentar"
          >
            🍖
          </button>
          
          <button 
            className="action-btn play-btn"
            onClick={() => handleAction('play')}
            disabled={isAnimating}
            title="Jugar"
          >
            🎾
          </button>
          
          <button 
            className="action-btn bath-btn"
            onClick={() => handleAction('bath')}
            disabled={isAnimating}
            title="Bañar"
          >
            🛁
          </button>
          
          <button 
            className="action-btn heal-btn"
            onClick={() => handleAction('heal')}
            disabled={isAnimating}
            title="Curar"
          >
            💊
          </button>
          
          <button 
            className="action-btn walk-btn"
            onClick={() => handleAction('walk')}
            disabled={isAnimating}
            title="Pasear"
          >
            🚶
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivePetDisplay; 