import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { 
  getActiveEvents, 
  getEventParticipants, 
  joinEvent, 
  leaveEvent,
  getEventRewards,
  claimEventReward
} from '../api';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import './Events.css';

const Events = () => {
  const { token, updateCoins } = useUser();
  const { playClick, playCoin, playCelebrate } = useSoundEffects();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getActiveEvents(token);
      setEvents(eventsData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setNotification({ message: 'Error al cargar eventos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      setActionLoading(true);
      playClick();
      
      await joinEvent(eventId, token);
      
      setNotification({ 
        message: '¡Te has unido al evento!', 
        type: 'success' 
      });
      
      playCoin();
      
      // Recargar eventos
      await fetchEvents();
    } catch (err) {
      console.error('Error joining event:', err);
      setNotification({ message: 'Error al unirse al evento', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      setActionLoading(true);
      playClick();
      
      await leaveEvent(eventId, token);
      
      setNotification({ 
        message: 'Has abandonado el evento', 
        type: 'info' 
      });
      
      // Recargar eventos
      await fetchEvents();
    } catch (err) {
      console.error('Error leaving event:', err);
      setNotification({ message: 'Error al abandonar evento', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewParticipants = async (eventId) => {
    try {
      const participantsData = await getEventParticipants(eventId, token);
      setParticipants(participantsData);
      setSelectedEvent(events.find(e => e._id === eventId));
    } catch (err) {
      console.error('Error fetching participants:', err);
      setNotification({ message: 'Error al cargar participantes', type: 'error' });
    }
  };

  const handleClaimReward = async (eventId) => {
    try {
      setActionLoading(true);
      playClick();
      
      const result = await claimEventReward(eventId, token);
      updateCoins(result.coinsEarned || 0);
      
      setNotification({ 
        message: `¡Recompensa reclamada! +${result.coinsEarned} monedas`, 
        type: 'success' 
      });
      
      playCelebrate();
      
      // Recargar eventos
      await fetchEvents();
    } catch (err) {
      console.error('Error claiming reward:', err);
      setNotification({ message: 'Error al reclamar recompensa', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'tournament': return '🏆';
      case 'collection': return '📦';
      case 'social': return '👥';
      case 'challenge': return '🎯';
      case 'seasonal': return '🎄';
      case 'special': return '⭐';
      default: return '🎪';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'tournament': return '#FFD700';
      case 'collection': return '#87CEEB';
      case 'social': return '#DDA0DD';
      case 'challenge': return '#FF6B6B';
      case 'seasonal': return '#90EE90';
      case 'special': return '#FFA07A';
      default: return '#FFE4E1';
    }
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Finalizado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getProgressPercentage = (event) => {
    if (!event.progress || !event.target) return 0;
    return Math.min((event.progress / event.target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading-message">
          <div className="loading-spinner">🎪</div>
          <p>Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'info' })} 
      />

      {/* Header */}
      <div className="events-header">
        <h1>🎪 Eventos</h1>
        <div className="events-stats">
          <div className="stat-item">
            <span className="stat-icon">🎪</span>
            <span className="stat-label">Activos:</span>
            <span className="stat-value">{events.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <span className="stat-label">Participando:</span>
            <span className="stat-value">
              {events.filter(e => e.isParticipating).length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid de eventos */}
      <div className="events-grid">
        {events.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">🎪</div>
            <h3>No hay eventos activos</h3>
            <p>¡Vuelve más tarde para nuevos eventos emocionantes!</p>
          </div>
        ) : (
          events.map(event => (
            <div 
              key={event._id} 
              className={`event-card ${event.isParticipating ? 'participating' : ''}`}
              style={{ backgroundColor: getEventColor(event.type) }}
            >
              <div className="event-header">
                <div className="event-icon">
                  {getEventIcon(event.type)}
                </div>
                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <span className="event-type">{event.type}</span>
                    <span className="event-participants">
                      👥 {event.participantsCount || 0} participantes
                    </span>
                  </div>
                </div>
                <div className="event-status">
                  {event.isParticipating ? (
                    <span className="status-participating">✅</span>
                  ) : (
                    <span className="status-available">🎯</span>
                  )}
                </div>
              </div>

              <div className="event-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getProgressPercentage(event)}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {event.progress || 0} / {event.target}
                </div>
              </div>

              <div className="event-rewards">
                <div className="rewards-info">
                  <span className="rewards-icon">💰</span>
                  <span className="rewards-amount">{event.reward} monedas</span>
                  {event.specialReward && (
                    <span className="special-reward">🎁 {event.specialReward}</span>
                  )}
                </div>
              </div>

              <div className="event-time">
                <span className="time-icon">⏰</span>
                <span className="time-remaining">
                  {getTimeRemaining(event.endDate)}
                </span>
              </div>

              <div className="event-actions">
                {!event.isParticipating ? (
                  <button
                    className="join-btn"
                    onClick={() => handleJoinEvent(event._id)}
                    disabled={actionLoading}
                  >
                    🎯 Unirse
                  </button>
                ) : (
                  <div className="participating-actions">
                    <button
                      className="participants-btn"
                      onClick={() => handleViewParticipants(event._id)}
                    >
                      👥 Ver Participantes
                    </button>
                    <button
                      className="leave-btn"
                      onClick={() => handleLeaveEvent(event._id)}
                      disabled={actionLoading}
                    >
                      ❌ Abandonar
                    </button>
                  </div>
                )}
                
                {event.canClaimReward && (
                  <button
                    className="claim-btn"
                    onClick={() => handleClaimReward(event._id)}
                    disabled={actionLoading}
                  >
                    🎁 Reclamar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de participantes */}
      {selectedEvent && participants.length > 0 && (
        <div className="participants-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="participants-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👥 Participantes - {selectedEvent.title}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedEvent(null)}
              >
                ✕
              </button>
            </div>
            <div className="participants-list">
              {participants.map((participant, index) => (
                <div key={participant._id} className="participant-item">
                  <div className="participant-rank">
                    #{index + 1}
                  </div>
                  <div className="participant-avatar">
                    <img 
                      src={participant.avatar || '/assets/hero.svg'} 
                      alt={participant.username}
                      className="avatar-img"
                    />
                  </div>
                  <div className="participant-info">
                    <h4 className="participant-name">{participant.username}</h4>
                    <p className="participant-score">Puntuación: {participant.score}</p>
                  </div>
                  <div className="participant-reward">
                    {index < 3 && (
                      <span className="reward-medal">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="events-info">
        <div className="info-card">
          <h3>💡 Tipos de Eventos</h3>
          <div className="event-types">
            <div className="type-item">
              <span className="type-icon">🏆</span>
              <span className="type-name">Torneos</span>
              <span className="type-desc">Competiciones por premios</span>
            </div>
            <div className="type-item">
              <span className="type-icon">📦</span>
              <span className="type-name">Colección</span>
              <span className="type-desc">Recolecta items especiales</span>
            </div>
            <div className="type-item">
              <span className="type-icon">👥</span>
              <span className="type-name">Social</span>
              <span className="type-desc">Interactúa con amigos</span>
            </div>
            <div className="type-item">
              <span className="type-icon">🎯</span>
              <span className="type-name">Desafíos</span>
              <span className="type-desc">Completa objetivos</span>
            </div>
            <div className="type-item">
              <span className="type-icon">🎄</span>
              <span className="type-name">Estacionales</span>
              <span className="type-desc">Eventos por temporada</span>
            </div>
            <div className="type-item">
              <span className="type-icon">⭐</span>
              <span className="type-name">Especiales</span>
              <span className="type-desc">Eventos únicos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events; 