import secretAchievementService from '../services/secretAchievementService.js';

/**
 * Obtener logros secretos del usuario
 */
export const getUserSecretAchievements = async (req, res) => {
  try {
    const secretAchievements = await secretAchievementService.getUserSecretAchievements(req.user._id);
    res.json(secretAchievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Verificar trigger de logro secreto
 */
export const checkSecretTrigger = async (req, res) => {
  try {
    const { trigger, data } = req.body;
    await secretAchievementService.checkSecretTriggers(req.user._id, trigger, data);
    res.json({ message: 'Trigger verificado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Activar easter egg
 */
export const activateEasterEgg = async (req, res) => {
  try {
    const { eggId, data } = req.body;
    const result = await secretAchievementService.checkEasterEgg(req.user._id, eggId, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener estadísticas de easter eggs
 */
export const getEasterEggStats = async (req, res) => {
  try {
    const stats = await secretAchievementService.getEasterEggStats(req.user._id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generar easter egg aleatorio
 */
export const generateRandomEasterEgg = async (req, res) => {
  try {
    const result = await secretAchievementService.generateRandomEasterEgg(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Inicializar logros secretos
 */
export const initializeSecretAchievements = async (req, res) => {
  try {
    await secretAchievementService.initializeSecretAchievements();
    res.json({ message: 'Logros secretos inicializados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 