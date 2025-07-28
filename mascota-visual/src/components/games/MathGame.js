import React, { useState, useEffect } from 'react';
import './MathGame.css';

const MathGame = ({ onGameEnd, onClose }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      generateQuestion();
    }
  }, [isPlaying, level]);

  const generateQuestion = () => {
    let num1, num2, operation, answer;
    
    switch (level) {
      case 1:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = '+';
        answer = num1 + num2;
        break;
      case 2:
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operation = Math.random() < 0.5 ? '+' : '-';
        answer = operation === '+' ? num1 + num2 : num1 - num2;
        break;
      case 3:
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        operation = Math.random() < 0.3 ? '+' : Math.random() < 0.5 ? '-' : '×';
        answer = operation === '+' ? num1 + num2 : 
                operation === '-' ? num1 - num2 : num1 * num2;
        break;
      default:
        num1 = Math.floor(Math.random() * 15) + 1;
        num2 = Math.floor(Math.random() * 15) + 1;
        operation = Math.random() < 0.25 ? '+' : Math.random() < 0.5 ? '-' : 
                   Math.random() < 0.75 ? '×' : '÷';
        if (operation === '÷') {
          answer = num1;
          num1 = num1 * num2;
        } else {
          answer = operation === '+' ? num1 + num2 : 
                  operation === '-' ? num1 - num2 : num1 * num2;
        }
    }

    setCurrentQuestion({ num1, num2, operation, answer });
    setUserAnswer('');
    setFeedback('');
  };

  const handleAnswer = () => {
    if (!userAnswer.trim()) return;

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(score + (level * 10));
      setFeedback('¡Correcto! 🎉');
      setTimeout(() => {
        if (score + (level * 10) >= level * 50) {
          setLevel(level + 1);
        }
        generateQuestion();
      }, 1000);
    } else {
      setFeedback(`Incorrecto. La respuesta era ${currentQuestion.answer}`);
      setTimeout(() => {
        generateQuestion();
      }, 2000);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setLevel(1);
  };

  const endGame = () => {
    setIsPlaying(false);
    const coinsEarned = Math.floor(score / 10);
    onGameEnd(coinsEarned);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnswer();
    }
  };

  if (!isPlaying) {
    return (
      <div className="math-game-overlay">
        <div className="math-game-modal">
          <h2>🎮 Juego de Matemáticas</h2>
          <div className="game-instructions">
            <p>Resuelve problemas matemáticos para ganar monedas!</p>
            <ul>
              <li>✅ Respuestas correctas: +{level * 10} puntos</li>
              <li>⏰ Tiempo: 60 segundos</li>
              <li>📈 Nivel: {level}</li>
            </ul>
          </div>
          <div className="game-buttons">
            <button className="start-btn" onClick={startGame}>
              ¡Comenzar!
            </button>
            <button className="close-btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="math-game-overlay">
      <div className="math-game-modal">
        <div className="game-header">
          <h2>🧮 Matemáticas</h2>
          <div className="game-stats">
            <span>⏰ {timeLeft}s</span>
            <span>📊 {score} pts</span>
            <span>📈 Nivel {level}</span>
          </div>
        </div>

        <div className="question-container">
          {currentQuestion && (
            <div className="question">
              <span className="number">{currentQuestion.num1}</span>
              <span className="operation">{currentQuestion.operation}</span>
              <span className="number">{currentQuestion.num2}</span>
              <span className="equals">=</span>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="?"
                className="answer-input"
                autoFocus
              />
            </div>
          )}
        </div>

        {feedback && (
          <div className={`feedback ${feedback.includes('Correcto') ? 'correct' : 'incorrect'}`}>
            {feedback}
          </div>
        )}

        <div className="game-controls">
          <button className="answer-btn" onClick={handleAnswer}>
            Responder
          </button>
          <button className="close-btn" onClick={endGame}>
            Terminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathGame; 