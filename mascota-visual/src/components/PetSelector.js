import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import PetFigure from './PetFigure';
import './PetSelector.css';

const PetSelector = ({ onPetSelect = null }) => {
  const { mascotas, activePet, setActivePetById } = useUser();
  const [showSelector, setShowSelector] = useState(false);

  const getPetMood = (pet) => {
    if (!pet) return 'normal';
    if (pet.health < 30) return 'sad';
    if (pet.happiness > 80) return 'happy';
    if (pet.energy < 30) return 'sleepy';
    return 'normal';
  };

  const handlePetSelect = (pet) => {
    setActivePetById(pet._id);
    if (onPetSelect) {
      onPetSelect(pet);
    }
    setShowSelector(false);
  };

  if (!mascotas || mascotas.length === 0) {
    return (
      <div className="pet-selector no-pets">
        <span className="pet-icon">🐾</span>
        <p>No tienes mascotas</p>
      </div>
    );
  }

  return (
    <div className="pet-selector">
      {/* Mascota activa actual */}
      <div className="active-pet-display" onClick={() => setShowSelector(!showSelector)}>
        {activePet ? (
          <>
            <div className="pet-figure">
              <PetFigure
                color={activePet.color || '#f39c12'}
                type={activePet.type || 'dog'}
                accessories={activePet.accessories || []}
                size={60}
                animated={true}
                mood={getPetMood(activePet)}
              />
            </div>
            <div className="pet-info">
              <h4>{activePet.name}</h4>
              <span className="pet-type">{activePet.petType}</span>
            </div>
            <div className="selector-arrow">▼</div>
          </>
        ) : (
          <>
            <div className="pet-figure">
              <span className="pet-placeholder">🐾</span>
            </div>
            <div className="pet-info">
              <h4>Seleccionar Mascota</h4>
            </div>
            <div className="selector-arrow">▼</div>
          </>
        )}
      </div>

      {/* Selector desplegable */}
      {showSelector && (
        <div className="pet-dropdown">
          {mascotas.map((pet) => (
            <div
              key={pet._id}
              className={`pet-option ${activePet?._id === pet._id ? 'active' : ''}`}
              onClick={() => handlePetSelect(pet)}
            >
              <div className="pet-figure">
                <PetFigure
                  color={pet.color || '#f39c12'}
                  type={pet.type || 'dog'}
                  accessories={pet.accessories || []}
                  size={50}
                  animated={false}
                  mood={getPetMood(pet)}
                />
              </div>
              <div className="pet-info">
                <h5>{pet.name}</h5>
                <span className="pet-type">{pet.petType}</span>
                <div className="pet-stats-mini">
                  <span className="stat">❤️ {pet.health || 100}%</span>
                  <span className="stat">😊 {pet.happiness || 100}%</span>
                </div>
              </div>
              {activePet?._id === pet._id && (
                <div className="active-indicator">✓</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetSelector; 