import Achievement from '../models/achievementModel.js';
import User from '../models/userModel.js';

// Logros predefinidos
const DEFAULT_ACHIEVEMENTS = [
  {
    name: 'Primer Alimento',
    description: 'Alimenta a tu mascota por primera vez',
    criteria: 'Alimentar 1 vez',
    icon: '🍖',
    type: 'feeding',
    requiredProgress: 1,
    coinReward: 5
  },
  {
    name: 'Alimentador Experto',
    description: 'Alimenta a tu mascota 10 veces',
    criteria: 'Alimentar 10 veces',
    icon: '🍽️',
    type: 'feeding',
    requiredProgress: 10,
    coinReward: 20
  },
  {
    name: 'Cuidadoso',
    description: 'Cuida a tu mascota 5 veces',
    criteria: 'Cuidar 5 veces',
    icon: '💝',
    type: 'care',
    requiredProgress: 5,
    coinReward: 15
  },
  {
    name: 'Coleccionista',
    description: 'Adopta 3 mascotas',
    criteria: 'Tener 3 mascotas',
    icon: '🐾',
    type: 'pets',
    requiredProgress: 3,
    coinReward: 50
  },
  {
    name: 'Rico',
    description: 'Acumula 100 monedas',
    criteria: 'Tener 100 monedas',
    icon: '💰',
    type: 'coins',
    requiredProgress: 100,
    coinReward: 25
  },
  {
    name: 'Comprador',
    description: 'Compra 5 objetos en la tienda',
    criteria: 'Comprar 5 objetos',
    icon: '🛒',
    type: 'shop',
    requiredProgress: 5,
    coinReward: 30
  }
];

// Inicializar logros por defecto
async function initializeAchievements() {
  for (const achievementData of DEFAULT_ACHIEVEMENTS) {
    const exists = await Achievement.findOne({ name: achievementData.name });
    if (!exists) {
      await Achievement.create(achievementData);
    }
  }
}

// Verificar y otorgar logros
async function checkAndAwardAchievements(userId, actionType, progress = 1) {
  try {
    const user = await User.findById(userId);
    if (!user) return { unlocked: [] };

    // Actualizar progreso
    const currentProgress = user.achievementProgress.get(actionType) || 0;
    const newProgress = currentProgress + progress;
    user.achievementProgress.set(actionType, newProgress);

    // Buscar logros que se puedan desbloquear
    const achievements = await Achievement.find({ type: actionType });
    const unlocked = [];

    for (const achievement of achievements) {
      // Verificar si ya está desbloqueado
      const alreadyUnlocked = user.unlockedAchievements.some(
        ua => ua.achievement.toString() === achievement._id.toString()
      );

      if (!alreadyUnlocked && newProgress >= achievement.requiredProgress) {
        // Desbloquear logro
        user.unlockedAchievements.push({
          achievement: achievement._id,
          unlockedAt: new Date()
        });

        // Otorgar recompensa de monedas
        user.coins = (user.coins || 0) + achievement.coinReward;

        unlocked.push({
          ...achievement.toObject(),
          coinReward: achievement.coinReward
        });
      }
    }

    if (unlocked.length > 0) {
      await user.save();
    }

    return { unlocked, newProgress };
  } catch (error) {
    console.error('Error checking achievements:', error);
    return { unlocked: [] };
  }
}

// Obtener logros del usuario
async function getUserAchievements(userId) {
  try {
    const user = await User.findById(userId).populate('unlockedAchievements.achievement');
    const allAchievements = await Achievement.find();
    
    const unlockedIds = user.unlockedAchievements.map(ua => ua.achievement._id.toString());
    const progress = user.achievementProgress || new Map();

    const achievements = allAchievements.map(achievement => {
      const isUnlocked = unlockedIds.includes(achievement._id.toString());
      const currentProgress = progress.get(achievement.type) || 0;
      const progressPercent = Math.min((currentProgress / achievement.requiredProgress) * 100, 100);

      return {
        ...achievement.toObject(),
        isUnlocked,
        currentProgress,
        progressPercent
      };
    });

    return achievements;
  } catch (error) {
    console.error('Error getting user achievements:', error);
    return [];
  }
}

