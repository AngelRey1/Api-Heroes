import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import './Achievements.css';

const Achievements = () => {
  const { token, user } = useUser();
  const { playClick, playCelebrate } = useSoundEffects();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  // Logros predefinidos
  const allAchievements = [
    // Logros de cuidado
    {
      id: 'first_feed',
      name: 'Primer Alimento',
      description: 'Alimenta a tu mascota por primera vez',
      icon: '🍖',
      category: 'care',
      requirement: 1,
      reward: 10,
      color: '#ff6b6b'
    },
    {
      id: 'care_master',
      name: 'Maestro del Cuidado',
      description: 'Alimenta a tu mascota 50 veces',
      icon: '👑',
      category: 'care',
      requirement: 50,
      reward: 100,
      color: '#feca57'
    },
    {
      id: 'clean_freak',
      name: 'Limpiador Obsesivo',
      description: 'Limpia a tu mascota 25 veces',
      icon: '🛁',
      category: 'care',
      requirement: 25,
      reward: 75,
      color: '#4ecdc4'
    },
    {
      id: 'playful_spirit',
      name: 'Espíritu Juguetón',
      description: 'Juega con tu mascota 30 veces',
      icon: '🎾',
      category: 'care',
      requirement: 30,
      reward: 80,
      color: '#ff9ff3'
    },
    {
      id: 'sleep_expert',
      name: 'Experto del Descanso',
      description: 'Haz dormir a tu mascota 20 veces',
      icon: '😴',
      category: 'care',
      requirement: 20,
      reward: 60,
      color: '#a55eea'
    },

    // Logros de mascotas
    {
      id: 'pet_collector',
      name: 'Coleccionista de Mascotas',
      description: 'Adopta 3 mascotas diferentes',
      icon: '🐾',
      category: 'pets',
      requirement: 3,
      reward: 150,
      color: '#26de81'
    },
    {
      id: 'pet_trainer',
      name: 'Entrenador de Mascotas',
      description: 'Mantén a una mascota feliz por 7 días',
      icon: '🎓',
      category: 'pets',
      requirement: 7,
      reward: 200,
      color: '#fd79a8'
    },
    {
      id: 'loyal_friend',
      name: 'Amigo Leal',
      description: 'Cuida a la misma mascota por 30 días',
      icon: '💝',
      category: 'pets',
      requirement: 30,
      reward: 500,
      color: '#e84393'
    },

    // Logros de juegos
    {
      id: 'game_beginner',
      name: 'Jugador Novato',
      description: 'Completa 5 minijuegos',
      icon: '🎮',
      category: 'games',
      requirement: 5,
      reward: 50,
      color: '#667eea'
    },
    {
      id: 'game_master',
      name: 'Maestro de Juegos',
      description: 'Completa 50 minijuegos',
      icon: '🏆',
      category: 'games',
      requirement: 50,
      reward: 300,
      color: '#feca57'
    },
    {
      id: 'speed_demon',
      name: 'Demonio de Velocidad',
      description: 'Gana 10 juegos de velocidad',
      icon: '⚡',
      category: 'games',
      requirement: 10,
      reward: 120,
      color: '#ff6b6b'
    },
    {
      id: 'math_genius',
      name: 'Genio Matemático',
      description: 'Resuelve 20 problemas matemáticos',
      icon: '🧮',
      category: 'games',
      requirement: 20,
      reward: 150,
      color: '#4ecdc4'
    },

    // Logros de monedas
    {
      id: 'coin_collector',
      name: 'Coleccionista de Monedas',
      description: 'Acumula 1000 monedas',
      icon: '💰',
      category: 'coins',
      requirement: 1000,
      reward: 50,
      color: '#feca57'
    },
    {
      id: 'rich_pet_owner',
      name: 'Dueño Rico de Mascotas',
      description: 'Acumula 5000 monedas',
      icon: '💎',
      category: 'coins',
      requirement: 5000,
      reward: 200,
      color: '#a55eea'
    },

    // Logros especiales
    {
      id: 'perfect_care',
      name: 'Cuidado Perfecto',
      description: 'Mantén a tu mascota al 100% de salud y felicidad por 24 horas',
      icon: '✨',
      category: 'special',
      requirement: 1,
      reward: 250,
      color: '#26de81'
    },
    {
      id: 'survivor',
      name: 'Sobreviviente',
      description: 'Salva a una mascota de la muerte',
      icon: '💊',
      category: 'special',
      requirement: 1,
      reward: 400,
      color: '#ff6b6b'
    },
    {
      id: 'first_hero',
      name: 'Primer Héroe',
      description: 'Crea tu primer héroe',
      icon: '🦸‍♂️',
      category: 'special',
      requirement: 1,
      reward: 100,
      color: '#667eea'
    }
  ];

  useEffect(() => {
    loadAchievements();
  }, [token]);

  const loadAchievements = async () => {
    if (!token) return;

    setLoading(true);
    try {
      // Simular carga de logros desde el backend
      // En un caso real, esto vendría de una API
      const userAchievements = user?.achievements || [];
      
      const achievementsWithProgress = allAchievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.id === achievement.id);
        const progress = userAchievement?.progress || 0;
        const completed = userAchievement?.completed || false;
        const claimed = userAchievement?.claimed || false;
        
        return {
          ...achievement,
          progress,
          completed,
          claimed,
          progressPercentage: Math.min((progress / achievement.requirement) * 100, 100)
        };
      });
      
      setAchievements(achievementsWithProgress);
    } catch (error) {
      console.error('Error cargando logros:', error);
      setNotification({ message: 'Error cargando logros', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (achievementId) => {
    if (!token) return;

    try {
      // Simular reclamar recompensa
      // En un caso real, esto sería una llamada a la API
      const achievement = achievements.find(a => a.id === achievementId);
      if (!achievement || !achievement.completed || achievement.claimed) return;

      playCelebrate();
      setNotification({ 
        message: `¡Logro reclamado! +${achievement.reward} monedas`, 
        type: 'success' 
      });

      // Actualizar estado local
      setAchievements(prev => prev.map(a => 
        a.id === achievementId 
          ? { ...a, claimed: true }
          : a
      ));

    } catch (error) {
      console.error('Error reclamando recompensa:', error);
      setNotification({ message: 'Error reclamando recompensa', type: 'error' });
    }
  };

  const getCategoryStats = () => {
    const categories = ['care', 'pets', 'games', 'coins', 'special'];
    return categories.map(category => {
      const categoryAchievements = achievements.filter(a => a.category === category);
      const completed = categoryAchievements.filter(a => a.completed).length;
      const total = categoryAchievements.length;
      
      return {
        category,
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });
  };

  const categoryStats = getCategoryStats();

  if (loading) {
    return (
      <div className="achievements-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando logros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>🏆 Logros</h1>
        <p>¡Completa desafíos y gana recompensas!</p>
      </div>

      {/* Estadísticas por categoría */}
      <div className="category-stats">
        {categoryStats.map(stat => (
          <div key={stat.category} className="category-stat">
            <div className="stat-icon">
              {stat.category === 'care' && '🛁'}
              {stat.category === 'pets' && '🐾'}
              {stat.category === 'games' && '🎮'}
              {stat.category === 'coins' && '💰'}
              {stat.category === 'special' && '⭐'}
            </div>
            <div className="stat-info">
              <span className="stat-title">{stat.category.toUpperCase()}</span>
              <span className="stat-progress">{stat.completed}/{stat.total}</span>
            </div>
            <div className="stat-bar">
              <div 
                className="stat-fill" 
                style={{ width: `${stat.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de logros */}
      <div className="achievements-grid">
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.completed ? 'completed' : ''} ${achievement.claimed ? 'claimed' : ''}`}
            style={{ '--achievement-color': achievement.color }}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-info">
              <h3>{achievement.name}</h3>
              <p>{achievement.description}</p>
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${achievement.progressPercentage}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {achievement.progress}/{achievement.requirement}
                </span>
              </div>
            </div>
            <div className="achievement-reward">
              <span className="reward-amount">💰 {achievement.reward}</span>
              {achievement.completed && !achievement.claimed && (
                <button 
                  className="claim-btn"
                  onClick={() => claimReward(achievement.id)}
                >
                  Reclamar
                </button>
              )}
              {achievement.claimed && (
                <span className="claimed-badge">✅ Reclamado</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Notificaciones */}
      {notification.message && (
        <NotificationToast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ message: '', type: 'info' })} 
        />
      )}
    </div>
  );
};

export default Achievements; 