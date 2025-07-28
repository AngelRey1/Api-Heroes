import User from '../models/userModel.js';
import Pet from '../models/petModel.js';
import Achievement from '../models/achievementModel.js';
import Mission from '../models/missionModel.js';
import Event from '../models/eventModel.js';
import Tournament from '../models/tournamentModel.js';
import League from '../models/leagueModel.js';

// Obtener estadísticas generales del usuario
async function getUserStatistics(userId) {
  try {
    const user = await User.findById(userId)
      .populate('pets')
      .populate('unlockedAchievements.achievementId')
      .populate('heroes');

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const stats = {
      general: {
        level: user.level || 1,
        experience: user.experience || 0,
        coins: user.coins || 0,
        gamesPlayed: user.gamesPlayed || 0,
        totalScore: user.totalScore || 0,
        coinsEarned: user.coinsEarned || 0,
        daysActive: calculateDaysActive(user.createdAt),
        lastActivity: user.lastActivity || user.createdAt
      },
      pets: {
        totalPets: user.pets ? user.pets.length : 0,
        activePet: user.activePet,
        averagePetLevel: calculateAveragePetLevel(user.pets),
        totalPetActions: calculateTotalPetActions(user.pets),
        favoritePetType: getFavoritePetType(user.pets)
      },
      achievements: {
        totalAchievements: user.unlockedAchievements ? user.unlockedAchievements.length : 0,
        secretAchievements: countSecretAchievements(user.unlockedAchievements),
        achievementProgress: calculateAchievementProgress(user),
        recentAchievements: getRecentAchievements(user.unlockedAchievements, 5)
      },
      missions: {
        completedMissions: countCompletedMissions(user),
        missionSuccessRate: calculateMissionSuccessRate(user),
        favoriteMissionType: getFavoriteMissionType(user),
        totalMissionRewards: calculateTotalMissionRewards(user)
      },
      events: {
        participatedEvents: countParticipatedEvents(user),
        eventWins: countEventWins(user),
        favoriteEventType: getFavoriteEventType(user),
        totalEventRewards: calculateTotalEventRewards(user)
      },
      tournaments: {
        participatedTournaments: countParticipatedTournaments(user),
        tournamentWins: countTournamentWins(user),
        bestTournamentRank: getBestTournamentRank(user),
        totalTournamentRewards: calculateTotalTournamentRewards(user)
      },
      social: {
        friendsCount: user.friends ? user.friends.length : 0,
        giftsSent: user.socialStats ? user.socialStats.giftsSent : 0,
        giftsReceived: user.socialStats ? user.socialStats.giftsReceived : 0,
        visitsReceived: user.socialStats ? user.socialStats.visitsReceived : 0,
        messagesSent: countMessagesSent(user),
        messagesReceived: countMessagesReceived(user)
      },
      minigames: {
        gamesPlayed: user.minigameStats ? user.minigameStats.gamesPlayed : 0,
        totalScore: user.minigameStats ? user.minigameStats.totalScore : 0,
        coinsEarned: user.minigameStats ? user.minigameStats.coinsEarned : 0,
        favoriteGame: getFavoriteMinigame(user),
        bestScores: getBestMinigameScores(user)
      },
      shop: {
        totalPurchases: countTotalPurchases(user),
        totalSpent: calculateTotalSpent(user),
        favoriteItemType: getFavoriteItemType(user),
        mostExpensivePurchase: getMostExpensivePurchase(user)
      }
    };

    return stats;
  } catch (error) {
    console.error('Error obteniendo estadísticas del usuario:', error);
    throw error;
  }
}

// Obtener estadísticas comparativas
async function getComparativeStatistics(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Obtener estadísticas globales
    const globalStats = await getGlobalStatistics();
    
    // Obtener estadísticas del usuario
    const userStats = await getUserStatistics(userId);

    // Calcular percentiles
    const percentiles = {
      level: calculatePercentile(userStats.general.level, globalStats.averageLevel),
      coins: calculatePercentile(userStats.general.coins, globalStats.averageCoins),
      achievements: calculatePercentile(userStats.achievements.totalAchievements, globalStats.averageAchievements),
      friends: calculatePercentile(userStats.social.friendsCount, globalStats.averageFriends),
      gamesPlayed: calculatePercentile(userStats.general.gamesPlayed, globalStats.averageGamesPlayed)
    };

    // Comparar con otros usuarios
    const comparisons = {
      level: {
        rank: await getUserRank(userId, 'level'),
        totalUsers: globalStats.totalUsers,
        percentage: (percentiles.level * 100).toFixed(1)
      },
      coins: {
        rank: await getUserRank(userId, 'coins'),
        totalUsers: globalStats.totalUsers,
        percentage: (percentiles.coins * 100).toFixed(1)
      },
      achievements: {
        rank: await getUserRank(userId, 'achievements'),
        totalUsers: globalStats.totalUsers,
        percentage: (percentiles.achievements * 100).toFixed(1)
      }
    };

    return {
      userStats,
      globalStats,
      percentiles,
      comparisons
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas comparativas:', error);
    throw error;
  }
}

