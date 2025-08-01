import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';
import User from '../models/userModel.js';
import friendService from './friendService.js';

// Obtener o crear conversación entre dos usuarios
async function getOrCreateConversation(userId1, userId2) {
  try {
    // Verificar que sean amigos
    const areFriends = await friendService.areFriends(userId1, userId2);
    if (!areFriends) {
      throw new Error('Solo puedes chatear con amigos');
    }

    // Buscar conversación existente
    let conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] }
    }).populate('participants', 'username heroes');

    if (!conversation) {
      // Crear nueva conversación
      conversation = new Conversation({
        participants: [userId1, userId2]
      });
      await conversation.save();
      await conversation.populate('participants', 'username heroes');
    }

    return conversation;
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
}

// Enviar mensaje
async function sendMessage(senderId, receiverId, content, type = 'text', metadata = {}) {
  try {
    // Verificar que sean amigos
    const areFriends = await friendService.areFriends(senderId, receiverId);
    if (!areFriends) {
      throw new Error('Solo puedes enviar mensajes a amigos');
    }

    // Crear mensaje
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      type,
      metadata
    });

    await message.save();

    // Obtener o crear conversación
    const conversation = await getOrCreateConversation(senderId, receiverId);

    // Actualizar conversación
    conversation.lastMessage = {
      content: content.length > 50 ? content.substring(0, 50) + '...' : content,
      sender: senderId,
      createdAt: new Date()
    };
    conversation.updatedAt = new Date();

    // Incrementar contador de mensajes no leídos para el receptor
    const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);

    await conversation.save();

    // Poblar información del remitente
    await message.populate('sender', 'username heroes');

    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Obtener mensajes de una conversación
async function getConversationMessages(userId1, userId2, limit = 50, offset = 0) {
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .populate('sender', 'username heroes')
    .populate('receiver', 'username heroes');

    return messages.reverse(); // Ordenar cronológicamente
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
}

// Obtener conversaciones del usuario
async function getUserConversations(userId) {
  try {
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'username heroes')
    .populate('lastMessage.sender', 'username heroes')
    .sort({ updatedAt: -1 });

    return conversations.map(conv => {
      const otherParticipant = conv.getOtherParticipant(userId);
      const unreadCount = conv.unreadCount.get(userId.toString()) || 0;
      
      return {
        _id: conv._id,
        otherParticipant: {
          _id: otherParticipant._id,
          username: otherParticipant.username,
          heroName: otherParticipant.heroes && otherParticipant.heroes.length > 0 
            ? otherParticipant.heroes[0].name 
            : otherParticipant.username,
          avatar: otherParticipant.heroes && otherParticipant.heroes.length > 0 
            ? otherParticipant.heroes[0].avatar 
            : null
        },
        lastMessage: conv.lastMessage,
        unreadCount,
        updatedAt: conv.updatedAt
      };
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
}

// Marcar mensajes como leídos
async function markMessagesAsRead(userId, senderId) {
  try {
    // Marcar mensajes como leídos
    await Message.updateMany(
      { sender: senderId, receiver: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    // Actualizar contador de conversación
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, senderId] }
    });

    if (conversation) {
      conversation.unreadCount.set(userId.toString(), 0);
      await conversation.save();
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
}

// Obtener mensajes no leídos
async function getUnreadMessagesCount(userId) {
  try {
    const count = await Message.countDocuments({
      receiver: userId,
      isRead: false
    });

    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
}

// Enviar mensaje de sistema
async function sendSystemMessage(userId, content, type = 'system', metadata = {}) {
  try {
    const message = new Message({
      sender: null, // Mensaje de sistema
      receiver: userId,
      content,
      type,
      metadata
    });

    await message.save();
    return message;
  } catch (error) {
    console.error('Error sending system message:', error);
    throw error;
  }
}

// Enviar mensaje de logro
async function sendAchievementMessage(userId, achievement, friendId = null) {
  try {
    const content = `¡Has desbloqueado el logro "${achievement.name}"! ${achievement.icon}`;
    
    const message = new Message({
      sender: null,
      receiver: userId,
      content,
      type: 'achievement',
      metadata: {
        achievementId: achievement._id,
        emoji: achievement.icon
      }
    });

    await message.save();

    // Si hay un amigo específico, también enviar notificación
    if (friendId) {
      const friendMessage = new Message({
        sender: userId,
        receiver: friendId,
        content: `¡${achievement.icon} Mi amigo ha desbloqueado "${achievement.name}"!`,
        type: 'achievement',
        metadata: {
          achievementId: achievement._id,
          emoji: achievement.icon
        }
      });
      await friendMessage.save();
    }

    return message;
  } catch (error) {
    console.error('Error sending achievement message:', error);
    throw error;
  }
}

// Enviar mensaje de regalo
async function sendGiftMessage(gift, fromUser, toUser) {
  try {
    const content = `🎁 Te ha enviado un regalo: ${gift.itemId.name}`;
    
    const message = new Message({
      sender: fromUser._id,
      receiver: toUser._id,
      content,
      type: 'gift',
      metadata: {
        giftId: gift._id,
        emoji: '🎁'
      }
    });

    await message.save();
    return message;
  } catch (error) {
    console.error('Error sending gift message:', error);
    throw error;
  }
}

// Eliminar conversación
async function deleteConversation(userId, conversationId) {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      throw new Error('Conversación no encontrada');
    }

    // Marcar como inactiva en lugar de eliminar
    conversation.isActive = false;
    await conversation.save();

    return { success: true };
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

// Buscar mensajes
async function searchMessages(userId, query, limit = 20) {
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ],
      content: { $regex: query, $options: 'i' }
    })
    .populate('sender', 'username heroes')
    .populate('receiver', 'username heroes')
    .sort({ createdAt: -1 })
    .limit(limit);

    return messages;
  } catch (error) {
    console.error('Error searching messages:', error);
    throw error;
  }
}

export default {
  getOrCreateConversation,
  sendMessage,
  getConversationMessages,
  getUserConversations,
  markMessagesAsRead,
  getUnreadMessagesCount,
  sendSystemMessage,
  sendAchievementMessage,
  sendGiftMessage,
  deleteConversation,
  searchMessages
}; 