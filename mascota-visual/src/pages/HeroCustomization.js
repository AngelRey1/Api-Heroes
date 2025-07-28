import React, { useEffect, useState } from 'react';
import { getUserProfile, updateHero } from '../api';
import './HeroCustomization.css';

const avatars = [
  '/assets/hero.png',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=hero1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=hero2',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=hero3'
];

const colores = ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6'];

export default function HeroCustomization({ hero: heroProp, token }) {
  const [hero, setHero] = useState(heroProp || null);
  const [name, setName] = useState(heroProp?.name || '');
  const [team, setTeam] = useState(heroProp?.team || '');
  const [avatar, setAvatar] = useState(heroProp?.avatar || avatars[0]);
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
            setHero(user.heroes[0]);
            setName(user.heroes[0].name);
            setTeam(user.heroes[0].team || '');
            setAvatar(user.heroes[0].avatar || avatars[0]);
            setColor(user.heroes[0].color || colores[0]);
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

  const handleSave = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      if (!hero) throw new Error('No hay héroe para actualizar');
      await updateHero(token, hero._id, { name, team, avatar, color });
      setSuccess('¡Héroe actualizado!');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al guardar.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  return (
    <div className="hero-custom-container">
      <h2>Personaliza tu Héroe</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className="hero-custom-form" onSubmit={handleSave}>
        <div className="avatar-select" style={{ background: color, borderRadius: 12, padding: 12, marginBottom: 12 }}>
          {avatars.map((av, i) => (
            <img
              key={i}
              src={av}
              alt={`Avatar ${i+1}`}
              className={`avatar-img${avatar === av ? ' selected' : ''}`}
              onClick={() => setAvatar(av)}
            />
          ))}
        </div>
        <label>Color de fondo</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {colores.map(c => (
            <span key={c} style={{ background: c, width: 28, height: 28, borderRadius: '50%', border: color === c ? '2px solid #333' : '1px solid #ccc', cursor: 'pointer' }} onClick={() => setColor(c)} />
          ))}
        </div>
        <label>Nombre</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
        <label>Equipo</label>
        <input value={team} onChange={e => setTeam(e.target.value)} />
        <button className="btn-main" type="submit" disabled={loading}>Guardar</button>
        {success && <div className="success-msg">{success}</div>}
      </form>
    </div>
  );
} 