// Obtener estadísticas globales
async function getGlobalStatistics() {
  try {
    const totalUsers = await User.countDocuments();
    const users = await User.find({}, 'level coins unlockedAchievements friends gamesPlayed');

    const stats = {
      totalUsers,
      averageLevel: calculateAverage(users.map(u => u.level || 1)),
      averageCoins: calculateAverage(users.map(u => u.coins || 0)),
      averageAchievements: calculateAverage(users.map(u => u.unlockedAchievements ? u.unlockedAchievements.length : 0)),
      averageFriends: calculateAverage(users.map(u => u.friends ? u.friends.length : 0)),
      averageGamesPlayed: calculateAverage(users.map(u => u.gamesPlayed || 0)),
      totalPets: await Pet.countDocuments(),
      totalAchievements: await Achievement.countDocuments(),
      totalMissions: await Mission.countDocuments(),
      totalEvents: await Event.countDocuments(),
      totalTournaments: await Tournament.countDocuments()
    };

    return stats;
  } catch (error) {
    console.error('Error obteniendo estadísticas globales:', error);
    throw error;
  }
}

// Obtener historial de actividades
async function getUserActivityHistory(userId, days = 30) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const activities = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Simular historial de actividades (en un sistema real, esto vendría de logs)
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      activities.push({
        date: date.toISOString().split('T')[0],
        gamesPlayed: Math.floor(Math.random() * 10),
        achievementsUnlocked: Math.floor(Math.random() * 3),
        missionsCompleted: Math.floor(Math.random() * 5),
        coinsEarned: Math.floor(Math.random() * 100),
        petActions: Math.floor(Math.random() * 20),
        timeSpent: Math.floor(Math.random() * 120) // minutos
      });
    }

    return activities;
  } catch (error) {
    console.error('Error obteniendo historial de actividades:', error);
    throw error;
  }
}

// Obtener predicciones y recomendaciones
async function getUserRecommendations(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const userStats = await getUserStatistics(userId);
    const recommendations = [];

    // Recomendaciones basadas en estadísticas
    if (userStats.achievements.totalAchievements < 5) {
      recommendations.push({
        type: 'achievement',
        title: 'Completa más logros',
        description: 'Tienes pocos logros desbloqueados. ¡Completa misiones para obtener más!',
        priority: 'high',
        action: 'Go to achievements'
      });
    }

    if (userStats.social.friendsCount < 3) {
      recommendations.push({
        type: 'social',
        title: 'Haz más amigos',
        description: 'Conecta con otros jugadores para obtener regalos y ayuda',
        priority: 'medium',
        action: 'Go to friends'
      });
    }

    if (userStats.pets.totalPets < 2) {
      recommendations.push({
        type: 'pet',
        title: 'Adopta más mascotas',
        description: 'Diversifica tu colección de mascotas',
        priority: 'medium',
        action: 'Go to pets'
      });
    }

    if (userStats.tournaments.participatedTournaments === 0) {
      recommendations.push({
        type: 'tournament',
        title: 'Participa en torneos',
        description: 'Los torneos ofrecen grandes recompensas',
        priority: 'high',
        action: 'Go to tournaments'
      });
    }

    if (userStats.general.coins < 1000) {
      recommendations.push({
        type: 'economy',
        title: 'Ahorra monedas',
        description: 'Necesitas más monedas para comprar items especiales',
        priority: 'medium',
        action: 'Play minigames'
      });
    }

    // Predicciones
    const predictions = {
      nextLevel: predictNextLevel(userStats.general.experience),
      coinsInWeek: predictCoinsInWeek(userStats.general.coinsEarned),
      achievementsInMonth: predictAchievementsInMonth(userStats.achievements.totalAchievements),
      recommendedActions: getRecommendedActions(userStats)
    };

    return {
      recommendations,
      predictions
    };
  } catch (error) {
    console.error('Error obteniendo recomendaciones:', error);
    throw error;
  }
}

