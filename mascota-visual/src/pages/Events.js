import React, { useEffect, useState } from 'react';
import { getActiveEvent, getUserEventProgress } from '../api';
import './Events.css';

export default function Events({ token }) {
  const [activeEvent, setActiveEvent] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventData();
    const interval = setInterval(fetchEventData, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, [token]);

  const fetchEventData = async () => {
    try {
      const [event, progress] = await Promise.all([
        getActiveEvent(),
        token ? getUserEventProgress(token) : null
      ]);
      setActiveEvent(event);
      setUserProgress(progress);
    } catch (err) {
      setError('Error al cargar eventos.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Evento terminado';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m restantes`;
  };

  const getProgressForObjective = (objective) => {
    if (!userProgress) return 0;
    const progress = userProgress.progress.get(objective.action) || 0;
    return Math.min((progress / objective.target) * 100, 100);
  };

  const isObjectiveCompleted = (objective) => {
    if (!userProgress) return false;
    return userProgress.completed.includes(objective.description);
  };

  if (loading) return <div className="events-container"><p>Cargando eventos...</p></div>;
  if (error) return <div className="events-container"><p style={{ color: 'red' }}>{error}</p></div>;

  if (!activeEvent) {
    return (
      <div className="events-container">
        <div className="no-event">
          <h2>🎉 Eventos Especiales</h2>
          <p>No hay eventos activos en este momento.</p>
          <p>¡Mantente atento para futuros eventos especiales!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div 
        className="event-banner"
        style={{ 
          background: `linear-gradient(135deg, ${activeEvent.theme.backgroundColor}, ${activeEvent.theme.backgroundColor}dd)`,
          color: activeEvent.theme.textColor
        }}
      >
        <div className="event-header">
          <div className="event-icon">{activeEvent.icon}</div>
          <div className="event-info">
            <h2>{activeEvent.name}</h2>
            <p>{activeEvent.description}</p>
            <div className="event-timer">
              ⏰ {formatTimeRemaining(activeEvent.endDate)}
            </div>
          </div>
        </div>
      </div>

      <div className="event-content">
        <div className="objectives-section">
          <h3>🎯 Objetivos del Evento</h3>
          <div className="objectives-grid">
            {activeEvent.objectives.map((objective, index) => (
              <div 
                key={index} 
                className={`objective-card ${isObjectiveCompleted(objective) ? 'completed' : 'active'}`}
              >
                <div className="objective-header">
                  <div className="objective-icon">🎯</div>
                  <div className="objective-info">
                    <h4>{objective.description}</h4>
                    <p>Recompensa: +{objective.reward} monedas</p>
                  </div>
                  {isObjectiveCompleted(objective) && (
                    <div className="completed-badge">✅</div>
                  )}
                </div>
                
                <div className="objective-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getProgressForObjective(objective)}%` }}
                    ></div>
                  </div>
                  <span>
                    {userProgress ? (userProgress.progress.get(objective.action) || 0) : 0}/{objective.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rewards-section">
          <h3>🏆 Recompensas del Evento</h3>
          <div className="rewards-grid">
            <div className="reward-card">
              <div className="reward-icon">🪙</div>
              <div className="reward-info">
                <h4>Monedas</h4>
                <p>+{activeEvent.rewards.coins} monedas</p>
              </div>
            </div>
            {activeEvent.rewards.specialReward && (
              <div className="reward-card special">
                <div className="reward-icon">👑</div>
                <div className="reward-info">
                  <h4>Recompensa Especial</h4>
                  <p>{activeEvent.rewards.specialReward}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="participation-info">
          <h3>👥 Participación</h3>
          <p>{activeEvent.participants.length} jugadores participando</p>
        </div>
      </div>
    </div>
  );
} 