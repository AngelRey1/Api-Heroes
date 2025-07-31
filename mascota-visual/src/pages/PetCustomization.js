import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import PetFigure from '../components/PetFigure';
import './PetCustomization.css';
import { customizePet } from '../api';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';

const colores = [
  '#FFD700', '#FF69B4', '#87CEEB', '#90EE90', '#FFA07A',
  '#DDA0DD', '#F0E68C', '#98FB98', '#FFB6C1', '#20B2AA',
  '#FF6347', '#32CD32', '#BA55D3', '#FF4500', '#00CED1'
];

const formas = [
  { label: 'Clásico', value: 'normal', icon: '🐕' },
  { label: 'Orejas grandes', value: 'big-ears', icon: '🐕‍🦺' },
  { label: 'Cuerpo redondo', value: 'round-body', icon: '🐕' },
  { label: 'Cola larga', value: 'long-tail', icon: '🐕' },
  { label: 'Pequeño', value: 'small', icon: '🐕' },
  { label: 'Grande', value: 'large', icon: '🐕' }
];

const accesorios = [
  { id: 'sombrero', name: 'Sombrero', icon: '🎩', price: 50 },
  { id: 'collar', name: 'Collar', icon: '🦮', price: 30 },
  { id: 'gafas', name: 'Gafas', icon: '👓', price: 40 },
  { id: 'corbata', name: 'Corbata', icon: '🎀', price: 25 },
  { id: 'chaleco', name: 'Chaleco', icon: '🦺', price: 60 }
];

