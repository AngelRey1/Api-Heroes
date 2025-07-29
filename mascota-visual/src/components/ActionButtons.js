import React from 'react';
import { useSoundEffects } from './SoundEffects';
import './ActionButtons.css';

function ActionButtons({ onFeed, onClean, onPlay, onSleep, loading, mascota }) {
  const { playClick, playFeed, playUse, playStat } = useSoundEffects();
  const [cooldowns, setCooldowns] = React.useState({
    feed: 0,
    clean: 0,
    play: 0,
    sleep: 0
  });

  // Función para manejar cooldowns
  const handleAction = (actionType, actionFunction) => {
    if (cooldowns[actionType] > 0) {
      return; // En cooldown
    }

    // Ejecutar acción
    if (actionType === 'feed') {
      playClick();
      playFeed();
      onFeed();
    } else if (actionType === 'clean') {
      playClick();
      playUse();
      onClean();
    } else if (actionType === 'play') {
      playClick();
      playStat();
      onPlay();
    } else if (actionType === 'sleep') {
      playClick();
      playStat();
      onSleep();
    }

    // Establecer cooldown (30 segundos)
    setCooldowns(prev => ({
      ...prev,
      [actionType]: 30
    }));

    // Reducir cooldown cada segundo
    const interval = setInterval(() => {
      setCooldowns(prev => {
        if (prev[actionType] <= 1) {
          clearInterval(interval);
          return { ...prev, [actionType]: 0 };
        }
        return { ...prev, [actionType]: prev[actionType] - 1 };
      });
    }, 1000);
  };

  // Determinar si las acciones están disponibles según el estado de la mascota
  const canFeed = mascota && (mascota.hunger ?? 100) < 80;
  const canClean = mascota && (mascota.cleanliness ?? 100) < 80;
  const canPlay = mascota && (mascota.energy ?? 100) > 30;
  const canSleep = mascota && (mascota.energy ?? 100) < 50;

  return (
    <div className="action-buttons">
      <button 
        className={`action-btn feed-btn ${!canFeed ? 'disabled' : ''} ${cooldowns.feed > 0 ? 'cooldown' : ''}`}
        onClick={() => handleAction('feed', onFeed)} 
        disabled={loading || cooldowns.feed > 0 || !canFeed}
        title={cooldowns.feed > 0 ? `Cooldown: ${cooldowns.feed}s` : 'Alimentar mascota'}
      >
        <span className="btn-icon">🍖</span>
        <span className="btn-label">Alimentar</span>
        {cooldowns.feed > 0 && <span className="cooldown-text">{cooldowns.feed}s</span>}
      </button>
      
      <button 
        className={`action-btn clean-btn ${!canClean ? 'disabled' : ''} ${cooldowns.clean > 0 ? 'cooldown' : ''}`}
        onClick={() => handleAction('clean', onClean)} 
        disabled={loading || cooldowns.clean > 0 || !canClean}
        title={cooldowns.clean > 0 ? `Cooldown: ${cooldowns.clean}s` : 'Limpiar mascota'}
      >
        <span className="btn-icon">🧼</span>
        <span className="btn-label">Limpiar</span>
        {cooldowns.clean > 0 && <span className="cooldown-text">{cooldowns.clean}s</span>}
      </button>
      
      <button 
        className={`action-btn play-btn ${!canPlay ? 'disabled' : ''} ${cooldowns.play > 0 ? 'cooldown' : ''}`}
        onClick={() => handleAction('play', onPlay)} 
        disabled={loading || cooldowns.play > 0 || !canPlay}
        title={cooldowns.play > 0 ? `Cooldown: ${cooldowns.play}s` : 'Jugar con mascota'}
      >
        <span className="btn-icon">🎲</span>
        <span className="btn-label">Jugar</span>
        {cooldowns.play > 0 && <span className="cooldown-text">{cooldowns.play}s</span>}
      </button>
      
      <button 
        className={`action-btn sleep-btn ${!canSleep ? 'disabled' : ''} ${cooldowns.sleep > 0 ? 'cooldown' : ''}`}
        onClick={() => handleAction('sleep', onSleep)} 
        disabled={loading || cooldowns.sleep > 0 || !canSleep}
        title={cooldowns.sleep > 0 ? `Cooldown: ${cooldowns.sleep}s` : 'Dormir mascota'}
      >
        <span className="btn-icon">🛌</span>
        <span className="btn-label">Dormir</span>
        {cooldowns.sleep > 0 && <span className="cooldown-text">{cooldowns.sleep}s</span>}
      </button>
    </div>
  );
}

export default ActionButtons; 