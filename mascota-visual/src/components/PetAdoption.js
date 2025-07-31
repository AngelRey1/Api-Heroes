import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import PetFigure from './PetFigure';
import HumanoidFigure from './HumanoidFigure';
import { adoptPet } from '../api';
import { useSoundEffects } from './SoundEffects';
import NotificationToast from './NotificationToast';
import './PetAdoption.css';

const PetAdoption = ({ pet, onClose, onSuccess }) => {
  const { user, token, fetchUserData } = useUser();
  const { playClick, playCelebrate } = useSoundEffects();
  const [selectedHero, setSelectedHero] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  useEffect(() => {
    // Seleccionar el primer héroe por defecto si existe
    if (user?.heroes && user.heroes.length > 0 && !selectedHero) {
      setSelectedHero(user.heroes[0]);
    }
  }, [user?.heroes, selectedHero]);

  const handleAdopt = async () => {
    if (!selectedHero || !pet) return;
    
    setLoading(true);
    setNotification({ message: '', type: 'info' });
    
    try {
      await adoptPet(token, pet._id, selectedHero._id);
      playCelebrate();
      setNotification({ 
        message: `¡${pet.name} ha sido adoptado por ${selectedHero.name}!`, 
        type: 'success' 
      });
      
      // Recargar datos del usuario
      await fetchUserData(true);
      
      // Notificar éxito
      if (onSuccess) {
        onSuccess();
      }
      
      // Cerrar modal después de un delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error al adoptar mascota:', error);
      setNotification({ 
        message: `Error al adoptar: ${error.response?.data?.message || error.message}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getPetMood = () => {
    if (!pet) return 'normal';
    if (pet.health < 30) return 'sad';
    if (pet.happiness > 80) return 'happy';
    if (pet.energy < 30) return 'sleepy';
    return 'normal';
  };

  if (!pet) {
    return (
      <div className="pet-adoption-overlay">
        <div className="pet-adoption-modal">
          <div className="pet-adoption-header">
            <h2>🐾 Adopción de Mascotas</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="pet-adoption-content">
            <p>No hay mascota seleccionada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pet-adoption-overlay">
      <div className="pet-adoption-modal">
        <div className="pet-adoption-header">
          <h2>🐾 Adoptar a {pet.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="pet-adoption-content">
          {/* Vista de la mascota */}
          <div className="pet-preview">
            <h3>Mascota a Adoptar</h3>
            <PetFigure
              color={pet.color || '#f39c12'}
              type={pet.type || 'dog'}
              accessories={pet.accessories || []}
              size={120}
              animated={true}
              mood={getPetMood()}
            />
            <div className="pet-details">
              <p><strong>Nombre:</strong> {pet.name}</p>
              <p><strong>Tipo:</strong> {pet.petType}</p>
              <p><strong>Super Poder:</strong> {pet.superPower}</p>
              <p><strong>Estado:</strong> {pet.status}</p>
            </div>
          </div>

          {/* Selección de héroe */}
          <div className="hero-selection">
            <h3>🦸 Selecciona un Héroe</h3>
            {user?.heroes && user.heroes.length > 0 ? (
              <div className="heroes-grid">
                {user.heroes.map((hero) => (
                  <button
                    key={hero._id}
                    className={`hero-option ${selectedHero?._id === hero._id ? 'selected' : ''}`}
                    onClick={() => setSelectedHero(hero)}
                  >
                    <div className="hero-preview">
                      <HumanoidFigure
                        color={hero.color || '#3498db'}
                        accessories={hero.accessories || []}
                        size={80}
                        animated={true}
                      />
                    </div>
                    <div className="hero-info">
                      <h4>{hero.name}</h4>
                      <p><strong>Alias:</strong> {hero.alias}</p>
                      <p><strong>Ciudad:</strong> {hero.city}</p>
                      <p><strong>Mascotas:</strong> {hero.pets?.length || 0}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="no-heroes">
                <p>❌ No tienes héroes creados</p>
                <p>Debes crear un héroe antes de adoptar una mascota</p>
              </div>
            )}
          </div>

          {/* Información de adopción */}
          {selectedHero && (
            <div className="adoption-info">
              <h3>📋 Información de Adopción</h3>
              <div className="adoption-details">
                <p><strong>Mascota:</strong> {pet.name}</p>
                <p><strong>Adoptada por:</strong> {selectedHero.name} ({selectedHero.alias})</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Estado:</strong> Pendiente de adopción</p>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="adoption-actions">
            <button 
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              className="btn-adopt"
              onClick={handleAdopt}
              disabled={!selectedHero || loading}
            >
              {loading ? 'Adoptando...' : 'Confirmar Adopción'}
            </button>
          </div>
        </div>

        {notification.message && (
          <NotificationToast 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification({ message: '', type: 'info' })}
          />
        )}
      </div>
    </div>
  );
};

export default PetAdoption; 