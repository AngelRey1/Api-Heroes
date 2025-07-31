import React, { useState, useEffect } from 'react';
import './SpeedGame.css';

const SpeedGame = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [timeLeft, setTimeLeft] = useState(30);
  const [clicks, setClicks] = useState(0);
  const [target, setTarget] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);

  useEffect(() => {
    if (gameState === 'waiting') {
      const timer = setTimeout(() => {
        setGameState('playing');
        setGameStartTime(Date.now());
        setTarget({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const handleTargetClick = () => {
    if (gameState !== 'playing') return;
    
    setClicks(prev => prev + 1);
    setTarget({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
  };

  const endGame = () => {
    setGameState('finished');
    const totalTime = (Date.now() - gameStartTime) / 1000;
    const clicksPerSecond = clicks / totalTime;
    const score = Math.round(clicks * clicksPerSecond * 10);
    onGameEnd(score);
  };

  const getMessage = () => {
    if (gameState === 'waiting') return '¡Prepárate! El juego comenzará en 2 segundos...';
    if (gameState === 'playing') return `¡Haz clic en los círculos! Tiempo: ${timeLeft}s`;
    return '¡Juego terminado!';
  };

  return (
    <div className="speed-game">
      <div className="game-header">
        <h2>⚡ Juego de Velocidad</h2>
        <p className="game-instruction">{getMessage()}</p>
      </div>

      <div className="game-info">
        <div className="info-item">
          <span className="info-label">Clics:</span>
          <span className="info-value">{clicks}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Tiempo:</span>
          <span className="info-value">{timeLeft}s</span>
        </div>
      </div>

      <div className="game-area">
        {gameState === 'playing' && target && (
          <div
            className="target"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`
            }}
            onClick={handleTargetClick}
          >
            🎯
          </div>
        )}
      </div>

      {gameState === 'waiting' && (
        <div className="countdown">
          <div className="countdown-number">3</div>
          <div className="countdown-number">2</div>
          <div className="countdown-number">1</div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-results">
          <h3>¡Resultados!</h3>
          <div className="result-item">
            <span>Clics totales:</span>
            <span>{clicks}</span>
          </div>
          <div className="result-item">
            <span>Tiempo:</span>
            <span>{30 - timeLeft}s</span>
          </div>
          <div className="result-item">
            <span>Velocidad:</span>
            <span>{((clicks / (30 - timeLeft)) * 10).toFixed(1)} clics/s</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedGame; 