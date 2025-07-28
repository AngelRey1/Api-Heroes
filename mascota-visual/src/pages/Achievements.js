import React, { useEffect, useState } from 'react';
import { getUserAchievements } from '../api';
import './Achievements.css';

export default function Achievements({ token }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getUserAchievements(token);
        setAchievements(data);
      } catch (err) {
        setError('Error al cargar logros.');
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [token]);

  if (loading) return <div className="achievements-container"><p>Cargando logros...</p></div>;
  if (error) return <div className="achievements-container"><p style={{ color: 'red' }}>{error}</p></div>;

  return (
    <div className="achievements-container">
      <h2>🏆 Logros</h2>
      <div className="achievements-grid">
        {achievements.length === 0 ? (
          <p>No hay logros disponibles.</p>
        ) : (
          achievements.map(achievement => (
            <div 
              key={achievement._id} 
              className={`achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${achievement.progressPercent}%` }}
                    ></div>
                  </div>
                  <span>{achievement.currentProgress}/{achievement.requiredProgress}</span>
                </div>
                {achievement.isUnlocked && (
                  <div className="achievement-reward">
                    <span>🎁 +{achievement.coinReward} monedas</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 