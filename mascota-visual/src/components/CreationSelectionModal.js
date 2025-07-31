import React from 'react';
import './CreationSelectionModal.css';

const CreationSelectionModal = ({ isOpen, onClose, onSelectType }) => {
  if (!isOpen) return null;

  const handleSelect = (type) => {
    onSelectType(type);
    onClose();
  };

  return (
    <div className="selection-modal-overlay" onClick={onClose}>
      <div className="selection-modal-content" onClick={e => e.stopPropagation()}>
        <div className="selection-modal-header">
          <h2>¿Qué quieres crear?</h2>
          <button className="selection-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="selection-options">
          <div 
            className="selection-option pet-option"
            onClick={() => handleSelect('pet')}
          >
            <div className="option-icon">🐾</div>
            <h3>Mascota</h3>
            <p>Crea tu compañero perfecto</p>
            <div className="option-features">
              <span>❤️ Personalizable</span>
              <span>🎮 Interactivo</span>
              <span>🏆 Evoluciona</span>
            </div>
          </div>

          <div 
            className="selection-option hero-option"
            onClick={() => handleSelect('hero')}
          >
            <div className="option-icon">🦸‍♂️</div>
            <h3>Héroe</h3>
            <p>Construye tu legendario</p>
            <div className="option-features">
              <span>⚔️ Poderoso</span>
              <span>🛡️ Protector</span>
              <span>🌟 Único</span>
            </div>
          </div>
        </div>

        <div className="selection-footer">
          <p>Elige sabiamente, ¡tu creación será única!</p>
        </div>
      </div>
    </div>
  );
};

export default CreationSelectionModal; 