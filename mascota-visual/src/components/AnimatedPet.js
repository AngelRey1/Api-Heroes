import React, { useState, useEffect } from 'react';
import './AnimatedPet.css';

const AnimatedPet = ({ pet, onAction, isActive = true }) => {
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mood, setMood] = useState('normal');

  // Determinar estado de ánimo basado en stats
  useEffect(() => {
    if (!pet) return;

    if (pet.status === 'dead' || pet.health === 0) {
      setMood('dead');
    } else if (pet.health < 30) {
      setMood('sick');
    } else if (pet.happiness > 80 && pet.health > 80) {
      setMood('happy');
    } else if (pet.happiness < 30) {
      setMood('sad');
    } else if (pet.energy < 30) {
      setMood('sleepy');
    } else {
      setMood('normal');
    }
  }, [pet]);

  // Animaciones automáticas
  useEffect(() => {
    if (!isActive) return;

    const animations = ['idle', 'blink', 'look', 'wiggle'];
    let animationInterval;

    const startRandomAnimations = () => {
      animationInterval = setInterval(() => {
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        if (randomAnimation !== currentAnimation) {
          setCurrentAnimation(randomAnimation);
          setTimeout(() => {
            setCurrentAnimation('idle');
          }, 1000);
        }
      }, 3000 + Math.random() * 2000);
    };

    startRandomAnimations();

    return () => {
      if (animationInterval) clearInterval(animationInterval);
    };
  }, [isActive, currentAnimation]);

  const handleAction = async (action) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentAnimation(action);

    // Animación de reacción
    setTimeout(() => {
      setCurrentAnimation('idle');
      setIsAnimating(false);
    }, 1500);

    if (onAction) {
      await onAction(action);
    }
  };

  if (!pet) {
    return (
      <div className="animated-pet-container">
        <div className="pet-placeholder">
          <div className="pet-blob">🐾</div>
          <p>Sin mascota</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animated-pet-container">
      <div className={`animated-pet ${currentAnimation} ${mood}`}>
        {/* Cuerpo principal */}
        <div className="pet-body" style={{ backgroundColor: pet.color || '#FFD700' }}>
          {/* Cara */}
          <div className="pet-face">
            {/* Ojos */}
            <div className="pet-eyes">
              <div className={`eye left ${currentAnimation}`}></div>
              <div className={`eye right ${currentAnimation}`}></div>
            </div>
            
            {/* Boca */}
            <div className={`pet-mouth ${mood} ${currentAnimation}`}></div>
            
            {/* Nariz */}
            <div className="pet-nose"></div>
          </div>

          {/* Orejas */}
          <div className="pet-ears">
            <div className="ear left"></div>
            <div className="ear right"></div>
          </div>

          {/* Accesorios */}
          {pet.accessories && pet.accessories.includes('sombrero') && (
            <div className="pet-accessory hat">🎩</div>
          )}
          {pet.accessories && pet.accessories.includes('collar') && (
            <div className="pet-accessory collar">🦮</div>
          )}
          {pet.accessories && pet.accessories.includes('gafas') && (
            <div className="pet-accessory glasses">👓</div>
          )}
        </div>

        {/* Efectos de estado */}
        {mood === 'sick' && <div className="sick-effect">🤒</div>}
        {mood === 'dead' && <div className="dead-effect">💀</div>}
        {mood === 'happy' && <div className="happy-effect">✨</div>}
        {mood === 'sad' && <div className="sad-effect">💧</div>}
      </div>

      {/* Botones de acción */}
      <div className="pet-actions">
        <button 
          className="action-btn feed-btn"
          onClick={() => handleAction('feed')}
          disabled={isAnimating}
        >
          🍖
        </button>
        <button 
          className="action-btn clean-btn"
          onClick={() => handleAction('clean')}
          disabled={isAnimating}
        >
          🛁
        </button>
        <button 
          className="action-btn play-btn"
          onClick={() => handleAction('play')}
          disabled={isAnimating}
        >
          🎾
        </button>
        <button 
          className="action-btn sleep-btn"
          onClick={() => handleAction('sleep')}
          disabled={isAnimating}
        >
          😴
        </button>
      </div>

      {/* Información de estado */}
      <div className="pet-info">
        <h3>{pet.name || 'Mi Mascota'}</h3>
        <div className="pet-stats">
          <div className="stat">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{pet.health || 100}%</span>
          </div>
          <div className="stat">
            <span className="stat-icon">😊</span>
            <span className="stat-value">{pet.happiness || 100}%</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⚡</span>
            <span className="stat-value">{pet.energy || 50}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedPet; 