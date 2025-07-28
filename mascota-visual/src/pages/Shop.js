import React, { useEffect, useState } from 'react';
import { getItems, buyItem, equipAccessory, equipHeroAccessory, updateUserBackground, getUserProfile } from '../api';

function PreviewMascota({ accessoryImg }) {
  return (
    <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 8px auto' }}>
      <img src="/assets/dog_normal.png" alt="Mascota" style={{ width: 90, height: 90, objectFit: 'contain' }} />
      {accessoryImg && <img src={accessoryImg} alt="Accesorio" style={{ position: 'absolute', top: 0, left: 18, width: 54, pointerEvents: 'none' }} />}
    </div>
  );
}

function PreviewHero({ accessoryImg }) {
  return (
    <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 8px auto' }}>
      <img src="/assets/hero.png" alt="Héroe" style={{ width: 90, height: 90, objectFit: 'contain', borderRadius: '50%' }} />
      {accessoryImg && <img src={accessoryImg} alt="Accesorio" style={{ position: 'absolute', top: 0, left: 18, width: 54, pointerEvents: 'none' }} />}
    </div>
  );
}

function Shop({ token, onPurchase, activePetId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buying, setBuying] = useState('');
  const [success, setSuccess] = useState('');
  const [equipping, setEquipping] = useState('');
  const [previewAcc, setPreviewAcc] = useState(null);
  const [activeHeroId, setActiveHeroId] = useState(null);
  const [userBackground, setUserBackground] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch (err) {
        setError('Error al cargar la tienda.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (!token) return;
    getUserProfile(token).then(u => setUserBackground(u.background || ''));
  }, [token]);

  const handleBuy = async (itemId) => {
    setBuying(itemId);
    setError('');
    setSuccess('');
    try {
      await buyItem(itemId, 1, token);
      setSuccess('¡Compra exitosa!');
      if (onPurchase) onPurchase();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al comprar.');
    } finally {
      setBuying('');
    }
  };

  const handleEquip = async (itemId) => {
    if (!activePetId) {
      setError('Selecciona una mascota activa para equipar.');
      return;
    }
    setEquipping(itemId);
    setError('');
    setSuccess('');
    try {
      await equipAccessory(token, activePetId, itemId);
      setSuccess('¡Accesorio equipado!');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al equipar.');
    } finally {
      setEquipping('');
    }
  };

  const handleEquipHero = async (itemId) => {
    if (!activeHeroId) {
      setError('Selecciona un héroe activo para equipar.');
      return;
    }
    setEquipping(itemId);
    setError('');
    setSuccess('');
    try {
      await equipHeroAccessory(token, activeHeroId, itemId);
      setSuccess('¡Accesorio equipado en el héroe!');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al equipar.');
    } finally {
      setEquipping('');
    }
  };

  const handleSetBackground = async (bg) => {
    if (!token) return;
    await updateUserBackground(token, bg);
    setUserBackground(bg);
    setSuccess('¡Fondo aplicado!');
  };

  const accesorios = items.filter(i => i.type === 'accessory');
  const fondos = items.filter(i => i.type === 'background');
  const skins = items.filter(i => i.type === 'skin');
  const accesoriosHero = items.filter(i => i.type === 'hero-accessory');

  return (
    <div className="shop-page">
      <h2>Tienda</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <h3>Accesorios</h3>
      <div className="shop-items">
        {accesorios.map(item => (
          <div key={item._id} className="shop-item"
            onMouseEnter={() => setPreviewAcc(item.image)}
            onMouseLeave={() => setPreviewAcc(null)}>
            <PreviewMascota accessoryImg={previewAcc === item.image ? item.image : null} />
            {item.image && <img src={item.image} alt={item.name} className="shop-item-img" />}
            <h3>{item.name}</h3>
            <p>Precio: <b>{item.price}</b> 🪙</p>
            <button onClick={() => handleBuy(item._id)} disabled={buying === item._id || !token}>
              {buying === item._id ? 'Comprando...' : 'Comprar'}
            </button>
            <button onClick={() => handleEquip(item._id)} disabled={equipping === item._id || !token}>
              {equipping === item._id ? 'Equipando...' : 'Equipar'}
            </button>
          </div>
        ))}
      </div>
      <h3>Accesorios para Héroes</h3>
      <div className="shop-items">
        {accesoriosHero.map(item => (
          <div key={item._id} className="shop-item"
            onMouseEnter={() => setPreviewAcc(item.image)}
            onMouseLeave={() => setPreviewAcc(null)}>
            <PreviewHero accessoryImg={previewAcc === item.image ? item.image : null} />
            {item.image && <img src={item.image} alt={item.name} className="shop-item-img" />}
            <h3>{item.name}</h3>
            <p>Precio: <b>{item.price}</b> 🪙</p>
            <button onClick={() => handleBuy(item._id)} disabled={buying === item._id || !token}>
              {buying === item._id ? 'Comprando...' : 'Comprar'}
            </button>
            <button onClick={() => handleEquipHero(item._id)} disabled={equipping === item._id || !token}>
              {equipping === item._id ? 'Equipando...' : 'Equipar'}
            </button>
          </div>
        ))}
      </div>
      <h3>Fondos</h3>
      <div className="shop-items">
        {fondos.map(item => (
          <div key={item._id} className="shop-item">
            {item.image && <img src={item.image} alt={item.name} className="shop-item-img" />}
            <h3>{item.name}</h3>
            <p>Precio: <b>{item.price}</b> 🪙</p>
            <button onClick={() => handleBuy(item._id)} disabled={buying === item._id || !token}>
              {buying === item._id ? 'Comprando...' : 'Comprar'}
            </button>
            <button onClick={() => handleSetBackground(item.image)} disabled={userBackground === item.image}>
              {userBackground === item.image ? 'Aplicado' : 'Aplicar'}
            </button>
          </div>
        ))}
      </div>
      <h3>Skins</h3>
      <div className="shop-items">
        {skins.map(item => (
          <div key={item._id} className="shop-item">
            {item.image && <img src={item.image} alt={item.name} className="shop-item-img" />}
            <h3>{item.name}</h3>
            <p>Precio: <b>{item.price}</b> 🪙</p>
            <button onClick={() => handleBuy(item._id)} disabled={buying === item._id || !token}>
              {buying === item._id ? 'Comprando...' : 'Comprar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop; 