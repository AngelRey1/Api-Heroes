import React, { useState } from 'react';
import MathGame from '../components/games/MathGame';
import './Minigames.css';

const Minigames = () => {
  const [showMathGame, setShowMathGame] = useState(false);
  const [showMemoryGame, setShowMemoryGame] = useState(false);
  const [showSpeedGame, setShowSpeedGame] = useState(false);
  const [showReactionGame, setShowReactionGame] = useState(false);
  const [showPuzzleGame, setShowPuzzleGame] = useState(false);

  const handleGameEnd = (coinsEarned) => {
    // Aquí podrías actualizar las monedas del usuario
    console.log('Monedas ganadas:', coinsEarned);
    setShowMathGame(false);
  };

  const games = [
    {
      id: 'math',
      name: 'Matemáticas',
      description: 'Resuelve problemas matemáticos para ganar monedas',
      icon: '🧮',
      color: '#667eea',
      onClick: () => setShowMathGame(true)
    },
    {
      id: 'memory',
      name: 'Memoria',
      description: 'Encuentra las parejas de cartas',
      icon: '🧠',
      color: '#4ecdc4',
      onClick: () => setShowMemoryGame(true)
    },
    {
      id: 'speed',
      name: 'Velocidad',
      description: 'Responde lo más rápido posible',
      icon: '⚡',
      color: '#ff6b6b',
      onClick: () => setShowSpeedGame(true)
    },
    {
      id: 'reaction',
      name: 'Reacción',
      description: 'Mide tus reflejos',
      icon: '🎯',
      color: '#f9ca24',
      onClick: () => setShowReactionGame(true)
    },
    {
      id: 'puzzle',
      name: 'Puzzle',
      description: 'Ordena las piezas correctamente',
      icon: '🧩',
      color: '#a55eea',
      onClick: () => setShowPuzzleGame(true)
    }
  ];

  return (
    <div className="minigames-container">
      <div className="minigames-header">
        <h1>🎮 Minijuegos</h1>
        <p>¡Juega y gana monedas para tu mascota!</p>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card"
            style={{ '--game-color': game.color }}
            onClick={game.onClick}
          >
            <div className="game-icon">{game.icon}</div>
            <h3>{game.name}</h3>
            <p>{game.description}</p>
            <div className="game-reward">
              <span>💰 +10-50 monedas</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modales de juegos */}
      {showMathGame && (
        <MathGame
          onGameEnd={handleGameEnd}
          onClose={() => setShowMathGame(false)}
        />
      )}

      {showMemoryGame && (
        <div className="game-modal">
          <div className="modal-content">
            <h2>🧠 Memoria</h2>
            <p>¡Próximamente!</p>
            <button onClick={() => setShowMemoryGame(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {showSpeedGame && (
        <div className="game-modal">
          <div className="modal-content">
            <h2>⚡ Velocidad</h2>
            <p>¡Próximamente!</p>
            <button onClick={() => setShowSpeedGame(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {showReactionGame && (
        <div className="game-modal">
          <div className="modal-content">
            <h2>🎯 Reacción</h2>
            <p>¡Próximamente!</p>
            <button onClick={() => setShowReactionGame(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {showPuzzleGame && (
        <div className="game-modal">
          <div className="modal-content">
            <h2>🧩 Puzzle</h2>
            <p>¡Próximamente!</p>
            <button onClick={() => setShowPuzzleGame(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Minigames; 