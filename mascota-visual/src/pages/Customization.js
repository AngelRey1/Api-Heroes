import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { 
  getPetCustomizations, 
  getHeroCustomizations,
  applyPetCustomization,
  applyHeroCustomization,
  buyCustomization
} from '../api';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import './Customization.css';

const Customization = () => {
  const { token, updateCoins, user } = useUser();
  const { playClick, playCoin, playCelebrate } = useSoundEffects();
  const [petCustomizations, setPetCustomizations] = useState([]);
  const [heroCustomizations, setHeroCustomizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [activeTab, setActiveTab] = useState('pets');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCustomizations();
  }, [token]);

  const fetchCustomizations = async () => {
    try {
      setLoading(true);
      
      const [petData, heroData] = await Promise.all([
        getPetCustomizations(token),
        getHeroCustomizations(token)
      ]);
      
      setPetCustomizations(petData);
      setHeroCustomizations(heroData);
    } catch (err) {
      console.error('Error fetching customizations:', err);
      setNotification({ message: 'Error al cargar personalizaciones', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPetCustomization = async (customizationId) => {
    try {
      setActionLoading(true);
      playClick();
      
      await applyPetCustomization(customizationId, token);
      
      setNotification({ 
        message: '¡Personalización aplicada a tu mascota!', 
        type: 'success' 
      });
      
      playCelebrate();
      
      // Recargar datos
      await fetchCustomizations();
    } catch (err) {
      console.error('Error applying pet customization:', err);
      setNotification({ message: 'Error al aplicar personalización', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyHeroCustomization = async (customizationId) => {
    try {
      setActionLoading(true);
      playClick();
      
      await applyHeroCustomization(customizationId, token);
      
      setNotification({ 
        message: '¡Personalización aplicada a tu héroe!', 
        type: 'success' 
      });
      
      playCelebrate();
      
      // Recargar datos
      await fetchCustomizations();
    } catch (err) {
      console.error('Error applying hero customization:', err);
      setNotification({ message: 'Error al aplicar personalización', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyCustomization = async (customizationId, price) => {
    try {
      setActionLoading(true);
      playClick();
      
      const result = await buyCustomization(customizationId, token);
      updateCoins(-price);
      
      setNotification({ 
        message: `¡Personalización comprada por ${price} monedas!`, 
        type: 'success' 
      });
      
      playCoin();
      
      // Recargar datos
      await fetchCustomizations();
    } catch (err) {
      console.error('Error buying customization:', err);
      setNotification({ message: 'Error al comprar personalización', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: '🎨' },
    { id: 'hats', name: 'Sombreros', icon: '🎩' },
    { id: 'accessories', name: 'Accesorios', icon: '👓' },
    { id: 'clothes', name: 'Ropa', icon: '👕' },
    { id: 'backgrounds', name: 'Fondos', icon: '🖼️' },
    { id: 'effects', name: 'Efectos', icon: '✨' },
    { id: 'special', name: 'Especiales', icon: '⭐' }
  ];

  const currentCustomizations = activeTab === 'pets' ? petCustomizations : heroCustomizations;
  
  const filteredCustomizations = selectedCategory === 'all' 
    ? currentCustomizations
    : currentCustomizations.filter(item => item.category === selectedCategory);

  const getCustomizationIcon = (category) => {
    switch (category) {
      case 'hats': return '🎩';
      case 'accessories': return '👓';
      case 'clothes': return '👕';
      case 'backgrounds': return '🖼️';
      case 'effects': return '✨';
      case 'special': return '⭐';
      default: return '🎨';
    }
  };

  const getCustomizationColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#C0C0C0';
      case 'rare': return '#87CEEB';
      case 'epic': return '#DDA0DD';
      case 'legendary': return '#FFD700';
      default: return '#FFE4E1';
    }
  };

  if (loading) {
    return (
      <div className="customization-container">
        <div className="loading-message">
          <div className="loading-spinner">🎨</div>
          <p>Cargando personalizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customization-container">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'info' })} 
      />

      {/* Header */}
      <div className="customization-header">
        <h1>🎨 Personalización</h1>
        <div className="customization-stats">
          <div className="stat-item">
            <span className="stat-icon">🐾</span>
            <span className="stat-label">Mascotas:</span>
            <span className="stat-value">
              {petCustomizations.filter(c => c.owned).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🦸‍♂️</span>
            <span className="stat-label">Héroes:</span>
            <span className="stat-value">
              {heroCustomizations.filter(c => c.owned).length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'pets' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('pets');
            playClick();
          }}
        >
          🐾 Mascotas
        </button>
        <button
          className={`tab-btn ${activeTab === 'heroes' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('heroes');
            playClick();
          }}
        >
          🦸‍♂️ Héroes
        </button>
      </div>

      {/* Categorías */}
      <div className="categories-container">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(category.id);
              playClick();
            }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Grid de personalizaciones */}
      <div className="customizations-grid">
        {filteredCustomizations.length === 0 ? (
          <div className="no-customizations">
            <div className="no-customizations-icon">🎨</div>
            <h3>No hay personalizaciones en esta categoría</h3>
            <p>¡Compra personalizaciones para personalizar tu {activeTab === 'pets' ? 'mascota' : 'héroe'}!</p>
          </div>
        ) : (
          filteredCustomizations.map(customization => (
            <div 
              key={customization._id} 
              className={`customization-card ${customization.owned ? 'owned' : 'locked'}`}
              style={{ backgroundColor: getCustomizationColor(customization.rarity) }}
            >
              <div className="customization-preview">
                <div className="preview-image">
                  {customization.image ? (
                    <img 
                      src={customization.image} 
                      alt={customization.name}
                      className="customization-img"
                    />
                  ) : (
                    <div className="preview-placeholder">
                      {getCustomizationIcon(customization.category)}
                    </div>
                  )}
                </div>
                
                {customization.applied && (
                  <div className="applied-badge">✅ Aplicado</div>
                )}
              </div>

              <div className="customization-info">
                <h3 className="customization-name">{customization.name}</h3>
                <p className="customization-description">{customization.description}</p>
                
                <div className="customization-meta">
                  <span className="customization-category">{customization.category}</span>
                  <span className={`rarity-badge ${customization.rarity}`}>
                    {customization.rarity === 'common' && 'Común'}
                    {customization.rarity === 'rare' && 'Raro'}
                    {customization.rarity === 'epic' && 'Épico'}
                    {customization.rarity === 'legendary' && 'Legendario'}
                  </span>
                </div>
              </div>

              <div className="customization-actions">
                {customization.owned ? (
                  <button
                    className="apply-btn"
                    onClick={() => activeTab === 'pets' 
                      ? handleApplyPetCustomization(customization._id)
                      : handleApplyHeroCustomization(customization._id)
                    }
                    disabled={actionLoading || customization.applied}
                  >
                    {customization.applied ? 'Aplicado' : 'Aplicar'}
                  </button>
                ) : (
                  <div className="purchase-info">
                    <div className="price-info">
                      <span className="price-icon">💰</span>
                      <span className="price-amount">{customization.price} monedas</span>
                    </div>
                    
                    {user?.coins >= customization.price ? (
                      <button
                        className="buy-btn"
                        onClick={() => handleBuyCustomization(customization._id, customization.price)}
                        disabled={actionLoading}
                      >
                        Comprar
                      </button>
                    ) : (
                      <span className="insufficient-funds">Monedas insuficientes</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Información adicional */}
      <div className="customization-info">
        <div className="info-card">
          <h3>💡 Tipos de Personalización</h3>
          <div className="customization-types">
            <div className="type-item">
              <span className="type-icon">🎩</span>
              <span className="type-name">Sombreros</span>
              <span className="type-desc">Sombreros y gorras</span>
            </div>
            <div className="type-item">
              <span className="type-icon">👓</span>
              <span className="type-name">Accesorios</span>
              <span className="type-desc">Gafas, collares, etc.</span>
            </div>
            <div className="type-item">
              <span className="type-icon">👕</span>
              <span className="type-name">Ropa</span>
              <span className="type-desc">Camisetas, vestidos</span>
            </div>
            <div className="type-item">
              <span className="type-icon">🖼️</span>
              <span className="type-name">Fondos</span>
              <span className="type-desc">Fondos personalizados</span>
            </div>
            <div className="type-item">
              <span className="type-icon">✨</span>
              <span className="type-name">Efectos</span>
              <span className="type-desc">Efectos especiales</span>
            </div>
            <div className="type-item">
              <span className="type-icon">⭐</span>
              <span className="type-name">Especiales</span>
              <span className="type-desc">Items únicos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customization; 