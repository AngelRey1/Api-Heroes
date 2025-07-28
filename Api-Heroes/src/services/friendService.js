import User from '../models/userModel.js';
import FriendRequest from '../models/friendRequestModel.js';
import Gift from '../models/giftModel.js';
import Item from '../models/itemModel.js';

// Buscar usuarios por nombre de usuario
async function searchUsers(query, currentUserId) {
  try {
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: currentUserId }
    }).populate('heroes').limit(10);

    return users.map(user => ({
      _id: user._id,
      username: user.username,
      heroName: user.heroes && user.heroes.length > 0 ? user.heroes[0].name : user.username,
      avatar: user.heroes && user.heroes.length > 0 ? user.heroes[0].avatar : null
    }));
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

// Enviar solicitud de amistad
async function sendFriendRequest(fromUserId, toUserId, message = '') {
  try {
    // Verificar que no sean amigos ya
    const fromUser = await User.findById(fromUserId);
    if (fromUser.friends.includes(toUserId)) {
      throw new Error('Ya son amigos');
    }

    // Verificar que no haya una solicitud pendiente
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { from: fromUserId, to: toUserId },
        { from: toUserId, to: fromUserId }
      ],
      status: 'pending'
    });

    if (existingRequest) {
      throw new Error('Ya existe una solicitud pendiente');
    }

    // Crear nueva solicitud
    const request = new FriendRequest({
      from: fromUserId,
      to: toUserId,
      message
    });

    await request.save();

    // Actualizar listas de solicitudes
    await User.findByIdAndUpdate(fromUserId, {
      $addToSet: { 'friendRequests.sent': toUserId }
    });

    await User.findByIdAndUpdate(toUserId, {
      $addToSet: { 'friendRequests.received': fromUserId }
    });

    return request;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
}

// Responder a solicitud de amistad
async function respondToFriendRequest(requestId, userId, response) {
  try {
    const request = await FriendRequest.findById(requestId);
    if (!request || request.to.toString() !== userId.toString()) {
      throw new Error('Solicitud no encontrada');
    }

    if (request.status !== 'pending') {
      throw new Error('Solicitud ya respondida');
    }

    request.status = response;
    request.respondedAt = new Date();
    await request.save();

    if (response === 'accepted') {
      // Agregar como amigos
      await User.findByIdAndUpdate(request.from, {
        $addToSet: { friends: request.to },
        $inc: { 'socialStats.friendsCount': 1 }
      });

      await User.findByIdAndUpdate(request.to, {
        $addToSet: { friends: request.from },
        $inc: { 'socialStats.friendsCount': 1 }
      });
    }

    // Limpiar solicitudes
    await User.findByIdAndUpdate(request.from, {
      $pull: { 'friendRequests.sent': request.to }
    });

    await User.findByIdAndUpdate(request.to, {
      $pull: { 'friendRequests.received': request.from }
    });

    return request;
  } catch (error) {
    console.error('Error responding to friend request:', error);
    throw error;
  }
}

// Obtener lista de amigos
async function getFriendsList(userId) {
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'friends',
        populate: {
          path: 'heroes',
          select: 'name avatar color'
        }
      });

    return user.friends.map(friend => ({
      _id: friend._id,
      username: friend.username,
      heroName: friend.heroes && friend.heroes.length > 0 ? friend.heroes[0].name : friend.username,
      avatar: friend.heroes && friend.heroes.length > 0 ? friend.heroes[0].avatar : null,
      color: friend.heroes && friend.heroes.length > 0 ? friend.heroes[0].color : null,
      lastActive: friend.lastActive || friend.createdAt
    }));
  } catch (error) {
    console.error('Error getting friends list:', error);
    throw error;
  }
}

// Obtener solicitudes de amistad
async function getFriendRequests(userId) {
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'friendRequests.received',
        populate: {
          path: 'heroes',
          select: 'name avatar'
        }
      });

    const requests = await FriendRequest.find({
      to: userId,
      status: 'pending'
    }).populate({
      path: 'from',
      populate: {
        path: 'heroes',
        select: 'name avatar'
      }
    });

    return requests.map(request => ({
      _id: request._id,
      from: {
        _id: request.from._id,
        username: request.from.username,
        heroName: request.from.heroes && request.from.heroes.length > 0 ? request.from.heroes[0].name : request.from.username,
        avatar: request.from.heroes && request.from.heroes.length > 0 ? request.from.heroes[0].avatar : null
      },
      message: request.message,
      createdAt: request.createdAt
    }));
  } catch (error) {
    console.error('Error getting friend requests:', error);
    throw error;
  }
}

