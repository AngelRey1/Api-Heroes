import React, { useEffect, useState } from 'react';
import { getUserProfile, updateHero, createHero } from '../api';
import './HeroCustomization.css';

const heroAvatars = [
  '/assets/hero.svg',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=hero1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=hero2',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=hero3',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=hero4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=hero5'
];

const colores = ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22', '#1abc9c', '#34495e'];

const teams = ['Avengers', 'Justice League', 'X-Men', 'Fantastic Four', 'Guardians', 'Solo'];

export default function HeroCustomization({ hero: heroProp, token }) {
  const [hero, setHero] = useState(heroProp || null);
  const [name, setName] = useState(heroProp?.name || '');
  const [team, setTeam] = useState(heroProp?.team || teams[0]);
  const [avatar, setAvatar] = useState(heroProp?.avatar || heroAvatars[0]);
  const [color, setColor] = useState(heroProp?.color || colores[0]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!heroProp && token) {
      const fetchHero = async () => {
        setLoading(true);
        setError('');
        try {
          const user = await getUserProfile(token);
          if (user.heroes && user.heroes.length > 0) {
            const userHero = user.heroes[0];
            setHero(userHero);
            setName(userHero.name || '');
            setTeam(userHero.team || teams[0]);
            setAvatar(userHero.avatar || heroAvatars[0]);
            setColor(userHero.color || colores[0]);
          }
        } catch (err) {
          setError('Error al cargar héroe.');
        } finally {
          setLoading(false);
        }
      };
      fetchHero();
    }
  }, [heroProp, token]);

  // Validar que tenemos token DESPUÉS de los hooks
  if (!token) {
    return (
      <div className="hero-custom-container">
        <h2>⚡ Personaliza tu Héroe</h2>
        <p className="error-message">Debes iniciar sesión para personalizar tu héroe.</p>
      </div>
    );
  }

  const handleSave = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    
    try {
      if (!name.trim()) {
        throw new Error('El nombre del héroe es requerido');
      }

      if (hero && hero._id) {
        // Actualizar héroe existente
        await updateHero(token, hero._id, { name, team, avatar, color });
        setSuccess('¡Héroe actualizado exitosamente!');
      } else {
        // Crear nuevo héroe
        const newHero = await createHero(token, { name, team, avatar, color });
        setHero(newHero);
        setSuccess('¡Héroe creado exitosamente!');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al guardar.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="hero-custom-container">
      <h2>⚡ Personaliza tu Héroe</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <form className="hero-custom-form" onSubmit={handleSave}>
        <div className="form-section">
          <h3>🎭 Avatar</h3>
          <div className="avatar-grid">
            {heroAvatars.map((av, i) => (
              <img
                key={i}
                src={av}
                alt={`Avatar ${i+1}`}
                className={`avatar-option ${avatar === av ? 'selected' : ''}`}
                onClick={() => setAvatar(av)}
              />
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>🎨 Color de Fondo</h3>
          <div className="color-grid">
            {colores.map(c => (
              <div
                key={c}
                className={`color-option ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>🏆 Equipo</h3>
          <select value={team} onChange={e => setTeam(e.target.value)}>
            {teams.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <h3>📝 Nombre del Héroe</h3>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre del héroe"
            required
          />
        </div>

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Héroe'}
        </button>
      </form>
    </div>
  );
} 