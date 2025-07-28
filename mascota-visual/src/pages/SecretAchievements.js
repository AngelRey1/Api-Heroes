import React, { useEffect, useState } from 'react';
import { getSecretAchievements } from '../api';

function SecretAchievements({ token }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getSecretAchievements(token);
        setAchievements(data);
      } catch (err) {
        setError('Error al cargar logros secretos.');
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [token]);

  return (
    <div className="secret-achievements-page">
      <h2>Logros Secretos Desbloqueados</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="secret-achievements-list">
        {achievements.length === 0 && !loading && <p>No has desbloqueado logros secretos aún.</p>}
        {achievements.map(a => (
          <div key={a._id} className="secret-achievement-item unlocked-anim">
            <span className="secret-achievement-icon">✨</span>
            <b>{a.name}</b>
            <div>{a.description}</div>
            {a.reward && <div className="secret-achievement-reward">Recompensa: {JSON.stringify(a.reward)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SecretAchievements; 