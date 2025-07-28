import statisticsService from '../services/statisticsService.js';

/**
 * Obtener estadísticas del usuario
 */
export const getUserStatistics = async (req, res) => {
  try {
    const stats = await statisticsService.getUserStatistics(req.user._id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener estadísticas comparativas
 */
export const getComparativeStatistics = async (req, res) => {
  try {
    const stats = await statisticsService.getComparativeStatistics(req.user._id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener estadísticas globales
 */
export const getGlobalStatistics = async (req, res) => {
  try {
    const stats = await statisticsService.getGlobalStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener historial de actividades
 */
export const getUserActivityHistory = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const history = await statisticsService.getUserActivityHistory(req.user._id, days);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener recomendaciones para el usuario
 */
export const getUserRecommendations = async (req, res) => {
  try {
    const recommendations = await statisticsService.getUserRecommendations(req.user._id);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 