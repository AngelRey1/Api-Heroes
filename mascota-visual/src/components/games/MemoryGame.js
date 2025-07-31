import React, { useState, useEffect, useCallback } from 'react';
import './MemoryGame.css';

const MemoryGame = ({ onGameEnd }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [moves, setMoves] = useState(0);

  // Emojis para las cartas
  const emojis = ['🐶', '🐱', '🐰', '🐹', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'];

  // Inicializar el juego
  const initializeGame = useCallback(() => {
    const gridSize = 4;
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
    setTimeLeft(60);
    setGameState('waiting');
  }, []);

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

  // Finalizar el juego
  const endGame = () => {
    setGameState('finished');
    const finalScore = Math.max(0, score - (moves * 5));
    const coinsEarned = Math.floor(finalScore / 10);
    if (onGameEnd) {
      onGameEnd(coinsEarned);
    }
  };

  // Reiniciar el juego
  const restartGame = () => {
    initializeGame();
  };

  // Formatear tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Efecto para el temporizador
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

  // Verificar si el juego está completo
  useEffect(() => {
    if (matchedPairs.length === 8 && gameState === 'playing') {
      setTimeout(() => {
        endGame();
      }, 500);
    }
  }, [matchedPairs, gameState]);

  // Inicializar el juego al montar el componente
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="memory-game">
      <div className="game-header">
        <div className="game-info">
          <div className="info-item">
            <span className="info-label">Tiempo:</span>
            <span className="info-value">{formatTime(timeLeft)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Puntuación:</span>
            <span className="info-value">{score}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Movimientos:</span>
            <span className="info-value">{moves}</span>
          </div>
        </div>
      </div>

      {gameState === 'waiting' && (
        <div className="game-start">
          <h2>🎮 Juego de Memoria</h2>
          <p>Encuentra todas las parejas antes de que se acabe el tiempo</p>
          <button className="start-btn" onClick={startGame}>
            ¡Comenzar!
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-board">
          <div className="cards-grid">
            {cards.map((card) => (
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
        <div className="game-end">
          <h2>🎉 ¡Juego Terminado!</h2>
          <div className="final-stats">
            <p>Puntuación final: {score}</p>
            <p>Movimientos: {moves}</p>
            <p>Parejas encontradas: {matchedPairs.length}/8</p>
          </div>
          <button className="restart-btn" onClick={restartGame}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame; 