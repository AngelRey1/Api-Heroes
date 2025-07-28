import React, { useState, useEffect } from 'react';
import { getAllMinigames, getMinigameHighScores, getUserMinigameStats } from '../api';
import MemoryGame from '../components/games/MemoryGame';
import SpeedGame from '../components/games/SpeedGame';
import PuzzleGame from '../components/games/PuzzleGame';
import ReactionGame from '../components/games/ReactionGame';
import MathGame from '../components/games/MathGame';
import './Minigames.css';

export default function Minigames({ token }) {
  const [minigames, setMinigames] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMinigames();
    fetchUserStats();
  }, [token]);

  const fetchMinigames = async () => {
    try {
      const data = await getAllMinigames();
      setMinigames(data);
    } catch (err) {
      setError('Error al cargar minijuegos');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!token) return;
    try {
      const stats = await getUserMinigameStats(token);
      setUserStats(stats);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleGameClose = () => {
    setSelectedGame(null);
    fetchUserStats(); // Actualizar estadísticas después del juego
  };

  const renderGameComponent = () => {
    if (!selectedGame) return null;

    const gameProps = {
      game: selectedGame,
      token,
      onClose: handleGameClose,
      onScoreUpdate: fetchUserStats
    };

    switch (selectedGame.type) {
      case 'memory':
        return <MemoryGame {...gameProps} />;
      case 'speed':
        return <SpeedGame {...gameProps} />;
      case 'puzzle':
        return <PuzzleGame {...gameProps} />;
      case 'reaction':
        return <ReactionGame {...gameProps} />;
      case 'math':
        return <MathGame {...gameProps} />;
      default:
        return <div>Juego no disponible</div>;
    }
  };

  if (loading) {
    return (
      <div className="minigames-container">
        <div className="loading">Cargando minijuegos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="minigames-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="minigames-container">
      <div className="minigames-header">
        <h1>🎮 Minijuegos</h1>
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-label">Juegos Jugados:</span>
            <span className="stat-value">{userStats.gamesPlayed || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Puntuación Total:</span>
            <span className="stat-value">{userStats.totalScore || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Monedas Ganadas:</span>
            <span className="stat-value">🪙 {userStats.coinsEarned || 0}</span>
          </div>
        </div>
      </div>

      <div className="minigames-grid">
        {minigames.map(game => (
          <div key={game._id} className="minigame-card">
            <div className="minigame-header">
              <span className="minigame-icon">{game.icon}</span>
              <h3>{game.name}</h3>
              <span className={`difficulty-badge ${game.difficulty}`}>
                {game.difficulty}
              </span>
            </div>
            
            <div className="minigame-info">
              <p>{game.description}</p>
              <div className="reward-info">
                <span>Recompensa: 🪙 {game.baseReward}-{game.maxReward}</span>
              </div>
              
              {userStats.minigameStats && userStats.minigameStats[game._id] && (
                <div className="user-score">
                  <span>Mejor puntuación: {userStats.minigameStats[game._id].bestScore || 0}</span>
                </div>
              )}
            </div>

            <div className="game-instructions">
              <p><strong>Instrucciones:</strong></p>
              <p>{game.instructions}</p>
            </div>

            <button 
              className="play-button"
              onClick={() => handleGameSelect(game)}
            >
              🎮 Jugar
            </button>
          </div>
        ))}
      </div>

      {selectedGame && (
        <div className="game-modal-overlay">
          <div className="game-modal">
            <div className="game-modal-header">
              <h2>{selectedGame.name}</h2>
              <button className="close-button" onClick={handleGameClose}>
                ✕
              </button>
            </div>
            <div className="game-modal-content">
              {renderGameComponent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 