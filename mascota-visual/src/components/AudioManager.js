import React, { useState, useEffect, useRef } from 'react';
import { useSoundEffects } from './SoundEffects';
import './AudioManager.css';

const AudioManager = () => {
  const { playClick, playCoin, playCelebrate } = useSoundEffects();
  const [isOpen, setIsOpen] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(() => {
    return localStorage.getItem('musicEnabled') !== 'false';
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('soundEnabled') !== 'false';
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    return parseFloat(localStorage.getItem('musicVolume')) || 0.5;
  });
  const [soundVolume, setSoundVolume] = useState(() => {
    return parseFloat(localStorage.getItem('soundVolume')) || 0.7;
  });
  const [currentTrack, setCurrentTrack] = useState('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  const audioRef = useRef(null);
  const musicRef = useRef(null);

  const musicTracks = {
    home: {
      name: '🏠 Música de Casa',
      url: '/assets/music/home-theme.wav',
      description: 'Música relajante para el hogar'
    },
    shop: {
      name: '🛍️ Música de Tienda',
      url: '/assets/music/shop-theme.wav',
      description: 'Música alegre para compras'
    },
    minigames: {
      name: '🎮 Música de Juegos',
      url: '/assets/music/game-theme.wav',
      description: 'Música energética para minijuegos'
    },
    achievements: {
      name: '🏆 Música de Logros',
      url: '/assets/music/achievement-theme.wav',
      description: 'Música épica para logros'
    },
    friends: {
      name: '👥 Música Social',
      url: '/assets/music/social-theme.wav',
      description: 'Música amigable para socializar'
    }
  };

  const soundEffects = [
    { id: 'click', name: 'Click', icon: '🖱️', description: 'Sonido de clics' },
    { id: 'coin', name: 'Monedas', icon: '💰', description: 'Sonido de monedas' },
    { id: 'celebrate', name: 'Celebración', icon: '🎉', description: 'Sonido de celebración' },
    { id: 'feed', name: 'Alimentar', icon: '🍽️', description: 'Sonido de alimentar mascota' },
    { id: 'clean', name: 'Limpiar', icon: '🧽', description: 'Sonido de limpiar mascota' },
    { id: 'play', name: 'Jugar', icon: '🎾', description: 'Sonido de jugar con mascota' },
    { id: 'sleep', name: 'Dormir', icon: '😴', description: 'Sonido de dormir' },
    { id: 'levelup', name: 'Subir Nivel', icon: '⭐', description: 'Sonido de subir nivel' },
    { id: 'achievement', name: 'Logro', icon: '🏆', description: 'Sonido de logro desbloqueado' },
    { id: 'notification', name: 'Notificación', icon: '🔔', description: 'Sonido de notificación' },
    { id: 'error', name: 'Error', icon: '❌', description: 'Sonido de error' },
    { id: 'success', name: 'Éxito', icon: '✅', description: 'Sonido de éxito' }
  ];

  useEffect(() => {
    // Guardar configuraciones en localStorage
    localStorage.setItem('musicEnabled', musicEnabled);
    localStorage.setItem('soundEnabled', soundEnabled);
    localStorage.setItem('musicVolume', musicVolume);
    localStorage.setItem('soundVolume', soundVolume);
  }, [musicEnabled, soundEnabled, musicVolume, soundVolume]);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = musicVolume;
      if (musicEnabled && isPlaying) {
        musicRef.current.play().catch(error => {
          console.warn('Could not play music:', error);
          setIsPlaying(false);
          setNotification({ message: 'Archivo de música no disponible', type: 'warning' });
        });
      } else {
        musicRef.current.pause();
      }
    }
  }, [musicVolume, musicEnabled, isPlaying]);

  const handleMusicToggle = () => {
    playClick();
    setMusicEnabled(!musicEnabled);
    if (!musicEnabled) {
      setIsPlaying(true);
      setNotification({ 
        message: 'Música activada', 
        type: 'success' 
      });
    } else {
      setIsPlaying(false);
      setNotification({ 
        message: 'Música desactivada', 
        type: 'info' 
      });
    }
  };

  const handleSoundToggle = () => {
    playClick();
    setSoundEnabled(!soundEnabled);
    setNotification({ 
      message: soundEnabled ? 'Sonidos desactivados' : 'Sonidos activados', 
      type: 'info' 
    });
  };

  const handleVolumeChange = (type, value) => {
    playClick();
    if (type === 'music') {
      setMusicVolume(value);
      setNotification({ 
        message: `Volumen de música: ${Math.round(value * 100)}%`, 
        type: 'info' 
      });
    } else {
      setSoundVolume(value);
      setNotification({ 
        message: `Volumen de sonidos: ${Math.round(value * 100)}%`, 
        type: 'info' 
      });
    }
  };

  const changeTrack = (trackId) => {
    playClick();
    setCurrentTrack(trackId);
    setIsPlaying(true);
    setNotification({ 
      message: `Reproduciendo: ${musicTracks[trackId].name}`, 
      type: 'success' 
    });
  };

  const testSound = (soundId) => {
    if (soundEnabled) {
      playClick();
      setNotification({ 
        message: `Probando: ${soundEffects.find(s => s.id === soundId)?.name}`, 
        type: 'info' 
      });
    }
  };

  const testMusic = () => {
    if (musicEnabled) {
      playClick();
      setIsPlaying(true);
      setNotification({ 
        message: 'Probando música de fondo', 
        type: 'success' 
      });
    }
  };

  return (
    <>
      {/* Botón flotante para abrir el panel */}
      <button
        className="audio-manager-btn"
        onClick={() => {
          setIsOpen(!isOpen);
          playClick();
        }}
        title="Configuración de Audio"
      >
        🎵
      </button>

      {/* Panel de configuración de audio */}
      {isOpen && (
        <div className="audio-manager-overlay">
          <div className="audio-manager-panel">
            <div className="audio-header">
              <h3>🎵 Configuración de Audio</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setIsOpen(false);
                  playClick();
                }}
              >
                ✕
              </button>
            </div>

            {/* Configuración de música */}
            <div className="audio-section">
              <h4>🎼 Música de Fondo</h4>
              
              <div className="music-controls">
                <button
                  className={`music-toggle ${musicEnabled ? 'active' : ''}`}
                  onClick={handleMusicToggle}
                >
                  {musicEnabled ? '🔊' : '🔇'} Música
                </button>
                
                <button
                  className="test-music-btn"
                  onClick={testMusic}
                  disabled={!musicEnabled}
                >
                  🎵 Probar
                </button>
              </div>

              <div className="volume-control">
                <label>Volumen de música:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={musicVolume}
                  onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
                  className="volume-slider"
                />
                <span className="volume-value">{Math.round(musicVolume * 100)}%</span>
              </div>

              <div className="track-selector">
                <label>Pista actual:</label>
                <div className="track-buttons">
                  {Object.entries(musicTracks).map(([id, track]) => (
                    <button
                      key={id}
                      className={`track-btn ${currentTrack === id ? 'active' : ''}`}
                      onClick={() => changeTrack(id)}
                      disabled={!musicEnabled}
                    >
                      {track.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Configuración de sonidos */}
            <div className="audio-section">
              <h4>🔊 Efectos de Sonido</h4>
              
              <div className="sound-controls">
                <button
                  className={`sound-toggle ${soundEnabled ? 'active' : ''}`}
                  onClick={handleSoundToggle}
                >
                  {soundEnabled ? '🔊' : '🔇'} Sonidos
                </button>
              </div>

              <div className="volume-control">
                <label>Volumen de sonidos:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={soundVolume}
                  onChange={(e) => handleVolumeChange('sound', parseFloat(e.target.value))}
                  className="volume-slider"
                />
                <span className="volume-value">{Math.round(soundVolume * 100)}%</span>
              </div>

              <div className="sound-effects">
                <label>Efectos disponibles:</label>
                <div className="effects-grid">
                  {soundEffects.map(sound => (
                    <button
                      key={sound.id}
                      className="effect-btn"
                      onClick={() => testSound(sound.id)}
                      disabled={!soundEnabled}
                      title={sound.description}
                    >
                      <span className="effect-icon">{sound.icon}</span>
                      <span className="effect-name">{sound.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="audio-info">
              <h4>ℹ️ Información</h4>
              <ul className="info-list">
                <li>La música cambia automáticamente según la sección</li>
                <li>Los sonidos se reproducen en acciones específicas</li>
                <li>Las configuraciones se guardan automáticamente</li>
                <li>Puedes probar los sonidos antes de usarlos</li>
              </ul>
            </div>

            {/* Notificación */}
            {notification.message && (
              <div className={`audio-toast ${notification.type}`}>
                <span className="toast-icon">
                  {notification.type === 'success' && '✅'}
                  {notification.type === 'error' && '❌'}
                  {notification.type === 'info' && 'ℹ️'}
                </span>
                <span className="toast-message">{notification.message}</span>
                <button
                  className="toast-close"
                  onClick={() => setNotification({ message: '', type: 'info' })}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Elementos de audio */}
      <audio ref={musicRef} loop>
        <source src={musicTracks[currentTrack]?.url} type="audio/mpeg" />
      </audio>
    </>
  );
};

export default AudioManager; 