import React, { useState } from 'react';
import './PetCustomization.css';
import { customizePet } from '../api';

const colores = ['#FFD700', '#FF69B4', '#87CEEB', '#90EE90', '#FFA07A'];
const formas = [
  { label: 'Clásico', value: 'normal' },
  { label: 'Orejas grandes', value: 'big-ears' },
  { label: 'Cuerpo redondo', value: 'round-body' },
  { label: 'Cola larga', value: 'long-tail' }
];

export default function PetCustomization({ pet, token, onClose, onUpdated }) {
  const [color, setColor] = useState(pet.color || colores[0]);
  const [forma, setForma] = useState(pet.forma || formas[0].value);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Simulación visual: solo cambia el color y la forma de la imagen
  const getPetImg = () => {
    let src = '/assets/dog_normal.svg';
    if (pet.type === 'Gato') src = '/assets/cat_normal.svg';
    // Aquí podrías cambiar la imagen según la forma seleccionada si tienes recursos
    return src;
  };

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await customizePet(pet._id, token, { color, forma });
      setSuccess('¡Personalización guardada!');
      if (onUpdated) onUpdated();
    } catch (err) {
      setError('Error al guardar la personalización.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  return (
    <div className="pet-custom-modal">
      <div className="pet-custom-content">
        <button className="btn-main btn-cancel" onClick={onClose} style={{ float: 'right' }}>Cerrar</button>
        <h3>Personaliza tu mascota</h3>
        <div className="pet-custom-preview" style={{ background: color }}>
          <img src={getPetImg()} alt="Mascota" className={`pet-custom-img pet-forma-${forma}`} />
        </div>
        <form onSubmit={handleSave}>
          <label>Color</label>
          <div className="pet-custom-colors">
            {colores.map(c => (
              <span key={c} className="pet-color-swatch" style={{ background: c, border: color === c ? '2px solid #333' : '1px solid #ccc' }} onClick={() => setColor(c)} />
            ))}
          </div>
          <label>Forma</label>
          <select value={forma} onChange={e => setForma(e.target.value)}>
            {formas.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <button className="btn-main" type="submit" disabled={loading}>Guardar</button>
          {success && <div className="success-msg">{success}</div>}
          {error && <div className="error-msg">{error}</div>}
        </form>
      </div>
    </div>
  );
} 