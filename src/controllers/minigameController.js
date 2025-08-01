import minigameService from '../services/minigameService.js';

/**
 * Obtiene todos los minijuegos disponibles
 */
export const getAllMinigames = async (req, res) => {
  try {
    const minigames = await minigameService.getAllMinigames();
    res.json(minigames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene un minijuego específico
 */
export const getMinigameById = async (req, res) => {
  try {
    const minigame = await minigameService.getMinigameById(req.params.id);
    if (!minigame) {
      return res.status(404).json({ error: 'Minijuego no encontrado' });
    }
    res.json(minigame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Guarda la puntuación de un minijuego
 */
export const saveScore = async (req, res) => {
  try {
    const { score } = req.body;
    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ error: 'Puntuación inválida' });
    }

    const result = await minigameService.saveScore(req.params.id, req.user._id, score);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene las puntuaciones altas de un minijuego
 */
export const getHighScores = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const scores = await minigameService.getHighScores(req.params.id, limit);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene las estadísticas de minijuegos del usuario
 */
export const getUserMinigameStats = async (req, res) => {
  try {
    const stats = await minigameService.getUserMinigameStats(req.user._id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 