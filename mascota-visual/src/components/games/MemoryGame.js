import React, { useState, useEffect, useCallback } from 'react';
import { saveMinigameScore } from '../../api';
import './MemoryGame.css';

const MemoryGame = ({ game, token, onClose, onScoreUpdate }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.settings?.timeLimit || 60);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Emojis para las cartas
  const emojis = ['🐶', '🐱', '🐰', '🐹', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'];

  // Inicializar el juego
  const initializeGame = useCallback(() => {
    const gridSize = game.settings?.gridSize || 4;
    const totalPairs = (gridSize * gridSize) / 2;
    const selectedEmojis = emojis.slice(0, totalPairs);
    
    // Crear pares de cartas
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    
    // Mezclar las cartas
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setMoves(0);
    setTimeLeft(game.settings?.timeLimit || 60);
    setGameState('waiting');
  }, [game.settings]);

  // Iniciar el juego
  const startGame = () => {
    setGameState('playing');
  };

  // Manejar clic en carta
  const handleCardClick = (cardId) => {
    if (gameState !== 'playing') return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Si hay dos cartas volteadas, verificar si coinciden
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard.emoji === secondCard.emoji) {
        // Coinciden
        setTimeout(() => {
          const updatedCards = newCards.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          );
          setCards(updatedCards);
          setMatchedPairs(prev => [...prev, firstCard.emoji]);
          setScore(prev => prev + 100);
          setFlippedCards([]);
        }, 500);
      } else {
        // No coinciden
        setTimeout(() => {
          const updatedCards = newCards.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          );
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Verificar si el juego terminó
  useEffect(() => {
    if (matchedPairs.length === (cards.length / 2) && cards.length > 0) {
      endGame();
    }
  }, [matchedPairs, cards.length]);

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

  // Terminar el juego
  const endGame = async () => {
    setGameState('finished');
    
    // Calcular puntuación final
    const finalScore = score + (timeLeft * 10) + (matchedPairs.length * 50);
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="memory-game">
      {gameState === 'waiting' && (
        <div className="game-start-screen">
          <h2>🎴 Juego de Memoria</h2>
          <p>Encuentra todos los pares de cartas antes de que se acabe el tiempo.</p>
          <div className="game-info">
            <p><strong>Tiempo:</strong> {formatTime(timeLeft)}</p>
            <p><strong>Pares:</strong> {(cards.length / 2)}</p>
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
              <span>🔄 Movimientos: {moves}</span>
              <span>✅ Pares: {matchedPairs.length}/{cards.length / 2}</span>
            </div>
          </div>

          <div className="cards-grid" style={{ 
            gridTemplateColumns: `repeat(${Math.sqrt(cards.length)}, 1fr)` 
          }}>
            {cards.map(card => (
              <div
                key={card.id}
                className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="card-inner">
                  <div className="card-front">❓</div>
                  <div className="card-back">{card.emoji}</div>
                </div>
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
            <p><strong>Pares Encontrados:</strong> {matchedPairs.length}/{cards.length / 2}</p>
            <p><strong>Movimientos:</strong> {moves}</p>
            <p><strong>Tiempo Restante:</strong> {formatTime(timeLeft)}</p>
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

export default MemoryGame; 