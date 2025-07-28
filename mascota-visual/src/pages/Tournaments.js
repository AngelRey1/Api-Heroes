import React, { useState, useEffect } from 'react';
import { 
  getActiveTournaments, 
  getUserTournaments, 
  registerForTournament,
  getUserLeague,
  getLeagueRanking
} from '../api';
import './Tournaments.css';

export default function Tournaments({ token }) {
  const [activeTournaments, setActiveTournaments] = useState([]);
  const [userTournaments, setUserTournaments] = useState([]);
  const [userLeague, setUserLeague] = useState(null);
  const [leagueRanking, setLeagueRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tournaments');

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tournaments, userTours, league] = await Promise.all([
        getActiveTournaments(),
        token ? getUserTournaments(token) : [],
        token ? getUserLeague(token) : null
      ]);

      setActiveTournaments(tournaments);
      setUserTournaments(userTours);
      setUserLeague(league);

      if (league) {
        const ranking = await getLeagueRanking(league.name, league.season);
        setLeagueRanking(ranking);
      }
    } catch (err) {
      setError('Error al cargar torneos');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (tournamentId) => {
    try {
      await registerForTournament(tournamentId, token);
      fetchData(); // Recargar datos
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  };

  const getTournamentStatus = (tournament) => {
    const now = new Date();
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    const registrationDeadline = new Date(tournament.registrationDeadline);

    if (now < registrationDeadline) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'active';
    if (now > endDate) return 'finished';
    return 'registration';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#3498db';
      case 'active': return '#2ecc71';
      case 'finished': return '#e74c3c';
      case 'registration': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'Próximamente';
      case 'active': return 'Activo';
      case 'finished': return 'Finalizado';
      case 'registration': return 'Inscripciones Abiertas';
      default: return 'Desconocido';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUserRegistered = (tournament) => {
    return tournament.participants.some(p => p.userId === user?.id);
  };

  if (loading) {
    return (
      <div className="tournaments-container">
        <div className="loading">Cargando torneos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tournaments-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="tournaments-container">
      <div className="tournaments-header">
        <h1>🏆 Torneos y Ligas</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'tournaments' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournaments')}
          >
            🏆 Torneos
          </button>
          <button 
            className={`tab-button ${activeTab === 'leagues' ? 'active' : ''}`}
            onClick={() => setActiveTab('leagues')}
          >
            🏅 Ligas
          </button>
        </div>
      </div>

      {activeTab === 'tournaments' && (
        <div className="tournaments-content">
          <div className="tournaments-section">
            <h2>🎯 Torneos Activos</h2>
            <div className="tournaments-grid">
              {activeTournaments.map(tournament => {
                const status = getTournamentStatus(tournament);
                const registered = isUserRegistered(tournament);
                
                return (
                  <div key={tournament._id} className="tournament-card" style={{
                    background: `linear-gradient(135deg, ${tournament.theme?.backgroundColor || '#667eea'} 0%, #764ba2 100%)`
                  }}>
                    <div className="tournament-header">
                      <span className="tournament-icon">{tournament.theme?.icon || '🏆'}</span>
                      <h3>{tournament.name}</h3>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(status) }}
                      >
                        {getStatusText(status)}
                      </span>
                    </div>

                    <div className="tournament-info">
                      <p>{tournament.description}</p>
                      <div className="tournament-details">
                        <span>🎮 {tournament.gameType}</span>
                        <span>👥 {tournament.currentParticipants}/{tournament.maxParticipants}</span>
                        <span>💰 Entrada: {tournament.entryFee} monedas</span>
                      </div>
                      <div className="prize-pool">
                        <h4>🏆 Premios:</h4>
                        <div className="prizes">
                          <span>🥇 {tournament.prizePool.first}</span>
                          <span>🥈 {tournament.prizePool.second}</span>
                          <span>🥉 {tournament.prizePool.third}</span>
                        </div>
                      </div>
                      <div className="tournament-dates">
                        <p><strong>Inicio:</strong> {formatDate(tournament.startDate)}</p>
                        <p><strong>Fin:</strong> {formatDate(tournament.endDate)}</p>
                      </div>
                    </div>

                    <div className="tournament-actions">
                      {status === 'registration' && !registered && (
                        <button 
                          className="register-button"
                          onClick={() => handleRegister(tournament._id)}
                        >
                          📝 Registrarse
                        </button>
                      )}
                      {registered && (
                        <span className="registered-badge">✅ Registrado</span>
                      )}
                      {status === 'active' && registered && (
                        <button className="play-button">
                          🎮 Jugar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {userTournaments.length > 0 && (
            <div className="tournaments-section">
              <h2>📊 Mis Torneos</h2>
              <div className="user-tournaments">
                {userTournaments.map(tournament => {
                  const participation = tournament.participants.find(p => p.userId === user?.id);
                  
                  return (
                    <div key={tournament._id} className="user-tournament-card">
                      <div className="tournament-info">
                        <h4>{tournament.name}</h4>
                        <p>Mejor puntuación: {participation?.bestScore || 0}</p>
                        <p>Intentos: {participation?.attempts || 0}</p>
                        <p>Posición: {participation?.rank || 'N/A'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'leagues' && (
        <div className="leagues-content">
          {userLeague ? (
            <div className="league-section">
              <h2>🏅 Liga {userLeague.name.toUpperCase()}</h2>
              <div className="league-info">
                <p>Temporada: {userLeague.season}</p>
                <p>Estado: {userLeague.status}</p>
                <p>Participantes: {userLeague.participants.length}</p>
              </div>

              <div className="user-league-stats">
                <h3>📊 Mis Estadísticas</h3>
                {(() => {
                  const userParticipation = userLeague.participants.find(p => p.userId === user?.id);
                  return userParticipation ? (
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-label">Puntos:</span>
                        <span className="stat-value">{userParticipation.points}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Posición:</span>
                        <span className="stat-value">{userParticipation.rank}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Victorias:</span>
                        <span className="stat-value">{userParticipation.wins}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Derrotas:</span>
                        <span className="stat-value">{userParticipation.losses}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Juegos:</span>
                        <span className="stat-value">{userParticipation.gamesPlayed}</span>
                      </div>
                    </div>
                  ) : (
                    <p>No estás participando en esta liga</p>
                  );
                })()}
              </div>

              <div className="league-ranking">
                <h3>🏆 Ranking de la Liga</h3>
                <div className="ranking-table">
                  <div className="ranking-header">
                    <span>Pos</span>
                    <span>Jugador</span>
                    <span>Puntos</span>
                    <span>V/D</span>
                    <span>Juegos</span>
                  </div>
                  {leagueRanking.map((participant, index) => (
                    <div key={participant.userId} className={`ranking-row ${participant.userId === user?.id ? 'current-user' : ''}`}>
                      <span className="rank">{participant.rank}</span>
                      <span className="player">{participant.heroName || participant.username}</span>
                      <span className="points">{participant.points}</span>
                      <span className="record">{participant.wins}/{participant.losses}</span>
                      <span className="games">{participant.gamesPlayed}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-league">
              <h2>🏅 Sistema de Ligas</h2>
              <p>No estás participando en ninguna liga actualmente.</p>
              <div className="league-info">
                <h3>Ligas Disponibles:</h3>
                <div className="leagues-list">
                  <div className="league-item">
                    <span className="league-name">🥉 Bronce</span>
                    <span className="league-desc">Liga para principiantes</span>
                  </div>
                  <div className="league-item">
                    <span className="league-name">🥈 Plata</span>
                    <span className="league-desc">Liga intermedia</span>
                  </div>
                  <div className="league-item">
                    <span className="league-name">🥇 Oro</span>
                    <span className="league-desc">Liga avanzada</span>
                  </div>
                  <div className="league-item">
                    <span className="league-name">💎 Platino</span>
                    <span className="league-desc">Liga experta</span>
                  </div>
                  <div className="league-item">
                    <span className="league-name">👑 Diamante</span>
                    <span className="league-desc">Liga élite</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 