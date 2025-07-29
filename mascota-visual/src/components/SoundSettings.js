import React, { useState } from 'react';
import { useSoundEffects } from './SoundEffects';
import './SoundSettings.css';

const SoundSettings = ({ isOpen, onClose }) => {
  const { setVolume, toggle, enabled } = useSoundEffects();
  const [volume, setLocalVolume] = useState(50);

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setLocalVolume(newVolume);
    setVolume(newVolume / 100);
  };

  const handleToggle = () => {
    toggle();
  };

  if (!isOpen) return null;

  return (
    <div className="sound-settings-overlay">
      <div className="sound-settings-modal">
        <div className="modal-header">
          <h2>🔊 Configuración de Sonido</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <div className="setting-item">
            <label className="setting-label">
              <span className="setting-icon">🔊</span>
              Sonido
            </label>
            <button 
              className={`toggle-btn ${enabled ? 'enabled' : 'disabled'}`}
              onClick={handleToggle}
            >
              {enabled ? 'ON' : 'OFF'}
            </button>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <span className="setting-icon">🔉</span>
              Volumen
            </label>
            <div className="volume-control">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                disabled={!enabled}
              />
              <span className="volume-value">{volume}%</span>
            </div>
          </div>
          
          <div className="sound-preview">
            <h3>🎵 Vista Previa</h3>
            <div className="preview-buttons">
              <button 
                className="preview-btn"
                onClick={() => {
                  if (enabled) {
                    const { playClick, playCoin, playFeed } = useSoundEffects();
                    playClick();
                  }
                }}
                disabled={!enabled}
              >
                🔊 Click
              </button>
              <button 
                className="preview-btn"
                onClick={() => {
                  if (enabled) {
                    const { playCoin } = useSoundEffects();
                    playCoin();
                  }
                }}
                disabled={!enabled}
              >
                💰 Moneda
              </button>
              <button 
                className="preview-btn"
                onClick={() => {
                  if (enabled) {
                    const { playFeed } = useSoundEffects();
                    playFeed();
                  }
                }}
                disabled={!enabled}
              >
                🍖 Alimentar
              </button>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="save-btn" onClick={onClose}>
            ✅ Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoundSettings; 