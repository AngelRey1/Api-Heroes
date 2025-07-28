import chatService from '../services/chatService.js';

/**
 * Obtener conversaciones del usuario
 */
export const getUserConversations = async (req, res) => {
  try {
    const conversations = await chatService.getUserConversations(req.user._id);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener mensajes de una conversación
 */
export const getConversationMessages = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const messages = await chatService.getConversationMessages(
      req.user._id, 
      req.params.userId, 
      parseInt(limit), 
      parseInt(offset)
    );
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Enviar mensaje
 */
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, type = 'text', metadata = {} } = req.body;
    
    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Destinatario y contenido requeridos' });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: 'Mensaje demasiado largo' });
    }

    const message = await chatService.sendMessage(
      req.user._id, 
      receiverId, 
      content, 
      type, 
      metadata
    );
    
    res.json({ message: 'Mensaje enviado', data: message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Marcar mensajes como leídos
 */
export const markMessagesAsRead = async (req, res) => {
  try {
    const result = await chatService.markMessagesAsRead(req.user._id, req.params.senderId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtener contador de mensajes no leídos
 */
export const getUnreadMessagesCount = async (req, res) => {
  try {
    const count = await chatService.getUnreadMessagesCount(req.user._id);
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Buscar mensajes
 */
export const searchMessages = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Búsqueda debe tener al menos 2 caracteres' });
    }

    const messages = await chatService.searchMessages(req.user._id, q, parseInt(limit));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Eliminar conversación
 */
export const deleteConversation = async (req, res) => {
  try {
    const result = await chatService.deleteConversation(req.user._id, req.params.conversationId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 