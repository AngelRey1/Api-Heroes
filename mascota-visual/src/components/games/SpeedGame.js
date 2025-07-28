import React, { useState, useEffect, useCallback } from 'react';
import { saveMinigameScore } from '../../api';
import './SpeedGame.css';

const SpeedGame = ({ game, token, onClose, onScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.settings?.duration || 30);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [targets, setTargets] = useState([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Inicializar el juego
  const initializeGame = useCallback(() => {
    setScore(0);
    setTimeLeft(game.settings?.duration || 30);
    setTargets([]);
    setHits(0);
    setMisses(0);
    setAccuracy(0);
    setGameState('waiting');
  }, [game.settings]);

  // Iniciar el juego
  const startGame = () => {
    setGameState('playing');
    spawnTarget();
  };

  // Generar posición aleatoria
  const getRandomPosition = () => {
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;
    return {
      x: Math.random() * maxX,
      y: Math.random() * maxY
    };
  };

  // Crear un nuevo objetivo
  const spawnTarget = () => {
    if (gameState !== 'playing') return;

    const position = getRandomPosition();
    const newTarget = {
      id: Date.now(),
      x: position.x,
      y: position.y,
      size: Math.random() * 30 + 40, // Tamaño entre 40-70px
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      points: Math.floor(Math.random() * 3) + 1, // 1-3 puntos
      createdAt: Date.now()
    };

    setTargets(prev => [...prev, newTarget]);

    // El objetivo desaparece después de 2 segundos
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
      setMisses(prev => prev + 1);
    }, 2000);
  };

  // Manejar clic en objetivo
  const handleTargetClick = (targetId) => {
    if (gameState !== 'playing') return;

    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    // Calcular puntos basados en velocidad de respuesta
    const responseTime = Date.now() - target.createdAt;
    const timeBonus = Math.max(0, 2000 - responseTime) / 2000; // Bonus por velocidad
    const points = Math.floor(target.points * (1 + timeBonus));

    setScore(prev => prev + points);
    setHits(prev => prev + 1);
    setTargets(prev => prev.filter(t => t.id !== targetId));

    // Crear efecto visual de puntos
    createPointsEffect(target.x, target.y, points);
  };

  // Crear efecto visual de puntos
  const createPointsEffect = (x, y, points) => {
    const effect = document.createElement('div');
    effect.className = 'points-effect';
    effect.textContent = `+${points}`;
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    document.body.appendChild(effect);

    setTimeout(() => {
      document.body.removeChild(effect);
    }, 1000);
  };

  // Manejar clic fuera de objetivos
  const handleBackgroundClick = (e) => {
    if (gameState !== 'playing' || e.target.className === 'target') return;
    setMisses(prev => prev + 1);
  };

  // Timer del juego
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState, timeLeft]);

  // Spawn de objetivos
  useEffect(() => {
    if (gameState === 'playing') {
      const spawnInterval = setInterval(() => {
        spawnTarget();
      }, Math.random() * 1000 + 500); // Entre 0.5 y 1.5 segundos

      return () => clearInterval(spawnInterval);
    }
  }, [gameState]);

  // Calcular precisión
  useEffect(() => {
    const total = hits + misses;
    if (total > 0) {
      setAccuracy(Math.round((hits / total) * 100));
    }
  }, [hits, misses]);

  // Terminar el juego
  const endGame = async () => {
    setGameState('finished');
    
    // Calcular puntuación final
    const finalScore = score + (accuracy * 10) + (hits * 5);
    setBestScore(finalScore);

    // Guardar puntuación en el servidor
    if (token) {
      try {
        await saveMinigameScore(game._id, finalScore, token);
        if (onScoreUpdate) onScoreUpdate();
      } catch (error) {
        console.error('Error al guardar puntuación:', error);
      }
    }
  };

  // Reiniciar juego
  const restartGame = () => {
    initializeGame();
  };

  // Formatear tiempo
  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  return (
    <div className="speed-game" onClick={handleBackgroundClick}>
      {gameState === 'waiting' && (
        <div className="game-start-screen">
          <h2>⚡ Juego de Velocidad</h2>
          <p>Haz clic en los objetivos que aparecen antes de que desaparezcan.</p>
          <div className="game-info">
            <p><strong>Duración:</strong> {formatTime(timeLeft)}</p>
            <p><strong>Objetivo:</strong> Haz clic en tantos objetivos como puedas</p>
            <p><strong>Mejor puntuación:</strong> {bestScore}</p>
          </div>
          <button className="start-button" onClick={startGame}>
            🚀 Comenzar Juego
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-playing">
          <div className="game-header">
            <div className="game-stats">
              <span>⏱️ Tiempo: {formatTime(timeLeft)}</span>
              <span>🎯 Puntuación: {score}</span>
              <span>✅ Aciertos: {hits}</span>
              <span>❌ Fallos: {misses}</span>
              <span>🎯 Precisión: {accuracy}%</span>
            </div>
          </div>

          <div className="game-area">
            {targets.map(target => (
              <div
                key={target.id}
                className="target"
                style={{
                  left: target.x,
                  top: target.y,
                  width: target.size,
                  height: target.size,
                  backgroundColor: target.color,
                  fontSize: target.size * 0.4
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTargetClick(target.id);
                }}
              >
                {target.points}
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-finished">
          <h2>🎉 ¡Juego Terminado!</h2>
          <div className="final-stats">
            <p><strong>Puntuación Final:</strong> {bestScore}</p>
            <p><strong>Aciertos:</strong> {hits}</p>
            <p><strong>Fallos:</strong> {misses}</p>
            <p><strong>Precisión:</strong> {accuracy}%</p>
            <p><strong>Puntuación Base:</strong> {score}</p>
          </div>
          
          <div className="game-actions">
            <button className="restart-button" onClick={restartGame}>
              🔄 Jugar de Nuevo
            </button>
            <button className="close-button" onClick={onClose}>
              ✕ Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedGame; 