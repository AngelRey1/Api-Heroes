import React, { useState, useEffect } from 'react';
import { useSoundEffects } from './SoundEffects';
import './NotificationToast.css';

const NotificationToast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { playClick, playCoin, playCelebrate } = useSoundEffects();

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      
      // Reproducir sonido según el tipo
      if (type === 'success') {
        playCelebrate();
      } else if (type === 'coin') {
        playCoin();
      } else {
        playClick();
      }

      // Auto-cerrar después del tiempo especificado
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300); // Esperar a que termine la animación
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, type, duration, onClose, playClick, playCoin, playCelebrate]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'coin': return '💰';
      case 'feed': return '🍖';
      case 'clean': return '🧼';
      case 'play': return '🎲';
      case 'sleep': return '🛌';
      default: return 'ℹ️';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#90EE90';
      case 'error': return '#FF6B6B';
      case 'warning': return '#FFD700';
      case 'coin': return '#FFD700';
      case 'feed': return '#FFB6C1';
      case 'clean': return '#87CEEB';
      case 'play': return '#DDA0DD';
      case 'sleep': return '#98FB98';
      default: return '#FFB6C1';
    }
  };

  return (
    <div className={`notification-toast ${isVisible ? 'visible' : ''}`}>
      <div 
        className="notification-content"
        style={{ backgroundColor: getBackgroundColor() }}
      >
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{message}</span>
        <button 
          className="notification-close"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificationToast; 