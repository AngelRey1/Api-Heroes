import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getUserMissions, claimMissionReward, generateMissions } from '../api';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import './Missions.css';

const Missions = () => {
  const { token, updateCoins } = useUser();
  const { playClick, playCoin, playCelebrate } = useSoundEffects();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  useEffect(() => {
    fetchMissions();
  }, [token]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const missionsData = await getUserMissions(token);
      setMissions(missionsData);
    } catch (err) {
      console.error('Error fetching missions:', err);
      setNotification({ message: 'Error al cargar misiones', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (missionId) => {
    try {
      setClaiming(true);
      playClick();
      
      const result = await claimMissionReward(missionId, token);
      updateCoins(result.coinsEarned || 0);
      
      setNotification({ 
        message: `¡Recompensa reclamada! +${result.coinsEarned} monedas`, 
        type: 'success' 
      });
      
      playCoin();
      if (result.coinsEarned > 50) {
        playCelebrate();
      }
      
      // Recargar misiones
      await fetchMissions();
    } catch (err) {
      console.error('Error claiming reward:', err);
      setNotification({ message: 'Error al reclamar recompensa', type: 'error' });
    } finally {
      setClaiming(false);
    }
  };

  const handleGenerateMissions = async () => {
    try {
      setLoading(true);
      playClick();
      
      await generateMissions(token);
      await fetchMissions();
      
      setNotification({ 
        message: '¡Nuevas misiones generadas!', 
        type: 'success' 
      });
    } catch (err) {
      console.error('Error generating missions:', err);
      setNotification({ message: 'Error al generar misiones', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getMissionIcon = (type) => {
    switch (type) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'achievement': return '🏆';
      case 'social': return '👥';
      case 'game': return '🎮';
      case 'pet': return '🐾';
      case 'hero': return '🦸‍♂️';
      case 'shop': return '🛒';
      default: return '📋';
    }
  };

  const getMissionColor = (type) => {
    switch (type) {
      case 'daily': return '#FFB6C1';
      case 'weekly': return '#87CEEB';
      case 'achievement': return '#FFD700';
      case 'social': return '#DDA0DD';
      case 'game': return '#90EE90';
      case 'pet': return '#F0E68C';
      case 'hero': return '#FFA07A';
      case 'shop': return '#98FB98';
      default: return '#FFE4E1';
    }
  };

  const getProgressPercentage = (mission) => {
    if (!mission.progress || !mission.target) return 0;
    return Math.min((mission.progress / mission.target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="missions-container">
        <div className="loading-message">
          <div className="loading-spinner">📋</div>
          <p>Cargando misiones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="missions-container">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'info' })} 
      />

      {/* Header */}
      <div className="missions-header">
        <h1>📋 Misiones</h1>
        <button 
          className="generate-btn"
          onClick={handleGenerateMissions}
          disabled={loading}
        >
          🔄 Generar Nuevas
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="missions-stats">
        <div className="stat-item">
          <span className="stat-icon">📋</span>
          <span className="stat-label">Total:</span>
          <span className="stat-value">{missions.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">✅</span>
          <span className="stat-label">Completadas:</span>
          <span className="stat-value">
            {missions.filter(m => m.completed).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💰</span>
          <span className="stat-label">Recompensas:</span>
          <span className="stat-value">
            {missions.filter(m => m.completed && !m.claimed).length}
          </span>
        </div>
      </div>

      {/* Grid de misiones */}
      <div className="missions-grid">
        {missions.length === 0 ? (
          <div className="no-missions">
            <div className="no-missions-icon">📋</div>
            <h3>No hay misiones disponibles</h3>
            <p>¡Genera nuevas misiones para comenzar!</p>
            <button 
              className="generate-btn-large"
              onClick={handleGenerateMissions}
              disabled={loading}
            >
              🔄 Generar Misiones
            </button>
          </div>
        ) : (
          missions.map(mission => (
            <div 
              key={mission._id} 
              className={`mission-card ${mission.completed ? 'completed' : ''}`}
              style={{ backgroundColor: getMissionColor(mission.type) }}
            >
              <div className="mission-header">
                <div className="mission-icon">
                  {getMissionIcon(mission.type)}
                </div>
                <div className="mission-info">
                  <h3 className="mission-title">{mission.title}</h3>
                  <p className="mission-description">{mission.description}</p>
                </div>
                <div className="mission-status">
                  {mission.completed ? (
                    <span className="status-completed">✅</span>
                  ) : (
                    <span className="status-pending">⏳</span>
                  )}
                </div>
              </div>

              <div className="mission-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getProgressPercentage(mission)}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {mission.progress || 0} / {mission.target}
                </div>
              </div>

              <div className="mission-reward">
                <div className="reward-info">
                  <span className="reward-icon">💰</span>
                  <span className="reward-amount">{mission.reward} monedas</span>
                </div>
                
                {mission.completed && !mission.claimed && (
                  <button
                    className="claim-btn"
                    onClick={() => handleClaimReward(mission._id)}
                    disabled={claiming}
                  >
                    {claiming ? 'Reclamando...' : 'Reclamar'}
                  </button>
                )}
                
                {mission.claimed && (
                  <span className="claimed-badge">✅ Reclamado</span>
                )}
              </div>

              {mission.deadline && (
                <div className="mission-deadline">
                  <span className="deadline-icon">⏰</span>
                  <span className="deadline-text">
                    Expira: {new Date(mission.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Información adicional */}
      <div className="missions-info">
        <div className="info-card">
          <h3>💡 Tipos de Misiones</h3>
          <div className="mission-types">
            <div className="type-item">
              <span className="type-icon">📅</span>
              <span className="type-name">Diarias</span>
              <span className="type-desc">Se renuevan cada día</span>
            </div>
            <div className="type-item">
              <span className="type-icon">📆</span>
              <span className="type-name">Semanales</span>
              <span className="type-desc">Se renuevan cada semana</span>
            </div>
            <div className="type-item">
              <span className="type-icon">🏆</span>
              <span className="type-name">Logros</span>
              <span className="type-desc">Basadas en logros</span>
            </div>
            <div className="type-item">
              <span className="type-icon">👥</span>
              <span className="type-name">Sociales</span>
              <span className="type-desc">Interactuar con amigos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions; 