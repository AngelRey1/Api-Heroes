import React, { useState, useEffect } from 'react';
import { 
  getUserStatistics, 
  getComparativeStatistics, 
  getGlobalStatistics,
  getUserActivityHistory,
  getUserRecommendations
} from '../api';
import './Statistics.css';

export default function Statistics({ token }) {
  const [userStats, setUserStats] = useState(null);
  const [comparativeStats, setComparativeStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStatistics();
  }, [token]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [stats, comparative, global, history, recs] = await Promise.all([
        getUserStatistics(token),
        getComparativeStatistics(token),
        getGlobalStatistics(),
        getUserActivityHistory(30, token),
        getUserRecommendations(token)
      ]);

      setUserStats(stats);
      setComparativeStats(comparative);
      setGlobalStats(global);
      setActivityHistory(history);
      setRecommendations(recs);
    } catch (err) {
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    if (percentage >= 40) return '#FFC107';
    return '#F44336';
  };

  if (loading) {
    return (
      <div className="statistics-container">
        <div className="loading">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <h1>📊 Estadísticas Avanzadas</h1>
        <p>Analiza tu progreso y rendimiento en el juego</p>
      </div>

      <div className="statistics-content">
        <div className="statistics-sidebar">
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📈 Resumen
            </button>
            <button 
              className={`tab-button ${activeTab === 'comparative' ? 'active' : ''}`}
              onClick={() => setActiveTab('comparative')}
            >
              🏆 Comparativas
            </button>
            <button 
              className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              📅 Actividad
            </button>
            <button 
              className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              💡 Recomendaciones
            </button>
          </div>
        </div>

        <div className="statistics-main">
          {activeTab === 'overview' && userStats && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card general">
                  <h3>🎮 General</h3>
                  <div className="stat-item">
                    <span className="stat-label">Nivel:</span>
                    <span className="stat-value">{userStats.general.level}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Experiencia:</span>
                    <span className="stat-value">{formatNumber(userStats.general.experience)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Monedas:</span>
                    <span className="stat-value">{formatNumber(userStats.general.coins)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Juegos Jugados:</span>
                    <span className="stat-value">{formatNumber(userStats.general.gamesPlayed)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Días Activo:</span>
                    <span className="stat-value">{userStats.general.daysActive}</span>
                  </div>
                </div>

                <div className="stat-card pets">
                  <h3>🐾 Mascotas</h3>
                  <div className="stat-item">
                    <span className="stat-label">Total Mascotas:</span>
                    <span className="stat-value">{userStats.pets.totalPets}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Nivel Promedio:</span>
                    <span className="stat-value">{userStats.pets.averagePetLevel}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Acciones Totales:</span>
                    <span className="stat-value">{formatNumber(userStats.pets.totalPetActions)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tipo Favorito:</span>
                    <span className="stat-value">{userStats.pets.favoritePetType}</span>
                  </div>
                </div>

                <div className="stat-card achievements">
                  <h3>🏆 Logros</h3>
                  <div className="stat-item">
                    <span className="stat-label">Total Logros:</span>
                    <span className="stat-value">{userStats.achievements.totalAchievements}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Logros Secretos:</span>
                    <span className="stat-value">{userStats.achievements.secretAchievements}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Progreso:</span>
                    <span className="stat-value">{userStats.achievements.achievementProgress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${userStats.achievements.achievementProgress}%`,
                        backgroundColor: getProgressColor(userStats.achievements.achievementProgress)
                      }}
                    ></div>
                  </div>
                </div>

                <div className="stat-card social">
                  <h3>👥 Social</h3>
                  <div className="stat-item">
                    <span className="stat-label">Amigos:</span>
                    <span className="stat-value">{userStats.social.friendsCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Regalos Enviados:</span>
                    <span className="stat-value">{userStats.social.giftsSent}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Regalos Recibidos:</span>
                    <span className="stat-value">{userStats.social.giftsReceived}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Visitas Recibidas:</span>
                    <span className="stat-value">{userStats.social.visitsReceived}</span>
                  </div>
                </div>

                <div className="stat-card minigames">
                  <h3>🎮 Minijuegos</h3>
                  <div className="stat-item">
                    <span className="stat-label">Juegos Jugados:</span>
                    <span className="stat-value">{formatNumber(userStats.minigames.gamesPlayed)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Puntuación Total:</span>
                    <span className="stat-value">{formatNumber(userStats.minigames.totalScore)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Monedas Ganadas:</span>
                    <span className="stat-value">{formatNumber(userStats.minigames.coinsEarned)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Juego Favorito:</span>
                    <span className="stat-value">{userStats.minigames.favoriteGame}</span>
                  </div>
                </div>

                <div className="stat-card shop">
                  <h3>🛒 Tienda</h3>
                  <div className="stat-item">
                    <span className="stat-label">Compras Totales:</span>
                    <span className="stat-value">{userStats.shop.totalPurchases}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Gastado:</span>
                    <span className="stat-value">{formatNumber(userStats.shop.totalSpent)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tipo Favorito:</span>
                    <span className="stat-value">{userStats.shop.favoriteItemType}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Compra Más Cara:</span>
                    <span className="stat-value">{formatNumber(userStats.shop.mostExpensivePurchase)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparative' && comparativeStats && (
            <div className="comparative-section">
              <h2>🏆 Comparativas con Otros Jugadores</h2>
              
              <div className="comparison-grid">
                <div className="comparison-card">
                  <h3>Nivel</h3>
                  <div className="comparison-info">
                    <span className="rank">#{comparativeStats.comparisons.level.rank}</span>
                    <span className="percentage">Top {comparativeStats.comparisons.level.percentage}%</span>
                  </div>
                  <div className="comparison-bar">
                    <div 
                      className="comparison-fill" 
                      style={{ width: `${comparativeStats.comparisons.level.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="comparison-card">
                  <h3>Monedas</h3>
                  <div className="comparison-info">
                    <span className="rank">#{comparativeStats.comparisons.coins.rank}</span>
                    <span className="percentage">Top {comparativeStats.comparisons.coins.percentage}%</span>
                  </div>
                  <div className="comparison-bar">
                    <div 
                      className="comparison-fill" 
                      style={{ width: `${comparativeStats.comparisons.coins.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="comparison-card">
                  <h3>Logros</h3>
                  <div className="comparison-info">
                    <span className="rank">#{comparativeStats.comparisons.achievements.rank}</span>
                    <span className="percentage">Top {comparativeStats.comparisons.achievements.percentage}%</span>
                  </div>
                  <div className="comparison-bar">
                    <div 
                      className="comparison-fill" 
                      style={{ width: `${comparativeStats.comparisons.achievements.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="global-stats">
                <h3>📊 Estadísticas Globales</h3>
                <div className="global-grid">
                  <div className="global-item">
                    <span className="global-label">Total Jugadores:</span>
                    <span className="global-value">{formatNumber(globalStats.totalUsers)}</span>
                  </div>
                  <div className="global-item">
                    <span className="global-label">Nivel Promedio:</span>
                    <span className="global-value">{globalStats.averageLevel}</span>
                  </div>
                  <div className="global-item">
                    <span className="global-label">Monedas Promedio:</span>
                    <span className="global-value">{formatNumber(globalStats.averageCoins)}</span>
                  </div>
                  <div className="global-item">
                    <span className="global-label">Logros Promedio:</span>
                    <span className="global-value">{globalStats.averageAchievements}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-section">
              <h2>📅 Historial de Actividad (Últimos 30 días)</h2>
              
              <div className="activity-chart">
                {activityHistory.map((day, index) => (
                  <div key={index} className="activity-day">
                    <div className="activity-date">{day.date}</div>
                    <div className="activity-bars">
                      <div 
                        className="activity-bar games" 
                        style={{ height: `${(day.gamesPlayed / 10) * 100}%` }}
                        title={`${day.gamesPlayed} juegos`}
                      ></div>
                      <div 
                        className="activity-bar achievements" 
                        style={{ height: `${(day.achievementsUnlocked / 3) * 100}%` }}
                        title={`${day.achievementsUnlocked} logros`}
                      ></div>
                      <div 
                        className="activity-bar missions" 
                        style={{ height: `${(day.missionsCompleted / 5) * 100}%` }}
                        title={`${day.missionsCompleted} misiones`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="activity-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Juegos:</span>
                  <span className="summary-value">
                    {activityHistory.reduce((sum, day) => sum + day.gamesPlayed, 0)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Logros:</span>
                  <span className="summary-value">
                    {activityHistory.reduce((sum, day) => sum + day.achievementsUnlocked, 0)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Misiones:</span>
                  <span className="summary-value">
                    {activityHistory.reduce((sum, day) => sum + day.missionsCompleted, 0)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Tiempo Total:</span>
                  <span className="summary-value">
                    {activityHistory.reduce((sum, day) => sum + day.timeSpent, 0)} min
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && recommendations && (
            <div className="recommendations-section">
              <h2>💡 Recomendaciones Personalizadas</h2>
              
              <div className="recommendations-grid">
                {recommendations.recommendations.map((rec, index) => (
                  <div key={index} className={`recommendation-card ${rec.priority}`}>
                    <div className="recommendation-icon">
                      {rec.type === 'achievement' && '🏆'}
                      {rec.type === 'social' && '👥'}
                      {rec.type === 'pet' && '🐾'}
                      {rec.type === 'tournament' && '🏆'}
                      {rec.type === 'economy' && '💰'}
                    </div>
                    <div className="recommendation-content">
                      <h4>{rec.title}</h4>
                      <p>{rec.description}</p>
                      <button className="recommendation-action">
                        {rec.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="predictions-section">
                <h3>🔮 Predicciones</h3>
                <div className="predictions-grid">
                  <div className="prediction-card">
                    <h4>Próximo Nivel</h4>
                    <div className="prediction-info">
                      <span>Nivel Actual: {recommendations.predictions.nextLevel.currentLevel}</span>
                      <span>Próximo: {recommendations.predictions.nextLevel.nextLevel}</span>
                      <span>Exp Necesaria: {recommendations.predictions.nextLevel.experienceNeeded}</span>
                    </div>
                  </div>
                  
                  <div className="prediction-card">
                    <h4>Monedas en 1 Semana</h4>
                    <div className="prediction-value">
                      {formatNumber(recommendations.predictions.coinsInWeek)}
                    </div>
                  </div>
                  
                  <div className="prediction-card">
                    <h4>Logros en 1 Mes</h4>
                    <div className="prediction-value">
                      {recommendations.predictions.achievementsInMonth}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 