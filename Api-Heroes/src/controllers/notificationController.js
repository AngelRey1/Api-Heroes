import notificationService from '../services/notificationService.js';

/**
 * Obtener notificaciones del usuario
 */
export const getUserNotifications = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const notifications = await notificationService.getUserNotifications(
      req.user._id, 
      parseInt(limit), 
      parseInt(offset)
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener contador de notificaciones no leídas
 */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user._id);
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Marcar notificación como leída
 */
export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Eliminar notificación
 */
export const deleteNotification = async (req, res) => {
  try {
    const notification = await notificationService.deleteNotification(req.params.id, req.user._id);
    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json({ message: 'Notificación eliminada', notification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 