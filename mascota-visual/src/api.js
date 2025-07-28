import axios from 'axios';

// Cambia la URL base de la API para producción en Render
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
export const getItems = async () => {
  const res = await axios.get(`${API_URL}/items`);
  return res.data;
};

export const getAchievements = async () => {
  const res = await axios.get(`${API_URL}/achievements`);
  return res.data;
};

export const getMinigames = async () => {
  const res = await axios.get(`${API_URL}/minigames`);
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

export const updateUserProfile = async (token, data) => {
  const res = await axios.put(`${API_URL}/users/me`, data, {
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

export const playWithPet = async (petId, token) => {
  const res = await axios.post(`${API_URL}/pet-care/${petId}/play`, {}, {
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

export const getHeroRanking = async () => {
  const res = await axios.get(`${API_URL}/heroes/ranking`);
  return res.data;
};

export const getHeroProfile = async (heroId) => {
  const res = await axios.get(`${API_URL}/heroes/${heroId}/perfil`);
  return res.data;
};

export const sendHeroPraise = async (heroId, mensaje, autor) => {
  const res = await axios.post(`${API_URL}/heroes/${heroId}/elogio`, { mensaje, autor });
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

export const getActiveEvent = async () => {
  const res = await axios.get(`${API_URL}/events/active`);
  return res.data;
};

export const getUserEventProgress = async (token) => {
  const res = await axios.get(`${API_URL}/events/user-progress`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAllMinigames = async () => {
  const res = await axios.get(`${API_URL}/minigames`);
  return res.data;
};

export const getMinigameById = async (id) => {
  const res = await axios.get(`${API_URL}/minigames/${id}`);
  return res.data;
};

export const getMinigameHighScores = async (minigameId, limit = 10) => {
  const res = await axios.get(`${API_URL}/minigames/${minigameId}/highscores?limit=${limit}`);
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

// Funciones de torneos
export const getActiveTournaments = async () => {
  const res = await axios.get(`${API_URL}/tournaments`);
  return res.data;
};

export const getUserTournaments = async (token) => {
  const res = await axios.get(`${API_URL}/tournaments/user`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const registerForTournament = async (tournamentId, token) => {
  const res = await axios.post(`${API_URL}/tournaments/${tournamentId}/register`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateTournamentScore = async (tournamentId, score, time, token) => {
  const res = await axios.post(`${API_URL}/tournaments/${tournamentId}/score`, { score, time }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createWeeklyTournament = async (token) => {
  const res = await axios.post(`${API_URL}/tournaments/create-weekly`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createMonthlyTournament = async (token) => {
  const res = await axios.post(`${API_URL}/tournaments/create-monthly`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createSpecialTournament = async (type, token) => {
  const res = await axios.post(`${API_URL}/tournaments/create-special`, { type }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Funciones de ligas
export const getUserLeague = async (token) => {
  const res = await axios.get(`${API_URL}/tournaments/leagues/user`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getLeagueRanking = async (leagueName, season) => {
  const res = await axios.get(`${API_URL}/tournaments/leagues/${leagueName}/${season}/ranking`);
  return res.data;
};

export const updateLeagueScore = async (leagueId, gameResult, score, token) => {
  const res = await axios.post(`${API_URL}/tournaments/leagues/${leagueId}/score`, { gameResult, score }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createLeagueSeason = async (leagueName, season, token) => {
  const res = await axios.post(`${API_URL}/tournaments/leagues/create-season`, { leagueName, season }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Funciones de estadísticas
export const getUserStatistics = async (token) => {
  const res = await axios.get(`${API_URL}/statistics/user`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getComparativeStatistics = async (token) => {
  const res = await axios.get(`${API_URL}/statistics/comparative`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getGlobalStatistics = async () => {
  const res = await axios.get(`${API_URL}/statistics/global`);
  return res.data;
};

export const getUserActivityHistory = async (days, token) => {
  const res = await axios.get(`${API_URL}/statistics/activity-history?days=${days}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUserRecommendations = async (token) => {
  const res = await axios.get(`${API_URL}/statistics/recommendations`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};