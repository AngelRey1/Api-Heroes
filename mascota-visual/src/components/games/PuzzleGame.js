import React, { useState, useEffect } from 'react';
import './PuzzleGame.css';

const PuzzleGame = ({ onGameEnd }) => {
  const [puzzle, setPuzzle] = useState([]);
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [startTime, setStartTime] = useState(0);

  const createPuzzle = () => {
    const size = 3;
    const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    numbers.push(null); // Espacio vacío
    
    // Mezclar los números
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    return numbers;
  };

  const isSolved = (puzzleArray) => {
    for (let i = 0; i < puzzleArray.length - 1; i++) {
      if (puzzleArray[i] !== i + 1) return false;
    }
    return puzzleArray[puzzleArray.length - 1] === null;
  };

  const canMove = (index) => {
    const size = 3;
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyIndex = puzzle.findIndex(cell => cell === null);
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    
    return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
           (Math.abs(col - emptyCol) === 1 && row === emptyRow);
  };

  const moveTile = (index) => {
    if (!canMove(index)) return;
    
    const newPuzzle = [...puzzle];
    const emptyIndex = newPuzzle.findIndex(cell => cell === null);
    [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];
    
    setPuzzle(newPuzzle);
    setMoves(prev => prev + 1);
    
    if (isSolved(newPuzzle)) {
      endGame();
    }
  };

  const startGame = () => {
    setGameState('playing');
    setPuzzle(createPuzzle());
    setMoves(0);
    setTimeLeft(120);
    setSolved(false);
    setStartTime(Date.now());
  };

  const endGame = () => {
    setGameState('finished');
    setSolved(true);
    const timeUsed = Math.floor((Date.now() - startTime) / 1000);
    const timeBonus = Math.max(0, 120 - timeUsed) * 2;
    const movePenalty = moves * 5;
    const finalScore = Math.max(0, 1000 + timeBonus - movePenalty);
    const coinsEarned = Math.floor(finalScore / 10);
    
    if (onGameEnd) {
      onGameEnd(coinsEarned);
    }
  };

  const restartGame = () => {
    setGameState('waiting');
    setPuzzle([]);
    setMoves(0);
    setTimeLeft(120);
    setSolved(false);
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
    <div className="puzzle-game">
      <div className="game-header">
        <h2>🧩 Juego de Puzzle</h2>
        <div className="game-info">
          <span>Tiempo: {formatTime(timeLeft)}</span>
          <span>Movimientos: {moves}</span>
        </div>
      </div>

      {gameState === 'waiting' && (
        <div className="game-start">
          <h3>¡Ordena los números!</h3>
          <p>Tienes 2 minutos para ordenar los números del 1 al 8</p>
          <button className="start-btn" onClick={startGame}>
            ¡Comenzar!
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-playing">
          <div className="puzzle-board">
            {puzzle.map((tile, index) => (
              <div
                key={index}
                className={`puzzle-tile ${tile === null ? 'empty' : ''} ${canMove(index) ? 'movable' : ''}`}
                onClick={() => moveTile(index)}
              >
                {tile}
              </div>
            ))}
          </div>
          <p className="instruction">Haz clic en las fichas adyacentes al espacio vacío para moverlas</p>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-end">
          <h3>🎉 ¡Puzzle Completado!</h3>
          <div className="final-stats">
            <p>Movimientos: {moves}</p>
            <p>Tiempo usado: {Math.floor((Date.now() - startTime) / 1000)}s</p>
            <p>¡Puzzle resuelto correctamente!</p>
          </div>
          <button className="restart-btn" onClick={restartGame}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default PuzzleGame; 