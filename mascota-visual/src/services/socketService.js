import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // Conectar al servidor WebSocket
  connect(token) {
    if (this.socket && this.isConnected) {
      return;
    }

    this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('[SOCKET] Conectado al servidor');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('[SOCKET] Desconectado del servidor');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SOCKET] Error de conexión:', error);
      this.isConnected = false;
    });
  }

  // Desconectar del servidor
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Enviar mensaje de chat
  sendMessage(receiverId, content, type = 'text', metadata = {}) {
    if (!this.socket || !this.isConnected) {
      throw new Error('No conectado al servidor');
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('send_message', { receiverId, content, type, metadata });
      
      this.socket.once('message_sent', (data) => {
        resolve(data);
      });

      this.socket.once('message_error', (data) => {
        reject(new Error(data.error));
      });
    });
  }

  // Marcar mensajes como leídos
  markAsRead(senderId) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('mark_as_read', { senderId });
  }

  // Indicar que está escribiendo
  startTyping(receiverId) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('typing_start', { receiverId });
  }

  // Indicar que dejó de escribir
  stopTyping(receiverId) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('typing_stop', { receiverId });
  }

  // Escuchar nuevos mensajes
  onNewMessage(callback) {
    if (!this.socket) return;

    this.socket.on('new_message', callback);
    this.listeners.set('new_message', callback);
  }

  // Escuchar confirmación de mensaje enviado
  onMessageSent(callback) {
    if (!this.socket) return;

    this.socket.on('message_sent', callback);
    this.listeners.set('message_sent', callback);
  }

  // Escuchar errores de mensaje
  onMessageError(callback) {
    if (!this.socket) return;

    this.socket.on('message_error', callback);
    this.listeners.set('message_error', callback);
  }

  // Escuchar cuando alguien está escribiendo
  onUserTyping(callback) {
    if (!this.socket) return;

    this.socket.on('user_typing', callback);
    this.listeners.set('user_typing', callback);
  }

  // Escuchar cuando se marcan mensajes como leídos
  onMessagesRead(callback) {
    if (!this.socket) return;

    this.socket.on('messages_read', callback);
    this.listeners.set('messages_read', callback);
  }

  // Escuchar notificaciones
  onNotification(callback) {
    if (!this.socket) return;

    this.socket.on('notification', callback);
    this.listeners.set('notification', callback);
  }

  // Remover listener específico
  off(event) {
    if (!this.socket) return;

    const callback = this.listeners.get(event);
    if (callback) {
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  // Remover todos los listeners
  offAll() {
    if (!this.socket) return;

    this.listeners.forEach((callback, event) => {
      this.socket.off(event, callback);
    });
    this.listeners.clear();
  }

  // Obtener estado de conexión
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Exportar instancia singleton
const socketService = new SocketService();
export default socketService; 