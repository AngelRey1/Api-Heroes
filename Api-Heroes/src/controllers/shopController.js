import shopService from '../services/shopService.js';
import achievementService from '../services/achievementService.js';
import missionService from '../services/missionService.js';
import eventService from '../services/eventService.js';

export const buyItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: 'ID del item es requerido' });
    }

    const result = await shopService.buyItem(req.user._id, itemId);
    
    // Verificar logros de compra (simulado por ahora)
    const achievementResult = { unlocked: [] };
    
    // Verificar progreso de misiones
    const missionResult = await missionService.checkAndUpdateMissionProgress(req.user._id, 'shop', 1);
    
    // Verificar progreso de eventos
    const eventResult = await eventService.checkAndUpdateEventProgress(req.user._id, 'shop', 1);
    
    res.json({ 
      ...result, 
      achievements: achievementResult, 
      missions: missionResult, 
      events: eventResult 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAvailableItems = async (req, res) => {
  try {
    const items = await shopService.getAvailableItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserInventory = async (req, res) => {
  try {
    const inventory = await shopService.getUserInventory(req.user._id);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const useItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: 'ID del item es requerido' });
    }

    const result = await shopService.useItem(req.user._id, itemId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 