// Enviar regalo a amigo
async function sendGift(fromUserId, toUserId, itemId, message = '') {
  try {
    // Verificar que sean amigos
    const fromUser = await User.findById(fromUserId);
    if (!fromUser.friends.includes(toUserId)) {
      throw new Error('Solo puedes enviar regalos a amigos');
    }

    // Verificar que el usuario tenga el item
    const userItem = await User.findOne({
      _id: fromUserId,
      'inventory.itemId': itemId
    });

    if (!userItem) {
      throw new Error('No tienes este objeto');
    }

    // Crear regalo
    const gift = new Gift({
      from: fromUserId,
      to: toUserId,
      itemId,
      message
    });

    await gift.save();

    // Remover item del inventario del remitente
    await User.findByIdAndUpdate(fromUserId, {
      $pull: { inventory: { itemId } }
    });

    // Actualizar estadísticas
    await User.findByIdAndUpdate(fromUserId, {
      $inc: { 'socialStats.giftsSent': 1 }
    });

    await User.findByIdAndUpdate(toUserId, {
      $inc: { 'socialStats.giftsReceived': 1 }
    });

    return gift;
  } catch (error) {
    console.error('Error sending gift:', error);
    throw error;
  }
}

// Obtener regalos recibidos
async function getReceivedGifts(userId) {
  try {
    const gifts = await Gift.find({
      to: userId,
      isClaimed: false,
      expiresAt: { $gt: new Date() }
    }).populate([
      {
        path: 'from',
        populate: {
          path: 'heroes',
          select: 'name avatar'
        }
      },
      {
        path: 'itemId',
        select: 'name description image price'
      }
    ]);

    return gifts.map(gift => ({
      _id: gift._id,
      from: {
        _id: gift.from._id,
        username: gift.from.username,
        heroName: gift.from.heroes && gift.from.heroes.length > 0 ? gift.from.heroes[0].name : gift.from.username,
        avatar: gift.from.heroes && gift.from.heroes.length > 0 ? gift.from.heroes[0].avatar : null
      },
      item: gift.itemId,
      message: gift.message,
      createdAt: gift.createdAt,
      expiresAt: gift.expiresAt
    }));
  } catch (error) {
    console.error('Error getting received gifts:', error);
    throw error;
  }
}

// Reclamar regalo
async function claimGift(giftId, userId) {
  try {
    const gift = await Gift.findById(giftId);
    if (!gift || gift.to.toString() !== userId.toString()) {
      throw new Error('Regalo no encontrado');
    }

    if (gift.isClaimed) {
      throw new Error('Regalo ya reclamado');
    }

    if (gift.expiresAt < new Date()) {
      throw new Error('Regalo expirado');
    }

    // Marcar como reclamado
    gift.isClaimed = true;
    gift.claimedAt = new Date();
    await gift.save();

    // Agregar item al inventario del destinatario
    await User.findByIdAndUpdate(userId, {
      $push: { inventory: { itemId: gift.itemId, quantity: 1 } }
    });

    return gift;
  } catch (error) {
    console.error('Error claiming gift:', error);
    throw error;
  }
}

// Obtener perfil de amigo
async function getFriendProfile(friendId, currentUserId) {
  try {
    // Verificar que sean amigos
    const currentUser = await User.findById(currentUserId);
    if (!currentUser.friends.includes(friendId)) {
      throw new Error('No son amigos');
    }

    const friend = await User.findById(friendId)
      .populate([
        {
          path: 'heroes',
          select: 'name avatar color elogios'
        },
        {
          path: 'pets',
          select: 'name type health happiness energy color forma'
        },
        {
          path: 'unlockedAchievements.achievement',
          select: 'name description icon'
        }
      ]);

    return {
      _id: friend._id,
      username: friend.username,
      hero: friend.heroes && friend.heroes.length > 0 ? friend.heroes[0] : null,
      pets: friend.pets,
      achievements: friend.unlockedAchievements,
      socialStats: friend.socialStats,
      coins: friend.coins,
      createdAt: friend.createdAt
    };
  } catch (error) {
    console.error('Error getting friend profile:', error);
    throw error;
  }
}

// Eliminar amigo
async function removeFriend(userId, friendId) {
  try {
    // Remover de ambas listas de amigos
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
      $inc: { 'socialStats.friendsCount': -1 }
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId },
      $inc: { 'socialStats.friendsCount': -1 }
    });

    return { message: 'Amigo eliminado correctamente' };
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
}

// Verificar si dos usuarios son amigos
async function areFriends(userId1, userId2) {
  try {
    const user = await User.findById(userId1);
    return user.friends.includes(userId2);
  } catch (error) {
    console.error('Error checking friendship:', error);
    return false;
  }
}

export default {
  searchUsers,
  sendFriendRequest,
  respondToFriendRequest,
  getFriendsList,
  getFriendRequests,
  sendGift,
  getReceivedGifts,
  claimGift,
  getFriendProfile,
  removeFriend,
  areFriends
}; 