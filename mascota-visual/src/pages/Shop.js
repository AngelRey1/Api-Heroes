import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getItems, buyItem } from '../api';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import './Shop.css';

const Shop = () => {
  const { token, coins, updateCoins } = useUser();
  const { playClick, playCoin } = useSoundEffects();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchItems();
  }, [token]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const itemsData = await getItems(token);
      setItems(itemsData);
    } catch (err) {
      console.error('Error fetching items:', err);
      setNotification({ message: 'Error al cargar items', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyItem = async (itemId, price) => {
    if (coins < price) {
      setNotification({ message: '¡No tienes suficientes monedas!', type: 'warning' });
      return;
    }

    try {
      setBuying(true);
      playClick();
      
      const result = await buyItem(itemId, 1, token);
      updateCoins(coins - price);
      
      setNotification({ 
        message: `¡${result.item.name} comprado por ${price} monedas!`, 
        type: 'success' 
      });
      
      playCoin();
    } catch (err) {
      console.error('Error buying item:', err);
      setNotification({ message: 'Error al comprar item', type: 'error' });
    } finally {
      setBuying(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: '🛍️' },
    { id: 'food', name: 'Comida', icon: '🍖' },
    { id: 'toys', name: 'Juguetes', icon: '🎲' },
    { id: 'accessories', name: 'Accesorios', icon: '👒' },
    { id: 'medicine', name: 'Medicina', icon: '💊' },
    { id: 'special', name: 'Especiales', icon: '⭐' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const getItemIcon = (category) => {
    switch (category) {
      case 'food': return '🍖';
      case 'toys': return '🎲';
      case 'accessories': return '👒';
      case 'medicine': return '💊';
      case 'special': return '⭐';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="shop-container">
        <div className="loading-message">
          <div className="loading-spinner">🛍️</div>
          <p>Cargando tienda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'info' })} 
      />

      {/* Header de la tienda */}
      <div className="shop-header">
        <h1>🛒 Tienda</h1>
        <div className="coins-display">
          <span className="coins-icon">💰</span>
          <span className="coins-amount">{coins}</span>
        </div>
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

      {/* Grid de items */}
      <div className="items-grid">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <div className="no-items-icon">📦</div>
            <p>No hay items en esta categoría</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item._id} className="item-card">
              <div className="item-icon">
                {getItemIcon(item.category)}
              </div>
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-stats">
                  {item.effects && Object.entries(item.effects).map(([stat, value]) => (
                    <span key={stat} className="item-stat">
                      {stat === 'health' && '❤️'}
                      {stat === 'happiness' && '😊'}
                      {stat === 'energy' && '⚡'}
                      {stat === 'cleanliness' && '🧼'}
                      {value > 0 ? '+' : ''}{value}
                    </span>
                  ))}
                </div>
              </div>
              <div className="item-price">
                <span className="price-amount">{item.price}</span>
                <span className="price-icon">💰</span>
              </div>
              <button
                className={`buy-btn ${coins < item.price ? 'disabled' : ''}`}
                onClick={() => handleBuyItem(item._id, item.price)}
                disabled={coins < item.price || buying}
              >
                {buying ? 'Comprando...' : 'Comprar'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Información adicional */}
      <div className="shop-info">
        <div className="info-card">
          <h3>💡 Consejos</h3>
          <ul>
            <li>Alimenta a tu mascota regularmente</li>
            <li>Los juguetes aumentan la felicidad</li>
            <li>La medicina cura enfermedades</li>
            <li>Los accesorios son solo decorativos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Shop; 