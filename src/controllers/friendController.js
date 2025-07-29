import friendService from '../services/friendService.js';

/**
 * Buscar usuarios por nombre
 */
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Búsqueda debe tener al menos 2 caracteres' });
    }
    const users = await friendService.searchUsers(q, req.user._id);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Enviar solicitud de amistad
 */
export const sendFriendRequest = async (req, res) => {
  try {
    const { toUserId, message } = req.body;
    if (!toUserId) {
      return res.status(400).json({ error: 'ID de usuario requerido' });
    }
    const request = await friendService.sendFriendRequest(req.user._id, toUserId, message);
    res.json({ message: 'Solicitud enviada', request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Responder a solicitud de amistad
 */
export const respondToFriendRequest = async (req, res) => {
  try {
    const { response } = req.body;
    if (!['accepted', 'rejected'].includes(response)) {
      return res.status(400).json({ error: 'Respuesta inválida' });
    }
    const result = await friendService.respondToFriendRequest(req.params.requestId, req.user._id, response);
    res.json({ message: `Solicitud ${response}`, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtener lista de amigos
 */
export const getFriendsList = async (req, res) => {
  try {
    const friends = await friendService.getFriendsList(req.user._id);
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener solicitudes de amistad pendientes
 */
export const getFriendRequests = async (req, res) => {
  try {
    const requests = await friendService.getFriendRequests(req.user._id);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener perfil de amigo
 */
export const getFriendProfile = async (req, res) => {
  try {
    const profile = await friendService.getFriendProfile(req.params.friendId, req.user._id);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Eliminar amigo
 */
export const removeFriend = async (req, res) => {
  try {
    const result = await friendService.removeFriend(req.user._id, req.params.friendId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Enviar regalo a amigo
 */
export const sendGift = async (req, res) => {
  try {
    const { toUserId, itemId, message } = req.body;
    if (!toUserId || !itemId) {
      return res.status(400).json({ error: 'Usuario e item requeridos' });
    }
    const gift = await friendService.sendGift(req.user._id, toUserId, itemId, message);
    res.json({ message: 'Regalo enviado', gift });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtener regalos recibidos
 */
export const getReceivedGifts = async (req, res) => {
  try {
    const gifts = await friendService.getReceivedGifts(req.user._id);
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reclamar regalo
 */
export const claimGift = async (req, res) => {
  try {
    const gift = await friendService.claimGift(req.params.giftId, req.user._id);
    res.json({ message: 'Regalo reclamado', gift });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 