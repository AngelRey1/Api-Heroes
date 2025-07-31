import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import PetFigure from './PetFigure';
import { 
  feedPet, 
  walkPet, 
  playWithPet, 
  bathePet, 
  healPet, 
  getPetStatus 
} from '../api';
import { useSoundEffects } from './SoundEffects';
import NotificationToast from './NotificationToast';
import './PetCare.css';

const PetCare = ({ pet, onClose, onUpdate }) => {
  const { token } = useUser();
  const { playClick, playCoin, playCelebrate } = useSoundEffects();
  const [loading, setLoading] = useState(false);
  const [petStatus, setPetStatus] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  useEffect(() => {
    if (pet) {
      loadPetStatus();
    }
  }, [pet]);

  const loadPetStatus = async () => {
    try {
      const status = await getPetStatus(token, pet._id);
      setPetStatus(status);
    } catch (error) {
      console.error('Error loading pet status:', error);
    }
  };

  const handleCareAction = async (action, actionName) => {
    if (loading) return;
    
    setLoading(true);
    setNotification({ message: '', type: 'info' });
    
    try {
      let result;
      
      switch (action) {
        case 'feed':
          result = await feedPet(token, pet._id);
          break;
        case 'walk':
          result = await walkPet(token, pet._id);
          break;
        case 'play':
          result = await playWithPet(token, pet._id);
          break;
        case 'bath':
          result = await bathePet(token, pet._id);
          break;
        case 'heal':
          result = await healPet(token, pet._id);
          break;
        default:
          throw new Error('Acción no válida');
      }
      
      playCelebrate();
      setNotification({ 
        message: `¡${actionName} completado exitosamente!`, 
        type: 'success' 
      });
      
      // Recargar estado de la mascota
      await loadPetStatus();
      
      // Notificar al componente padre
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (error) {
      console.error(`Error en ${action}:`, error);
      setNotification({ 
        message: `Error al ${actionName.toLowerCase()}: ${error.response?.data?.message || error.message}`, 
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

  const getStatusColor = (value) => {
    if (value >= 80) return '#27ae60';
    if (value >= 50) return '#f39c12';
    return '#e74c3c';
  };

  if (!pet) {
    return (
      <div className="pet-care-overlay">
        <div className="pet-care-modal">
          <div className="pet-care-header">
            <h2>🐾 Cuidado de Mascotas</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="pet-care-content">
            <p>No hay mascota seleccionada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pet-care-overlay">
      <div className="pet-care-modal">
        <div className="pet-care-header">
          <h2>🐾 Cuidar a {pet.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="pet-care-content">
          {/* Vista de la mascota */}
          <div className="pet-preview">
            <PetFigure
              color={pet.color || '#f39c12'}
              type={pet.type || 'dog'}
              accessories={pet.accessories || []}
              size={150}
              animated={true}
              mood={getPetMood()}
            />
          </div>

          {/* Información de la mascota */}
          <div className="pet-info">
            <h3>{pet.name}</h3>
            <p><strong>Tipo:</strong> {pet.petType}</p>
            <p><strong>Super Poder:</strong> {pet.superPower}</p>
            <p><strong>Estado:</strong> {pet.status}</p>
          </div>

          {/* Estadísticas */}
          <div className="pet-stats">
            <h4>📊 Estadísticas</h4>
            <div className="stat-bars">
              <div className="stat-item">
                <label>❤️ Salud</label>
                <div className="stat-bar">
                  <div 
                    className="stat-fill" 
                    style={{ 
                      width: `${pet.health}%`, 
                      backgroundColor: getStatusColor(pet.health) 
                    }}
                  ></div>
                </div>
                <span>{pet.health}%</span>
              </div>
              
              <div className="stat-item">
                <label>😊 Felicidad</label>
                <div className="stat-bar">
                  <div 
                    className="stat-fill" 
                    style={{ 
                      width: `${pet.happiness}%`, 
                      backgroundColor: getStatusColor(pet.happiness) 
                    }}
                  ></div>
                </div>
                <span>{pet.happiness}%</span>
              </div>
              
              <div className="stat-item">
                <label>⚡ Energía</label>
                <div className="stat-bar">
                  <div 
                    className="stat-fill" 
                    style={{ 
                      width: `${pet.energy}%`, 
                      backgroundColor: getStatusColor(pet.energy) 
                    }}
                  ></div>
                </div>
                <span>{pet.energy}%</span>
              </div>
            </div>
          </div>

          {/* Acciones de cuidado */}
          <div className="care-actions">
            <h4>🛠️ Acciones de Cuidado</h4>
            <div className="action-grid">
              <button 
                className="care-btn feed-btn"
                onClick={() => handleCareAction('feed', 'Alimentar')}
                disabled={loading}
              >
                🍖 Alimentar
              </button>
              
              <button 
                className="care-btn walk-btn"
                onClick={() => handleCareAction('walk', 'Pasear')}
                disabled={loading}
              >
                🚶 Pasear
              </button>
              
              <button 
                className="care-btn play-btn"
                onClick={() => handleCareAction('play', 'Jugar')}
                disabled={loading}
              >
                🎾 Jugar
              </button>
              
              <button 
                className="care-btn bath-btn"
                onClick={() => handleCareAction('bath', 'Bañar')}
                disabled={loading}
              >
                🛁 Bañar
              </button>
              
              <button 
                className="care-btn heal-btn"
                onClick={() => handleCareAction('heal', 'Curar')}
                disabled={loading}
              >
                💊 Curar
              </button>
            </div>
          </div>

          {/* Historial de actividades */}
          {pet.activityHistory && pet.activityHistory.length > 0 && (
            <div className="activity-history">
              <h4>📝 Historial de Actividades</h4>
              <div className="activity-list">
                {pet.activityHistory.slice(-5).map((activity, index) => (
                  <div key={index} className="activity-item">
                    <span className="activity-icon">
                      {activity.action === 'feed' && '🍖'}
                      {activity.action === 'walk' && '🚶'}
                      {activity.action === 'play' && '🎾'}
                      {activity.action === 'bath' && '🛁'}
                      {activity.action === 'heal' && '💊'}
                    </span>
                    <span className="activity-text">{activity.action}</span>
                    <span className="activity-date">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default PetCare; 