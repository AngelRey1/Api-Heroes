import eventService from '../services/eventService.js';

/**
 * Obtiene los eventos activos
 */
export const getActiveEvent = async (req, res) => {
  try {
    const events = await eventService.getActiveEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene el progreso del usuario en eventos
 */
export const getUserEventProgress = async (req, res) => {
  try {
    const progress = await eventService.getUserEventProgress(req.user._id);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Programa eventos automáticos
 */
export const scheduleEvents = async (req, res) => {
  try {
    await eventService.scheduleEvents();
    res.json({ message: 'Eventos programados correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 