export default function PetCustomization({ pet, onClose, onUpdated }) {
  const { token, coins, updateCoins } = useUser();
  const { playClick, playCoin, playCelebrate } = useSoundEffects();
  
  const [color, setColor] = useState(pet?.color || colores[0]);
  const [forma, setForma] = useState(pet?.forma || formas[0].value);
  const [nombre, setNombre] = useState(pet?.name || '');
  const [accesoriosSeleccionados, setAccesoriosSeleccionados] = useState(pet?.accessories || []);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [previewMode, setPreviewMode] = useState('normal'); // normal, happy, sad

  // Validar que pet existe DESPUÉS de los hooks
  if (!pet) {
    return (
      <div className="pet-custom-overlay">
        <div className="pet-custom-modal">
          <div className="pet-custom-header">
            <h2>🐾 Personalizar Mascota</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="pet-custom-content">
            <div className="no-pet-message">
              <div className="no-pet-icon">🐾</div>
              <h3>No hay mascota seleccionada</h3>
              <p>Primero debes crear o seleccionar una mascota para personalizarla.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Validar nombre
  const isNombreValido = nombre.length >= 2 && nombre.length <= 20;
  const nombreError = nombre.length > 0 && !isNombreValido ? 
    'El nombre debe tener entre 2 y 20 caracteres' : '';

  // Calcular costo total de accesorios
  const costoAccesorios = accesoriosSeleccionados.reduce((total, accId) => {
    const accesorio = accesorios.find(a => a.id === accId);
    return total + (accesorio?.price || 0);
  }, 0);

  const puedeComprar = coins >= costoAccesorios;

  const handleColorChange = (newColor) => {
    setColor(newColor);
    playClick();
  };

  const handleFormaChange = (newForma) => {
    setForma(newForma);
    playClick();
  };

  const handleNombreChange = (newNombre) => {
    setNombre(newNombre);
  };

  const handleAccesorioToggle = (accesorioId) => {
    playClick();
    setAccesoriosSeleccionados(prev => {
      if (prev.includes(accesorioId)) {
        return prev.filter(id => id !== accesorioId);
      } else {
        return [...prev, accesorioId];
      }
    });
  };

  const handlePreviewMode = (mode) => {
    setPreviewMode(mode);
    playClick();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!isNombreValido) {
      setNotification({ message: 'Por favor, ingresa un nombre válido', type: 'error' });
      return;
    }

    if (costoAccesorios > coins) {
      setNotification({ message: 'No tienes suficientes monedas para los accesorios', type: 'error' });
      return;
    }

    setLoading(true);
    setNotification({ message: '', type: 'info' });
    
    try {
      const result = await customizePet(pet._id, token, { 
        name: nombre, 
        color, 
        forma,
        accessories: accesoriosSeleccionados
      });
      
      // Descontar monedas por accesorios
      if (costoAccesorios > 0) {
        updateCoins(-costoAccesorios);
      }
      
      setNotification({ 
        message: '¡Personalización guardada exitosamente!', 
        type: 'success' 
      });
      
      playCelebrate();
      
      if (onUpdated) onUpdated();
      
      // Cerrar después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error al guardar personalización:', err);
      setNotification({ 
        message: err.response?.data?.error || 'Error al guardar la personalización', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefault = () => {
    setColor(colores[0]);
    setForma(formas[0].value);
    setNombre(pet.name || '');
    setAccesoriosSeleccionados([]);
    playClick();
  };

  return (
    <div className="pet-custom-overlay">
      <div className="pet-custom-modal">
        <div className="pet-custom-header">
          <h2>🐾 Personalizar {pet.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="pet-custom-content">
          {/* Preview en tiempo real */}
          <div className="preview-section">
            <h3>👀 Vista Previa</h3>
            <div className="preview-container">
              <div className="preview-pet" style={{ backgroundColor: color }}>
                <PetFigure
                  color={color}
                  type={pet.type || 'dog'}
                  accessories={accesoriosSeleccionados}
                  size={120}
                  animated={true}
                  mood={previewMode}
                />
              </div>
              
              {/* Controles de preview */}
              <div className="preview-controls">
                <button 
                  className={`preview-btn ${previewMode === 'normal' ? 'active' : ''}`}
                  onClick={() => handlePreviewMode('normal')}
                >
                  😊 Normal
                </button>
                <button 
                  className={`preview-btn ${previewMode === 'happy' ? 'active' : ''}`}
                  onClick={() => handlePreviewMode('happy')}
                >
                  😄 Feliz
                </button>
                <button 
                  className={`preview-btn ${previewMode === 'sad' ? 'active' : ''}`}
                  onClick={() => handlePreviewMode('sad')}
                >
                  😢 Triste
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="customization-form">
            {/* Nombre */}
            <div className="form-section">
              <h3>📝 Nombre</h3>
              <div className="input-group">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => handleNombreChange(e.target.value)}
                  placeholder="Nombre de tu mascota"
                  className={nombreError ? 'error' : ''}
                  maxLength={20}
                />
                {nombreError && <span className="error-message">{nombreError}</span>}
                <span className="char-count">{nombre.length}/20</span>
              </div>
            </div>

            {/* Colores */}
            <div className="form-section">
              <h3>🎨 Color</h3>
              <div className="color-grid">
                {colores.map((c) => (
                  <div
                    key={c}
                    className={`color-option ${color === c ? 'selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => handleColorChange(c)}
                    title={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Formas */}
            <div className="form-section">
              <h3>🦴 Forma</h3>
              <div className="shape-grid">
                {formas.map((f) => (
                  <div
                    key={f.value}
                    className={`shape-option ${forma === f.value ? 'selected' : ''}`}
                    onClick={() => handleFormaChange(f.value)}
                  >
                    <span className="shape-icon">{f.icon}</span>
                    <span className="shape-label">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accesorios */}
            <div className="form-section">
              <h3>👔 Accesorios</h3>
              <div className="accessories-grid">
                {accesorios.map((acc) => (
                  <div
                    key={acc.id}
                    className={`accessory-option ${accesoriosSeleccionados.includes(acc.id) ? 'selected' : ''}`}
                    onClick={() => handleAccesorioToggle(acc.id)}
                  >
                    <span className="accessory-icon">{acc.icon}</span>
                    <span className="accessory-name">{acc.name}</span>
                    <span className="accessory-price">💰 {acc.price}</span>
                  </div>
                ))}
              </div>
              
              {costoAccesorios > 0 && (
                <div className="cost-info">
                  <span>Costo total: 💰 {costoAccesorios}</span>
                  <span className={puedeComprar ? 'can-afford' : 'cannot-afford'}>
                    {puedeComprar ? '✅ Puedes comprar' : '❌ No tienes suficientes monedas'}
                  </span>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="action-buttons">
              <button 
                type="button" 
                className="reset-btn"
                onClick={resetToDefault}
                disabled={loading}
              >
                🔄 Restablecer
              </button>
              
              <button 
                type="submit" 
                className="save-btn"
                disabled={loading || !isNombreValido || !puedeComprar}
              >
                {loading ? '💾 Guardando...' : '💾 Guardar Personalización'}
              </button>
            </div>
          </form>
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
} 