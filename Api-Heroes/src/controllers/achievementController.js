import achievementService from '../services/achievementService.js';

/**
 * Obtiene todos los logros disponibles
 */
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await achievementService.getAllAchievements();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene un logro específico por ID
 */
export const getAchievement = async (req, res) => {
  try {
    const achievement = await achievementService.getAchievementById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ error: 'Logro no encontrado' });
    }
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Crea un nuevo logro
 */
export const createAchievement = async (req, res) => {
  try {
    const achievement = await achievementService.createAchievement(req.body);
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualiza un logro existente
 */
export const updateAchievement = async (req, res) => {
  try {
    const achievement = await achievementService.updateAchievement(req.params.id, req.body);
    if (!achievement) {
      return res.status(404).json({ error: 'Logro no encontrado' });
    }
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Elimina un logro
 */
export const deleteAchievement = async (req, res) => {
  try {
    const result = await achievementService.deleteAchievement(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Logro no encontrado' });
    }
    res.json({ message: 'Logro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reclama un logro (para compatibilidad con rutas existentes)
 */
export const claimAchievement = async (req, res) => {
  try {
    const result = await achievementService.claimAchievement(req.user._id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene los logros del usuario autenticado
 */
export const getUserAchievements = async (req, res) => {
  try {
    const achievements = await achievementService.getUserAchievements(req.user._id);
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Inicializa los logros por defecto
 */
export const initializeAchievements = async (req, res) => {
  try {
    await achievementService.initializeAchievements();
    res.json({ message: 'Logros inicializados correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene logros secretos del usuario
 */
export const getSecretAchievements = async (req, res) => {
  try {
    const achievements = await achievementService.getUserSecretAchievements(req.user._id);
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 