import React, { useState, useEffect } from 'react';
import { updateUserBackground } from '../api';
import './Customization.css';

export default function Customization({ token, user, onUpdate }) {
  const [settings, setSettings] = useState({
    theme: 'light',
    backgroundColor: '#667eea',
    textColor: '#ffffff',
    animations: true,
    particles: true,
    sounds: true,
    music: true,
    musicVolume: 50,
    soundVolume: 70,
    uiScale: 100,
    language: 'es'
  });
  const [activeTab, setActiveTab] = useState('theme');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('gameSettings', JSON.stringify(updatedSettings));
    applySettings(updatedSettings);
  };

  const applySettings = (settings) => {
    // Aplicar tema
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Aplicar colores personalizados
    document.documentElement.style.setProperty('--custom-bg', settings.backgroundColor);
    document.documentElement.style.setProperty('--custom-text', settings.textColor);
    
    // Aplicar escala de UI
    document.documentElement.style.setProperty('--ui-scale', `${settings.uiScale}%`);
    
    // Aplicar animaciones
    if (settings.animations) {
      document.body.classList.add('animations-enabled');
    } else {
      document.body.classList.remove('animations-enabled');
    }
    
    // Aplicar partículas
    if (settings.particles) {
      document.body.classList.add('particles-enabled');
    } else {
      document.body.classList.remove('particles-enabled');
    }
    
    // Aplicar sonidos
    if (settings.sounds) {
      document.body.classList.add('sounds-enabled');
    } else {
      document.body.classList.remove('sounds-enabled');
    }
  };

  const handleThemeChange = (theme) => {
    saveSettings({ theme });
  };

  const handleColorChange = (type, color) => {
    saveSettings({ [type]: color });
  };

  const handleToggle = (setting) => {
    saveSettings({ [setting]: !settings[setting] });
  };

  const handleVolumeChange = (type, value) => {
    saveSettings({ [type]: parseInt(value) });
  };

  const handleScaleChange = (value) => {
    saveSettings({ uiScale: parseInt(value) });
  };

  const handleLanguageChange = (language) => {
    saveSettings({ language });
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      theme: 'light',
      backgroundColor: '#667eea',
      textColor: '#ffffff',
      animations: true,
      particles: true,
      sounds: true,
      music: true,
      musicVolume: 50,
      soundVolume: 70,
      uiScale: 100,
      language: 'es'
    };
    setSettings(defaultSettings);
    localStorage.setItem('gameSettings', JSON.stringify(defaultSettings));
    applySettings(defaultSettings);
  };

  const themes = [
    { id: 'light', name: 'Claro', icon: '☀️', colors: { bg: '#ffffff', text: '#333333' } },
    { id: 'dark', name: 'Oscuro', icon: '🌙', colors: { bg: '#1a1a1a', text: '#ffffff' } },
    { id: 'blue', name: 'Azul', icon: '🌊', colors: { bg: '#1e3a8a', text: '#ffffff' } },
    { id: 'green', name: 'Verde', icon: '🌿', colors: { bg: '#065f46', text: '#ffffff' } },
    { id: 'purple', name: 'Púrpura', icon: '🔮', colors: { bg: '#581c87', text: '#ffffff' } },
    { id: 'pink', name: 'Rosa', icon: '🌸', colors: { bg: '#be185d', text: '#ffffff' } },
    { id: 'orange', name: 'Naranja', icon: '🍊', colors: { bg: '#ea580c', text: '#ffffff' } },
    { id: 'custom', name: 'Personalizado', icon: '🎨', colors: { bg: settings.backgroundColor, text: settings.textColor } }
  ];

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  return (
    <div className="customization-container">
      <div className="customization-header">
        <h1>🎨 Personalización</h1>
        <p>Personaliza tu experiencia de juego</p>
      </div>

      <div className="customization-content">
        <div className="customization-sidebar">
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'theme' ? 'active' : ''}`}
              onClick={() => setActiveTab('theme')}
            >
              🎨 Tema
            </button>
            <button 
              className={`tab-button ${activeTab === 'colors' ? 'active' : ''}`}
              onClick={() => setActiveTab('colors')}
            >
              🌈 Colores
            </button>
            <button 
              className={`tab-button ${activeTab === 'effects' ? 'active' : ''}`}
              onClick={() => setActiveTab('effects')}
            >
              ✨ Efectos
            </button>
            <button 
              className={`tab-button ${activeTab === 'audio' ? 'active' : ''}`}
              onClick={() => setActiveTab('audio')}
            >
              🔊 Audio
            </button>
            <button 
              className={`tab-button ${activeTab === 'interface' ? 'active' : ''}`}
              onClick={() => setActiveTab('interface')}
            >
              🖥️ Interfaz
            </button>
            <button 
              className={`tab-button ${activeTab === 'language' ? 'active' : ''}`}
              onClick={() => setActiveTab('language')}
            >
              🌍 Idioma
            </button>
          </div>

          <div className="preview-toggle">
            <button 
              className={`preview-button ${previewMode ? 'active' : ''}`}
              onClick={() => setPreviewMode(!previewMode)}
            >
              👁️ {previewMode ? 'Ocultar' : 'Mostrar'} Vista Previa
            </button>
          </div>

          <div className="reset-section">
            <button className="reset-button" onClick={resetToDefaults}>
              🔄 Restablecer Valores
            </button>
          </div>
        </div>

        <div className="customization-main">
          {activeTab === 'theme' && (
            <div className="theme-section">
              <h2>🎨 Temas Predefinidos</h2>
              <div className="themes-grid">
                {themes.map(theme => (
                  <div 
                    key={theme.id}
                    className={`theme-card ${settings.theme === theme.id ? 'selected' : ''}`}
                    onClick={() => handleThemeChange(theme.id)}
                    style={{
                      backgroundColor: theme.colors.bg,
                      color: theme.colors.text
                    }}
                  >
                    <div className="theme-icon">{theme.icon}</div>
                    <div className="theme-name">{theme.name}</div>
                    {settings.theme === theme.id && (
                      <div className="theme-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="colors-section">
              <h2>🌈 Colores Personalizados</h2>
              <div className="color-pickers">
                <div className="color-picker">
                  <label>Color de Fondo</label>
                  <input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  />
                  <span className="color-value">{settings.backgroundColor}</span>
                </div>
                <div className="color-picker">
                  <label>Color de Texto</label>
                  <input
                    type="color"
                    value={settings.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                  />
                  <span className="color-value">{settings.textColor}</span>
                </div>
              </div>
              
              <div className="color-presets">
                <h3>Paletas Predefinidas</h3>
                <div className="presets-grid">
                  {[
                    { name: 'Oceánico', colors: ['#1e3a8a', '#ffffff'] },
                    { name: 'Bosque', colors: ['#065f46', '#ffffff'] },
                    { name: 'Atardecer', colors: ['#be185d', '#ffffff'] },
                    { name: 'Aurora', colors: ['#581c87', '#ffffff'] },
                    { name: 'Desierto', colors: ['#ea580c', '#ffffff'] },
                    { name: 'Noche', colors: ['#1a1a1a', '#ffffff'] }
                  ].map((preset, index) => (
                    <div 
                      key={index}
                      className="preset-card"
                      onClick={() => {
                        handleColorChange('backgroundColor', preset.colors[0]);
                        handleColorChange('textColor', preset.colors[1]);
                      }}
                    >
                      <div className="preset-colors">
                        <div 
                          className="preset-bg" 
                          style={{ backgroundColor: preset.colors[0] }}
                        ></div>
                        <div 
                          className="preset-text" 
                          style={{ backgroundColor: preset.colors[1] }}
                        ></div>
                      </div>
                      <span className="preset-name">{preset.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="effects-section">
              <h2>✨ Efectos Visuales</h2>
              <div className="effects-grid">
                <div className="effect-item">
                  <div className="effect-info">
                    <span className="effect-icon">🎭</span>
                    <div>
                      <span className="effect-name">Animaciones</span>
                      <span className="effect-desc">Efectos de animación en la interfaz</span>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.animations}
                      onChange={() => handleToggle('animations')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="effect-item">
                  <div className="effect-info">
                    <span className="effect-icon">✨</span>
                    <div>
                      <span className="effect-name">Partículas</span>
                      <span className="effect-desc">Efectos de partículas en el fondo</span>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.particles}
                      onChange={() => handleToggle('particles')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="effect-item">
                  <div className="effect-info">
                    <span className="effect-icon">🌟</span>
                    <div>
                      <span className="effect-name">Efectos de Hover</span>
                      <span className="effect-desc">Efectos al pasar el mouse</span>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.animations}
                      onChange={() => handleToggle('animations')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="audio-section">
              <h2> 🔊 Configuración de Audio</h2>
              <div className="audio-settings">
                <div className="audio-item">
                  <div className="audio-info">
                    <span className="audio-icon">🔊</span>
                    <div>
                      <span className="audio-name">Efectos de Sonido</span>
                      <span className="audio-desc">Sonidos de botones y acciones</span>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.sounds}
                      onChange={() => handleToggle('sounds')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="audio-item">
                  <div className="audio-info">
                    <span className="audio-icon">🎵</span>
                    <div>
                      <span className="audio-name">Música de Fondo</span>
                      <span className="audio-desc">Música ambiental del juego</span>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.music}
                      onChange={() => handleToggle('music')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="volume-controls">
                  <div className="volume-item">
                    <label>Volumen de Música</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.musicVolume}
                      onChange={(e) => handleVolumeChange('musicVolume', e.target.value)}
                      disabled={!settings.music}
                    />
                    <span className="volume-value">{settings.musicVolume}%</span>
                  </div>

                  <div className="volume-item">
                    <label>Volumen de Efectos</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.soundVolume}
                      onChange={(e) => handleVolumeChange('soundVolume', e.target.value)}
                      disabled={!settings.sounds}
                    />
                    <span className="volume-value">{settings.soundVolume}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interface' && (
            <div className="interface-section">
              <h2>🖥️ Configuración de Interfaz</h2>
              <div className="interface-settings">
                <div className="scale-control">
                  <label>Tamaño de Interfaz</label>
                  <input
                    type="range"
                    min="80"
                    max="120"
                    value={settings.uiScale}
                    onChange={(e) => handleScaleChange(e.target.value)}
                  />
                  <span className="scale-value">{settings.uiScale}%</span>
                </div>

                <div className="interface-preview">
                  <h3>Vista Previa</h3>
                  <div className="preview-window" style={{ transform: `scale(${settings.uiScale / 100})` }}>
                    <div className="preview-header">Ejemplo de Interfaz</div>
                    <div className="preview-content">
                      <button className="preview-button">Botón de Ejemplo</button>
                      <div className="preview-text">Texto de ejemplo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="language-section">
              <h2>🌍 Configuración de Idioma</h2>
              <div className="languages-grid">
                {languages.map(lang => (
                  <div 
                    key={lang.code}
                    className={`language-card ${settings.language === lang.code ? 'selected' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <div className="language-flag">{lang.flag}</div>
                    <div className="language-name">{lang.name}</div>
                    {settings.language === lang.code && (
                      <div className="language-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {previewMode && (
        <div className="preview-overlay">
          <div className="preview-container" style={{
            backgroundColor: settings.backgroundColor,
            color: settings.textColor
          }}>
            <div className="preview-header">
              <h2>Vista Previa</h2>
              <p>Así se verá tu juego con la configuración actual</p>
            </div>
            <div className="preview-content">
              <div className="preview-card">
                <h3>Ejemplo de Tarjeta</h3>
                <p>Este es un ejemplo de cómo se verán las tarjetas con tu configuración.</p>
                <button className="preview-btn">Botón de Ejemplo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 