// Obtener todos los logros
async function getAllAchievements() {
  try {
    return await Achievement.find();
  } catch (error) {
    console.error('Error getting all achievements:', error);
    return [];
  }
}

// Verificar logros específicos
async function checkFeedingAchievements(userId) {
  return await checkAndAwardAchievements(userId, 'feeding', 1);
}

async function checkCareAchievements(userId) {
  return await checkAndAwardAchievements(userId, 'care', 1);
}

async function checkPetAchievements(userId, petCount) {
  return await checkAndAwardAchievements(userId, 'pets', petCount);
}

async function checkCoinAchievements(userId, coinAmount) {
  return await checkAndAwardAchievements(userId, 'coins', coinAmount);
}

async function checkShopAchievements(userId) {
  return await checkAndAwardAchievements(userId, 'shop', 1);
}

// Funciones adicionales necesarias para el controlador
async function getAchievementById(id) {
  try {
    return await Achievement.findById(id);
  } catch (error) {
    console.error('Error getting achievement by ID:', error);
    return null;
  }
}

async function createAchievement(achievementData) {
  try {
    return await Achievement.create(achievementData);
  } catch (error) {
    console.error('Error creating achievement:', error);
    throw error;
  }
}

async function updateAchievement(id, updateData) {
  try {
    return await Achievement.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error('Error updating achievement:', error);
    throw error;
  }
}

async function deleteAchievement(id) {
  try {
    return await Achievement.findByIdAndDelete(id);
  } catch (error) {
    console.error('Error deleting achievement:', error);
    throw error;
  }
}

async function claimAchievement(userId, achievementId) {
  try {
    const user = await User.findById(userId);
    const achievement = await Achievement.findById(achievementId);
    
    if (!user || !achievement) {
      throw new Error('Usuario o logro no encontrado');
    }

    // Verificar si ya está desbloqueado
    const alreadyUnlocked = user.unlockedAchievements.some(
      ua => ua.achievement.toString() === achievementId
    );

    if (alreadyUnlocked) {
      throw new Error('Logro ya desbloqueado');
    }

    // Verificar si cumple los requisitos
    const currentProgress = user.achievementProgress.get(achievement.type) || 0;
    if (currentProgress < achievement.requiredProgress) {
      throw new Error('No cumple los requisitos para desbloquear este logro');
    }

    // Desbloquear logro
    user.unlockedAchievements.push({
      achievement: achievementId,
      unlockedAt: new Date()
    });

    // Otorgar recompensa
    user.coins = (user.coins || 0) + achievement.coinReward;
    await user.save();

    return {
      message: 'Logro desbloqueado',
      achievement: achievement,
      coinReward: achievement.coinReward
    };
  } catch (error) {
    console.error('Error claiming achievement:', error);
    throw error;
  }
}

async function getUserSecretAchievements(userId) {
  try {
    const user = await User.findById(userId).populate('unlockedAchievements.achievement');
    const secretAchievements = await Achievement.find({ isSecret: true });
    
    const unlockedIds = user.unlockedAchievements.map(ua => ua.achievement._id.toString());

    return secretAchievements.map(achievement => {
      const isUnlocked = unlockedIds.includes(achievement._id.toString());
      return {
        ...achievement.toObject(),
        isUnlocked
      };
    });
  } catch (error) {
    console.error('Error getting user secret achievements:', error);
    return [];
  }
}

export default {
  initializeAchievements,
  checkAndAwardAchievements,
  getUserAchievements,
  getAllAchievements,
  checkFeedingAchievements,
  checkCareAchievements,
  checkPetAchievements,
  checkCoinAchievements,
  checkShopAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  claimAchievement,
  getUserSecretAchievements
}; 