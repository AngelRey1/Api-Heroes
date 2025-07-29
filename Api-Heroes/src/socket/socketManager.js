import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import notificationService from '../services/notificationService.js';
import chatService from '../services/chatService.js';

let io;

// Inicializar Socket.IO
function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Middleware de autenticación
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Token no proporcionado'));
      }

      const getJWTSecret = () => {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
          throw new Error('JWT_SECRET environment variable is required');
        }
        return JWT_SECRET;
      };
      const decoded = jwt.verify(token, getJWTSecret());
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Token inválido'));
    }
  });

  // Manejar conexiones
  io.on('connection', (socket) => {
    console.log(`[SOCKET] Usuario ${socket.userId} conectado`);
    
    // Registrar conexión
    notificationService.registerConnection(socket.userId, socket);

    // Unir al usuario a su sala personal
    socket.join(`user_${socket.userId}`);

    // Manejar mensajes de chat
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content, type = 'text', metadata = {} } = data;
        
        // Enviar mensaje
        const message = await chatService.sendMessage(
          socket.userId, 
          receiverId, 
          content, 
          type, 
          metadata
        );

        // Notificar al receptor si está conectado
        const receiverSocket = io.sockets.adapter.rooms.get(`user_${receiverId}`);
        if (receiverSocket) {
          io.to(`user_${receiverId}`).emit('new_message', {
            message,
            sender: {
              _id: socket.userId,
              username: message.sender.username,
              heroName: message.sender.heroes && message.sender.heroes.length > 0 
                ? message.sender.heroes[0].name 
                : message.sender.username
            }
          });
        }

        // Enviar confirmación al remitente
        socket.emit('message_sent', { success: true, message });
      } catch (error) {
        socket.emit('message_error', { error: error.message });
      }
    });

    // Manejar marcado como leído
    socket.on('mark_as_read', async (data) => {
      try {
        const { senderId } = data;
        await chatService.markMessagesAsRead(socket.userId, senderId);
        
        // Notificar al remitente
        const senderSocket = io.sockets.adapter.rooms.get(`user_${senderId}`);
        if (senderSocket) {
          io.to(`user_${senderId}`).emit('messages_read', { readerId: socket.userId });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Manejar escritura en tiempo real
    socket.on('typing_start', (data) => {
      const { receiverId } = data;
      const receiverSocket = io.sockets.adapter.rooms.get(`user_${receiverId}`);
      if (receiverSocket) {
        io.to(`user_${receiverId}`).emit('user_typing', { 
          userId: socket.userId,
          isTyping: true 
        });
      }
    });

    socket.on('typing_stop', (data) => {
      const { receiverId } = data;
      const receiverSocket = io.sockets.adapter.rooms.get(`user_${receiverId}`);
      if (receiverSocket) {
        io.to(`user_${receiverId}`).emit('user_typing', { 
          userId: socket.userId,
          isTyping: false 
        });
      }
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log(`[SOCKET] Usuario ${socket.userId} desconectado`);
      notificationService.removeConnection(socket.userId);
    });
  });

  return io;
}

// Obtener instancia de Socket.IO
function getIO() {
  if (!io) {
    throw new Error('Socket.IO no inicializado');
  }
  return io;
}

// Enviar notificación a usuario específico
function sendNotificationToUser(userId, notification) {
  const socket = io.sockets.adapter.rooms.get(`user_${userId}`);
  if (socket) {
    io.to(`user_${userId}`).emit('notification', notification);
  }
}

// Enviar notificación a múltiples usuarios
function sendNotificationToUsers(userIds, notification) {
  userIds.forEach(userId => {
    sendNotificationToUser(userId, notification);
  });
}

// Enviar mensaje de chat en tiempo real
function sendChatMessage(receiverId, message) {
  const socket = io.sockets.adapter.rooms.get(`user_${receiverId}`);
  if (socket) {
    io.to(`user_${receiverId}`).emit('new_message', message);
  }
}

// Broadcast a todos los usuarios conectados
function broadcastToAll(event, data) {
  io.emit(event, data);
}

// Broadcast a usuarios específicos
function broadcastToUsers(userIds, event, data) {
  userIds.forEach(userId => {
    const socket = io.sockets.adapter.rooms.get(`user_${userId}`);
    if (socket) {
      io.to(`user_${userId}`).emit(event, data);
    }
  });
}

export default {
  initializeSocket,
  getIO,
  sendNotificationToUser,
  sendNotificationToUsers,
  sendChatMessage,
  broadcastToAll,
  broadcastToUsers
}; 