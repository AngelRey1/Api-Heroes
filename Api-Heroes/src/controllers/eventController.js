import eventService from '../services/eventService.js';

/**
 * Obtiene el evento activo actual
 */
export const getActiveEvent = async (req, res) => {
  try {
    const event = await eventService.getActiveEvent();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene el progreso del usuario en el evento activo
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
 * Genera un nuevo evento especial (admin)
 */
export const generateEvent = async (req, res) => {
  try {
    const event = await eventService.generateRandomEvent();
    if (event) {
      res.json({ message: 'Evento generado', event });
    } else {
      res.json({ message: 'Ya hay un evento activo' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 