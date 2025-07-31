import React, { useState } from 'react';
import CreationModal from './CreationModal';
import CreationSelectionModal from './CreationSelectionModal';
import './WelcomeGuide.css';

const WelcomeGuide = ({ onClose, hasHero, hasPet }) => {
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [creationType, setCreationType] = useState('pet');

  const handleCreateHero = () => {
    setCreationType('hero');
    setShowCreationModal(true);
  };

  const handleCreatePet = () => {
    setCreationType('pet');
    setShowCreationModal(true);
  };

  const handleCloseSelectionModal = () => {
    setShowSelectionModal(false);
  };

  const handleSelectType = (type) => {
    setCreationType(type);
    setShowCreationModal(true);
  };

  const handleCloseCreationModal = () => {
    setShowCreationModal(false);
    onClose(); // Cerrar también el WelcomeGuide
  };

  return (
    <>
      <div className="welcome-overlay">
        <div className="welcome-modal">
          <h2>¡Bienvenido! 🎉</h2>
          
          <div className="welcome-content">
            <div className="welcome-step">
              <h3>⚡ Crea tu Héroe</h3>
              {!hasHero ? (
                <button 
                  className="welcome-btn hero-btn"
                  onClick={handleCreateHero}
                >
                  Crear Héroe
                </button>
              ) : (
                <p className="welcome-completed">✅ Héroe creado</p>
              )}
            </div>
            
            <div className="welcome-step">
              <h3>🐾 Adopta tu Mascota</h3>
              {!hasPet ? (
                <button 
                  className="welcome-btn pet-btn"
                  onClick={handleCreatePet}
                >
                  Adoptar Mascota
                </button>
              ) : (
                <p className="welcome-completed">✅ Mascota adoptada</p>
              )}
            </div>
          </div>
          
          <button className="welcome-close" onClick={onClose}>
            Continuar
          </button>
        </div>
      </div>

      {/* Modal de selección */}
      <CreationSelectionModal 
        isOpen={showSelectionModal}
        onClose={handleCloseSelectionModal}
        onSelectType={handleSelectType}
      />

      {/* Modal de creación */}
      <CreationModal 
        isOpen={showCreationModal}
        onClose={handleCloseCreationModal}
        type={creationType}
      />
    </>
  );
};

export default WelcomeGuide; 