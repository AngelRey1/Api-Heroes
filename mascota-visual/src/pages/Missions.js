import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
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

  // Misiones por defecto que se generan automáticamente
  const defaultMissions = [
    {
      _id: 'daily_1',
      title: 'Alimentar Mascota',
      description: 'Alimenta a tu mascota 3 veces hoy',
      type: 'daily',
      progress: 0,
      target: 3,
      reward: 15,
      completed: false,
      claimed: false,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    },
    {
      _id: 'daily_2',
      title: 'Jugar con Mascota',
      description: 'Juega con tu mascota 2 veces hoy',
      type: 'daily',
      progress: 0,
      target: 2,
      reward: 20,
      completed: false,
      claimed: false,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'daily_3',
      title: 'Limpiar Mascota',
      description: 'Limpia a tu mascota 1 vez hoy',
      type: 'daily',
      progress: 0,
      target: 1,
      reward: 25,
      completed: false,
      claimed: false,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'daily_4',
      title: 'Hacer Dormir Mascota',
      description: 'Haz dormir a tu mascota 1 vez hoy',
      type: 'daily',
      progress: 0,
      target: 1,
      reward: 30,
      completed: false,
      claimed: false,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'weekly_1',
      title: 'Completar 5 Misiones',
      description: 'Completa 5 misiones esta semana',
      type: 'weekly',
      progress: 0,
      target: 5,
      reward: 100,
      completed: false,
      claimed: false,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
    }
  ];

  useEffect(() => {
    initializeMissions();
  }, []);

  // Inicializar misiones automáticamente (sin depender del backend)
  const initializeMissions = async () => {
    try {
      setLoading(true);
      
      // Verificar si ya existen misiones en localStorage
      const savedMissions = localStorage.getItem('userMissions');
      const lastGenerated = localStorage.getItem('lastMissionsGenerated');
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
      
      if (!savedMissions || !lastGenerated || (now - parseInt(lastGenerated)) > oneDay) {
        // Generar nuevas misiones automáticamente
        const newMissions = defaultMissions.map(mission => ({
          ...mission,
          _id: `${mission._id}_${Date.now()}`,
          progress: 0,
          completed: false,
          claimed: false
        }));
        
        localStorage.setItem('userMissions', JSON.stringify(newMissions));
        localStorage.setItem('lastMissionsGenerated', now.toString());
        setMissions(newMissions);
        
        setNotification({ 
          message: '¡Nuevas misiones generadas automáticamente!', 
          type: 'success' 
        });
      } else {
        // Cargar misiones existentes
        const existingMissions = JSON.parse(savedMissions);
        setMissions(existingMissions);
      }
      
    } catch (error) {
      console.error('Error initializing missions:', error);
      // Si hay error, usar misiones por defecto
      setMissions(defaultMissions);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (missionId) => {
    try {
      setClaiming(true);
      playClick();
      
      // Simular reclamación de recompensa
      const mission = missions.find(m => m._id === missionId);
      if (mission && mission.completed && !mission.claimed) {
        const coinsEarned = mission.reward;
        updateCoins(coinsEarned);
        
        // Actualizar estado de la misión
        const updatedMissions = missions.map(m => 
          m._id === missionId ? { ...m, claimed: true } : m
        );
        setMissions(updatedMissions);
        localStorage.setItem('userMissions', JSON.stringify(updatedMissions));
        
        setNotification({ 
          message: `¡Recompensa reclamada! +${coinsEarned} monedas`, 
          type: 'success' 
        });
        
        playCoin();
        if (coinsEarned > 50) {
          playCelebrate();
        }
      }
    } catch (err) {
      console.error('Error claiming reward:', err);
      setNotification({ message: 'Error al reclamar recompensa', type: 'error' });
    } finally {
      setClaiming(false);
    }
  };

  // Función para actualizar progreso de misiones (se llamará desde otras partes del juego)
  const updateMissionProgress = (missionType, amount = 1) => {
    const updatedMissions = missions.map(mission => {
      if (mission.title.toLowerCase().includes(missionType.toLowerCase())) {
        const newProgress = Math.min(mission.progress + amount, mission.target);
        const completed = newProgress >= mission.target;
        return { ...mission, progress: newProgress, completed };
      }
      return mission;
    });
    
    setMissions(updatedMissions);
    localStorage.setItem('userMissions', JSON.stringify(updatedMissions));
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
        <h1>📋 Misiones Diarias</h1>
        <div className="header-info">
          <div className="auto-generated-info">
            <span className="info-icon">🔄</span>
            <span className="info-text">Se renuevan automáticamente cada 24 horas</span>
          </div>
        </div>
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
            <p>Las misiones se generan automáticamente cada 24 horas</p>
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
          <h3>💡 Cómo Funcionan las Misiones</h3>
          <div className="mission-types">
            <div className="type-item">
              <span className="type-icon">📅</span>
              <span className="type-name">Diarias</span>
              <span className="type-desc">Se renuevan automáticamente cada día</span>
            </div>
            <div className="type-item">
              <span className="type-icon">📆</span>
              <span className="type-name">Semanales</span>
              <span className="type-desc">Se renuevan automáticamente cada semana</span>
            </div>
            <div className="type-item">
              <span className="type-icon">🎮</span>
              <span className="type-name">Juego</span>
              <span className="type-desc">Basadas en acciones del juego</span>
            </div>
            <div className="type-item">
              <span className="type-icon">🐾</span>
              <span className="type-name">Mascota</span>
              <span className="type-desc">Cuidar y jugar con tu mascota</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions; 