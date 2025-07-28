import React, { useEffect, useState } from 'react';
import { getHeroRanking, getUserProfile, getHeroProfile, sendHeroPraise } from '../api';
import Loader from '../components/Loader';
import './Ranking.css';

function HeroProfileModal({ hero, onClose }) {
  const [perfil, setPerfil] = React.useState(null);
  const [elogio, setElogio] = React.useState('');
  const [elogioMsg, setElogioMsg] = React.useState('');
  React.useEffect(() => {
    if (!hero) return;
    getHeroProfile(hero._id).then(setPerfil);
  }, [hero]);
  const handleElogio = async () => {
    if (!elogio || elogio.length < 2) return;
    await sendHeroPraise(hero._id, elogio);
    setElogioMsg('¡Elogio enviado!');
    setElogio('');
    // Refrescar elogios
    getHeroProfile(hero._id).then(setPerfil);
    setTimeout(() => setElogioMsg(''), 2000);
  };
  if (!hero) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 280, maxWidth: '90vw', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', position: 'relative' }}>
        <button className="btn-main btn-cancel" onClick={onClose} style={{ position: 'absolute', top: 12, right: 12 }}>Cerrar</button>
        <div style={{ textAlign: 'center' }}>
          <img src={hero.avatar} alt={hero.name} style={{ width: 90, height: 90, borderRadius: '50%', background: '#eee', marginBottom: 12 }} />
          <h2>{hero.name}</h2>
          <div><b>Equipo:</b> {hero.team || 'Independiente'}</div>
          <div><b>Monedas:</b> 🪙 {hero.coins}</div>
          {perfil && (
            <>
              <div style={{ marginTop: 16 }}><b>Mascotas:</b></div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {perfil.mascotas && perfil.mascotas.length > 0 ? perfil.mascotas.map(m => (
                  <div key={m._id} style={{ background: '#f8f8f8', borderRadius: 8, padding: 8, minWidth: 60, textAlign: 'center' }}>
                    <img src={m.type === 'Gato' ? '/assets/cat_normal.png' : '/assets/dog_normal.png'} alt={m.type} style={{ width: 36, height: 36 }} />
                    <div style={{ fontSize: 13 }}>{m.name}</div>
                  </div>
                )) : <span style={{ color: '#aaa' }}>Sin mascotas</span>}
              </div>
              <div style={{ marginTop: 16 }}><b>Logros destacados:</b></div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {perfil.logros && perfil.logros.length > 0 ? perfil.logros.map((l, i) => (
                  <div key={i} style={{ background: '#eaffea', borderRadius: 8, padding: 8, minWidth: 60, textAlign: 'center' }}>
                    <span style={{ fontSize: 22 }}>{l.icon}</span>
                    <div style={{ fontSize: 13 }}>{l.name}</div>
                  </div>
                )) : <span style={{ color: '#aaa' }}>Sin logros</span>}
              </div>
              <div style={{ marginTop: 16 }}><b>Enviar elogio:</b></div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                <input value={elogio} onChange={e => setElogio(e.target.value)} maxLength={60} placeholder="¡Felicidades!" style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc', minWidth: 120 }} />
                <button className="btn-main" onClick={handleElogio} disabled={!elogio || elogio.length < 2}>Enviar</button>
              </div>
              {elogioMsg && <div style={{ color: 'green', marginBottom: 8 }}>{elogioMsg}</div>}
              <div style={{ marginTop: 16 }}><b>Últimos elogios recibidos:</b></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', maxHeight: 120, overflowY: 'auto' }}>
                {perfil.elogios && perfil.elogios.length > 0 ? perfil.elogios.map((e, i) => (
                  <div key={i} style={{ background: '#f1f8e9', borderRadius: 8, padding: 6, minWidth: 120, fontSize: 14 }}>
                    <span style={{ color: '#2ecc40', fontWeight: 'bold' }}>“</span>{e.mensaje}<span style={{ color: '#2ecc40', fontWeight: 'bold' }}>”</span>
                    {e.autor && <span style={{ color: '#888', marginLeft: 8 }}>- {e.autor}</span>}
                  </div>
                )) : <span style={{ color: '#aaa' }}>Sin elogios</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Ranking({ token }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [profileHero, setProfileHero] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getHeroRanking();
        setRanking(data);
        if (token) {
          const user = await getUserProfile(token);
          if (user.heroes && user.heroes.length > 0) setUserId(user.heroes[0]._id);
        }
      } catch (err) {
        setError('Error al cargar ranking.');
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [token]);

  return (
    <div className="ranking-container">
      <h2>Ranking de Jugadores</h2>
      {loading && <Loader />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <HeroProfileModal hero={profileHero} onClose={() => setProfileHero(null)} />
      <table className="ranking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Avatar</th>
            <th>Nombre</th>
            <th>Equipo</th>
            <th>Monedas</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((hero, i) => (
            <tr key={hero._id} className={userId === hero._id ? 'top-player' : ''} onClick={() => setProfileHero(hero)} style={{ cursor: 'pointer' }}>
              <td>{i + 1}</td>
              <td><img src={hero.avatar} alt={hero.name} className="ranking-avatar" /></td>
              <td>{hero.name}</td>
              <td>{hero.team || 'Independiente'}</td>
              <td>🪙 {hero.coins}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {ranking.length === 0 && !loading && <p>No hay jugadores en el ranking.</p>}
    </div>
  );
} 