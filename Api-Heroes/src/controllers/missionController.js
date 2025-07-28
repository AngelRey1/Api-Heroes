import missionService from '../services/missionService.js';

/**
 * Obtiene las misiones del usuario autenticado
 */
export const getUserMissions = async (req, res) => {
  try {
    const missions = await missionService.getUserMissions(req.user._id);
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Genera nuevas misiones diarias para el usuario
 */
export const generateMissions = async (req, res) => {
  try {
    const missions = await missionService.generateDailyMissions(req.user._id);
    res.json({ message: 'Misiones generadas', missions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reclama la recompensa de una misión completada
 */
export const claimMissionReward = async (req, res) => {
  try {
    const result = await missionService.claimMissionReward(req.params.missionId, req.user._id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 