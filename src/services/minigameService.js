import Minigame from '../models/minigameModel.js';
import User from '../models/userModel.js';

// Minijuegos predefinidos
const DEFAULT_MINIGAMES = [
  {
    name: 'Memoria de Mascotas',
    description: 'Encuentra las parejas de mascotas iguales',
    type: 'memory',
    difficulty: 'easy',
    icon: '🐾',
    baseReward: 15,
    maxReward: 60,
    instructions: 'Haz clic en las cartas para encontrar parejas iguales. ¡Cuanto más rápido, mejor puntuación!',
    settings: {
      gridSize: 4,
      timeLimit: 60,
      cardTypes: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'turtle', 'guinea_pig']
    }
  },
  {
    name: 'Velocidad de Alimentación',
    description: 'Alimenta a las mascotas lo más rápido posible',
    type: 'speed',
    difficulty: 'medium',
    icon: '🍖',
    baseReward: 20,
    maxReward: 80,
    instructions: 'Haz clic en las mascotas hambrientas para alimentarlas. ¡Evita las que ya están llenas!',
    settings: {
      duration: 30,
      spawnRate: 1000,
      maxPets: 8
    }
  },
  {
    name: 'Puzzle de Colores',
    description: 'Organiza los bloques de colores en el orden correcto',
    type: 'puzzle',
    difficulty: 'hard',
    icon: '🎨',
    baseReward: 25,
    maxReward: 100,
    instructions: 'Mueve los bloques para crear el patrón de colores correcto. ¡Menos movimientos = mejor puntuación!',
    settings: {
      gridSize: 3,
      maxMoves: 50,
      colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'brown']
    }
  },
  {
    name: 'Reacción Rápida',
    description: 'Reacciona a los estímulos visuales lo más rápido posible',
    type: 'reaction',
    difficulty: 'medium',
    icon: '⚡',
    baseReward: 18,
    maxReward: 70,
    instructions: 'Haz clic cuando veas el color correcto. ¡Cuidado con los distractores!',
    settings: {
      rounds: 10,
      minDelay: 1000,
      maxDelay: 3000,
      targetColor: 'green'
    }
  },
  {
    name: 'Matemáticas de Mascotas',
    description: 'Resuelve problemas matemáticos relacionados con mascotas',
    type: 'math',
    difficulty: 'easy',
    icon: '🧮',
    baseReward: 12,
    maxReward: 50,
    instructions: 'Resuelve las operaciones matemáticas. ¡Respuestas correctas y rápidas dan más puntos!',
    settings: {
      rounds: 8,
      timeLimit: 15,
      operations: ['addition', 'subtraction', 'multiplication'],
      maxNumber: 20
    }
  }
];

// Inicializar minijuegos por defecto
async function initializeMinigames() {
  for (const gameData of DEFAULT_MINIGAMES) {
    const exists = await Minigame.findOne({ name: gameData.name });
    if (!exists) {
      await Minigame.create(gameData);
    }
  }
}

// Obtener todos los minijuegos activos
async function getAllMinigames() {
  try {
    return await Minigame.find({ isActive: true }).sort({ difficulty: 1 });
  } catch (error) {
    console.error('Error getting minigames:', error);
    return [];
  }
}

// Obtener minijuego por ID
async function getMinigameById(minigameId) {
  try {
    return await Minigame.findById(minigameId);
  } catch (error) {
    console.error('Error getting minigame:', error);
    return null;
  }
}

// Guardar puntuación y otorgar recompensa
async function saveScore(minigameId, userId, score) {
  try {
    const minigame = await Minigame.findById(minigameId);
    const user = await User.findById(userId);
    
    if (!minigame || !user) {
      throw new Error('Minijuego o usuario no encontrado');
    }

    // Calcular recompensa basada en la puntuación
    const maxScore = minigame.maxReward;
    const baseScore = minigame.baseReward;
    const reward = Math.floor(baseScore + (score / maxScore) * (minigame.maxReward - minigame.baseReward));

    // Actualizar puntuación más alta del usuario
    let highScore = user.highScores.find(hs => hs.minigameId.toString() === minigameId.toString());
    let isNewRecord = false;

    if (!highScore) {
      user.highScores.push({ minigameId, score });
      isNewRecord = true;
    } else if (score > highScore.score) {
      highScore.score = score;
      isNewRecord = true;
    }

    // Actualizar estadísticas del usuario
    user.minigameStats.gamesPlayed += 1;
    user.minigameStats.totalScore += score;
    user.minigameStats.coinsEarned += reward;
    user.coins = (user.coins || 0) + reward;

    await user.save();

    return {
      score,
      reward,
      isNewRecord,
      newCoins: user.coins,
      stats: user.minigameStats
    };
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
}

// Obtener puntuaciones altas de un minijuego
async function getHighScores(minigameId, limit = 10) {
  try {
    const users = await User.find({
      'highScores.minigameId': minigameId
    }).populate('heroes');

    const scores = users
      .map(user => {
        const highScore = user.highScores.find(hs => hs.minigameId.toString() === minigameId.toString());
        return {
          userId: user._id,
          username: user.username,
          score: highScore ? highScore.score : 0,
          heroName: user.heroes && user.heroes.length > 0 ? user.heroes[0].name : user.username
        };
      })
      .filter(score => score.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scores;
  } catch (error) {
    console.error('Error getting high scores:', error);
    return [];
  }
}

// Obtener estadísticas de minijuegos del usuario
async function getUserMinigameStats(userId) {
  try {
    const user = await User.findById(userId).populate('highScores.minigameId');
    return {
      stats: user.minigameStats,
      highScores: user.highScores,
      games: await getAllMinigames()
    };
  } catch (error) {
    console.error('Error getting user minigame stats:', error);
    return null;
  }
}

export default {
  initializeMinigames,
  getAllMinigames,
  getMinigameById,
  saveScore,
  getHighScores,
  getUserMinigameStats
}; 