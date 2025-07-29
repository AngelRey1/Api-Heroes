import React from 'react';
import { useSoundEffects } from './SoundEffects';
import './ActionButtons.css';

function ActionButtons({ onFeed, onClean, onPlay, onSleep, loading }) {
  const { playClick, playFeed, playUse, playStat } = useSoundEffects();
  return (
    <div className="action-buttons">
      <button 
        className="action-btn feed-btn" 
        onClick={() => {
          playClick();
          playFeed();
          onFeed();
        }} 
        disabled={loading}
      >
        <span className="btn-icon">🍖</span>
        <span className="btn-label">Alimentar</span>
      </button>
      
      <button 
        className="action-btn clean-btn" 
        onClick={() => {
          playClick();
          playUse();
          onClean();
        }} 
        disabled={loading}
      >
        <span className="btn-icon">🧼</span>
        <span className="btn-label">Limpiar</span>
      </button>
      
      <button 
        className="action-btn play-btn" 
        onClick={() => {
          playClick();
          playStat();
          onPlay();
        }} 
        disabled={loading}
      >
        <span className="btn-icon">🎲</span>
        <span className="btn-label">Jugar</span>
      </button>
      
      <button 
        className="action-btn sleep-btn" 
        onClick={() => {
          playClick();
          playStat();
          onSleep();
        }} 
        disabled={loading}
      >
        <span className="btn-icon">🛌</span>
        <span className="btn-label">Dormir</span>
      </button>
    </div>
  );
}

export default ActionButtons; 