// Funciones auxiliares
function calculateDaysActive(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateAveragePetLevel(pets) {
  if (!pets || pets.length === 0) return 0;
  const totalLevel = pets.reduce((sum, pet) => sum + (pet.level || 1), 0);
  return Math.round(totalLevel / pets.length);
}

function calculateTotalPetActions(pets) {
  if (!pets || pets.length === 0) return 0;
  return pets.reduce((sum, pet) => {
    return sum + (pet.feedCount || 0) + (pet.playCount || 0) + (pet.cleanCount || 0);
  }, 0);
}

function getFavoritePetType(pets) {
  if (!pets || pets.length === 0) return 'Ninguna';
  
  const types = {};
  pets.forEach(pet => {
    const type = pet.type || 'unknown';
    types[type] = (types[type] || 0) + 1;
  });
  
  return Object.keys(types).reduce((a, b) => types[a] > types[b] ? a : b);
}

function countSecretAchievements(achievements) {
  if (!achievements) return 0;
  return achievements.filter(achievement => 
    achievement.achievementId && achievement.achievementId.isSecret
  ).length;
}

function calculateAchievementProgress(user) {
  const totalAchievements = user.unlockedAchievements ? user.unlockedAchievements.length : 0;
  const totalPossible = 50; // Número total de logros disponibles
  return Math.round((totalAchievements / totalPossible) * 100);
}

function getRecentAchievements(achievements, limit) {
  if (!achievements) return [];
  return achievements
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
    .slice(0, limit)
    .map(achievement => ({
      name: achievement.achievementId ? achievement.achievementId.name : 'Desconocido',
      unlockedAt: achievement.unlockedAt
    }));
}

function countCompletedMissions(user) {
  // Implementar lógica para contar misiones completadas
  return user.missionProgress ? Object.keys(user.missionProgress).length : 0;
}

function calculateMissionSuccessRate(user) {
  // Implementar lógica para calcular tasa de éxito
  return 85; // Porcentaje simulado
}

function getFavoriteMissionType(user) {
  // Implementar lógica para obtener tipo de misión favorito
  return 'Daily';
}

function calculateTotalMissionRewards(user) {
  // Implementar lógica para calcular recompensas totales
  return 1500; // Simulado
}

function countParticipatedEvents(user) {
  // Implementar lógica para contar eventos participados
  return user.activeEvents ? user.activeEvents.length : 0;
}

function countEventWins(user) {
  // Implementar lógica para contar victorias en eventos
  return 3; // Simulado
}

function getFavoriteEventType(user) {
  // Implementar lógica para obtener tipo de evento favorito
  return 'Feeding Frenzy';
}

function calculateTotalEventRewards(user) {
  // Implementar lógica para calcular recompensas totales
  return 800; // Simulado
}

function countParticipatedTournaments(user) {
  // Implementar lógica para contar torneos participados
  return 2; // Simulado
}

function countTournamentWins(user) {
  // Implementar lógica para contar victorias en torneos
  return 1; // Simulado
}

function getBestTournamentRank(user) {
  // Implementar lógica para obtener mejor ranking
  return 3; // Simulado
}

function calculateTotalTournamentRewards(user) {
  // Implementar lógica para calcular recompensas totales
  return 500; // Simulado
}

function countMessagesSent(user) {
  // Implementar lógica para contar mensajes enviados
  return 25; // Simulado
}

function countMessagesReceived(user) {
  // Implementar lógica para contar mensajes recibidos
  return 30; // Simulado
}

function getFavoriteMinigame(user) {
  // Implementar lógica para obtener juego favorito
  return 'Memory Game';
}

function getBestMinigameScores(user) {
  // Implementar lógica para obtener mejores puntuaciones
  return {
    'Memory Game': 1500,
    'Speed Game': 800,
    'Math Game': 1200
  };
}

function countTotalPurchases(user) {
  // Implementar lógica para contar compras totales
  return 15; // Simulado
}

function calculateTotalSpent(user) {
  // Implementar lógica para calcular total gastado
  return 2500; // Simulado
}

function getFavoriteItemType(user) {
  // Implementar lógica para obtener tipo de item favorito
  return 'Food';
}

function getMostExpensivePurchase(user) {
  // Implementar lógica para obtener compra más cara
  return 500; // Simulado
}

function calculateAverage(values) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function calculatePercentile(value, average) {
  // Cálculo simplificado de percentil
  if (value >= average * 2) return 0.95;
  if (value >= average * 1.5) return 0.85;
  if (value >= average) return 0.7;
  if (value >= average * 0.5) return 0.4;
  return 0.2;
}

async function getUserRank(userId, metric) {
  // Implementar lógica para obtener ranking del usuario
  return Math.floor(Math.random() * 100) + 1; // Simulado
}

function predictNextLevel(experience) {
  const currentLevel = Math.floor(experience / 1000) + 1;
  const nextLevelExp = currentLevel * 1000;
  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    experienceNeeded: nextLevelExp - experience
  };
}

function predictCoinsInWeek(currentCoinsEarned) {
  const dailyAverage = currentCoinsEarned / 7;
  return Math.round(dailyAverage * 7);
}

function predictAchievementsInMonth(currentAchievements) {
  const monthlyRate = currentAchievements / 3; // Asumiendo 3 meses de juego
  return Math.round(monthlyRate);
}

function getRecommendedActions(userStats) {
  const actions = [];
  
  if (userStats.general.gamesPlayed < 10) {
    actions.push('Jugar más minijuegos para ganar experiencia');
  }
  
  if (userStats.social.friendsCount < 5) {
    actions.push('Agregar más amigos para recibir regalos');
  }
  
  if (userStats.pets.totalPets < 3) {
    actions.push('Adoptar más mascotas para diversificar');
  }
  
  return actions;
}

export default {
  getUserStatistics,
  getComparativeStatistics,
  getGlobalStatistics,
  getUserActivityHistory,
  getUserRecommendations
}; 