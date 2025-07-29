import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getUserStatistics, getComparativeStatistics, getUserActivityHistory, getUserRecommendations } from '../api';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import './Statistics.css';

const Statistics = () => {
  const { token } = useUser();
  const { playClick } = useSoundEffects();
  const [stats, setStats] = useState(null);
  const [comparative, setComparative] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  useEffect(() => {
    fetchStatistics();
  }, [token, selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas del usuario
      const userStats = await getUserStatistics(token);
      setStats(userStats);
      
      // Obtener estadísticas comparativas
      const compStats = await getComparativeStatistics(token);
      setComparative(compStats);
      
      // Obtener historial de actividad
      const activity = await getUserActivityHistory(selectedPeriod, token);
      setActivityHistory(activity);
      
      // Obtener recomendaciones
      const recs = await getUserRecommendations(token);
      setRecommendations(recs);
      
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setNotification({ message: 'Error al cargar estadísticas', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatIcon = (statType) => {
    switch (statType) {
      case 'pets': return '🐾';
      case 'heroes': return '🦸‍♂️';
      case 'games': return '🎮';
      case 'achievements': return '🏆';
      case 'coins': return '💰';
      case 'time': return '⏰';
      default: return '📊';
    }
  };

  const getStatColor = (statType) => {
    switch (statType) {
      case 'pets': return '#FFB6C1';
      case 'heroes': return '#87CEEB';
      case 'games': return '#DDA0DD';
      case 'achievements': return '#FFD700';
      case 'coins': return '#90EE90';
      case 'time': return '#F0E68C';
      default: return '#FFE4E1';
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="statistics-container">
        <div className="loading-message">
          <div className="loading-spinner">📊</div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'info' })} 
      />

      {/* Header */}
      <div className="stats-header">
        <h1>📊 Estadísticas</h1>
        <div className="period-selector">
          <label>Período:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => {
              setSelectedPeriod(parseInt(e.target.value));
              playClick();
            }}
          >
            <option value={7}>7 días</option>
            <option value={30}>30 días</option>
            <option value={90}>90 días</option>
          </select>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card" style={{ backgroundColor: getStatColor('pets') }}>
          <div className="stat-icon">🐾</div>
          <div className="stat-info">
            <h3>Mascotas</h3>
            <div className="stat-value">{stats?.pets?.total || 0}</div>
            <div className="stat-detail">Creadas: {stats?.pets?.created || 0}</div>
          </div>
        </div>

        <div className="stat-card" style={{ backgroundColor: getStatColor('heroes') }}>
          <div className="stat-icon">🦸‍♂️</div>
          <div className="stat-info">
            <h3>Héroes</h3>
            <div className="stat-value">{stats?.heroes?.total || 0}</div>
            <div className="stat-detail">Nivel: {stats?.heroes?.level || 1}</div>
          </div>
        </div>

        <div className="stat-card" style={{ backgroundColor: getStatColor('games') }}>
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <h3>Juegos</h3>
            <div className="stat-value">{stats?.games?.played || 0}</div>
            <div className="stat-detail">Mejor: {stats?.games?.bestScore || 0}</div>
          </div>
        </div>

        <div className="stat-card" style={{ backgroundColor: getStatColor('achievements') }}>
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3>Logros</h3>
            <div className="stat-value">{stats?.achievements?.unlocked || 0}</div>
            <div className="stat-detail">Total: {stats?.achievements?.total || 0}</div>
          </div>
        </div>

        <div className="stat-card" style={{ backgroundColor: getStatColor('coins') }}>
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Monedas</h3>
            <div className="stat-value">{stats?.coins?.current || 0}</div>
            <div className="stat-detail">Ganadas: {stats?.coins?.earned || 0}</div>
          </div>
        </div>

        <div className="stat-card" style={{ backgroundColor: getStatColor('time') }}>
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>Tiempo</h3>
            <div className="stat-value">{formatTime(stats?.time?.total || 0)}</div>
            <div className="stat-detail">Promedio: {formatTime(stats?.time?.average || 0)}</div>
          </div>
        </div>
      </div>

      {/* Comparativas */}
      {comparative && (
        <div className="comparative-section">
          <h2>📈 Comparativas</h2>
          <div className="comparative-grid">
            <div className="comparative-card">
              <h3>🎯 Rendimiento</h3>
              <div className="comparative-item">
                <span>Tu puntuación:</span>
                <span className="comparative-value">{comparative.performance?.user || 0}</span>
              </div>
              <div className="comparative-item">
                <span>Promedio:</span>
                <span className="comparative-value">{comparative.performance?.average || 0}</span>
              </div>
              <div className="comparative-item">
                <span>Mejor:</span>
                <span className="comparative-value">{comparative.performance?.best || 0}</span>
              </div>
            </div>

            <div className="comparative-card">
              <h3>🏆 Ranking</h3>
              <div className="comparative-item">
                <span>Tu posición:</span>
                <span className="comparative-value">#{comparative.ranking?.position || 'N/A'}</span>
              </div>
              <div className="comparative-item">
                <span>Total jugadores:</span>
                <span className="comparative-value">{comparative.ranking?.total || 0}</span>
              </div>
              <div className="comparative-item">
                <span>Percentil:</span>
                <span className="comparative-value">{comparative.ranking?.percentile || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial de actividad */}
      {activityHistory.length > 0 && (
        <div className="activity-section">
          <h2>📅 Actividad Reciente</h2>
          <div className="activity-timeline">
            {activityHistory.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {getStatIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h2>💡 Recomendaciones</h2>
          <div className="recommendations-grid">
            {recommendations.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <div className="recommendation-icon">💡</div>
                <h4>{rec.title}</h4>
                <p>{rec.description}</p>
                {rec.reward && (
                  <div className="recommendation-reward">
                    Recompensa: {rec.reward}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics; 