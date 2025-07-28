import React, { useEffect, useState } from 'react';
import { getUserMissions, claimMissionReward, generateMissions } from '../api';
import './Missions.css';

export default function Missions({ token }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claiming, setClaiming] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMissions();
  }, [token]);

  const fetchMissions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserMissions(token);
      setMissions(data);
    } catch (err) {
      setError('Error al cargar misiones.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (missionId) => {
    setClaiming(missionId);
    setError('');
    setSuccess('');
    try {
      const result = await claimMissionReward(missionId, token);
      setSuccess(`¡Recompensa reclamada! +${result.coinReward} monedas`);
      fetchMissions(); // Recargar misiones
    } catch (err) {
      setError(err.response?.data?.error || 'Error al reclamar recompensa.');
    } finally {
      setClaiming('');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleGenerateMissions = async () => {
    setLoading(true);
    setError('');
    try {
      await generateMissions(token);
      fetchMissions();
      setSuccess('¡Nuevas misiones generadas!');
    } catch (err) {
      setError('Error al generar misiones.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#2ecc40';
      case 'medium': return '#f39c12';
      case 'hard': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) return <div className="missions-container"><p>Cargando misiones...</p></div>;

  return (
    <div className="missions-container">
      <div className="missions-header">
        <h2>📋 Misiones Diarias</h2>
        <button 
          className="btn-generate" 
          onClick={handleGenerateMissions}
          disabled={loading}
        >
          🔄 Generar Nuevas
        </button>
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <div className="missions-grid">
        {missions.length === 0 ? (
          <div className="no-missions">
            <p>No tienes misiones activas.</p>
            <button className="btn-generate" onClick={handleGenerateMissions}>
              Generar Misiones
            </button>
          </div>
        ) : (
          missions.map(mission => (
            <div 
              key={mission._id} 
              className={`mission-card ${mission.completed ? 'completed' : 'active'}`}
            >
              <div className="mission-header">
                <div className="mission-icon">{mission.icon}</div>
                <div className="mission-info">
                  <h3>{mission.title}</h3>
                  <p>{mission.description}</p>
                </div>
                <div 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(mission.difficulty) }}
                >
                  {mission.difficulty}
                </div>
              </div>
              
              <div className="mission-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${mission.progressPercent}%` }}
                  ></div>
                </div>
                <span>{mission.currentProgress}/{mission.goal}</span>
              </div>
              
              <div className="mission-reward">
                <span>🎁 +{mission.coinReward} monedas</span>
              </div>
              
              {mission.completed && !mission.claimed && (
                <button 
                  className="btn-claim"
                  onClick={() => handleClaim(mission._id)}
                  disabled={claiming === mission._id}
                >
                  {claiming === mission._id ? 'Reclamando...' : 'Reclamar Recompensa'}
                </button>
              )}
              
              {mission.claimed && (
                <div className="claimed-badge">✅ Reclamado</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 