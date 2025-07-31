import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useSoundEffects } from '../components/SoundEffects';
import MemoryGame from '../components/games/MemoryGame';
import MathGame from '../components/games/MathGame';
import SpeedGame from '../components/games/SpeedGame';
import './Minigames.css';

const Minigames = () => {
  const { user } = useUser();
  const { playClick, playCoin } = useSoundEffects();
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGame, setShowGame] = useState(false);

  const games = [
    {
      id: 'memory',
      name: 'Memoria',
      description: 'Encuentra las parejas de cartas',
      icon: '🧠',
      reward: 10,
      color: '#667eea'
    },
    {
      id: 'math',
      name: 'Matemáticas',
      description: 'Resuelve operaciones matemáticas',
      icon: '🔢',
      reward: 15,
      color: '#feca57'
    },
    {
      id: 'speed',
      name: 'Velocidad',
      description: 'Haz clic lo más rápido posible',
      icon: '⚡',
      reward: 12,
      color: '#48dbfb'
    }
  ];

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setShowGame(true);
    playClick();
  };

  const handleCloseGame = () => {
    setShowGame(false);
    setSelectedGame(null);
  };

  const handleGameEnd = (score) => {
    playCoin();
    setShowGame(false);
    setSelectedGame(null);
  };

  const renderGame = () => {
    if (!selectedGame) return null;

    switch (selectedGame.id) {
      case 'memory':
        return <MemoryGame onGameEnd={handleGameEnd} />;
      case 'math':
        return <MathGame onGameEnd={handleGameEnd} />;
      case 'speed':
        return <SpeedGame onGameEnd={handleGameEnd} />;
      default:
        return null;
    }
  };

  return (
    <div className="minigames-container">
      <div className="minigames-header">
        <h1>🎮 Minijuegos</h1>
        <p>¡Juega y gana monedas!</p>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => handleGameSelect(game)}
            style={{ '--game-color': game.color }}
          >
            <div className="game-icon">{game.icon}</div>
            <h3 className="game-name">{game.name}</h3>
            <p className="game-description">{game.description}</p>
            <div className="game-reward">
              <span className="reward-icon">💰</span>
              <span className="reward-amount">+{game.reward} monedas</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal del juego */}
      {showGame && selectedGame && (
        <div className="game-modal">
          <div className="game-modal-content">
            <button className="close-game-btn" onClick={handleCloseGame}>
              ✕
            </button>
            {renderGame()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Minigames; 