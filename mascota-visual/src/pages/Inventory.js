import React, { useEffect, useState } from 'react';
import { getInventory, useItem } from '../api';
import './Inventory.css';

export default function Inventory({ token, onUse, mascotas, onPetUpdate }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [using, setUsing] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getInventory(token);
        setInventory(data);
      } catch (err) {
        setError('Error al cargar inventario.');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [token]);

  const handleUse = async (itemId, petId) => {
    setUsing(itemId);
    setError('');
    setSuccess('');
    try {
      const res = await useItem(itemId, token, petId);
      setSuccess('¡Objeto usado!');
      setInventory(res.inventory);
      if (onPetUpdate && res.pet) onPetUpdate(res.pet);
      if (onUse) onUse();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al usar objeto.');
    } finally {
      setUsing('');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  return (
    <div className="inventory-container">
      <h2>Inventario</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div className="inventory-list">
        {inventory.length === 0 && !loading && <p>No tienes objetos en el inventario.</p>}
        {inventory.map(item => (
          <div key={item.itemId._id || item.itemId} className="inventory-card">
            <div className="inventory-name">{item.itemId.name}</div>
            <div className="inventory-qty">Cantidad: {item.quantity}</div>
            <button className="btn-main" onClick={() => handleUse(item.itemId._id || item.itemId, mascotas?.[0]?._id)} disabled={using === (item.itemId._id || item.itemId)}>
              Usar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 