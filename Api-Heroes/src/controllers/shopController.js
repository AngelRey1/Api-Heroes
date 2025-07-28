import User from '../models/userModel.js';
import Item from '../models/itemModel.js';
import shopService from '../services/shopService.js';
import achievementService from '../services/achievementService.js';
import missionService from '../services/missionService.js';
import eventService from '../services/eventService.js';

export const buyItem = async (req, res) => {
  try {
    const result = await shopService.buyItem(req.params.itemId, req.user._id);
    // Verificar logros de compra
    const achievementResult = await achievementService.checkShopAchievements(req.user._id);
    // Verificar progreso de misiones de compra
    const missionResult = await missionService.checkAndUpdateMissionProgress(req.user._id, 'shop', 1);
    // Verificar progreso de eventos
    const eventResult = await eventService.checkAndUpdateEventProgress(req.user._id, 'shop', 1);
    res.json({ ...result, achievements: achievementResult, missions: missionResult, events: eventResult });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 