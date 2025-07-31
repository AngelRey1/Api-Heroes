import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import { createHero, createPet, updateHero, updatePet } from '../api';
import './Customization.css';

const Customization = () => {
  const { token, user, heroes, mascotas, fetchUserData } = useUser();
  const { playClick, playCoin } = useSoundEffects();
  const [activeTab, setActiveTab] = useState('heroes');
  const [selectedHero, setSelectedHero] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('hero');
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  // Estados para edición de héroe
  const [heroForm, setHeroForm] = useState({
    name: '',
    alias: '',
    city: '',
    team: '',
    superPower: '',
    color: '#FFD700'
  });

  // Estados para edición de mascota
  const [petForm, setPetForm] = useState({
    name: '',
    type: 'dog',
    superPower: '',
    color: '#FFD700'
  });

  // Estados para creación
  const [createForm, setCreateForm] = useState({
    name: '',
    color: '#3498db',
    alias: '',
    city: '',
    team: '',
    petType: 'dog',
    superPower: ''
  });

  useEffect(() => {
    if (token) {
      loadCharacters();
    }
  }, [token, heroes, mascotas]);

  const loadCharacters = async () => {
    try {
      console.log('Customization - Loading characters...');
      console.log('Customization - User:', user);
      console.log('Customization - Heroes from context:', heroes);
      console.log('Customization - Pets from context:', mascotas);
    } catch (error) {
      console.error('Error cargando personajes:', error);
    }
  };

  const handleCreateHero = () => {
    setCreateType('hero');
    setCreateForm({
      name: '',
      color: '#3498db',
      alias: '',
      city: '',
      team: '',
      petType: 'dog',
      superPower: ''
    });
    setShowCreateModal(true);
    playClick();
  };

  const handleCreatePet = () => {
    setCreateType('pet');
    setCreateForm({
      name: '',
      color: '#3498db',
      alias: '',
      city: '',
      team: '',
      petType: 'dog',
      superPower: ''
    });
    setShowCreateModal(true);
    playClick();
  };

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      setNotification({
        message: 'Por favor ingresa un nombre',
        type: 'error'
      });
      return;
    }

    try {
      if (createType === 'hero') {
        const heroData = {
          name: createForm.name,
          alias: createForm.alias || createForm.name,
          city: createForm.city || 'Ciudad Desconocida',
          team: createForm.team || 'Sin Equipo',
          superPower: createForm.superPower || 'Sin poder',
          color: createForm.color
        };

        await createHero(token, heroData);
        setNotification({
          message: '¡Héroe creado exitosamente!',
          type: 'success'
        });
      } else {
        const petData = {
          name: createForm.name,
          type: createForm.petType,
          superPower: createForm.superPower || 'Amor incondicional',
          color: createForm.color
        };

        await createPet(token, petData);
        setNotification({
          message: '¡Mascota creada exitosamente!',
          type: 'success'
        });
      }

      playCoin();
      await fetchUserData();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creando personaje:', error);
      setNotification({
        message: 'Error al crear el personaje',
        type: 'error'
      });
    }
  };

  const handleEditHero = (hero) => {
    setSelectedHero(hero);
    setHeroForm({
      name: hero.name || '',
      alias: hero.alias || '',
      city: hero.city || '',
      team: hero.team || '',
      superPower: hero.superPower || '',
      color: hero.color || '#FFD700'
    });
    setShowEditModal(true);
    playClick();
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setPetForm({
      name: pet.name || '',
      type: pet.type || 'dog',
      superPower: pet.superPower || '',
      color: pet.color || '#FFD700'
    });
    setShowEditModal(true);
    playClick();
  };

  const handleSaveHero = async () => {
    try {
      const heroData = {
        name: heroForm.name,
        alias: heroForm.alias,
        city: heroForm.city,
        team: heroForm.team,
        superPower: heroForm.superPower,
        color: heroForm.color
      };

      await updateHero(token, selectedHero._id, heroData);
      setNotification({ message: 'Héroe actualizado correctamente!', type: 'success' });
      setShowEditModal(false);
      await fetchUserData();
      playCoin();
    } catch (error) {
      setNotification({ message: 'Error al actualizar héroe', type: 'error' });
    }
  };

  const handleSavePet = async () => {
    try {
      const petData = {
        name: petForm.name,
        type: petForm.type,
        superPower: petForm.superPower,
        color: petForm.color
      };

      await updatePet(token, selectedPet._id, petData);
      setNotification({ message: 'Mascota actualizada correctamente!', type: 'success' });
      setShowEditModal(false);
      await fetchUserData();
      playCoin();
    } catch (error) {
      setNotification({ message: 'Error al actualizar mascota', type: 'error' });
    }
  };

  const handleInputChange = (field, value) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
  };

  const handleHeroFormChange = (field, value) => {
    setHeroForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePetFormChange = (field, value) => {
    setPetForm(prev => ({ ...prev, [field]: value }));
  };

  const petTypes = [
    { id: 'dog', name: 'Perro', emoji: '🐕' },
    { id: 'cat', name: 'Gato', emoji: '🐱' },
    { id: 'rabbit', name: 'Conejo', emoji: '🐰' },
    { id: 'bird', name: 'Pájaro', emoji: '🐦' },
    { id: 'hamster', name: 'Hamster', emoji: '🐹' },
    { id: 'turtle', name: 'Tortuga', emoji: '🐢' }
  ];

  return (
    <div className="customization-container">
      <div className="customization-header">
        <h1>🎨 Personalización</h1>
        <p>Edita tus héroes y mascotas</p>
      </div>

      <div className="customization-tabs">
        <button
          className={`tab-btn ${activeTab === 'heroes' ? 'active' : ''}`}
          onClick={() => setActiveTab('heroes')}
        >
          👤 Héroes ({heroes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'pets' ? 'active' : ''}`}
          onClick={() => setActiveTab('pets')}
        >
          🐾 Mascotas ({mascotas.length})
        </button>
      </div>

      <div className="characters-grid">
        {activeTab === 'heroes' ? (
          <>
            {/* Botón de crear héroe */}
            <div className="character-card create-card" onClick={handleCreateHero}>
              <div className="create-icon">➕</div>
              <h3>Crear Héroe</h3>
              <p>Agrega un nuevo héroe</p>
            </div>

            {/* Lista de héroes */}
            {heroes.map((hero, index) => (
              <div key={hero._id || index} className="character-card">
                <div className="hero-avatar" style={{ backgroundColor: hero.color || '#FFD700' }}>
                  {hero.name?.charAt(0).toUpperCase() || 'H'}
                </div>
                <h3>{hero.name}</h3>
                <p>Alias: {hero.alias}</p>
                <p>Ciudad: {hero.city}</p>
                <p>Equipo: {hero.team}</p>
                <p>Poder: {hero.superPower}</p>
                <button className="edit-btn" onClick={() => handleEditHero(hero)}>
                  ✏️ Editar
                </button>
              </div>
            ))}

            {heroes.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🦸‍♂️</div>
                <h3>No tienes héroes creados</h3>
                <p>¡Crea tu primer héroe para comenzar!</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Botón de crear mascota */}
            <div className="character-card create-card" onClick={handleCreatePet}>
              <div className="create-icon">➕</div>
              <h3>Crear Mascota</h3>
              <p>Adopta una nueva mascota</p>
            </div>

            {/* Lista de mascotas */}
            {mascotas.map((pet, index) => (
              <div key={pet._id || index} className="character-card">
                <div className="pet-avatar" style={{ backgroundColor: pet.color || '#FFD700' }}>
                  {pet.type === 'dog' ? '🐕' : 
                   pet.type === 'cat' ? '🐱' : 
                   pet.type === 'rabbit' ? '🐰' : 
                   pet.type === 'bird' ? '🐦' : 
                   pet.type === 'hamster' ? '🐹' : 
                   pet.type === 'turtle' ? '🐢' : '🐾'}
                </div>
                <h3>{pet.name}</h3>
                <p>Tipo: {pet.type}</p>
                <p>Poder: {pet.superPower}</p>
                <button className="edit-btn" onClick={() => handleEditPet(pet)}>
                  ✏️ Editar
                </button>
              </div>
            ))}

            {mascotas.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🐾</div>
                <h3>No tienes mascotas</h3>
                <p>¡Adopta tu primera mascota!</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de creación */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Crear {createType === 'hero' ? 'Héroe' : 'Mascota'}</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={`Nombre del ${createType === 'hero' ? 'héroe' : 'mascota'}`}
                />
              </div>

              {createType === 'hero' ? (
                <>
                  <div className="form-group">
                    <label>Alias</label>
                    <input
                      type="text"
                      value={createForm.alias}
                      onChange={(e) => handleInputChange('alias', e.target.value)}
                      placeholder="Ej: Spiderman, Batman..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      value={createForm.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Ej: Nueva York, Gotham..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Equipo</label>
                    <input
                      type="text"
                      value={createForm.team}
                      onChange={(e) => handleInputChange('team', e.target.value)}
                      placeholder="Ej: Los Vengadores, Liga de la Justicia..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Super Poder</label>
                    <input
                      type="text"
                      value={createForm.superPower}
                      onChange={(e) => handleInputChange('superPower', e.target.value)}
                      placeholder="Ej: Volar, Super fuerza..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Tipo de Mascota</label>
                    <select
                      value={createForm.petType}
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
                      value={createForm.superPower}
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
                  value={createForm.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </button>
              <button 
                className="create-btn" 
                onClick={handleCreate}
                disabled={!createForm.name.trim()}
              >
                Crear {createType === 'hero' ? 'Héroe' : 'Mascota'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar {selectedHero ? 'Héroe' : 'Mascota'}</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              {selectedHero ? (
                <>
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      value={heroForm.name}
                      onChange={(e) => handleHeroFormChange('name', e.target.value)}
                      placeholder="Nombre del héroe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Alias</label>
                    <input
                      type="text"
                      value={heroForm.alias}
                      onChange={(e) => handleHeroFormChange('alias', e.target.value)}
                      placeholder="Alias del héroe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      value={heroForm.city}
                      onChange={(e) => handleHeroFormChange('city', e.target.value)}
                      placeholder="Ciudad del héroe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Equipo</label>
                    <input
                      type="text"
                      value={heroForm.team}
                      onChange={(e) => handleHeroFormChange('team', e.target.value)}
                      placeholder="Equipo del héroe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Super Poder</label>
                    <input
                      type="text"
                      value={heroForm.superPower}
                      onChange={(e) => handleHeroFormChange('superPower', e.target.value)}
                      placeholder="Super poder del héroe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input
                      type="color"
                      value={heroForm.color}
                      onChange={(e) => handleHeroFormChange('color', e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      value={petForm.name}
                      onChange={(e) => handlePetFormChange('name', e.target.value)}
                      placeholder="Nombre de la mascota"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo de Mascota</label>
                    <select
                      value={petForm.type}
                      onChange={(e) => handlePetFormChange('type', e.target.value)}
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
                      value={petForm.superPower}
                      onChange={(e) => handlePetFormChange('superPower', e.target.value)}
                      placeholder="Super poder de la mascota"
                    />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input
                      type="color"
                      value={petForm.color}
                      onChange={(e) => handlePetFormChange('color', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
              <button 
                className="save-btn" 
                onClick={selectedHero ? handleSaveHero : handleSavePet}
                disabled={selectedHero ? !heroForm.name.trim() : !petForm.name.trim()}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {notification.message && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: 'info' })}
        />
      )}
    </div>
  );
};

export default Customization; 