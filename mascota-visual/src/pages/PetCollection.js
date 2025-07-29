import React, { useEffect, useState } from 'react';
import { getPets, createPet } from '../api';
import Loader from '../components/Loader';
import './PetCollection.css';
import PetCustomization from './PetCustomization'; // Assuming PetCustomization is in the same directory

const petAvatars = {
  Perro: '/assets/dog_normal.svg',
  Gato: '/assets/cat_normal.svg',
};

export default function PetCollection({ token, activePetId, onActiveChange }) {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Perro');
  const [superPower, setSuperPower] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showCustomize, setShowCustomize] = useState(null); // id de la mascota a personalizar

  useEffect(() => {
    const fetchMascotas = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getPets(token);
        setMascotas(data);
      } catch (err) {
        setError('Error al cargar mascotas.');
      } finally {
        setLoading(false);
      }
    };
    fetchMascotas();
  }, [token]);

  const handleCreate = async e => {
    e.preventDefault();
    if (!name || !superPower) {
      setError('Completa todos los campos');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await createPet(token, { name, type, superPower });
      setSuccess('¡Mascota creada!');
      setShowForm(false);
      setName('');
      setSuperPower('');
      // Recargar mascotas
      const data = await getPets(token);
      setMascotas(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear mascota.');
    }
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="pet-collection-container">
      <h2>Mis Mascotas</h2>
      {loading && <Loader />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div className="pet-list">
        {mascotas.length === 0 && !loading && <p>No tienes mascotas aún.</p>}
        {mascotas.map(m => (
          <div key={m._id} className={`pet-card${activePetId === m._id ? ' active' : ''}`} onClick={() => onActiveChange && onActiveChange(m._id)}>
            <img src={petAvatars[m.type] || petAvatars['Perro']} alt={m.type} className="pet-avatar" />
            <div className="pet-info">
              <div className="pet-name">{m.name}</div>
              <div className="pet-type">{m.type}</div>
              <div className="pet-superpower">{m.superPower}</div>
              <button className="btn-main" type="button" onClick={e => { e.stopPropagation(); setShowCustomize(m); }}>Personalizar</button>
            </div>
          </div>
        ))}
        <div className="pet-card add-pet" onClick={() => setShowForm(true)}>
          <span className="add-icon">＋</span>
          <div>Agregar mascota</div>
        </div>
      </div>
      {/* Modal de personalización */}
      {showCustomize && (
        <PetCustomization pet={showCustomize} token={token} onClose={() => setShowCustomize(null)} onUpdated={async () => {
          setShowCustomize(null);
          const data = await getPets(token);
          setMascotas(data);
        }} />
      )}
      {showForm && (
        <form className="pet-form" onSubmit={handleCreate}>
          <h3>Crear nueva mascota</h3>
          <label>Nombre</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
          <label>Tipo</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
          </select>
          <label>Superpoder</label>
          <input value={superPower} onChange={e => setSuperPower(e.target.value)} required />
          <button className="btn-main" type="submit">Crear</button>
          <button className="btn-main btn-cancel" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          {success && <div className="success-msg">{success}</div>}
          {error && <div className="error-msg">{error}</div>}
        </form>
      )}
    </div>
  );
} 