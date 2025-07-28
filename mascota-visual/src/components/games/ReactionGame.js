import React, { useState, useEffect, useCallback } from 'react';
import { saveMinigameScore } from '../../api';
import './ReactionGame.css';

const ReactionGame = ({ game, token, onClose, onScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [currentRound, setCurrentRound] = useState(1);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [currentColor, setCurrentColor] = useState(null);
  const [targetColor, setTargetColor] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [rounds, setRounds] = useState(game.settings?.rounds || 10);
  const [bestScore, setBestScore] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const targetColors = ['red', 'blue', 'green'];

  // Inicializar el juego
  const initializeGame = useCallback(() => {
    setScore(0);
    setCurrentRound(1);
    setReactionTimes([]);
    setCurrentColor(null);
    setTargetColor(null);
    setStartTime(null);
    setCorrectClicks(0);
    setWrongClicks(0);
    setGameState('waiting');
  }, []);

  // Iniciar el juego
  const startGame = () => {
    setGameState('playing');
    startNewRound();
  };

  // Iniciar nueva ronda
  const startNewRound = () => {
    // Seleccionar color objetivo
    const newTargetColor = targetColors[Math.floor(Math.random() * targetColors.length)];
    setTargetColor(newTargetColor);

    // Esperar un tiempo aleatorio antes de mostrar el color
    const delay = Math.random() * 3000 + 1000; // Entre 1-4 segundos
    
    setTimeout(() => {
      if (gameState === 'playing') {
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        setCurrentColor(newColor);
        setStartTime(Date.now());
      }
    }, delay);
  };

  // Manejar clic en el área de color
  const handleColorClick = () => {
    if (gameState !== 'playing' || !currentColor || !startTime) return;

    const reactionTime = Date.now() - startTime;
    const isCorrect = currentColor === targetColor;

    if (isCorrect) {
      // Calcular puntos basados en velocidad de reacción
      const timeBonus = Math.max(0, 2000 - reactionTime) / 2000;
      const basePoints = 50;
      const points = Math.floor(basePoints * (1 + timeBonus));

      setScore(prev => prev + points);
      setCorrectClicks(prev => prev + 1);
      setReactionTimes(prev => [...prev, reactionTime]);
      
      showFeedback(true, points, reactionTime);
    } else {
      setWrongClicks(prev => prev + 1);
      showFeedback(false, 0, reactionTime);
    }

    // Limpiar estado actual
    setCurrentColor(null);
    setStartTime(null);

    // Pasar a la siguiente ronda o terminar
    if (currentRound < rounds) {
      setCurrentRound(prev => prev + 1);
      setTimeout(startNewRound, 1000);
    } else {
      endGame();
    }
  };

  // Mostrar feedback visual
  const showFeedback = (isCorrect, points, reactionTime) => {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.textContent = isCorrect 
      ? `¡Correcto! +${points} (${reactionTime}ms)` 
      : `Incorrecto (${reactionTime}ms)`;
    feedback.style.position = 'fixed';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.zIndex = '1000';
    feedback.style.fontSize = '1.5rem';
    feedback.style.fontWeight = 'bold';
    feedback.style.padding = '20px';
    feedback.style.borderRadius = '10px';
    feedback.style.color = 'white';
    feedback.style.background = isCorrect ? '#4CAF50' : '#f44336';
    feedback.style.animation = 'feedbackPop 0.5s ease-out';
    
    document.body.appendChild(feedback);

    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 1500);
  };

  // Terminar el juego
  const endGame = async () => {
    setGameState('finished');
    
    // Calcular puntuación final
    const avgReactionTime = reactionTimes.length > 0 
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    const accuracy = correctClicks + wrongClicks > 0 
      ? Math.round((correctClicks / (correctClicks + wrongClicks)) * 100) 
      : 0;
    const finalScore = score + (accuracy * 10) + (correctClicks * 20);
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

  // Obtener color CSS
  const getColorCSS = (colorName) => {
    const colorMap = {
      red: '#ff4757',
      blue: '#3742fa',
      green: '#2ed573',
      yellow: '#ffa502',
      purple: '#a55eea',
      orange: '#ff6348'
    };
    return colorMap[colorName] || '#333';
  };

  return (
    <div className="reaction-game">
      {gameState === 'waiting' && (
        <div className="game-start-screen">
          <h2>⚡ Juego de Reacción</h2>
          <p>Haz clic cuando aparezca el color objetivo: <strong>{targetColors.join(', ')}</strong></p>
          <div className="game-info">
            <p><strong>Rondas:</strong> {rounds}</p>
            <p><strong>Colores objetivo:</strong> {targetColors.join(', ')}</p>
            <p><strong>Mejor puntuación:</strong> {bestScore}</p>
          </div>
          <div className="color-examples">
            {targetColors.map(color => (
              <div 
                key={color}
                className="color-example"
                style={{ backgroundColor: getColorCSS(color) }}
              >
                {color}
              </div>
            ))}
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
              <span>🎯 Puntuación: {score}</span>
              <span>📊 Ronda: {currentRound}/{rounds}</span>
              <span>✅ Correctos: {correctClicks}</span>
              <span>❌ Incorrectos: {wrongClicks}</span>
              <span>🎯 Objetivo: <span style={{ color: getColorCSS(targetColor) }}>{targetColor}</span></span>
            </div>
          </div>

          <div className="game-area">
            {targetColor && (
              <div className="target-display">
                Haz clic cuando aparezca: <span style={{ color: getColorCSS(targetColor) }}>{targetColor}</span>
              </div>
            )}
            
            <div 
              className={`color-area ${currentColor ? 'active' : ''}`}
              style={{ 
                backgroundColor: currentColor ? getColorCSS(currentColor) : '#333',
                cursor: currentColor ? 'pointer' : 'default'
              }}
              onClick={handleColorClick}
            >
              {currentColor ? (
                <div className="color-text">
                  {currentColor}
                </div>
              ) : (
                <div className="waiting-text">
                  Esperando...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-finished">
          <h2>🎉 ¡Juego Terminado!</h2>
          <div className="final-stats">
            <p><strong>Puntuación Final:</strong> {bestScore}</p>
            <p><strong>Clics Correctos:</strong> {correctClicks}</p>
            <p><strong>Clics Incorrectos:</strong> {wrongClicks}</p>
            <p><strong>Precisión:</strong> {correctClicks + wrongClicks > 0 ? Math.round((correctClicks / (correctClicks + wrongClicks)) * 100) : 0}%</p>
            <p><strong>Tiempo Promedio:</strong> {reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0}ms</p>
            <p><strong>Mejor Tiempo:</strong> {reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0}ms</p>
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

      <style jsx>{`
        @keyframes feedbackPop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ReactionGame; 