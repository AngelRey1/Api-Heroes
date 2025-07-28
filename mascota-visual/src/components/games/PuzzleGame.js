import React, { useState, useEffect, useCallback } from 'react';
import { saveMinigameScore } from '../../api';
import './PuzzleGame.css';

const PuzzleGame = ({ game, token, onClose, onScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [puzzle, setPuzzle] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gridSize, setGridSize] = useState(game.settings?.gridSize || 3);
  const [maxMoves, setMaxMoves] = useState(game.settings?.maxMoves || 100);

  // Inicializar el juego
  const initializeGame = useCallback(() => {
    setScore(0);
    setMoves(0);
    setTimeElapsed(0);
    setGameState('waiting');
    generatePuzzle();
  }, [gridSize]);

  // Generar puzzle aleatorio
  const generatePuzzle = () => {
    const totalTiles = gridSize * gridSize;
    const numbers = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    numbers.push(0); // Espacio vacío
    
    // Mezclar los números
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Convertir a matriz 2D
    const puzzleArray = [];
    for (let i = 0; i < gridSize; i++) {
      puzzleArray.push(numbers.slice(i * gridSize, (i + 1) * gridSize));
    }

    setPuzzle(puzzleArray);
  };

  // Verificar si el puzzle está resuelto
  const isPuzzleSolved = (puzzleArray) => {
    const totalTiles = gridSize * gridSize;
    let expectedValue = 1;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (i === gridSize - 1 && j === gridSize - 1) {
          // Última posición debe ser 0 (espacio vacío)
          if (puzzleArray[i][j] !== 0) return false;
        } else {
          if (puzzleArray[i][j] !== expectedValue) return false;
          expectedValue++;
        }
      }
    }
    return true;
  };

  // Encontrar la posición del espacio vacío
  const findEmptyPosition = (puzzleArray) => {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (puzzleArray[i][j] === 0) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  };

  // Verificar si un movimiento es válido
  const isValidMove = (row, col, emptyPos) => {
    return (
      (Math.abs(row - emptyPos.row) === 1 && col === emptyPos.col) ||
      (Math.abs(col - emptyPos.col) === 1 && row === emptyPos.row)
    );
  };

  // Manejar clic en una ficha
  const handleTileClick = (row, col) => {
    if (gameState !== 'playing') return;

    const emptyPos = findEmptyPosition(puzzle);
    if (!emptyPos) return;

    if (isValidMove(row, col, emptyPos)) {
      // Realizar el movimiento
      const newPuzzle = puzzle.map(row => [...row]);
      newPuzzle[emptyPos.row][emptyPos.col] = newPuzzle[row][col];
      newPuzzle[row][col] = 0;

      setPuzzle(newPuzzle);
      setMoves(prev => prev + 1);

      // Verificar si el puzzle está resuelto
      if (isPuzzleSolved(newPuzzle)) {
        endGame();
      }
    }
  };

  // Iniciar el juego
  const startGame = () => {
    setGameState('playing');
    setTimeElapsed(0);
  };

  // Timer del juego
  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Terminar el juego
  const endGame = async () => {
    setGameState('finished');
    
    // Calcular puntuación basada en movimientos y tiempo
    const baseScore = 1000;
    const movePenalty = moves * 5;
    const timePenalty = timeElapsed * 2;
    const finalScore = Math.max(0, baseScore - movePenalty - timePenalty);
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

  // Renderizar ficha individual
  const renderTile = (value, row, col) => {
    if (value === 0) {
      return (
        <div className="tile empty" key={`${row}-${col}`}>
          &nbsp;
        </div>
      );
    }

    return (
      <div
        className="tile"
        key={`${row}-${col}`}
        onClick={() => handleTileClick(row, col)}
      >
        {value}
      </div>
    );
  };

  return (
    <div className="puzzle-game">
      {gameState === 'waiting' && (
        <div className="game-start-screen">
          <h2>🧩 Juego de Puzzle</h2>
          <p>Ordena los números del 1 al {gridSize * gridSize - 1} moviendo las fichas.</p>
          <div className="game-info">
            <p><strong>Tamaño del tablero:</strong> {gridSize}x{gridSize}</p>
            <p><strong>Máximo movimientos:</strong> {maxMoves}</p>
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
              <span>⏱️ Tiempo: {formatTime(timeElapsed)}</span>
              <span>🔄 Movimientos: {moves}</span>
              <span>🎯 Puntuación: {score}</span>
              <span>📊 Restantes: {maxMoves - moves}</span>
            </div>
          </div>

          <div className="puzzle-container">
            <div 
              className="puzzle-grid"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
              }}
            >
              {puzzle.map((row, rowIndex) =>
                row.map((value, colIndex) =>
                  renderTile(value, rowIndex, colIndex)
                )
              )}
            </div>
          </div>

          <div className="puzzle-controls">
            <button className="restart-button" onClick={restartGame}>
              🔄 Reiniciar
            </button>
            <button className="close-button" onClick={onClose}>
              ✕ Salir
            </button>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-finished">
          <h2>🎉 ¡Puzzle Completado!</h2>
          <div className="final-stats">
            <p><strong>Puntuación Final:</strong> {bestScore}</p>
            <p><strong>Movimientos:</strong> {moves}</p>
            <p><strong>Tiempo:</strong> {formatTime(timeElapsed)}</p>
            <p><strong>Eficiencia:</strong> {moves > 0 ? Math.round((gridSize * gridSize * 2) / moves * 100) : 0}%</p>
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

export default PuzzleGame; 