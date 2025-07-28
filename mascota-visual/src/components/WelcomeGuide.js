import React from 'react';
import './WelcomeGuide.css';

const WelcomeGuide = ({ onClose, hasHero, hasPet }) => {
  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <h2>¡Bienvenido a Mascota Hero! 🎉</h2>
        
        <div className="welcome-content">
          <div className="welcome-step">
            <h3>1. Crea tu Héroe ⚡</h3>
            <p>Ve a "Personalización de Héroe" para crear tu primer superhéroe personalizado.</p>
            {!hasHero && (
              <button 
                className="welcome-btn hero-btn"
                onClick={() => window.location.href = '/hero-customization'}
              >
                Crear Héroe
              </button>
            )}
          </div>
          
          <div className="welcome-step">
            <h3>2. Adopta tu Mascota 🐾</h3>
            <p>Ve a "Mascotas" para adoptar tu primera mascota y comenzar a cuidarla.</p>
            {!hasPet && (
              <button 
                className="welcome-btn pet-btn"
                onClick={() => window.location.href = '/pets'}
              >
                Adoptar Mascota
              </button>
            )}
          </div>
          
          <div className="welcome-step">
            <h3>3. Explora el Mundo 🌍</h3>
            <ul>
              <li>🎮 <strong>Minijuegos:</strong> Juega y gana monedas</li>
              <li>🏆 <strong>Logros:</strong> Completa objetivos y desbloquea recompensas</li>
              <li>🛒 <strong>Tienda:</strong> Compra items para tu mascota y héroe</li>
              <li>📊 <strong>Ranking:</strong> Compite con otros jugadores</li>
            </ul>
          </div>
        </div>
        
        <button className="welcome-close" onClick={onClose}>
          ¡Entendido!
        </button>
      </div>
    </div>
  );
};

export default WelcomeGuide; 