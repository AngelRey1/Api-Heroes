import React, { useState, useEffect } from 'react';
import './ReactionGame.css';

const ReactionGame = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, playing, finished
  const [reactionTimes, setReactionTimes] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [rounds] = useState(5);
  const [countdown, setCountdown] = useState(3);

  const startGame = () => {
    setGameState('ready');
    setReactionTimes([]);
    setCurrentRound(0);
    setCountdown(3);
  };

  const handleStartRound = () => {
    const delay = Math.random() * 3000 + 1000; // 1-4 segundos
    setGameState('waiting');
    
    setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      const reactionTime = Date.now() - startTime;
      const newReactionTimes = [...reactionTimes, reactionTime];
      setReactionTimes(newReactionTimes);
      
      if (currentRound + 1 < rounds) {
        setCurrentRound(currentRound + 1);
        setGameState('waiting');
        setTimeout(handleStartRound, 1000);
      } else {
        endGame(newReactionTimes);
      }
    }
  };

  const endGame = (times) => {
    setGameState('finished');
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    const bestTime = Math.min(...times);
    const score = Math.max(0, 1000 - Math.floor(averageTime));
    const coinsEarned = Math.floor(score / 10);
    
    if (onGameEnd) {
      onGameEnd(coinsEarned);
    }
  };

  const restartGame = () => {
    setGameState('waiting');
    setReactionTimes([]);
    setCurrentRound(0);
    setCountdown(3);
  };

  useEffect(() => {
    if (gameState === 'ready') {
      const timer = setTimeout(() => {
        setGameState('waiting');
        setCurrentRound(prev => prev + 1);
        if (currentRound + 1 < rounds) {
          setTimeout(handleStartRound, 1000);
        } else {
          endGame(reactionTimes);
        }
      }, 3000); // 3 segundos para reaccionar

      return () => clearTimeout(timer);
    }
  }, [gameState, currentRound, rounds, reactionTimes]);

  useEffect(() => {
    if (gameState === 'ready' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, countdown]);

  return (
    <div className="reaction-game">
      <div className="game-header">
        <h2>🎯 Juego de Reacción</h2>
        <div className="game-info">
          <span>Ronda: {currentRound + 1}/{rounds}</span>
          <span>Mejor tiempo: {reactionTimes.length > 0 ? Math.min(...reactionTimes) + 'ms' : 'N/A'}</span>
        </div>
      </div>

      {gameState === 'waiting' && (
        <div className="game-start">
          <h3>¡Preparado!</h3>
          <p>Haz clic cuando veas el círculo verde</p>
          <button className="start-btn" onClick={startGame}>
            ¡Comenzar!
          </button>
        </div>
      )}

      {gameState === 'ready' && (
        <div className="game-playing">
          <div className="target-area">
            <div 
              className={`target ${countdown > 0 ? 'countdown' : 'active'}`}
              onClick={handleClick}
            >
              {countdown > 0 ? countdown : '¡CLIC!'}
            </div>
          </div>
          <p className="instruction">¡Haz clic lo más rápido posible!</p>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-end">
          <h3>🎉 ¡Juego Terminado!</h3>
          <div className="final-stats">
            <p>Tiempo promedio: {Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)}ms</p>
            <p>Mejor tiempo: {Math.min(...reactionTimes)}ms</p>
            <p>Peor tiempo: {Math.max(...reactionTimes)}ms</p>
          </div>
          <button className="restart-btn" onClick={restartGame}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default ReactionGame; 