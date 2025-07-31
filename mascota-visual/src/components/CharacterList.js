import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import HumanoidFigure from './HumanoidFigure';
import PetFigure from './PetFigure';
import { deleteHero, deletePet } from '../api';
import './CharacterList.css';

const CharacterList = ({ onClose, onCharacterSelect }) => {
  const { heroes, mascotas, fetchUserData, token } = useUser();
  const [activeTab, setActiveTab] = useState('heroes');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (type, id) => {
    try {
      setLoading(true);
      
      if (type === 'hero') {
        await deleteHero(token, id);
      } else {
        await deletePet(token, id);
      }
      
      await fetchUserData(true);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHeroMood = (hero) => {
    // Lógica para determinar el estado de ánimo del héroe
    return 'happy';
  };

  const getPetMood = (pet) => {
    // Lógica para determinar el estado de ánimo de la mascota
    if (pet.health < 30) return 'sad';
    if (pet.happiness > 80) return 'happy';
    if (pet.energy < 30) return 'sleepy';
    return 'normal';
  };

  const handleAdoptPet = (petId) => {
    // Lógica para adoptar mascota
    console.log('Adoptando mascota:', petId);
  };

  const handleCarePet = (petId) => {
    // Lógica para cuidar mascota
    console.log('Cuidando mascota:', petId);
  };

  return (
    <div className="character-list-overlay">
      <div className="character-list-modal">
        <div className="character-list-header">
          <h2>🎮 Mis Personajes</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="character-list-tabs">
          <button 
            className={`tab-btn ${activeTab === 'heroes' ? 'active' : ''}`}
            onClick={() => setActiveTab('heroes')}
          >
            🦸 Héroes ({heroes?.length || 0})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pets' ? 'active' : ''}`}
            onClick={() => setActiveTab('pets')}
          >
            🐾 Mascotas ({mascotas?.length || 0})
          </button>
        </div>

        <div className="character-list-content">
          {activeTab === 'heroes' && (
            <div>
              {heroes && heroes.length > 0 ? (
                heroes.map((hero) => (
                  <div key={hero._id} className="character-card">
                    <div className="character-preview">
                      <HumanoidFigure
                        color={hero.color || '#3498db'}
                        accessories={hero.accessories || []}
                        size={80}
                        animated={true}
                      />
                    </div>
                    <div className="character-info">
                      <h3>{hero.name}</h3>
                      <p><strong>Alias:</strong> {hero.alias}</p>
                      <p><strong>Ciudad:</strong> {hero.city}</p>
                      <p><strong>Equipo:</strong> {hero.team}</p>
                      <p><strong>Mascotas:</strong> {hero.pets?.length || 0}</p>
                    </div>
                    <div className="character-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => onCharacterSelect('hero', hero)}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => setConfirmDelete({ type: 'hero', id: hero._id, name: hero.name })}
                        disabled={loading}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-characters">
                  <div className="no-characters-icon">🦸</div>
                  <h3>No tienes héroes creados</h3>
                  <p>¡Crea tu primer héroe para comenzar la aventura!</p>
                  <button className="create-btn" onClick={() => onCharacterSelect('create-hero')}>
                    ➕ Crear Héroe
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pets' && (
            <div>
              {mascotas && mascotas.length > 0 ? (
                mascotas.map((pet) => (
                  <div key={pet._id} className="character-card">
                    <div className="character-preview">
                      <PetFigure
                        color={pet.color || '#f39c12'}
                        type={pet.type || 'dog'}
                        accessories={pet.accessories || []}
                        size={80}
                        animated={true}
                        mood={getPetMood(pet)}
                      />
                    </div>
                    <div className="character-info">
                      <h3>{pet.name}</h3>
                      <p><strong>Tipo:</strong> {pet.petType}</p>
                      <p><strong>Salud:</strong> {pet.health || 100}%</p>
                      <p><strong>Felicidad:</strong> {pet.happiness || 100}%</p>
                      <p><strong>Energía:</strong> {pet.energy || 100}%</p>
                    </div>
                    <div className="character-actions">
                      <button 
                        className="action-btn care-btn"
                        onClick={() => handleCarePet(pet._id)}
                      >
                        🛁 Cuidar
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => onCharacterSelect('pet', pet)}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => setConfirmDelete({ type: 'pet', id: pet._id, name: pet.name })}
                        disabled={loading}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-characters">
                  <div className="no-characters-icon">🐾</div>
                  <h3>No tienes mascotas creadas</h3>
                  <p>¡Adopta tu primera mascota para comenzar!</p>
                  <button className="create-btn" onClick={() => onCharacterSelect('create-pet')}>
                    ➕ Crear Mascota
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal de confirmación de eliminación */}
        {confirmDelete && (
          <div className="confirm-delete-overlay">
            <div className="confirm-delete-modal">
              <h3>⚠️ Confirmar Eliminación</h3>
              <p>¿Estás seguro de que quieres eliminar a <strong>{confirmDelete.name}</strong>?</p>
              <p>Esta acción no se puede deshacer.</p>
              <div className="confirm-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setConfirmDelete(null)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  className="delete-confirm-btn"
                  onClick={() => handleDelete(confirmDelete.type, confirmDelete.id)}
                  disabled={loading}
                >
                  {loading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterList; 