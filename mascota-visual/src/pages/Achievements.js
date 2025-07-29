import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getUserAchievements, getSecretAchievements, claimAchievementReward } from '../api';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import './Achievements.css';

const Achievements = () => {
  const { token, updateCoins } = useUser();
  const { playClick, playCoin, playCelebrate } = useSoundEffects();
  const [achievements, setAchievements] = useState([]);
  const [secretAchievements, setSecretAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchAchievements();
  }, [token]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      
      // Obtener logros normales
      const achievementsData = await getUserAchievements(token);
      setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
      
      // Obtener logros secretos
      const secretData = await getSecretAchievements(token);
      setSecretAchievements(Array.isArray(secretData) ? secretData : []);
      
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setNotification({ message: 'Error al cargar logros', type: 'error' });
      // Establecer arrays vacíos en caso de error
      setAchievements([]);
      setSecretAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (achievementId) => {
    try {
      setClaiming(true);
      playClick();
      
      const result = await claimAchievementReward(achievementId, token);
      updateCoins(result.coinsEarned || 0);
      
      setNotification({ 
        message: `¡Logro reclamado! +${result.coinsEarned} monedas`, 
        type: 'success' 
      });
      
      playCoin();
      if (result.coinsEarned > 100) {
        playCelebrate();
      }
      
      // Recargar logros
      await fetchAchievements();
    } catch (err) {
      console.error('Error claiming achievement:', err);
      setNotification({ message: 'Error al reclamar logro', type: 'error' });
    } finally {
      setClaiming(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: '🏆' },
    { id: 'pet', name: 'Mascotas', icon: '🐾' },
    { id: 'hero', name: 'Héroes', icon: '🦸‍♂️' },
    { id: 'game', name: 'Juegos', icon: '🎮' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'collection', name: 'Colección', icon: '📦' },
    { id: 'secret', name: 'Secretos', icon: '🔒' }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? [...achievements, ...secretAchievements]
    : selectedCategory === 'secret'
    ? secretAchievements
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'pet': return '🐾';
      case 'hero': return '🦸‍♂️';
      case 'game': return '🎮';
      case 'social': return '👥';
      case 'collection': return '📦';
      case 'secret': return '🔒';
      default: return '🏆';
    }
  };

  const getAchievementColor = (type, unlocked) => {
    if (!unlocked) return '#D3D3D3';
    
    switch (type) {
      case 'pet': return '#FFB6C1';
      case 'hero': return '#87CEEB';
      case 'game': return '#DDA0DD';
      case 'social': return '#90EE90';
      case 'collection': return '#FFD700';
      case 'secret': return '#FFA07A';
      default: return '#FFE4E1';
    }
  };

  const getProgressPercentage = (achievement) => {
    if (!achievement.progress || !achievement.target) return 0;
    return Math.min((achievement.progress / achievement.target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="achievements-container">
        <div className="loading-message">
          <div className="loading-spinner">🏆</div>
          <p>Cargando logros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-container">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'info' })} 
      />

      {/* Header */}
      <div className="achievements-header">
        <h1>🏆 Logros</h1>
        <div className="achievements-stats">
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <span className="stat-label">Desbloqueados:</span>
            <span className="stat-value">
              {achievements.filter(a => a.unlocked).length + secretAchievements.filter(a => a.unlocked).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔒</span>
            <span className="stat-label">Secretos:</span>
            <span className="stat-value">
              {secretAchievements.filter(a => a.unlocked).length}
            </span>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="categories-container">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(category.id);
              playClick();
            }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Grid de logros */}
      <div className="achievements-grid">
        {filteredAchievements.length === 0 ? (
          <div className="no-achievements">
            <div className="no-achievements-icon">🏆</div>
            <h3>No hay logros en esta categoría</h3>
            <p>¡Completa acciones para desbloquear logros!</p>
          </div>
        ) : (
          filteredAchievements.map(achievement => (
            <div 
              key={achievement._id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              style={{ backgroundColor: getAchievementColor(achievement.category, achievement.unlocked) }}
            >
              <div className="achievement-header">
                <div className="achievement-icon">
                  {achievement.unlocked ? getAchievementIcon(achievement.category) : '🔒'}
                </div>
                <div className="achievement-info">
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                </div>
                <div className="achievement-status">
                  {achievement.unlocked ? (
                    achievement.claimed ? (
                      <span className="status-claimed">✅</span>
                    ) : (
                      <span className="status-unclaimed">💰</span>
                    )
                  ) : (
                    <span className="status-locked">🔒</span>
                  )}
                </div>
              </div>

              {!achievement.unlocked && achievement.progress !== undefined && (
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${getProgressPercentage(achievement)}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {achievement.progress || 0} / {achievement.target}
                  </div>
                </div>
              )}

              <div className="achievement-reward">
                <div className="reward-info">
                  <span className="reward-icon">💰</span>
                  <span className="reward-amount">{achievement.reward} monedas</span>
                </div>
                
                {achievement.unlocked && !achievement.claimed && (
                  <button
                    className="claim-btn"
                    onClick={() => handleClaimReward(achievement._id)}
                    disabled={claiming}
                  >
                    {claiming ? 'Reclamando...' : 'Reclamar'}
                  </button>
                )}
                
                {achievement.claimed && (
                  <span className="claimed-badge">✅ Reclamado</span>
                )}
              </div>

              {achievement.rarity && (
                <div className="achievement-rarity">
                  <span className={`rarity-badge ${achievement.rarity}`}>
                    {achievement.rarity === 'common' && 'Común'}
                    {achievement.rarity === 'rare' && 'Raro'}
                    {achievement.rarity === 'epic' && 'Épico'}
                    {achievement.rarity === 'legendary' && 'Legendario'}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Información adicional */}
      <div className="achievements-info">
        <div className="info-card">
          <h3>💡 Tipos de Logros</h3>
          <div className="achievement-types">
            <div className="type-item">
              <span className="type-icon">🐾</span>
              <span className="type-name">Mascotas</span>
              <span className="type-desc">Cuidar y criar mascotas</span>
            </div>
            <div className="type-item">
              <span className="type-icon">🦸‍♂️</span>
              <span className="type-name">Héroes</span>
              <span className="type-desc">Desarrollar héroes</span>
            </div>
            <div className="type-item">
              <span className="type-icon">🎮</span>
              <span className="type-name">Juegos</span>
              <span className="type-desc">Jugar minijuegos</span>
            </div>
            <div className="type-item">
              <span className="type-icon">👥</span>
              <span className="type-name">Social</span>
              <span className="type-desc">Interactuar con amigos</span>
            </div>
            <div className="type-item">
              <span className="type-icon">📦</span>
              <span className="type-name">Colección</span>
              <span className="type-desc">Recolectar items</span>
            </div>
            <div className="type-item">
              <span className="type-icon">🔒</span>
              <span className="type-name">Secretos</span>
              <span className="type-desc">Logros ocultos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 