import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

// Almacén de conexiones WebSocket activas
const activeConnections = new Map();

// Registrar conexión WebSocket de usuario
function registerConnection(userId, socket) {
  activeConnections.set(userId.toString(), socket);
  console.log(`[WEBSOCKET] Usuario ${userId} conectado`);
}

// Remover conexión WebSocket de usuario
function removeConnection(userId) {
  activeConnections.delete(userId.toString());
  console.log(`[WEBSOCKET] Usuario ${userId} desconectado`);
}

// Enviar notificación en tiempo real
function sendRealTimeNotification(userId, notification) {
  const socket = activeConnections.get(userId.toString());
  if (socket) {
    socket.emit('notification', notification);
    console.log(`[WEBSOCKET] Notificación enviada a ${userId}: ${notification.title}`);
  }
}

// Crear notificación
async function createNotification(userId, type, title, message, icon = '🔔', priority = 'medium', metadata = {}, expiresAt = null) {
  try {
    const notification = new Notification({
      user: userId,
      type,
      title,
      message,
      icon,
      priority,
      metadata,
      expiresAt
    });

    await notification.save();

    // Enviar en tiempo real si el usuario está conectado
    sendRealTimeNotification(userId, {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      icon: notification.icon,
      priority: notification.priority,
      createdAt: notification.createdAt
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Notificación de logro desbloqueado
async function achievementUnlocked(userId, achievement) {
  return await createNotification(
    userId,
    'achievement',
    '¡Logro Desbloqueado!',
    `Has desbloqueado "${achievement.name}"`,
    achievement.icon,
    'high',
    { achievementId: achievement._id, reward: achievement.coinReward }
  );
}

// Notificación de misión completada
async function missionCompleted(userId, mission) {
  return await createNotification(
    userId,
    'mission',
    '¡Misión Completada!',
    `Has completado "${mission.name}"`,
    '🎯',
    'medium',
    { missionId: mission._id, reward: mission.coinReward }
  );
}

// Notificación de evento activo
async function eventStarted(userId, event) {
  return await createNotification(
    userId,
    'event',
    '¡Evento Especial!',
    `Ha comenzado "${event.name}"`,
    event.icon,
    'high',
    { eventId: event._id },
    new Date(Date.now() + 24 * 60 * 60 * 1000) // Expira en 24 horas
  );
}

// Notificación de regalo recibido
async function giftReceived(userId, gift, senderName) {
  return await createNotification(
    userId,
    'gift',
    '¡Regalo Recibido!',
    `${senderName} te ha enviado un regalo`,
    '🎁',
    'medium',
    { giftId: gift._id }
  );
}

// Notificación de solicitud de amistad
async function friendRequestReceived(userId, senderName) {
  return await createNotification(
    userId,
    'friend_request',
    'Nueva Solicitud de Amistad',
    `${senderName} quiere ser tu amigo`,
    '👥',
    'medium',
    { friendId: userId }
  );
}

// Notificación de mensaje nuevo
async function newMessageReceived(userId, senderName) {
  return await createNotification(
    userId,
    'chat',
    'Nuevo Mensaje',
    `${senderName} te ha enviado un mensaje`,
    '💬',
    'low',
    { action: 'chat' }
  );
}

// Notificación de cuidado de mascota
async function petCareReminder(userId, petName, careType) {
  const careIcons = {
    'feed': '🍖',
    'clean': '🛁',
    'play': '🎾',
    'sleep': '😴',
    'heal': '💊'
  };

  return await createNotification(
    userId,
    'pet_care',
    'Recordatorio de Cuidado',
    `${petName} necesita ${careType}`,
    careIcons[careType] || '🐾',
    'low',
    { action: careType },
    new Date(Date.now() + 2 * 60 * 60 * 1000) // Expira en 2 horas
  );
}

// Notificación de sistema
async function systemNotification(userId, title, message, priority = 'medium') {
  return await createNotification(
    userId,
    'system',
    title,
    message,
    '⚙️',
    priority
  );
}

// Obtener notificaciones del usuario
async function getUserNotifications(userId, limit = 20, offset = 0) {
  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    return notifications;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
}

// Marcar notificación como leída
async function markAsRead(notificationId, userId) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId, isRead: false },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// Marcar todas las notificaciones como leídas
async function markAllAsRead(userId) {
  try {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

// Obtener contador de notificaciones no leídas
async function getUnreadCount(userId) {
  try {
    const count = await Notification.countDocuments({
      user: userId,
      isRead: false
    });

    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
}

// Eliminar notificación
async function deleteNotification(notificationId, userId) {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId
    });

    return notification;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

// Limpiar notificaciones expiradas
async function cleanupExpiredNotifications() {
  try {
    const result = await Notification.deleteMany({
      expiresAt: { $lt: new Date() }
    });

    console.log(`[NOTIFICATIONS] Limpiadas ${result.deletedCount} notificaciones expiradas`);
    return result;
  } catch (error) {
    console.error('Error cleaning up expired notifications:', error);
    throw error;
  }
}

// Enviar notificación a múltiples usuarios
async function sendBulkNotification(userIds, type, title, message, icon = '🔔', priority = 'medium', metadata = {}) {
  try {
    const notifications = [];
    
    for (const userId of userIds) {
      const notification = await createNotification(
        userId,
        type,
        title,
        message,
        icon,
        priority,
        metadata
      );
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
}

export default {
  registerConnection,
  removeConnection,
  createNotification,
  achievementUnlocked,
  missionCompleted,
  eventStarted,
  giftReceived,
  friendRequestReceived,
  newMessageReceived,
  petCareReminder,
  systemNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  cleanupExpiredNotifications,
  sendBulkNotification
}; 