import React, { useState, useEffect } from 'react';
import './MathGame.css';

const MathGame = ({ onGameEnd }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const generateQuestion = () => {
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
        num1 = Math.floor(Math.random() * 50) + 25;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
    }

    return {
      question: `${num1} ${operation} ${num2} = ?`,
      answer: answer,
      num1,
      num2,
      operation
    };
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setCurrentQuestion(generateQuestion());
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!currentQuestion) return;

    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentQuestion.answer;

    if (isCorrect) {
      const timeBonus = Math.max(0, 30 - timeLeft) * 2;
      const basePoints = 50;
      const points = basePoints + timeBonus;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    }

    setQuestionsAnswered(prev => prev + 1);
    setUserAnswer('');
    setCurrentQuestion(generateQuestion());
  };

  const endGame = () => {
    setGameState('finished');
    const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;
    const finalScore = Math.floor(score * (accuracy / 100));
    const coinsEarned = Math.floor(finalScore / 10);
    
    if (onGameEnd) {
      onGameEnd(coinsEarned);
    }
  };

  const restartGame = () => {
    setGameState('waiting');
    setScore(0);
    setTimeLeft(60);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setUserAnswer('');
    setCurrentQuestion(null);
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="math-game">
      <div className="game-header">
        <h2>🧮 Juego de Matemáticas</h2>
        <div className="game-info">
          <span>Tiempo: {formatTime(timeLeft)}</span>
          <span>Puntuación: {score}</span>
          <span>Correctas: {correctAnswers}/{questionsAnswered}</span>
        </div>
      </div>

      {gameState === 'waiting' && (
        <div className="game-start">
          <h3>¡Resuelve problemas matemáticos!</h3>
          <p>Tienes 60 segundos para resolver el mayor número de problemas</p>
          <button className="start-btn" onClick={startGame}>
            ¡Comenzar!
          </button>
        </div>
      )}

      {gameState === 'playing' && currentQuestion && (
        <div className="game-playing">
          <div className="question-area">
            <h3 className="question">{currentQuestion.question}</h3>
            <form onSubmit={handleAnswerSubmit} className="answer-form">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Tu respuesta"
                className="answer-input"
                autoFocus
              />
              <button type="submit" className="submit-btn">
                Responder
              </button>
            </form>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-end">
          <h3>🎉 ¡Juego Terminado!</h3>
          <div className="final-stats">
            <p>Puntuación final: {score}</p>
            <p>Problemas resueltos: {correctAnswers}/{questionsAnswered}</p>
            <p>Precisión: {questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}%</p>
          </div>
          <button className="restart-btn" onClick={restartGame}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default MathGame; 