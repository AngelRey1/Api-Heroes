import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useSoundEffects } from './SoundEffects';
import NotificationToast from './NotificationToast';
import { createHero, createPet } from '../api';
import './CreationModal.css';

const CreationModal = ({ isOpen, onClose }) => {
  const { token, fetchUserData } = useUser();
  const { playClick, playCoin } = useSoundEffects();
  
  const [type, setType] = useState('hero'); // 'hero' o 'pet'
  const [formData, setFormData] = useState({
    name: '',
    color: '#3498db',
    // Campos para héroes
    alias: '',
    city: '',
    team: '',
    // Campos para mascotas
    petType: 'dog',
    superPower: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  // Debug: mostrar información del modal
  console.log('CreationModal - isOpen:', isOpen);
  console.log('CreationModal - type:', type);
  console.log('CreationModal - formData:', formData);

  // Tipos de mascotas disponibles
  const petTypes = [
    { id: 'dog', name: 'Perro', emoji: '🐕' },
    { id: 'cat', name: 'Gato', emoji: '🐱' },
    { id: 'rabbit', name: 'Conejo', emoji: '🐰' },
    { id: 'bird', name: 'Pájaro', emoji: '🐦' },
    { id: 'hamster', name: 'Hamster', emoji: '🐹' },
    { id: 'turtle', name: 'Tortuga', emoji: '🐢' }
  ];

  const handleInputChange = (field, value) => {
    console.log('handleInputChange:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    console.log('handleCreate - type:', type);
    console.log('handleCreate - formData:', formData);
    
    if (!formData.name.trim()) {
      setNotification({
        message: 'Por favor ingresa un nombre',
        type: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      playClick();

      if (type === 'hero') {
        const heroData = {
          name: formData.name,
          alias: formData.alias || formData.name,
          city: formData.city || 'Ciudad Desconocida',
          team: formData.team || 'Sin Equipo',
          color: formData.color
        };

        console.log('Creando héroe:', heroData);
        await createHero(token, heroData);
        setNotification({
          message: '¡Héroe creado exitosamente!',
          type: 'success'
        });
      } else {
        const petData = {
          name: formData.name,
          type: formData.petType,
          petType: formData.petType,
          superPower: formData.superPower || 'Amor incondicional',
          color: formData.color
        };

        console.log('Creando mascota:', petData);
        await createPet(token, petData);
        setNotification({
          message: '¡Mascota creada exitosamente!',
          type: 'success'
        });
      }

      playCoin();
      await fetchUserData();
      onClose();
    } catch (error) {
      console.error('Error creando personaje:', error);
      setNotification({
        message: 'Error al crear el personaje',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    console.log('CreationModal - No se muestra porque isOpen es false');
    return null;
  }

  console.log('CreationModal - Renderizando modal');

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Crear {type === 'hero' ? 'Héroe' : 'Mascota'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Selector de tipo - HACER MÁS VISIBLE */}
          <div className="type-selector" style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '30px',
            border: '2px solid rgba(255, 255, 255, 0.4)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '15px', textAlign: 'center' }}>
              ¿Qué quieres crear?
            </h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                className={`type-btn ${type === 'hero' ? 'active' : ''}`}
                onClick={() => {
                  console.log('Cambiando a héroe');
                  setType('hero');
                }}
                style={{ flex: 1, padding: '20px', fontSize: '18px' }}
              >
                🦸‍♂️ Héroe
              </button>
              <button
                className={`type-btn ${type === 'pet' ? 'active' : ''}`}
                onClick={() => {
                  console.log('Cambiando a mascota');
                  setType('pet');
                }}
                style={{ flex: 1, padding: '20px', fontSize: '18px' }}
              >
                🐾 Mascota
              </button>
            </div>
          </div>

          {/* Formulario */}
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={`Nombre del ${type === 'hero' ? 'héroe' : 'mascota'}`}
            />
          </div>

          {type === 'hero' ? (
            <>
              <div className="form-group">
                <label>Alias</label>
                <input
                  type="text"
                  value={formData.alias}
                  onChange={(e) => handleInputChange('alias', e.target.value)}
                  placeholder="Ej: Spiderman, Batman..."
                />
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Ej: Nueva York, Gotham..."
                />
              </div>
              <div className="form-group">
                <label>Equipo</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => handleInputChange('team', e.target.value)}
                  placeholder="Ej: Los Vengadores, Liga de la Justicia..."
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Tipo de Mascota</label>
                <select
                  value={formData.petType}
                  onChange={(e) => handleInputChange('petType', e.target.value)}
                >
                  {petTypes.map(pet => (
                    <option key={pet.id} value={pet.id}>
                      {pet.emoji} {pet.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Super Poder</label>
                <input
                  type="text"
                  value={formData.superPower}
                  onChange={(e) => handleInputChange('superPower', e.target.value)}
                  placeholder="Ej: Volar, Super fuerza..."
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Color</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="create-btn" 
            onClick={handleCreate}
            disabled={loading || !formData.name.trim()}
          >
            {loading ? 'Creando...' : `Crear ${type === 'hero' ? 'Héroe' : 'Mascota'}`}
          </button>
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

export default CreationModal; 