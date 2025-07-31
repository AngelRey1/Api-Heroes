import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import { getItems, buyItem } from '../api';
import './Shop.css';

const Shop = () => {
  const { token, user, fetchUserData } = useUser();
  const { playClick, playCoin } = useSoundEffects();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  const categories = [
    { id: 'all', name: 'Todos', icon: '🛍️' },
    { id: 'food', name: 'Comida', icon: '🍖' },
    { id: 'toys', name: 'Juguetes', icon: '🎾' },
    { id: 'accessories', name: 'Accesorios', icon: '👑' },
    { id: 'medicine', name: 'Medicina', icon: '💊' },
    { id: 'cosmetics', name: 'Cosméticos', icon: '💄' }
  ];

  useEffect(() => {
    if (token) {
      loadItems();
    }
  }, [token]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const itemsData = await getItems(token);
      setItems(itemsData);
    } catch (error) {
      console.error('Error cargando items:', error);
      setNotification({
        message: 'Error cargando la tienda',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyItem = async (item) => {
    if (!user || user.coins < item.price) {
      setNotification({
        message: 'No tienes suficientes monedas',
        type: 'error'
      });
      return;
    }

    try {
      await buyItem(item._id, 1, token);
      playCoin();
      setNotification({
        message: `¡${item.name} comprado exitosamente!`,
        type: 'success'
      });
      await fetchUserData(); // Actualizar monedas del usuario
    } catch (error) {
      console.error('Error comprando item:', error);
      setNotification({
        message: 'Error al comprar el item',
        type: 'error'
      });
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const getItemIcon = (category) => {
    const iconMap = {
      'food': '🍖',
      'toys': '🎾',
      'accessories': '👑',
      'medicine': '💊',
      'cosmetics': '💄'
    };
    return iconMap[category] || '📦';
  };

  if (loading) {
    return (
      <div className="shop-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando tienda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>🛒 Tienda</h1>
        <p>Compra items para tus mascotas y héroes</p>
        <div className="user-coins">
          <span className="coin-icon">💰</span>
          <span className="coin-amount">{user?.coins || 0}</span>
        </div>
      </div>

      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="items-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
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
                      {stat === 'cleanliness' && '🛁'}
                      +{value}
                    </span>
                  ))}
                </div>
              </div>
              <div className="item-price">
                <span className="price-amount">{item.price}</span>
                <span className="price-icon">💰</span>
              </div>
              <button
                className={`buy-btn ${user?.coins >= item.price ? '' : 'disabled'}`}
                onClick={() => handleBuyItem(item)}
                disabled={user?.coins < item.price}
              >
                {user?.coins >= item.price ? 'Comprar' : 'Sin monedas'}
              </button>
            </div>
          ))
        ) : (
          <div className="empty-shop">
            <div className="empty-icon">🛍️</div>
            <h3>No hay items en esta categoría</h3>
            <p>Intenta con otra categoría</p>
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
  );
};

export default Shop; 