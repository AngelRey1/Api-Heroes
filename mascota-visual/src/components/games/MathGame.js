import React, { useState, useEffect, useCallback } from 'react';
import { saveMinigameScore } from '../../api';
import './MathGame.css';

const MathGame = ({ game, token, onClose, onScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.settings?.timeLimit || 10);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [round, setRound] = useState(1);

  // Inicializar el juego
  const initializeGame = useCallback(() => {
    setScore(0);
    setTimeLeft(game.settings?.timeLimit || 10);
    setCurrentProblem(null);
    setUserAnswer('');
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setStreak(0);
    setRound(1);
    setGameState('waiting');
  }, [game.settings]);

  // Generar problema matemático
  const generateProblem = () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, answer;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
    }

    return {
      num1,
      num2,
      operation,
      answer,
      question: `${num1} ${operation} ${num2} = ?`
    };
  };

  // Iniciar el juego
  const startGame = () => {
    setGameState('playing');
    setCurrentProblem(generateProblem());
    setTimeLeft(game.settings?.timeLimit || 10);
  };

  // Manejar respuesta del usuario
  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) return;

    const userAnswerNum = parseInt(userAnswer);
    const isCorrect = userAnswerNum === currentProblem.answer;

    if (isCorrect) {
      // Calcular puntos basados en tiempo restante y racha
      const timeBonus = Math.floor(timeLeft * 2);
      const streakBonus = Math.floor(streak * 5);
      const basePoints = 10;
      const points = basePoints + timeBonus + streakBonus;

      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      // Efecto visual de respuesta correcta
      showFeedback(true, points);
    } else {
      setWrongAnswers(prev => prev + 1);
      setStreak(0);
      showFeedback(false);
    }

    // Generar nuevo problema
    setUserAnswer('');
    setRound(prev => prev + 1);
    setCurrentProblem(generateProblem());
    setTimeLeft(game.settings?.timeLimit || 10);
  };

  // Mostrar feedback visual
  const showFeedback = (isCorrect, points = 0) => {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.textContent = isCorrect ? `¡Correcto! +${points}` : 'Incorrecto';
    feedback.style.position = 'fixed';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.zIndex = '1000';
    feedback.style.fontSize = '2rem';
    feedback.style.fontWeight = 'bold';
    feedback.style.padding = '20px';
    feedback.style.borderRadius = '10px';
    feedback.style.color = 'white';
    feedback.style.background = isCorrect ? '#4CAF50' : '#f44336';
    feedback.style.animation = 'feedbackPop 0.5s ease-out';
    
    document.body.appendChild(feedback);

    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 1000);
  };

  // Timer del juego
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Tiempo agotado, contar como respuesta incorrecta
            setWrongAnswers(prev => prev + 1);
            setStreak(0);
            setRound(prev => prev + 1);
            setCurrentProblem(generateProblem());
            return game.settings?.timeLimit || 10;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState, timeLeft, game.settings]);

  // Terminar el juego después de cierto número de rondas
  useEffect(() => {
    if (round > (game.settings?.rounds || 10)) {
      endGame();
    }
  }, [round, game.settings]);

  // Terminar el juego
  const endGame = async () => {
    setGameState('finished');
    
    // Calcular puntuación final
    const accuracy = correctAnswers + wrongAnswers > 0 
      ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) 
      : 0;
    const finalScore = score + (accuracy * 5) + (correctAnswers * 10);
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
    <div className="math-game">
      {gameState === 'waiting' && (
        <div className="game-start-screen">
          <h2>🧮 Juego de Matemáticas</h2>
          <p>Resuelve las operaciones matemáticas antes de que se acabe el tiempo.</p>
          <div className="game-info">
            <p><strong>Rondas:</strong> {game.settings?.rounds || 10}</p>
            <p><strong>Tiempo por pregunta:</strong> {formatTime(game.settings?.timeLimit || 10)}</p>
            <p><strong>Mejor puntuación:</strong> {bestScore}</p>
          </div>
          <button className="start-button" onClick={startGame}>
            🚀 Comenzar Juego
          </button>
        </div>
      )}

      {gameState === 'playing' && currentProblem && (
        <div className="game-playing">
          <div className="game-header">
            <div className="game-stats">
              <span>⏱️ Tiempo: {formatTime(timeLeft)}</span>
              <span>🎯 Puntuación: {score}</span>
              <span>✅ Correctas: {correctAnswers}</span>
              <span>❌ Incorrectas: {wrongAnswers}</span>
              <span>🔥 Racha: {streak}</span>
              <span>📊 Ronda: {round}/{game.settings?.rounds || 10}</span>
            </div>
          </div>

          <div className="problem-container">
            <div className="problem-display">
              <h2 className="problem-text">{currentProblem.question}</h2>
              <div className="timer-bar">
                <div 
                  className="timer-fill" 
                  style={{ 
                    width: `${(timeLeft / (game.settings?.timeLimit || 10)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleAnswerSubmit} className="answer-form">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Tu respuesta..."
                className="answer-input"
                autoFocus
              />
              <button type="submit" className="submit-button">
                Responder
              </button>
            </form>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-finished">
          <h2>🎉 ¡Juego Terminado!</h2>
          <div className="final-stats">
            <p><strong>Puntuación Final:</strong> {bestScore}</p>
            <p><strong>Respuestas Correctas:</strong> {correctAnswers}</p>
            <p><strong>Respuestas Incorrectas:</strong> {wrongAnswers}</p>
            <p><strong>Precisión:</strong> {correctAnswers + wrongAnswers > 0 ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) : 0}%</p>
            <p><strong>Mejor Racha:</strong> {streak}</p>
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

export default MathGame; 