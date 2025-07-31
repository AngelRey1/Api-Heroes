import axios from 'axios';

// URL de la API en Render
const API_URL = process.env.REACT_APP_API_URL || 'https://api-heroes-gh4i.onrender.com/api';

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { username, password });
  return res.data; // { message, token, user }
};

export const getMascotas = async (token) => {
  const res = await axios.get(`${API_URL}/pets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // Array de mascotas del usuario
};

export const alimentarMascota = async (petId, token) => {
  const res = await axios.post(`${API_URL}/pet-care/${petId}/feed`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // Nueva data de la mascota
};

export const register = async (username, email, password) => {
  const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
  return res.data; // { message, user }
};

// --- NUEVOS SERVICIOS ---
export const getItems = async (token) => {
  const res = await axios.get(`${API_URL}/items`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAchievements = async (token) => {
  const res = await axios.get(`${API_URL}/achievements`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMinigames = async (token) => {
  const res = await axios.get(`${API_URL}/minigames`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// --- INVENTARIO Y TIENDA ---
export const buyItem = async (itemId, quantity, token) => {
  const res = await axios.post(`${API_URL}/shop/buy`, { itemId, quantity }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getInventory = async (token) => {
  const res = await axios.get(`${API_URL}/inventory`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const useItem = async (itemId, token, petId) => {
  const res = await axios.post(`${API_URL}/inventory/use`, { itemId, petId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUserProfile = async (token) => {
  const res = await axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};



export const updateUserBackground = async (token, background) => {
  const res = await axios.put(`${API_URL}/users/background`, { background }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const saveMinigameScore = async (minigameId, score, token) => {
  const res = await axios.post(`${API_URL}/minigames/${minigameId}/score`, { score }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const claimAchievement = async (achievementId, token) => {
  const res = await axios.post(`${API_URL}/achievements/${achievementId}/claim`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getPets = async (token) => {
  const res = await axios.get(`${API_URL}/pets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createPet = async (token, data) => {
  const res = await axios.post(`${API_URL}/pets`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const renamePet = async (token, id, name) => {
  const res = await axios.put(`${API_URL}/pets/${id}/rename`, { name }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deletePet = async (token, id) => {
  const res = await axios.delete(`${API_URL}/pets/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const setActivePet = async (token, id) => {
  const res = await axios.post(`${API_URL}/pets/${id}/active`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const equipAccessory = async (token, petId, itemId) => {
  const res = await axios.post(`${API_URL}/pets/${petId}/equip`, { itemId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const unequipAccessory = async (token, petId, itemId) => {
  const res = await axios.post(`${API_URL}/pets/${petId}/unequip`, { itemId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getNotifications = async (token) => {
  const res = await axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createNotification = async (token, data) => {
  const res = await axios.post(`${API_URL}/notifications`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const markNotificationAsRead = async (token, id) => {
  const res = await axios.post(`${API_URL}/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteNotification = async (token, id) => {
  const res = await axios.delete(`${API_URL}/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateHero = async (token, heroId, data) => {
  const res = await axios.put(`${API_URL}/heroes/${heroId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updatePet = async (token, petId, data) => {
  const res = await axios.put(`${API_URL}/pets/${petId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createHero = async (token, data) => {
  const res = await axios.post(`${API_URL}/heroes`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAllHeroes = async (token) => {
  const res = await axios.get(`${API_URL}/heroes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const equipHeroAccessory = async (token, heroId, itemId) => {
  const res = await axios.post(`${API_URL}/heroes/${heroId}/equip`, { itemId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const unequipHeroAccessory = async (token, heroId, itemId) => {
  const res = await axios.post(`${API_URL}/heroes/${heroId}/unequip`, { itemId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const claimDailyReward = async (token) => {
  const res = await axios.post(`${API_URL}/events/daily-reward`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getActiveEvents = async (token) => {
  const res = await axios.get(`${API_URL}/events/active`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMissions = async (token) => {
  const res = await axios.get(`${API_URL}/missions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateMissionProgress = async (token, missionId, amount = 1) => {
  const res = await axios.post(`${API_URL}/missions/${missionId}/progress`, { amount }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const claimMission = async (token, missionId) => {
  const res = await axios.post(`${API_URL}/missions/${missionId}/claim`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const resetMissions = async (token) => {
  const res = await axios.post(`${API_URL}/missions/reset`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMinigameRanking = async (minigameId) => {
  const res = await axios.get(`${API_URL}/minigames/${minigameId}/ranking`);
  return res.data;
};

export const getSecretAchievements = async (token) => {
  const res = await axios.get(`${API_URL}/achievements/secret/unlocked`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const sleepPet = async (petId, token) => {
  const res = await axios.post(`${API_URL}/pet-care/${petId}/sleep`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const bathPet = async (petId, token) => {
  const res = await axios.post(`${API_URL}/pet-care/${petId}/bath`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};



export const customizePet = async (petId, token, { item, type, color, forma }) => {
  const res = await axios.post(`${API_URL}/pet-care/${petId}/customize`, { item, type, color, forma }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getHeroRanking = async (token) => {
  const res = await axios.get(`${API_URL}/heroes/ranking`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getHeroProfile = async (heroId, token) => {
  const res = await axios.get(`${API_URL}/heroes/${heroId}/perfil`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const sendHeroPraise = async (heroId, mensaje, autor, token) => {
  const res = await axios.post(`${API_URL}/heroes/${heroId}/elogio`, { mensaje, autor }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUserAchievements = async (token) => {
  const res = await axios.get(`${API_URL}/achievements/user`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUserMissions = async (token) => {
  const res = await axios.get(`${API_URL}/missions/user`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const claimMissionReward = async (missionId, token) => {
  const res = await axios.post(`${API_URL}/missions/${missionId}/claim`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const generateMissions = async (token) => {
  const res = await axios.post(`${API_URL}/missions/generate`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getActiveEvent = async (token) => {
  const res = await axios.get(`${API_URL}/events/active`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUserEventProgress = async (token) => {
  const res = await axios.get(`${API_URL}/events/user-progress`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAllMinigames = async (token) => {
  const res = await axios.get(`${API_URL}/minigames`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMinigameById = async (id, token) => {
  const res = await axios.get(`${API_URL}/minigames/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMinigameHighScores = async (minigameId, limit = 10, token) => {
  const res = await axios.get(`${API_URL}/minigames/${minigameId}/highscores?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUserMinigameStats = async (token) => {
  const res = await axios.get(`${API_URL}/minigames/user/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Funciones de amigos
export const searchUsers = async (query, token) => {
  const res = await axios.get(`${API_URL}/friends/search?q=${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const sendFriendRequest = async (toUserId, message, token) => {
  const res = await axios.post(`${API_URL}/friends/request`, { toUserId, message }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const respondToFriendRequest = async (requestId, response, token) => {
  const res = await axios.post(`${API_URL}/friends/request/${requestId}/respond`, { response }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getFriendsList = async (token) => {
  const res = await axios.get(`${API_URL}/friends/list`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getFriendRequests = async (token) => {
  const res = await axios.get(`${API_URL}/friends/requests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getFriendProfile = async (friendId, token) => {
  const res = await axios.get(`${API_URL}/friends/${friendId}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const removeFriend = async (friendId, token) => {
  const res = await axios.delete(`${API_URL}/friends/${friendId}/remove`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const sendGift = async (toUserId, itemId, message, token) => {
  const res = await axios.post(`${API_URL}/friends/gift`, { toUserId, itemId, message }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getReceivedGifts = async (token) => {
  const res = await axios.get(`${API_URL}/friends/gifts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const claimGift = async (giftId, token) => {
  const res = await axios.post(`${API_URL}/friends/gifts/${giftId}/claim`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Funciones de chat
export const getConversations = async (token) => {
  const res = await axios.get(`${API_URL}/chat/conversations`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getConversationMessages = async (userId, token, limit = 50, offset = 0) => {
  const res = await axios.get(`${API_URL}/chat/messages/${userId}?limit=${limit}&offset=${offset}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const sendMessage = async (receiverId, content, token, type = 'text', metadata = {}) => {
  const res = await axios.post(`${API_URL}/chat/send`, { receiverId, content, type, metadata }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const markMessagesAsRead = async (senderId, token) => {
  const res = await axios.post(`${API_URL}/chat/read/${senderId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUnreadMessagesCount = async (token) => {
  const res = await axios.get(`${API_URL}/chat/unread`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const searchMessages = async (query, token, limit = 20) => {
  const res = await axios.get(`${API_URL}/chat/search?q=${query}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteConversation = async (conversationId, token) => {
  const res = await axios.delete(`${API_URL}/chat/conversation/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Funciones de logros
export const claimAchievementReward = async (achievementId, token) => {
  const res = await axios.post(`${API_URL}/achievements/${achievementId}/claim-reward`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Funciones de personalización
export const getPetCustomizations = async (token) => {
  const res = await axios.get(`${API_URL}/customization/pets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getHeroCustomizations = async (token) => {
  const res = await axios.get(`${API_URL}/customization/heroes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const applyPetCustomization = async (customizationId, token) => {
  const res = await axios.post(`${API_URL}/customization/pets/${customizationId}/apply`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const applyHeroCustomization = async (customizationId, token) => {
  const res = await axios.post(`${API_URL}/customization/heroes/${customizationId}/apply`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const buyCustomization = async (customizationId, token) => {
  const res = await axios.post(`${API_URL}/customization/${customizationId}/buy`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteHero = async (token, heroId) => {
  const res = await axios.delete(`${API_URL}/heroes/${heroId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const adoptPet = async (token, petId, heroId) => {
  const res = await axios.post(`${API_URL}/pets/${petId}/adopt`, { heroId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const feedPet = async (token, petId) => {
  const res = await axios.post(`${API_URL}/pet-care/${petId}/feed`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const walkPet = async (token, petId) => {
  const res = await axios.post(`${API_URL}/pet-care/${petId}/walk`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const playWithPet = async (token, petId) => {
  const res = await axios.post(`${API_URL}/pet-care/${petId}/play`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const bathePet = async (token, petId) => {
  const res = await axios.post(`${API_URL}/pet-care/${petId}/bath`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const healPet = async (token, petId) => {
  const res = await axios.post(`${API_URL}/pet-care/${petId}/heal`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getPetStatus = async (token, petId) => {
  const res = await axios.get(`${API_URL}/pets/${petId}/status`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};